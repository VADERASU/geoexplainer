import React, {useEffect, useState} from "react";
import '../../styles/modelConfig.css';
import { Card, Row, Col, Descriptions, Alert, Button } from 'antd';
import * as d3 from 'd3';
import { HistogramEchart } from "../../utilities/histogramEchart";

export function DependentVar(props){
    const [currentY, setCurrentY] = useState(null);
    const [echartHistData, setEchartHistData] = useState(null);
    const [narrativeInfo, setNarrativeInfo] = useState({
        pvalue: 0.00,
        skewness: 0.00,
        distribution: null
    });
    const [suggestion, setSuggestion] = useState({
        msg: null,
        type: 'warning',
        action: false,
        btnMsg: null
    });

    const makeSuggestion = (narrativeInfo, logtrans_backup) => {
        //console.log(narrativeInfo);
        if(parseFloat(narrativeInfo.pvalue) >= 0.05){
            //console.log(logtrans_backup);
            let suggestionObj = {
                msg: "Data is in normal distribution, can use Gaussian model type.",
                type: 'success',
                action: (logtrans_backup.feature !== currentY && logtrans_backup.feature === null) ? true : false,
                btnMsg: (logtrans_backup.feature !== currentY && logtrans_backup.feature === null) ? 'no action needed' : 'Use original Y'
            }
            setSuggestion(suggestionObj);
        }else if(parseFloat(narrativeInfo.skewness) > 0){
            let suggestionObj = {
                msg: "Data has a positively skewed distribution. Try log transformation to normalize the data.",
                type: 'warning',
                action: false,
                btnMsg: 'Log transformation'
            }
            setSuggestion(suggestionObj);
        }else if(parseFloat(narrativeInfo.skewness) < 0){
            let suggestionObj = {
                msg: "Data has a negatively skewed distribution. Try square root transformation to normalize the data.",
                type: 'warning',
                action: false,
                btnMsg: 'Square root transformation'
            }
            setSuggestion(suggestionObj);
        }
    };

    const makeHistoData = (rawDependentData, dependentVar, logtrans_backup) => {
        let data = rawDependentData.Y;
        let pValue = parseFloat(rawDependentData.p_value);
        let skewness = parseFloat(rawDependentData.skewness);
        let narrativeInfo = {
            pvalue: pValue.toFixed(2),
            skewness: skewness.toFixed(2),
            distribution: rawDependentData.p_value >= 0.05 ? 'Normal distribution' : 
            (rawDependentData.skewness > 0 ? 'Positively skewed' : 'Negatively skewed'),
        };
        makeSuggestion(narrativeInfo, logtrans_backup);
        setNarrativeInfo(narrativeInfo);
        // get databins
        const dataBins = d3.bin().thresholds(10)(data);
        //console.log(rawDependentData);
        const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
        const quantile = d3.scaleQuantile()
            .domain(data) // pass the whole dataset to a scaleQuantile’s domain
            .range(dependentColorScheme);

        const classSteps = quantile.quantiles();
        //console.log(classSteps);
        // make histogram clusters
        const echartHistData = {
            binNames: [],
            binCount: [],
            featureName: dependentVar,
            grid: { top: 15, bottom: 20, right: 25 },
        };
        dataBins.forEach(e=>{
            let name = e.x0 + '-' + e.x1;
            let color = e.x1 <= classSteps[0] ? dependentColorScheme[0] : 
            (e.x1 <=  classSteps[1] ? dependentColorScheme[1] : 
            (e.x1 <= classSteps[2] ? dependentColorScheme[2] : 
                (e.x1 <= classSteps[3] ? dependentColorScheme[3] : dependentColorScheme[4])));
            
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
        if((props.dependent_features.length > 0) && (props.norm_test_result.length > 0)){
            setCurrentY(props.dependent_features[0]);
            makeHistoData(
                props.norm_test_result.filter(e=>e.feature === props.dependent_features[0])[0], 
                props.dependent_features[0], 
                props.logtrans_backup, 
            );
        }
    }, [props.dependent_features[0], props.norm_test_result]);

    const handleBtnClick = (e) => {
        //console.log('click', props.select_case);
        props.logTransform(currentY, props.select_case);
    };
    
    return(
        <Card
            title={'Distribution of Dependent Variable Y: ' + currentY}
            size='small'
        >
            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={15}>
                        <HistogramEchart
                            echartHistData={echartHistData}
                            height={130}
                        />
                        </Col>

                        <Col span={9}>
                            <Descriptions.Item><b>Normality test result</b></Descriptions.Item>
                            <Descriptions column={1} size={'small'} style={{marginTop: 10}}>
                            <Descriptions.Item label="p-value (95%)">{narrativeInfo.pvalue}</Descriptions.Item>
                            <Descriptions.Item label="Skewness">{narrativeInfo.skewness}</Descriptions.Item>
                            <Descriptions.Item><b>{narrativeInfo.distribution}</b></Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <div style={{padding: 8}}>
                    <Alert 
                        message={suggestion.msg}
                        type={suggestion.type} 
                        showIcon
                        style={{
                            textAlign: 'left',
                        }}
                        action={
                            <Button size="small" type="ghost" disabled={suggestion.action} onClick={()=>handleBtnClick('log')} >{suggestion.btnMsg}</Button>
                        }
                    />
                    </div>
                    
                </Col>
            </Row>
        </Card>
    );
}
