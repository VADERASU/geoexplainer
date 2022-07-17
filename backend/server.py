from flask import Flask, jsonify, request, make_response
import os
import json
# MGWR related
from scipy import stats
import numpy as np
#import libpysal as ps
from mgwr.gwr import GWR, MGWR
from mgwr.sel_bw import Sel_BW
#from mgwr.utils import shift_colormap, truncate_colormap
import geopandas as gp
from libpysal.weights.contiguity import Queen
from esda.moran import Moran
import pandas as pd
import geojson
from statsmodels.stats.outliers_influence import variance_inflation_factor

app = Flask(__name__)

# util function
def getDatasetPath(dataName):
    if dataName == "georgia":
        dataset_path = "../src/data/GData_utm.csv"
        pointJson_path = "../src/data/georgia_demo_points.geojson"
        polyJson_path = "../src/data/georgia_demo.geojson"
        shape_path = "../src/data/georgia_shape/G_utm.shp"
    else:
        dataset_path = "../src/data/Chicago_ABNB.csv"
        pointJson_path = "../src/data/chicago_config_point.geojson"
        polyJson_path = "../src/data/chicago_config_poly.geojson"
        shape_path = "../src/data/airbnb_shape/airbnb_Chicago 2015.shp"

    return dataset_path, pointJson_path, polyJson_path, shape_path

def geojsonGenerate(model, pointJson_path, polyJson_path):
    #import raw geojson
    with open(pointJson_path, 'r', encoding='utf-8') as f:
        rawPointsJson = geojson.load(f)
    with open(polyJson_path, 'r', encoding='utf-8') as f:
        rawPloyJson = geojson.load(f)
    xList = model['X']
    geoFeature_poly_list = []
    geoFeature_points_list = []

    for i, record in enumerate(rawPloyJson.features):
        # geo features
        geo = record.geometry['coordinates']
        geoType = record.geometry['type']
        geo_feature = {}
        point_feature = {}

        point_geo = rawPointsJson.features[i].geometry['coordinates']

        # properties
        UID = record.properties['UID']
        #state_name = record.properties['state_name']
        county_name = record.properties['county_name']
        Long = record.properties['Long_']
        Lat = record.properties['Lat']
        # diagnostic indicators
        loacl_R2 = model['local_R2']['value'][i]
        cooksD = model['cooksD']['value'][i]
        std_residuals = model['std_residuals']['value'][i]
        # properties
        properties = {
            'local_R2': loacl_R2, 'cooksD': cooksD, 'std_residuals': std_residuals
        }
        for key in record.properties:
            if key == 'county_name':
                properties[key] = record.properties[key].title()
            else:
                properties[key] = record.properties[key]
        # variable coefficients' tvalue
        for x in xList:
            tvalue_key = x + '_tval'
            properties[tvalue_key] = model[x]['tvalue'][i]
            coefficient_key = x + '_coefficient'
            properties[coefficient_key] = model[x]['param'][i]

        # add intercept and related tvalues
        properties['intercept_tval'] = model['intercept']['tvalue'][i]
        properties['intercept_coefficient'] = model['intercept']['param'][i]

        if geoType == "MultiPolygon":
            geo_feature = geojson.Feature(geometry=geojson.MultiPolygon(geo),
                                          properties=properties)
        elif geoType == "Polygon":
            geo_feature = geojson.Feature(geometry=geojson.Polygon(geo),
                                          properties=properties)

        point_feature = geojson.Feature(geometry=geojson.Point(point_geo),
                                      properties=properties)
        geoFeature_poly_list.append(geo_feature)
        geoFeature_points_list.append(point_feature)
    poly_geojson_obj = geojson.FeatureCollection(geoFeature_poly_list)
    point_geojson_obj = geojson.FeatureCollection(geoFeature_points_list)
    return poly_geojson_obj, point_geojson_obj

def gaussian_verify(param, georgia_data):
    #georgia_data = pd.read_csv(dataset_path)
    Y = georgia_data[param]
    u = Y.mean()
    std = Y.std()
    skewness = stats.skew(Y)
    kstest_result = stats.kstest(Y, 'norm', (u, std))
    p_value = kstest_result[1]
    normality_results = {
        'feature': param,
        'p_value': format(p_value, '.5f'),
        'skewness': format(skewness, '.5f'),
        'Y': Y.tolist()
    }
    return normality_results

def getMoranTestScore(shp, model):
    # when the user selects georgia example
    dependent_var = model['Y']
    x_list = model['X']
    g_y = shp[dependent_var].values.reshape((-1, 1))
    g_X = shp[x_list].values
    #print(shp.columns)
    u = shp['Longitud']
    v = shp['Latitude']
    g_coords = list(zip(u, v))

    # z-normalization
    g_X = (g_X - g_X.mean(axis=0)) / g_X.std(axis=0)
    g_y = g_y.reshape((-1, 1))
    g_y = (g_y - g_y.mean(axis=0)) / g_y.std(axis=0)

    # Calibrate GWR model
    gwr_selector = Sel_BW(g_coords, g_y, g_X, spherical=True)
    gwr_bw = gwr_selector.search(bw_min=2)
    gwr_results = GWR(g_coords, g_y, g_X, gwr_bw, spherical=True).fit()

    # get residual
    std_res_val = gwr_results.std_res[:, 0]
    shp['std_res'] = std_res_val
    weights = Queen.from_dataframe(shp)
    moran = Moran(shp['std_res'], weights)
    moran_result = {
        'moran_EI': round(moran.EI,2),
        'moran_I': round(moran.I,2),
        'moran_p': round(moran.p_norm,2)
    }

    return moran_result


