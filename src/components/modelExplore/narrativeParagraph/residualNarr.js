import React, {useState} from "react";
import { Typography, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
//import { BoxZoomHandler } from "mapbox-gl";
const { Paragraph, Text } = Typography;

export function ResidualNarrative (props) {
    const [goodDIVstyle, setGoodDIVstyle] = useState({textAlign: 'left'});
    const [badDIVstyle, setBadDIVstyle] = useState({textAlign: 'left'});
    const [goodClicked, setGoodClicked] = useState(false);
    const [badClicked, setBadClicked] = useState(false);

    const key = props.selectedRowKeys[0];
    const geojsonObj = props.model_result.geojson_poly.features.map(e=>e.properties);
    
    //const stat = props.model_result[key];
    const good_places = {};
    const bad_places = {};
    geojsonObj.forEach(e=>{
        if(e.std_residuals >= 0){
            good_places[e.state_name] !== undefined ? 
            good_places[e.state_name].push(e.UID) :
            good_places[e.state_name] = [e.UID];
            
        }else if(e.std_residuals < 0){
            //bad_places.push(e.UID);
            bad_places[e.state_name] !== undefined ? 
            bad_places[e.state_name].push(e.UID) :
            bad_places[e.state_name] = [e.UID];
        }
    });

    const goodNarr = "The positive values of residuals stand for those regions where the predicted values are higher than expected.";
    const badNarr = "The negative values are associated with regions where the value was found lower than expected.";
    
    const moranResult = props.model_result.std_residuals.moran;
    const moranNarr = `The expected value of Moran's I if the distribution were random is ` + 
    moranResult.moran_EI + ` and the observed value is ` + moranResult.moran_I + 
    ` with a p value of `+moranResult.moran_p+` in 95% confidence intervals.`;

    let moranPost = moranResult.moran_p >= 0.05 ? 
    (`There is no clear (systematic) pattern of over or under predictions in the study area.`+
    `The model works good without missing and key explanatory variables.`) :
    (`The residuals exhibit strong spatial dependency, which invalidates the inferences made from the model.`);
    
    const handleCopy = (e) => {
        console.log(e);
    };

    const onGoodHover = () => {
        let filter = ['in', 'UID'];
        Object.keys(good_places).forEach((key)=>{
            good_places[key].forEach(e=>{
                filter.push(e);
            });
        });
        setGoodDIVstyle({textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.1)'});
        props.setMapLayer(key, filter);
        //console.log(key);
    };

    const offGoodHover = () => {
        props.setMapLayer(key);
        setGoodDIVstyle({textAlign: 'left'});        
    };

    const onBadHover = () => {
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
        setBadDIVstyle({textAlign: 'left'});
        props.setMapLayer(key);
    };

    return(
        <>
            <Paragraph style={{textAlign: 'left'}}>
                The spatial distribution of the model residuals
                 between the predicted and observed dependent variable <Text strong>{props.model_result.Y}</Text>
            </Paragraph>

            <Paragraph
                style={goodDIVstyle}
                onMouseEnter={() => onGoodHover()}
                onMouseLeave={() => offGoodHover()}
            >
                {goodNarr}
                <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleCopy(1)}
                ></Button>
            </Paragraph>

            <Paragraph
                style={badDIVstyle}
                onMouseEnter={() => onBadHover()}
                onMouseLeave={() => offBadHover()}
            >
                {badNarr}
                <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleCopy(2)}
                ></Button>
            </Paragraph>

            <Paragraph style={{textAlign: 'left'}}>
                {moranNarr}
                <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleCopy(3)}
                ></Button>
            </Paragraph>

            <Paragraph style={{textAlign: 'left'}}>
                {moranPost}
                <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleCopy(4)}
                ></Button>
            </Paragraph>
        </>
    );
}
