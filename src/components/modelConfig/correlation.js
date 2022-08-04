import React, {useEffect, useState} from "react";
import { Card, Row, Col } from 'antd';
import { ScatterEchart } from "../../utilities/scatterEchart";

export function Correlation(props) {

    const [currentY, setCurrentY] = useState(null);
    
    useEffect(()=>{
        if (props.dependent_features.length > 0) {
            setCurrentY(props.dependent_features[0]);
        }
    }, [props]);
    
    return(
        <Card
            title={'Correlation of [' + currentY + ']'}
            
        >
            <ScatterEchart></ScatterEchart>
        </Card>
    );
}