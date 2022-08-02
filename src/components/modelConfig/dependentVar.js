import React, {useEffect, useState} from "react";
import '../../styles/modelConfig.css';
import { Card, Button } from 'antd';

export function DependentVar(props){
    const [currentY, setCurrentY] = useState(null);

    useEffect(()=>{
        if(props.dependent_features.length > 0){
            setCurrentY(props.dependent_features[0]);
        }
    });

    return(
        <Card
            title={'Distribution of Dependent Variable Y: ' + currentY}
            size='small'

        >
        
        </Card>
    );
}
