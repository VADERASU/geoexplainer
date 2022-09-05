import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Card, Row, Col, Descriptions, Alert } from 'antd';
import { ScatterEchart } from "../../utilities/scatterEchart";

export function Correlation(props) {
    
    const [currentY, setCurrentY] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [echartScatterData, setEchartScatterData] = useState(null);

    const [narrativeInfo, setNarrativeInfo] = useState({
        p_value: 0.00,
        correlation_coefficient: 0.00,
        //distribution: null
    });
    const [suggestion, setSuggestion] = useState({
        msg: null,
        type: 'info',
    });
    
    const getPearsonResult = (Y, X, select_case) => {
        axios.get('http://demo.vaderlab.org:5006/models/api/v0.1/calibration/correlation/'+Y+'+'+X+'+'+select_case)
        .then(response => {
          setNarrativeInfo(response.data.pearson_results);
          makeSuggestion(response.data.pearson_results.p_value, response.data.pearson_results.correlation_coefficient);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    };

    const makeSuggestion = (pVal, coeff) => {
        if(pVal < 0.05){
            if(coeff >= 0.7){
                let sugDict = {
                    msg: 'Significant global strong positive relationship between two variables.',
                    type: 'success',
                };
                setSuggestion(sugDict);
            }else if(coeff >= 0.5 || coeff < 0.7){
                let sugDict = {
                    msg: 'Significant global moderate positive relationship between two variables.',
                    type: 'success',
                };
                setSuggestion(sugDict);
            }else if(coeff >= 0.3 || coeff < 0.5){
                let sugDict = {
                    msg: 'Significant global weak positive relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }else if(coeff >= 0 || coeff < 0.3){
                let sugDict = {
                    msg: 'Very weak or no positive relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }else if(coeff >= -0.3 || coeff < 0){
                let sugDict = {
                    msg: 'Very weak or no negative relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }else if(coeff >= -0.5 || coeff < -0.3){
                let sugDict = {
                    msg: 'Significant global weak negative relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }else if(coeff >= -0.7 || coeff < -0.5){
                let sugDict = {
                    msg: 'Significant global moderate negative relationship between two variables.',
                    type: 'success',
                };
                setSuggestion(sugDict);
            }else if(coeff < -0.7){
                let sugDict = {
                    msg: 'Significant global strong negative relationship between two variables.',
                    type: 'success',
                };
                setSuggestion(sugDict);
            }
        }else{
            if(coeff > 0){
                let sugDict = {
                    msg: 'Insignificant positive relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }else if(coeff < 0){
                let sugDict = {
                    msg: 'Insignificant negative relationship between two variables.',
                    type: 'info',
                };
                setSuggestion(sugDict);
            }
        }
    };

    useEffect(() => {
        if (props.dependent_features.length > 0 && props.currentActivCorrelation !== null && props.loaded_map_data.features.length > 0) {
            setCurrentY(props.dependent_features[0]);
            setCurrentX(props.currentActivCorrelation);
            getPearsonResult(props.dependent_features[0], props.currentActivCorrelation, props.select_case);
            //console.log(props.independCorr);
            setEchartScatterData(
                props.loaded_map_data.features.map(d => {
                    return {
                        x: d.properties[props.currentActivCorrelation],
                        y: d.properties[props.dependent_features[0]],
                        UID: d.properties['UID'],
                        county_name: d.properties['county_name'],
                        xName: props.currentActivCorrelation,
                        yName: props.dependent_features[0],
                        color: d.properties.biVariateLayer,
                    }
                }
            ));
        }
    }, [props.dependent_features[0], props.currentActivCorrelation]);
    
    return(
        <Card
            title={'Correlation of [' + currentY + '] and [' + currentX + ']'}
            size='small'
        >
            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={15}>
                        <ScatterEchart 
                            echartScatterData={echartScatterData}
                            xName={props.currentActivCorrelation}
                            yName={props.dependent_features[0]}
                            height={150}
                            independCorr={props.independCorr!== undefined ? true : false}
                        />
                        </Col>

                        <Col span={9}>
                            <Descriptions.Item><b>Linear correlation test</b></Descriptions.Item>
                            <Descriptions column={1} size={'small'} style={{marginTop: 10}}>
                            <Descriptions.Item label="p-value (95%)">{parseFloat(narrativeInfo.p_value).toFixed(2)}</Descriptions.Item>
                            <Descriptions.Item label="Pearson coefficient">{parseFloat(narrativeInfo.correlation_coefficient).toFixed(2)}</Descriptions.Item>
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
                    />
                    </div>
                    
                </Col>
            </Row>
        </Card>
    );
}