''' API PART '''
# handle
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.route("/")
def hello_world():
    dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath('georgia')
    georgia_data = pd.read_csv(dataset_path)
    print(georgia_data)
    return "Hello, World!"

# Kolmogorov-Smirnov test for normality
@app.route('/models/api/v0.1/calibration/normality/<param>', methods=["GET","OPTIONS"])
def normality_test(param):
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

    elif request.method == "GET":  # The actual request following the preflight
        raw_data = param.split('+')
        Y_list = raw_data[0].split(',')
        dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath(raw_data[1])
        georgia_data = pd.read_csv(dataset_path)
        print(dataset_path)
        normality_result_list = []
        for Y in Y_list:
            normality_result = gaussian_verify(Y, georgia_data)
            normality_result_list.append(normality_result)
        print(normality_result_list)

        return _corsify_actual_response(jsonify({'normality_results': normality_result_list}))

    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

#log transformation
#TODO: Sqrt transformation
@app.route('/models/api/v0.1/calibration/normality/log-transform/<param>', methods=["GET","OPTIONS"])
def normality_log(param):
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "GET":  # The actual request following the preflight
        raw_data = param.split('+')
        parameter = raw_data[0]
        dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath(raw_data[1])
        georgia_data = pd.read_csv(dataset_path)
        Y = georgia_data[parameter]
        log_Y = np.log(Y, where=Y!=0)
        #print(Y)
        #print(log_Y)
        u = log_Y.mean()
        std = log_Y.std()
        skewness = stats.skew(log_Y)
        kstest_result = stats.kstest(log_Y, 'norm', (u, std))
        #normaltest_result = stats.normaltest(log_Y)
        #shaprio_result = stats.shapiro(log_Y)
        p_value = kstest_result[1]
        #print(p_value)
        #print(skewness)
        normality_results = {
            'p_value': format(p_value, '.5f'),
            'skewness': format(skewness, '.5f'),
            'Y': log_Y.tolist()
        }
        
        return _corsify_actual_response(jsonify({'normality_results': normality_results}))

    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

# Pearson correlation calculation. INPUT: variable_Y+variable_X
@app.route('/models/api/v0.1/calibration/correlation/<param>', methods=["GET","OPTIONS"])
def pearson_correlation(param):
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "GET":  # The actual request following the preflight
        raw_data = param.split('+')
        variableY = raw_data[0]
        variableX = raw_data[1]
        dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath(raw_data[2])
        georgia_data = pd.read_csv(dataset_path)
        Y_data = georgia_data[variableY]
        X_data = georgia_data[variableX]
        pearson_result = stats.pearsonr(Y_data, X_data)
        correlation_results = {
            'correlation_coefficient': format(pearson_result[0], '.5f'),
            'p_value': format(pearson_result[1], '.5f')
        }

        return _corsify_actual_response(jsonify({'pearson_results': correlation_results}))

    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))

# Detecting Multicollinearity with Variance Inflation Factor(VIF)
@app.route('/models/api/v0.1/calibration/VIF/<param>', methods=["GET","OPTIONS"])
def get_VIF(param):
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "GET":  # The actual request following the preflight
        raw_data = param.split('+')
        dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath(raw_data[1])
        georgia_data = pd.read_csv(dataset_path)
        x_data = raw_data[0].split(',')
        X = georgia_data[x_data]
        # VIF dataframe
        vif_data = pd.DataFrame()
        # calculating VIF for each feature
        vif_data["VIF"] = [variance_inflation_factor(X.values, i) for i in range(len(X.columns))]
        VIF_list = vif_data["VIF"].tolist()
        VIF_results = {
            'VIF_list': VIF_list
        }

        return _corsify_actual_response(jsonify({'VIF_results': VIF_results}))

    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))
    
