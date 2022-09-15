import * as d3 from 'd3';

export function fomatFloat(value, n) {
    let f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        s += '.';
    }
    for(let i = s.length - s.indexOf('.'); i <= n; i++){
        s += "0";
    }
    return s;
}

export function getCountyCenter(geojson_data){
    let geo_data = geojson_data['features'];
    let long = 0;
    let lat = 0;
    let count = geo_data.length;
    let max_long = 0;
    let min_long = 0;
    let max_lat = 0;
    let min_lat = 0;
    
    geo_data.forEach((element, index) => {
        long = long + element['properties']['Long_'];
        lat = lat + element['properties']['Lat'];
        // find max coord in each direction
        if(index === 0){
            max_long = element['properties']['Long_'];
            min_long = element['properties']['Long_'];
            max_lat = element['properties']['Lat'];
            min_lat = element['properties']['Lat'];
        }else{
            if(element['properties']['Long_'] > max_long) max_long = element['properties']['Long_'];
            if(element['properties']['Long_'] <= min_long) min_long = element['properties']['Long_'];
            if(element['properties']['Lat'] > max_lat) max_lat = element['properties']['Lat'];
            if(element['properties']['Lat'] <= min_lat) min_lat = element['properties']['Lat'];
        }
    });
    let center_coords = [long/count - 0.1, lat/count + 0.05];

    /* divided N W S E directions of the coords */
    let west_bound = min_long + (max_long - min_long)/3;
    let east_bound = west_bound + (max_long - min_long)/3;
    let south_bound = min_lat + (max_lat - min_lat) / 3;
    let north_bound = south_bound + (max_lat - min_lat) / 3;
    let NWSE_bounds = {
        west_bound: west_bound,
        east_bound: east_bound,
        south_bound: south_bound,
        north_bound: north_bound
    };
    //console.log(west_bound + ', '+ east_bound);
    //console.log(south_bound + ', '+ north_bound);
    return {
        center_coords: center_coords,
        NWSE_bounds: NWSE_bounds
    };
}

