import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';

import { ModelPerformance } from "./modelPerformance";

export function ModelExplore (props) {

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};

    return props.model_trained ? (
        <div style={modelExploreInterfaceStyle}>
            <div className="floatExplorationContainer">
            {/** model performance container */}
                <ModelPerformance
                />

            </div>
        </div>
    ) : <></>;
}
