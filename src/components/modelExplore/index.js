import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';

import { ModelPerformance } from "./modelPerformance";
import { NumDistribution } from "./numDistribution";

export function ModelExplore (props) {
    const [numericalDist, setNumericalDist] = useState(null);

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};
    const makeNumericalDist = (feature) => {
        setNumericalDist({
            key: feature,
            data: props.model_result[feature]
        });
    };
    //console.log(props.model_trained ? props.loaded_map_data : '');

    return props.model_trained ? (
        <div style={modelExploreInterfaceStyle}>
            <div className="floatExplorationContainer">
            {/** model performance container */}
                <ModelPerformance
                    globalInfo={props.model_result.diagnostic_info}
                    model_used={props.model_used}
                    local_r2={props.model_result.local_R2}
                    cooksd={props.model_result.cooksD}
                    residual={props.model_result.std_residuals}
                    setMapLayer={props.setMapLayer}
                    setNumericalDist={makeNumericalDist}
                />

            </div>

            <NumDistribution
                numericalDist={numericalDist}
            />
            
        </div>
    ) : <></>;
}
