import React, {useState} from "react";
import { Typography, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
//import { BoxZoomHandler } from "mapbox-gl";
const { Paragraph, Text } = Typography;

export function CooksDNarrative (props) {
    const [coodsdAreas, setCooksdAreas] = useState("");
    const [textCooksd, setTextCooksd] = useState("");
    const [DIVstyle, setDIVstyle] = useState({textAlign: 'left'});
    const [clicked, setClicked] = useState(false);

    const updateName = (key) => {
        setCooksdAreas(key);
        const newText = key+`, where the Cook's distances are above the threshold and these places are considered as influential outliers. Areas list above are worth checking for validity.`;
        setTextCooksd(newText);
    };

    const key = props.selectedRowKeys[0];
    const geojsonObj = props.model_result.geojson_poly.features.map(e=>e.properties);
    const threshold = 4 / geojsonObj.length;
    const areaName = props.select_case === 'chicago' ? ' community areas in ' : ' counties in ';
    const upperAreaName = props.select_case === 'chicago' ? ' city' : ' state';
    const places = {};
    geojsonObj.forEach(e=>{
        if(e.cooksD > threshold){
            places[e.state_name] !== undefined ? 
            places[e.state_name].push(e.UID) :
            places[e.state_name] = [e.UID];
        }
    });

    let places_narr = '';
    Object.keys(places).map((key, i)=>{
        const len = places[key].length;
        const textgood = len+areaName+key+upperAreaName;
        if(i<Object.keys(places).length-1){
            places_narr = places_narr + ', '
        }
        places_narr = places_narr + textgood;
    });

    const initCopy = places_narr + `, where the Cook's distances are above the threshold and these places are considered as influential outliers. Areas list above are worth checking for validity.`;

    const handleCopy = () => {
        const newText = coodsdAreas === "" ? 
        initCopy : textCooksd;
        console.log(newText);
    };
    //console.log(props.model_result);

    return(
        <Paragraph
            style={DIVstyle}
            //onMouseEnter={() => onGoodHover()}
            //onMouseLeave={() => offGoodHover()}
            //onClick={onGoodClick}
        >
            <Text key={key} editable={{ onChange: updateName }}>{coodsdAreas === "" ? places_narr : coodsdAreas}</Text>
                , where the Cook's distances are above the threshold  
                and these places are considered as <b>influential outliers</b>.  
                <Text type="warning"> Areas list above are worth checking for validity.</Text>
            <Button 
                size='small' style={{display: 'inline-block', marginLeft: 3}}
                icon={<CopyOutlined />} type="dashed"
                onClick={() => handleCopy()}
            ></Button>
        </Paragraph>
    );

}