export function getDiagnosticMapLayer(feature, geoData, filter_){
    //console.log(filter);
    if(feature === 'local_R2'){
        // try 5 classes with multiple classification methods, use Quantile at first
        const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
        const configLayer = {
            id: 'config-fill',
            type: 'fill',
        };
        //'filter': ['in', 'UID', '']
        const featureList = geoData.features.map(e=>e.properties[feature]);

        const quantile = d3.scaleQuantile()
            .domain(featureList) // pass the whole dataset to a scaleQuantile’s domain
            .range(dependentColorScheme);

        const classSteps = quantile.quantiles();
        //console.log(quantile.quantiles());

        let paintProp = {
            'fill-color': [
                'step',
                ['get', feature],
                dependentColorScheme[0],
                parseFloat(classSteps[0].toFixed(2)),
                dependentColorScheme[1],
                parseFloat(classSteps[1].toFixed(2)),
                dependentColorScheme[2],
                parseFloat(classSteps[2].toFixed(2)),
                dependentColorScheme[3],
                parseFloat(classSteps[3].toFixed(2)),
                dependentColorScheme[4],
            ],
            'fill-opacity': 0.8,
            
        };
        configLayer.paint = paintProp;
        if(filter_ !== undefined){
            configLayer.filter = filter_;
        }
        return configLayer;
    }else if(feature === 'cooksD'){
        const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
        const configLayer = {
            id: 'config-fill',
            type: 'fill',
        };
        //'filter': ['in', 'UID', '']
        const filter = ['in', 'UID'];
        const featureList = geoData.features.map(e=>e.properties[feature]);

        const quantile = d3.scaleQuantile()
            .domain(featureList) // pass the whole dataset to a scaleQuantile’s domain
            .range(dependentColorScheme);

        const classSteps = quantile.quantiles();
        
        // filter cooksD above the threshold 4 / N
        const threshold = 4 / featureList.length;
        geoData.features.forEach(e=>{
            let UID = e.properties['UID'];
            if(e.properties[feature]>threshold){
                filter.push(UID);
            }
        });
        //console.log(classSteps, threshold);

        let paintProp = {
            'fill-color': [
                'step',
                ['get', feature],
                dependentColorScheme[0],
                classSteps[0],
                dependentColorScheme[1],
                classSteps[1],
                dependentColorScheme[2],
                classSteps[2],
                dependentColorScheme[3],
                classSteps[3],
                dependentColorScheme[4],
            ],
            'fill-opacity': 0.8,
            
        };
        configLayer.paint = paintProp;
        configLayer.filter = filter;
        return configLayer;
    }else if(feature === 'std_residuals'){
        const configLayer = {
            id: 'config-fill',
            type: 'fill',
        };

        const featureList = geoData.features.map(e=>e.properties[feature]);
        const posList = featureList.filter(e=>e>0);
        const negList = featureList.filter(e=>e<0);

        const negColorScheme = ['#b2182b','#ef8a62','#fddbc7'];
        const posColorScheme = ['#d1e5f0','#67a9cf','#2166ac'];

        const quantile_neg = d3.scaleQuantile()
            .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
            .range(negColorScheme);

        const quantile_pos = d3.scaleQuantile()
            .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
            .range(posColorScheme);

        const classSteps_neg = quantile_neg.quantiles();
        const classSteps_pos = quantile_pos.quantiles();
        //const min = Math.min(...classSteps_pos);
        //console.log(min);

        let paintProp = {
            'fill-color': [
                'step',
                ['get', feature],

                negColorScheme[0],
                classSteps_neg[0],
                negColorScheme[1],
                classSteps_neg[1],
                negColorScheme[2],
                
                0,

                posColorScheme[0],
                classSteps_pos[0],
                posColorScheme[1],
                classSteps_pos[1],
                posColorScheme[2],
            ],
            'fill-opacity': 0.8,
            
        };
        configLayer.paint = paintProp;
        //console.log(configLayer);
        if(filter_ !== undefined){
            configLayer.filter = filter_;
        }
        return configLayer;
    }else{
        //coefficients
        const configLayer = {
            id: 'config-fill',
            type: 'fill',
        };

        const filter = ['in', 'UID'];

        const featureName = feature + '_coefficient';
        const featureTVal = feature + '_tval';

        const featureList = geoData.features.map(e=>e.properties[featureName]);
        
        const posList = featureList.filter(e=>e>0);
        const negList = featureList.filter(e=>e<0);
        geoData.features.forEach(e=>{
            let UID = e.properties['UID'];
            if(e.properties[featureTVal] !== 0){
                filter.push(UID);
            }
        });

        if(negList.length === 0){
            // all positive values
            const posColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
            //const posColorScheme = ['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'];
            const quantile_pos = d3.scaleQuantile()
            .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
            .range(posColorScheme);
            const classSteps_pos = quantile_pos.quantiles();

            let paintProp = {
                'fill-color': [
                    'step',
                    ['get', featureName],
                    posColorScheme[0],
                    classSteps_pos[0],
                    posColorScheme[1],
                    classSteps_pos[1],
                    posColorScheme[2],
                    classSteps_pos[2],
                    posColorScheme[3],
                    classSteps_pos[3],
                    posColorScheme[4],
                ],
                'fill-opacity': 0.8,
                
            };
            configLayer.paint = paintProp;
            configLayer.filter = filter;
            return configLayer;
        }else if(posList.length === 0){
            //console.log(negList);
            const negColorScheme = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'];
            const quantile_neg = d3.scaleQuantile()
            .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
            .range(negColorScheme);
            const classSteps_neg = quantile_neg.quantiles();
            //console.log(classSteps_neg);
            let paintProp = {
                'fill-color': [
                    'step',
                    ['get', featureName],
                    negColorScheme[0],
                    classSteps_neg[0],
                    negColorScheme[1],
                    classSteps_neg[1],
                    negColorScheme[2],
                    classSteps_neg[2],
                    negColorScheme[3],
                    classSteps_neg[3],
                    negColorScheme[4],
                ],
                'fill-opacity': 0.8,
                
            };
            configLayer.paint = paintProp;
            configLayer.filter = filter;
            return configLayer;
        }else{
            const negColorScheme = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'];
            const posColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
    
            const quantile_neg = d3.scaleQuantile()
                .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                .range(negColorScheme);
    
            const quantile_pos = d3.scaleQuantile()
                .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                .range(posColorScheme);
    
            const classSteps_neg = quantile_neg.quantiles();
            const classSteps_pos = quantile_pos.quantiles();
            let paintProp = {
                'fill-color': [
                    'step',
                    ['get', featureName],
    
                    negColorScheme[0],
                    classSteps_neg[0],
                    negColorScheme[1],
                    classSteps_neg[1],
                    negColorScheme[2],
                    classSteps_neg[2],
                    negColorScheme[3],
                    classSteps_neg[3],
                    negColorScheme[4],
                    
                    0,
    
                    posColorScheme[0],
                    classSteps_pos[0],
                    posColorScheme[1],
                    classSteps_pos[1],
                    posColorScheme[2],
                    classSteps_pos[2],
                    posColorScheme[3],
                    classSteps_pos[3],
                    posColorScheme[4],
                ],
                'fill-opacity': 0.8,
                
            };
            configLayer.paint = paintProp;
            configLayer.filter = filter;
            //console.log(configLayer);
            return configLayer;            
        } 
    }
      
}

