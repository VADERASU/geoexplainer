import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, InputNumber, Button} from 'antd';
//import * as d3 from 'd3';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { LocalR2Narrative } from "./narrativeParagraph/localR2Narr";
import { CooksDNarrative } from "./narrativeParagraph/cooksDNarr";
import { ResidualNarrative } from "./narrativeParagraph/residualNarr";
import { CoeffNarrative } from "./narrativeParagraph/coeffNarr";

export function NarrativeExplain (props) {
    //const { Paragraph, Text, Link } = Typography;

    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});
    const [narrativeInfo, setNarrativeInfo] = useState(null);
    // control the local R2 threshold setting
    const [R2ThresholdDisplay, setR2ThresholdDisplay] = useState({
        display: 'none'
    });

    //const [goodLocalR2Areas, setGoodLocalR2Areas] = useState("");
    //const [badLocalR2Areas, setBadLocalR2Areas] = useState("");

    const cardBodyDisplay = {
        display: cardDisplay,
        padding: 12,
        height: 250,
        overflow: 'auto',
    };
    const btnDisplay = {
        display: cardDisplay,
        marginLeft: 5,
        float: 'left'
    };

    const closeBtnClick = () => {
        props.setNarrativeContainerDisplay({display: 'none'});
        props.setNarrativeBtnSelect(null);
    };

    const minBtnClick = () => {
        setCardDisplay('none');
        setMinCardDisplay({display: 'block', float: 'left'});
    };

    const maxBtnClick = () => {
        setCardDisplay('block');
        setMinCardDisplay({display: 'none'});
    };

    const makeNarrative = (model_result, selectedRowKeys, setMapLayer,narraInfoGen) => {
        const key = selectedRowKeys[0];
        //const geojsonObj = model_result.geojson_poly.features.map(e=>e.properties);
        //const stat = model_result[key];
        if(key === 'local_R2'){
            setR2ThresholdDisplay({
                marginRight: 10,
                float: 'left'
            });
            setNarrativeInfo(
                <LocalR2Narrative
                    selectedRowKeys={selectedRowKeys}
                    model_result={model_result}
                    setMapLayer={setMapLayer}
                    select_case={props.select_case}
                />
            );
        }else if(key === 'cooksD'){
            setR2ThresholdDisplay({
                display: 'none'
            });
            setNarrativeInfo(
                <CooksDNarrative
                    selectedRowKeys={selectedRowKeys}
                    model_result={model_result}
                    setMapLayer={setMapLayer}
                    select_case={props.select_case}
                />
            ); 
        }else if(key === 'std_residuals'){
            setR2ThresholdDisplay({
                display: 'none'
            });
            setNarrativeInfo(
                <ResidualNarrative
                    selectedRowKeys={selectedRowKeys}
                    model_result={model_result}
                    setMapLayer={setMapLayer}
                    select_case={props.select_case}
                    narraInfoGen={narraInfoGen}
                />
            );
        }else{
            setR2ThresholdDisplay({
                display: 'none'
            });
            setNarrativeInfo(
                <CoeffNarrative
                    selectedRowKeys={selectedRowKeys}
                    model_result={model_result}
                    setMapLayer={setMapLayer}
                    select_case={props.select_case}
                    narraInfoGen={narraInfoGen}
                    setDisplayFlag={props.setDisplayFlag}
                    setExternalCase={props.setExternalCase}
                />
            );
        }

    };

    useEffect(()=>{
        if(props.model_result !== {}){
            makeNarrative(props.model_result, props.selectedRowKeys, props.setMapLayer,props.narraInfoGen);
        }
    }, [props.model_result, props.selectedRowKeys, props.setMapLayer,props.narraInfoGen]);

    return(
        <div className='narrativeExplainContainer' style={props.narrativeContainerDisplay}>
            <Card
                title={'Explain the Spatial Distribution: '+ props.selectedRowKeys[0]}
                size="small"
                className="explorationCard"
                bodyStyle={cardBodyDisplay}
                extra={
                    <div
                    style={{
                        display: 'inline-block',
                        fontSize: 12
                    }}
                >
                    <InputNumber 
                        style={R2ThresholdDisplay}
                        size="small"
                        defaultValue={0.7}
                        step="0.01"
                    />

                    <Button 
                    style={btnDisplay} 
                    size='small' icon={<MinusOutlined />}
                    onClick={() => minBtnClick()}
                    ></Button>

                    <Button 
                        style={btnDisplay} 
                        size='small' icon={<CloseOutlined />}
                        onClick={() => closeBtnClick()}
                    ></Button>

                    <Button 
                    size='small' style={minCardDisplay}
                    icon={<PlusOutlined />}
                    onClick={() => maxBtnClick()}
                    ></Button>

                </div>
                }
            >
                {narrativeInfo}
            </Card>
        </div>
    );
}