''' GWR or MGWR model training'''
@app.route('/models/api/v0.1/models', methods=["POST", "OPTIONS"])
# get the top 1000 completions for the given prompt
def single_sentence_embed():
    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()
    elif request.method == "POST":  # The actual request following the preflight
        raw_form = request.json
        raw_dataset_name = raw_form['dataset']
        dataset_path, pointJson_path, polyJson_path, shape_path = getDatasetPath(raw_dataset_name)
        georgia_data = pd.read_csv(dataset_path)
        shp = gp.read_file(shape_path)
        model = {
            'Y': raw_form['dependent_Y'],
            'Y_data': raw_form['Y_data'],
            'X': raw_form['X_list']
        }
        model_type = raw_form['gwr_mgwr']
        x_list = model['X']
        #print(raw_form)
        #Prepare Georgia dataset inputs
        #g_y = georgia_data[model['Y']].values.reshape((-1,1))
        g_y = pd.DataFrame(model['Y_data']).values.reshape((-1,1))
        g_X = georgia_data[model['X']].values
        u = georgia_data['Long_']
        v = georgia_data['Lat']
        g_coords = list(zip(u,v))

        # z-normalization
        g_X = (g_X - g_X.mean(axis=0)) / g_X.std(axis=0)
        g_y = g_y.reshape((-1,1))
        g_y = (g_y - g_y.mean(axis=0)) / g_y.std(axis=0)

        #Calibrate GWR model
        gwr_selector = Sel_BW(g_coords, g_y, g_X, spherical=True)
        gwr_bw = gwr_selector.search(bw_min=2)
        gwr_results = GWR(g_coords, g_y, g_X, gwr_bw, spherical=True).fit()
        #trained_models.append(gwr_results)

        # get model results
        tvalues = gwr_results.filter_tvals()
        #filter_tvals = gwr_results.filter_tvals
        #critical_tval = gwr_results.critical_tval
        local_R2 = []
        for i, value in enumerate(gwr_results.localR2.tolist()):
            local_R2.append(value[0])
        model['local_R2'] = {
            'value': gwr_results.localR2[:,0].tolist(),
            'mean': np.mean(gwr_results.localR2[:,0]),
            'min': np.min(gwr_results.localR2[:,0]),
            'median': np.median(gwr_results.localR2[:,0]),
            'max': np.max(gwr_results.localR2[:,0]),
            'std': np.std(gwr_results.localR2[:,0])
        }

        model['band_width'] = gwr_bw

        # Summary statistics for GWR parameter estimates (Histogram)
        model['intercept'] = {
            'param': gwr_results.params[:,0].tolist(),
            'tvalue': tvalues[:,0].tolist(),
            'mean': np.mean(gwr_results.params[:,0]),
            'std': np.std(gwr_results.params[:,0]),
            'min': np.min(gwr_results.params[:,0]),
            'median': np.median(gwr_results.params[:,0]),
            'max': np.max(gwr_results.params[:,0])
        }

        for i, value in enumerate(x_list):
            model[value] = {
                'param': gwr_results.params[:,i+1].tolist(),
                'tvalue': tvalues[:,i+1].tolist(),
                'mean': np.mean(gwr_results.params[:,i+1]),
                'std': np.std(gwr_results.params[:,i+1]),
                'min': np.min(gwr_results.params[:,i+1]),
                'median': np.median(gwr_results.params[:,i+1]),
                'max': np.max(gwr_results.params[:,i+1])
            }

        diagnostic_info = {
            'degree_of_freedom': gwr_results.df_model,
            'AICc': gwr_results.aicc,
            'BIC': gwr_results.bic,
            'R2': gwr_results.R2,
            'adj_R2': gwr_results.adj_R2
        }
        model['diagnostic_info'] = diagnostic_info
        model['cooksD'] = {
            'value': gwr_results.cooksD[:,0].tolist(),
            'mean': np.mean(gwr_results.cooksD[:,0]),
            'min': np.min(gwr_results.cooksD[:,0]),
            'median': np.median(gwr_results.cooksD[:,0]),
            'max': np.max(gwr_results.cooksD[:,0]),
            'std': np.std(gwr_results.cooksD[:,0])
        }

        std_res_val = gwr_results.std_res[:, 0]
        if raw_dataset_name == "georgia":
            moran_result = getMoranTestScore(shp, model)
        else:
            shp['std_res'] = std_res_val
            weights = Queen.from_dataframe(shp)
            moran = Moran(shp['std_res'], weights)
            moran_result = {
                'moran_EI': round(moran.EI,2),
                'moran_I': round(moran.I,2),
                'moran_p': round(moran.p_norm,2)
            }

        model['std_residuals'] = {
            'value': std_res_val.tolist(),
            'mean': np.mean(gwr_results.std_res[:,0]),
            'min': np.min(gwr_results.std_res[:,0]),
            'median': np.median(gwr_results.std_res[:,0]),
            'max': np.max(gwr_results.std_res[:,0]),
            'std': np.std(gwr_results.std_res[:,0]),
            'moran': moran_result
        }

        # get geojson objects
        poly_geojson_obj, point_geojson_obj = geojsonGenerate(model,pointJson_path, polyJson_path)
        model['geojson_poly'] = poly_geojson_obj
        model['geojson_point'] = point_geojson_obj

        # add model to models list
        #trained_models.append(model)
        #print(model)

        #return jsonify({'added_model': model}), 201
        return _corsify_actual_response(jsonify({'added_model': model}))
    else:
        raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == '__main__':
    #app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5004)))
    app.run(host='0.0.0.0', port=5005, debug=True)
