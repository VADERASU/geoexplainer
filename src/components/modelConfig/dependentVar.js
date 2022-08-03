import React, {useEffect, useState} from "react";
import '../../styles/modelConfig.css';
import { Card, Row, Col } from 'antd';
import * as d3 from 'd3';
import { HistogramEchart } from "../../utilities/histogramEchart";

export function DependentVar(props){
    const [currentY, setCurrentY] = useState(null);
    const [echartHistData, setEchartHistData] = useState(null);
    const [narrativeInfo, setNarrativeInfo] = useState(null);

    const makeHistoData = (rawDependentData, dependentVar) => {
        let data = rawDependentData.Y;
        // get databins
        const dataBins = d3.bin().thresholds(10)(data);
        //console.log(data);
        //const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#2171b5'];
        const globalMax = d3.max(data);
        const globalMin = d3.min(data);
        const clusterInterval = parseInt((globalMax - globalMin) / 5); // start from 0, 5 classes
        const classSteps = [];
    
        for(let i = 1; i < 4; i++){
            let classBreak = globalMin + clusterInterval * i;
            classSteps.push(parseInt(classBreak));
        }
        //console.log(classSteps);
        // make  histogram clusters
        const echartHistData = {
            binNames: [],
            binCount: [],
            featureName: dependentVar,
        };
        dataBins.forEach(e=>{
            let name = e.x0 + '-' + e.x1;
            let color = e.x1 <= classSteps[0] ? '#eff3ff' : 
            (e.x1 <=  classSteps[1] ? '#bdd7e7' : 
            (e.x1 <= classSteps[2] ? '#6baed6' : '#2171b5'));
            
            let length = {
                value: e.length,
                itemStyle: {
                    color: color,
                }
            };
            echartHistData.binNames.push(name);
            echartHistData.binCount.push(length);
        });
        setEchartHistData(echartHistData);
    };

    useEffect(()=>{
        //console.log(props.dependent_features);
        if((props.dependent_features.length > 0) && (props.norm_test_result.length > 0)){
            setCurrentY(props.dependent_features[0]);
            makeHistoData(props.norm_test_result.filter(e=>e.feature === props.dependent_features[0])[0], props.dependent_features[0]);
        }
    }, [props]);
    
    return(
        <Card
            title={'Distribution of Dependent Variable Y: ' + currentY}
            size='small'

        >
            <HistogramEchart
                echartHistData={echartHistData}
            />
        </Card>
    );
}
