import React, {useState} from "react";
import { Typography, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
//import { BoxZoomHandler } from "mapbox-gl";
const { Paragraph, Text } = Typography;

export function LocalR2Narrative (props) {
    const [goodLocalR2Areas, setGoodLocalR2Areas] = useState("");
    const [badLocalR2Areas, setBadLocalR2Areas] = useState("");
    const [textGoodLocalR2, setTextGoodLocalR2] = useState("");
    const [textBadLocalR2, setTextBadLocalR2] = useState("");
    const [goodDIVstyle, setGoodDIVstyle] = useState({textAlign: 'left'});
    const [badDIVstyle, setBadDIVstyle] = useState({textAlign: 'left'});
    const [goodClicked, setGoodClicked] = useState(false);
    const [badClicked, setBadClicked] = useState(false);
    
    const updateGoodR2Name = (key) => {
        setGoodLocalR2Areas(key);
        const newText = key+`, where the local R <sup>2</sup> values are greater than <b>0.7</b> Indicating a decent prediction of the model in these areas.`;
        setTextGoodLocalR2(newText);
    };

    const updateBadR2Name = (key) => {
        setBadLocalR2Areas(key);
        const newText = key+`, where the local R <sup>2</sup> values are less than <b>0.6</b> Indicating a poor prediction in these areas.`;
        setTextBadLocalR2(newText);
    };

    const key = props.selectedRowKeys[0];
    const geojsonObj = props.model_result.geojson_poly.features.map(e=>e.properties);
    //const stat = props.model_result[key];
    const areaName = props.select_case === 'chicago' ? ' community areas in ' : ' counties in ';
    const upperAreaName = props.select_case === 'chicago' ? ' city' : ' state';

    const threshold_good = 0.7;
    const threshold_bad = 0.6;
    const good_places = {};
    const bad_places = {};
    geojsonObj.forEach(e=>{
        if(e.local_R2 >= threshold_good){
            good_places[e.state_name] !== undefined ? 
            good_places[e.state_name].push(e.UID) :
            good_places[e.state_name] = [e.UID];
            
        }else if(e.local_R2 < threshold_bad){
            //bad_places.push(e.UID);
            bad_places[e.state_name] !== undefined ? 
            bad_places[e.state_name].push(e.UID) :
            bad_places[e.state_name] = [e.UID];
        }
    });

    let good_places_narr = '';
    Object.keys(good_places).map((key, i)=>{
        const len = good_places[key].length;
        const textgood = len+areaName+key+upperAreaName;
        if(i<Object.keys(good_places).length-1){
            good_places_narr = good_places_narr + ', '
        }
        good_places_narr = good_places_narr + textgood;
    });

    let bad_places_narr = '';
    Object.keys(bad_places).map((key, i)=>{
        const len = bad_places[key].length;
        const textbad = len+areaName+key+upperAreaName;
        if(i<Object.keys(bad_places).length-1){
            bad_places_narr = bad_places_narr + ', '
        }
        bad_places_narr = bad_places_narr + textbad;
    });

    const initGoodCopy = good_places_narr+`, where the local R <sup>2</sup> values are greater than <b>0.7</b> Indicating a decent prediction of the model in these areas.`;
    const initBadCopy = bad_places_narr+`, where the local R <sup>2</sup> values are less than <b>0.6</b> Indicating a poor prediction in these areas.`;

    const handleGoodCopy = () => {
        const newText = goodLocalR2Areas === "" ? 
        initGoodCopy : textGoodLocalR2;
        console.log(newText);
    };

    const handleBadCopy = () => {
        const newText = badLocalR2Areas === "" ? 
        initBadCopy : textBadLocalR2;
        console.log(newText);
    };

    const onGoodHover = () => {
        setBadDIVstyle({textAlign: 'left'});
        setBadClicked(false);

        let filter = ['in', 'UID'];
        Object.keys(good_places).forEach((key)=>{
            good_places[key].forEach(e=>{
                filter.push(e);
            });
        });
        setGoodDIVstyle({textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.1)'});
        props.setMapLayer(key, filter);
        //console.log(filter);
    };

    const offGoodHover = () => {
        let filter = ['!', ['in', 'UID', ""]];
        if(!goodClicked){
            props.setMapLayer(key);
            setGoodDIVstyle({textAlign: 'left'});
        }   
    };

    const onGoodClick = () => {
        //console.log('click');
        setGoodClicked(!goodClicked);
    };

    const onBadHover = () => {
        setGoodDIVstyle({textAlign: 'left'});
        setGoodClicked(false);

        let filter = ['in', 'UID'];
        Object.keys(bad_places).forEach((key)=>{
            bad_places[key].forEach(e=>{
                filter.push(e);
            });
        });
        setBadDIVstyle({textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.1)'});
        props.setMapLayer(key, filter);
        //console.log(filter);
    };

    const offBadHover = () => {
        let filter = ['!', ['in', 'UID', ""]];
        if(!badClicked){
            setBadDIVstyle({textAlign: 'left'});
            props.setMapLayer(key);
        }
    };

    const onBadClick = () => {
        //console.log('click');
        setBadClicked(!badClicked);
    };

    return (
        <>
        <Paragraph
            style={goodDIVstyle}
            onMouseEnter={() => onGoodHover()}
            onMouseLeave={() => offGoodHover()}
            onClick={onGoodClick}
        >
            <Text key={key} editable={{ onChange: updateGoodR2Name }}>{goodLocalR2Areas === "" ? good_places_narr : goodLocalR2Areas}</Text>
                , where the local R <sup>2</sup> values are greater than <Text strong>0.7</Text>. 
                Indicating a <Text type="success">decent prediction</Text> of the model in these areas.
            <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleGoodCopy()}
            ></Button>
        </Paragraph>

        <Paragraph
            style={badDIVstyle}
            onMouseEnter={() => onBadHover()}
            onMouseLeave={() => offBadHover()}
            onClick={onBadClick}
        >
            <Text key={key} editable={{ onChange: updateBadR2Name }}>{badLocalR2Areas === "" ? bad_places_narr : badLocalR2Areas}</Text>
                , where the local R <sup>2</sup> values are less than <Text strong>0.6</Text>. 
                Indicating a <Text type="warning">poor prediction</Text> in these areas.
            <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleBadCopy()}
            ></Button>
        </Paragraph>
        </>
    );
}
