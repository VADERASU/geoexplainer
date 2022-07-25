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

export function getConfigMapLayer(feature, geoData){
    const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#2171b5'];
    const biVarColorScheme = [
        // Y
        ['#92c5de','#4393c3','#2166ac'],
        // X
        ['#f4a582', '#d6604d', '#b2182b'],
        // x is correlated with y
        ['#f0f0f0', '#bdbdbd', '#636363']
    ];
    const configLayer = {
        id: 'config-fill',
        type: 'fill',
    };
    //console.log(geoData);
    if(feature.length === 1){
        // only visualize dependent Y
        //find min & max
        const featureList = geoData.features.map(e=>e.properties[feature[0]]);
        const max = Math.max(...featureList);
        const min = Math.min(...featureList);
        
        const clusterInterval = parseInt((max - min) / 5); // start from 0, 5 classes
        const classSteps = [];
        
        for(let i = 1; i < 4; i++){
            let classBreak = min + clusterInterval * i;
            classSteps.push(parseInt(classBreak));
        }
        //console.log(classSteps);
        let paintProp = {
            'fill-color': [
                'step',
                ['get', feature[0]],
                dependentColorScheme[0],
                classSteps[0],
                dependentColorScheme[1],
                classSteps[1],
                dependentColorScheme[2],
                classSteps[2],
                dependentColorScheme[3]
            ],
            'fill-opacity': 0.8,
            
        };
        configLayer.paint = paintProp;
        return configLayer;
    }   
}

