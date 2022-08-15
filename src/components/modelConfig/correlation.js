import React, { useEffect, useState } from "react";
import { Card, Row, Col, Descriptions, Alert } from 'antd';
import { ScatterEchart } from "../../utilities/scatterEchart";

export function Correlation(props) {
    
    const [currentY, setCurrentY] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [echartScatterData, setEchartScatterData] = useState(null);

    const [narrativeInfo, setNarrativeInfo] = useState({
        pearson_pvalue: 0.00,
        pearson_coefficient: 0.00,
        //distribution: null
    });
    const [suggestion, setSuggestion] = useState({
        msg: null,
        type: 'info',
    });
    
    useEffect(() => {
        if (props.dependent_features.length > 0 && props.currentActivCorrelation !== null && props.loaded_map_data.features.length > 0) {
            setCurrentY(props.dependent_features[0]);
            setCurrentX(props.currentActivCorrelation);
            setEchartScatterData(
                props.loaded_map_data.features.map(d => {
                    return {
                        x: d.properties[props.currentActivCorrelation],
                        y: d.properties[props.dependent_features[0]],
                        UID: d.properties['UID']
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
                            height={130}
                        />
                        </Col>

                        <Col span={9}>
                            <Descriptions.Item><b>Linear correlation test</b></Descriptions.Item>
                            <Descriptions column={1} size={'small'} style={{marginTop: 10}}>
                            <Descriptions.Item label="p-value (95%)">{narrativeInfo.pearson_pvalue}</Descriptions.Item>
                            <Descriptions.Item label="Skewness">{narrativeInfo.pearson_coefficient}</Descriptions.Item>
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