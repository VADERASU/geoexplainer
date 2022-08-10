import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';

import { ModelPerformance } from "./modelPerformance";

export function ModelExplore (props) {

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};

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
                />

            </div>
        </div>
    ) : <></>;
}