export function getConfigMapLayerY(feature, geoData){
    const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
    const configLayer = {
        id: 'config-fill',
        type: 'fill',
    };
    
    const featureList = geoData.features.map(e=>e.properties[feature[0]]);
    //const max = Math.max(...featureList);
    //const min = Math.min(...featureList);
    //const clusterInterval = parseInt((max - min) / 5); // start from 0, 5 classes
    
    const quantile = d3.scaleQuantile()
            .domain(featureList) // pass the whole dataset to a scaleQuantile’s domain
            .range(dependentColorScheme);

    const classSteps = quantile.quantiles();
    //console.log(quantile.quantiles());

    let paintProp = {
        'fill-color': [
            'step',
            ['get', feature[0]],
            dependentColorScheme[0],
            parseFloat(classSteps[0].toFixed(2)),
            dependentColorScheme[1],
            parseFloat(classSteps[1].toFixed(2)),
            dependentColorScheme[2],
            parseFloat(classSteps[2].toFixed(2)),
            dependentColorScheme[3],
            parseFloat(classSteps[3].toFixed(2)),
            dependentColorScheme[4],
        ],
        'fill-opacity': 0.8,            
    };

    //console.log(classSteps);
    
    configLayer.paint = paintProp;

    return configLayer;  
}

export function addBivariateProp(feature, geoData){
    const biVarColorScheme = [
        // Y
        ['#92c5de','#4393c3','#2166ac'],
        // X
        ['#f4a582', '#d6604d', '#b2182b'],
        // x is correlated with y
        ['#f0f0f0', '#bdbdbd', '#636363']
    ];
    const clonedata = JSON.parse(JSON.stringify(geoData));
    const featureListY = clonedata.features.map(e=>e.properties[feature[0]]);
    const featureListX = clonedata.features.map(e=>e.properties[feature[1]]);
    const maxY = Math.max(...featureListY);
    const minY = Math.min(...featureListY);
    const maxX = Math.max(...featureListX);
    const minX = Math.min(...featureListX);

    const clusterIntervalY = parseInt((maxY - minY) / 4); // start from 0, 5 classes
    const clusterIntervalX = parseInt((maxX - minX) / 4); // start from 0, 5 classes
    const classStepsY = [];
    const classStepsX = [];
    for(let i = 1; i < 3; i++){
        let classBreakY = minY + clusterIntervalY * i;
        classStepsY.push(parseInt(classBreakY));
        let classBreakX = minX + clusterIntervalX * i;
        classStepsX.push(parseInt(classBreakX));
    }

    // add bi-variate property to the GeoJson obj
    
    clonedata.features.map(e=>{
        let y = e.properties[feature[0]];
        let x = e.properties[feature[1]];
        // decide smallest y-axis color
        if(y < classStepsY[0]){
            // decide three x-axis colors
            if(x < classStepsX[0]){
                // low y and low x
                e.properties.biVariateLayer = biVarColorScheme[2][0];
            }else if((x >= classStepsX[0]) && (x < classStepsX[1])){
                // low y & mid x
                e.properties.biVariateLayer = biVarColorScheme[1][0];
            }else if(x >= classStepsX[1]){
                // low y & high x
                e.properties.biVariateLayer = biVarColorScheme[1][1];
            }
        }else if((y >= classStepsY[0]) && (y < classStepsY[1])){ //mid y
            // decide three x-axis colors
            if(x < classStepsX[0]){
                // mid y and low x
                e.properties.biVariateLayer = biVarColorScheme[0][0];
            }else if((x >= classStepsX[0]) && (x < classStepsX[1])){
                // mid y & mid x
                e.properties.biVariateLayer = biVarColorScheme[2][1];
            }else if(x >= classStepsX[1]){
                // mid y & high x
                e.properties.biVariateLayer = biVarColorScheme[1][2];
            }
        }else if(y >= classStepsY[1]){ //high y
            // decide three x-axis colors
            if(x < classStepsX[0]){
                // high y and low x
                e.properties.biVariateLayer = biVarColorScheme[0][1];
            }else if((x >= classStepsX[0]) && (x < classStepsX[1])){
                // high y & mid x
                e.properties.biVariateLayer = biVarColorScheme[0][2];
            }else if(x >= classStepsX[1]){
                // high y & high x
                e.properties.biVariateLayer = biVarColorScheme[2][2];
            }
        }
    });
    //console.log(geoData.features.map(e=>e.properties.biVariateLayer));
    return clonedata;

}

export function getConfigMapLayerYX(){
    const configLayer = {
        id: 'config-fill',
        type: 'fill',
    };
    
    let paintProp = {
        'fill-color': [
            'match',
            ['get', 'biVariateLayer'],
            '#92c5de','#92c5de',
            '#4393c3','#4393c3',
            '#2166ac','#2166ac',
            '#f4a582','#f4a582',
            '#d6604d','#d6604d',
            '#b2182b','#b2182b',
            '#f0f0f0','#f0f0f0',
            '#bdbdbd','#bdbdbd',
            '#636363','#636363',
            '#ffffff'
        ],
        'fill-opacity': 0.8,
        
    };
    configLayer.paint = paintProp;

    return configLayer;
}

