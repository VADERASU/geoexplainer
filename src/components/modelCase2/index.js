import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import numDistImg_chicago from '../../img/chicago_std.png';
import us1 from '../../img/us_pct_age_18_29.png';
import us2 from '../../img/us_intercept.png';
import chicagoMapGreen from '../../img/chicago_green.png';

import { ModelPerformance } from "./modelPerformance";
import { ModelCoefficient } from "./modelCoefficient";
import { NumDistribution } from "./numDistribution";
import { NarrativeExplain } from "./narrativeExplain";
import { ReportAuthor } from "./reportAuthor";
import { ExternalInfo } from "./wikiInfo";
import { Legend } from "../../utilities/legend";
import { WikiText } from "./oriWikiText";

export function ModelCase2 (props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState(['ols_residual']);
    const [numericalDist, setNumericalDist] = useState(null);
    const [numericalBtnSelect, setNumericalBtnSelect] = useState('ols_residual');
    const [narrativeBtnSelect, setNarrativeBtnSelect] = useState('ols_residual');
    const [numericalContainerDisplay, setNumericalContainerDisplay] = useState({display: 'block'});

    const [narrativeContainerDisplay, setNarrativeContainerDisplay] = useState({display: 'block'});

    const [reportContent, setReportContent] = useState(['']);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [wikiTextDisplay, setWikiTextDisplay] = useState(false);
    //const [externalArea, setExternalArea] = useState([]);
    //const [externalCase, setExternalCase] = useState('general');

    const modelExploreInterfaceStyle = props.model_trained ? {display: 'block'} : {display: 'none'};
    const [mapImg, setMapImg] = useState(us1);
    const [mapImg1, setMapImg1] = useState(us2);

    /*const changeMapImg = (val) => {
        //console.log(val);
        if(val === 'intercept'){
            setMapImg(us2);
        }else{
            setMapImg(us1);
        }
    };*/

    const resetMapColor = (val) => {
        //console.log(val);
        val === 0 ? setMapImg(us1) : setMapImg(us1);
    };

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

    const mapInfoGen = () => {
        const imgInfo = selectedRowKeys[0] === 'intercept' ? 'map_img1' : 'map_img';
        let reportList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        reportList.push(imgInfo);
        setReportContent(reportList);
    };

    const newParagraphGen = (param) => {
        console.log(param);
        let reportList = JSON.parse(JSON.stringify(reportContent)); // deep copy
        reportList.splice(1, 0, param);
        setReportContent(reportList);
        //console.log(reportContent);
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

    return (props.model_trained && props.select_case === "US_election") ? (
        <div style={modelExploreInterfaceStyle}>
            <div className="floatExplorationContainer">
                {/** model performance container */}
                <ModelPerformance
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    globalInfo={props.model_result.diagnostic_info}
                    model_used={props.model_used}
                    ols_residual={props.model_result.ols_residual}
                    mgwr_residual={props.model_result.mgwr_residual}
                    setMapLayer={props.setMapLayer}
                    setNumericalDist={makeNumericalDist}

                    numericalBtnSelect={numericalBtnSelect}
                    narrativeBtnSelect={narrativeBtnSelect}
                    handleNumBtnClick={handleNumBtnClick}
                    handleNarrativeBtnClick={handleNarrativeBtnClick}

                    globalInfoGen={globalInfoGen}
                    setDisplayFlag={setDisplayFlag}
                    //setExternalCase={props.setExternalCase}
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
                    setDisplayFlag={setDisplayFlag}
                    setExternalCase={props.setExternalCase}
                />
                {/** original Wiki content list */}
                <WikiText 
                    wikiTextDisplay={wikiTextDisplay}
                    setWikiTextDisplay={setWikiTextDisplay}
                    select_case={props.select_case}
                    setMapFilter={props.setMapFilter}
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
                    setDisplayFlag={setDisplayFlag}
                    setExternalCase={props.setExternalCase}
                    mapFly={props.mapFly}
                />

                <ExternalInfo
                    displayFlag={displayFlag}
                    setDisplayFlag={setDisplayFlag}
                    
                    externalCase={props.externalCase}
                    setWikiTextDisplay={setWikiTextDisplay}
                />

            </div>

            <ReportAuthor
                reportContent={reportContent}
                deleteClick={deleteClick}
                numDistImg={numDistImg_chicago}
                moveUpClick={moveUpClick}
                moveDownClick={moveDownClick}
                loaded_map_data={props.loaded_map_data}
                selectedRowKeys={selectedRowKeys}
                mapInfoGen={mapInfoGen}
                mapImg={mapImg}
                mapImg1={mapImg1}
                resetMapColor={resetMapColor}
                newParagraphGen={newParagraphGen}
            />

            <div
                className='mapLegend'
                style={{width: 500, height: 40}}
                >
                <Legend 
                    mapLegend={props.mapLegend}
                    loaded_map_data={props.loaded_map_data}
                />
            </div>           
            
        </div>
    ) : <></>;
}
