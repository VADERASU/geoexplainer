import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import numDistImg_chicago from '../../img/chicago_std.png';

import { ModelPerformance } from "./modelPerformance";
import { ModelCoefficient } from "./modelCoefficient";
import { NumDistribution } from "./numDistribution";
import { NarrativeExplain } from "./narrativeExplain";
import { ReportAuthor } from "./reportAuthor";
import { ExternalInfo } from "./wikiInfo";

export function ModelExplore (props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState(['local_R2']);
    const [numericalDist, setNumericalDist] = useState(null);
    const [numericalBtnSelect, setNumericalBtnSelect] = useState('local_R2');
    const [narrativeBtnSelect, setNarrativeBtnSelect] = useState('local_R2');
    const [numericalContainerDisplay, setNumericalContainerDisplay] = useState({display: 'block'});

    const [narrativeContainerDisplay, setNarrativeContainerDisplay] = useState({display: 'block'});

    const [reportContent, setReportContent] = useState(['']);
    const [displayFlag, setDisplayFlag] = useState(true);
    //const [externalArea, ]

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};
    const makeNumericalDist = (feature) => {
        setNumericalDist({
            key: feature,
            data: props.model_result[feature]
        });
    };

    const deleteClick = (val) => {
        let conList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        conList.splice(val, 1);
        setReportContent(conList);
    };

    const moveUpClick = (val) => {
        let conList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        let upOriObj = conList[val-1];
        conList[val-1] = conList[val];
        conList[val] = upOriObj;
        setReportContent(conList);
    };

    const moveDownClick = (val) => {
        let conList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        let downOriObj = conList[val+1];
        conList[val+1] = conList[val];
        conList[val] = downOriObj;
        setReportContent(conList);
    };

    const globalInfoGen = (param) => {
        // generate global diagnostic information narrative
        let globalDiag = props.model_result.diagnostic_info;
        const globalInfo = `For the trained `+props.model_used+` model, the R-squared is `+globalDiag.R2.toFixed(2)+', adjusted R-squared is '
        +globalDiag.adj_R2.toFixed(2)+', and the AICc is '+globalDiag.AICc.toFixed(2)+'.';

        let reportList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        reportList.push(globalInfo);
        setReportContent(reportList);
    };

    const narraInfoGen = (param) => {
        let content = param;
        let reportList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        reportList.push(content);
        setReportContent(reportList);
        console.log(reportContent);
    };

    const numDistInfoGen = () => {
        const imgInfo = 'num_img';
        let reportList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        reportList.push(imgInfo);
        setReportContent(reportList);
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

                    globalInfoGen={globalInfoGen}
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
                    numDistInfoGen={numDistInfoGen}
                />

                <NarrativeExplain
                    narrativeContainerDisplay={narrativeContainerDisplay}
                    setNarrativeContainerDisplay={setNarrativeContainerDisplay}
                    setNarrativeBtnSelect={setNarrativeBtnSelect}
                    selectedRowKeys={selectedRowKeys}
                    model_result={props.model_result}
                    setMapLayer={props.setMapLayer}
                    select_case={props.select_case}
                    narraInfoGen={narraInfoGen}
                />
            </div>

            <ReportAuthor
                reportContent={reportContent}
                deleteClick={deleteClick}
                numDistImg={numDistImg_chicago}
                moveUpClick={moveUpClick}
                moveDownClick={moveDownClick}
            />

            <ExternalInfo
                displayFlag={displayFlag}
                setDisplayFlag={setDisplayFlag}
            />

        </div>
    ) : <></>;
}
