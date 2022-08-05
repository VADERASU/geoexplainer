import React, {createFactory, useEffect, useState} from "react";
import { Card, Row, Col } from 'antd';
import { ScatterEchart } from "../../utilities/scatterEchart";

export function Correlation(props) {
    
    const [currentY, setCurrentY] = useState(null);
    const [currentX, setCurrentX] = useState(null);
    const [echartScatterData, setEchartScatterData] = useState(null);
    
    const makeScatterData = (xData, yData) => {
        setEchartScatterData(xData.map((d,i) => [d, yData[i]]));
    };

    useEffect(()=>{
        if (props.dependent_features.length > 0) {
            setCurrentY(props.dependent_features[0]);
        }

        if (props.currentActivCorrelation !== null) {
            setCurrentX(props.currentActivCorrelation);
        }

        if (props.corrX.length > 0 && props.corrY.length > 0) {
            makeScatterData(props.corrX, props.corrY);
        }
    }, [props]);
    
    return(
        <Card
            title={'Correlation of [' + currentY + ']' + 'and [' + currentX + ']'}
        >
            <ScatterEchart echartScatterData={echartScatterData}></ScatterEchart>
        </Card>
    );
}