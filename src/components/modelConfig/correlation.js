import React, {createFactory, useEffect, useState} from "react";
import { Card, Row, Col } from 'antd';
import { ScatterEchart } from "../../utilities/scatterEchart";

export function Correlation(props) {
    
    const [currentY, setCurrentY] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [echartScatterData, setEchartScatterData] = useState(null);
    
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
        >
            <ScatterEchart echartScatterData={echartScatterData}></ScatterEchart>
        </Card>
    );
}