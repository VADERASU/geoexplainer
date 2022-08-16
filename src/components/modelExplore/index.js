import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';

import { ModelPerformance } from "./modelPerformance";
import { ModelCoefficient } from "./modelCoefficient";
import { NumDistribution } from "./numDistribution";
import { NarrativeExplain } from "./narrativeExplain";

export function ModelExplore (props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState(['local_R2']);
    const [numericalDist, setNumericalDist] = useState(null);
    const [numericalBtnSelect, setNumericalBtnSelect] = useState('local_R2');
    const [narrativeBtnSelect, setNarrativeBtnSelect] = useState('local_R2');
    const [numericalContainerDisplay, setNumericalContainerDisplay] = useState({display: 'block'});

    const [narrativeContainerDisplay, setNarrativeContainerDisplay] = useState({display: 'block'});

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};
    const makeNumericalDist = (feature) => {
        setNumericalDist({
            key: feature,
            data: props.model_result[feature]
        });
    };
    
    const handleNumBtnClick = (feature) => {
        setNumericalBtnSelect(feature === numericalBtnSelect ? null : feature);
        setNumericalContainerDisplay(
            feature === numericalBtnSelect ? {display: 'none'} : {display: 'block'}
        );
        setNumericalDist(
            feature === numericalBtnSelect ? null :
            {
                key: feature,
                data: props.model_result[feature]
            }
        );
    };

    const handleNarrativeBtnClick = (feature) => {
        
        setNarrativeBtnSelect(feature === narrativeBtnSelect ? null : feature);
        setNarrativeContainerDisplay(
            feature === narrativeBtnSelect ? {display: 'none'} : {display: 'block'}
        );
    };

    return props.model_trained ? (
        <div style={modelExploreInterfaceStyle}>
            <div className="floatExplorationContainer">
                {/** model performance container */}
                <ModelPerformance
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    globalInfo={props.model_result.diagnostic_info}
                    model_used={props.model_used}
                    local_r2={props.model_result.local_R2}
                    cooksd={props.model_result.cooksD}
                    residual={props.model_result.std_residuals}
                    setMapLayer={props.setMapLayer}
                    setNumericalDist={makeNumericalDist}

                    numericalBtnSelect={numericalBtnSelect}
                    narrativeBtnSelect={narrativeBtnSelect}
                    handleNumBtnClick={handleNumBtnClick}
                    handleNarrativeBtnClick={handleNarrativeBtnClick}
                />
                {/** model coefficient container */}
                <ModelCoefficient
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    model_result={props.model_result}
                    setMapLayer={props.setMapLayer}
                    numericalBtnSelect={numericalBtnSelect}
                    narrativeBtnSelect={narrativeBtnSelect}
                    handleNumBtnClick={handleNumBtnClick}
                    handleNarrativeBtnClick={handleNarrativeBtnClick}
                />
            </div>

            <div className="floatPlotsContainer">
                <NumDistribution
                    numericalDist={numericalDist}
                    numericalContainerDisplay={numericalContainerDisplay}
                    setNumericalContainerDisplay={setNumericalContainerDisplay}
                    setNumericalBtnSelect={setNumericalBtnSelect}
                />

                <NarrativeExplain
                    narrativeContainerDisplay={narrativeContainerDisplay}
                    setNarrativeContainerDisplay={setNarrativeContainerDisplay}
                    setNarrativeBtnSelect={setNarrativeBtnSelect}
                    selectedRowKeys={selectedRowKeys}
                    model_result={props.model_result}
                    setMapLayer={props.setMapLayer}
                />
            </div>
            
        </div>
    ) : <></>;
}
