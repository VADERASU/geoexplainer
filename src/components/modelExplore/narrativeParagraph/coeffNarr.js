import React, {useState} from "react";
import { Typography, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

export function CoeffNarrative (props){
    const [posAreas, setPosAreas] = useState("");
    const [negAreas, setNegAreas] = useState("");
    const [textPosAreas, setTextPosAreas] = useState("");
    const [textNegAreas, setTextNegAreas] = useState("");
    const [posDIVstyle, setPosDIVstyle] = useState({textAlign: 'left'});
    const [negDIVstyle, setNegDIVstyle] = useState({textAlign: 'left'});
    const [goodClicked, setGoodClicked] = useState(false);
    const [badClicked, setBadClicked] = useState(false);
    
    const updatePosName = (key) => {
        setPosAreas(key);
        const newText = key+`, where the positive relationship is significant in `+posPct+`% study area. The significant local coefficients range from `+posMax+` to `+posMin+`, with a mean value equal to `+posMean+`.`;
        setTextPosAreas(newText);
    };

    const updateNegName = (key) => {
        setNegAreas(key);
        const newText = key+`, where the negative relationship is significant in `+negPct+`% study area. The significant local coefficients range from `+negMax+` to `+negMin+`, with a mean value equal to `+negMean+`.`;
        setTextNegAreas(newText);
    };

    const key = props.selectedRowKeys[0];
    const featureName = key + '_coefficient';
    const featureTVal = key + '_tval';
    const geojsonObj = props.model_result.geojson_poly.features.map(e=>e.properties);
    
    const areaName = props.select_case === 'chicago' ? ' community areas in ' : ' counties in ';
    const upperAreaName = props.select_case === 'chicago' ? ' city' : ' state';

    const pos_places = {};
    const neg_places = {};
    let posMax = 0;
    let posMin = 0;
    let negMax = 0;
    let negMin = 0;
    let poscount = 0;
    let negcount = 0;
    geojsonObj.forEach(e=>{
        if(e[featureTVal] !== 0){
            if(e[featureName] > 0){
                if(poscount === 0){
                    posMax = e[featureName];
                    posMin = e[featureName];
                }
                // positive relationship
                pos_places[e.state_name]!== undefined ? 
                pos_places[e.state_name].push(e.UID) : 
                pos_places[e.state_name] = [e.UID];
                
                posMax = (e[featureName] > posMax) ? e[featureName] : posMax;
                posMin = (e[featureName] < posMin) ? e[featureName] : posMin;
                poscount = poscount + 1;
            }else{
                if(negcount === 0) negMax = negMin = e[featureName];
                // negative relationship
                neg_places[e.state_name] !== undefined ? 
                neg_places[e.state_name].push(e.UID) :
                neg_places[e.state_name] = [e.UID];

                negMax = (e[featureName] > negMax) ? e[featureName] : negMax;
                negMin = (e[featureName] < negMin) ? e[featureName] : negMin;
                negcount = negcount + 1;
            }
        }
    });
    const posMean = ((posMax + posMin) / 2).toFixed(2);
    const negMean = ((negMax + negMin) / 2).toFixed(2);

    let pos_places_narr = '';
    let totalPosLen = 0;
    Object.keys(pos_places).map((key, i)=>{
        const len = pos_places[key].length;
        totalPosLen = totalPosLen + len;
        const textgood = len+areaName+key+upperAreaName;
        if(i<Object.keys(pos_places).length-1){
            pos_places_narr = pos_places_narr + ', '
        }
        pos_places_narr = pos_places_narr + textgood;
    });
    // positive area percentage
    const posPct = (totalPosLen / geojsonObj.length).toFixed(2);

    let neg_places_narr = '';
    let negLen = 0;
    Object.keys(neg_places).map((key, i)=>{
        const len = neg_places[key].length;
        negLen = negLen + len;
        const textbad = len+areaName+key+upperAreaName;
        if(i<Object.keys(neg_places).length-1){
            neg_places_narr = neg_places_narr + ', '
        }
        neg_places_narr = neg_places_narr + textbad;
    });
    // negative area pct
    const negPct = (negLen / geojsonObj.length).toFixed(2);

    const initPosCopy = pos_places_narr + 
    `, where the positive relationship is significant in `+posPct+`% of the study area. The significant local coefficients range from `+posMin+` to `+posMax+`, with a mean value equal to `+posMean+`.`;

    const initNegCopy = neg_places_narr + 
    `, where the negative relationship is significant in `+negPct+`% of the study area. The significant local coefficients range from `+negMin+` to `+negMax+`, with a mean value equal to `+negMean+`.`;

    const handleGoodCopy = () => {
        const newText = posAreas === "" ? 
        initPosCopy : textPosAreas;
        console.log(newText);
    };

    const handleBadCopy = () => {
        const newText = negAreas === "" ? 
        initNegCopy : textNegAreas;
        console.log(newText);
    };

    const posComponent = <Paragraph style={posDIVstyle}>
        <Text key={key} editable={{ onChange: updatePosName }}>{posAreas === "" ? pos_places_narr : posAreas}</Text>  
        , where the <Text strong style={{color: '#3182bd'}}>positive relationship</Text> is <Text strong>significant</Text> in <Text strong>{posPct}%</Text> of the study area. The significant local coefficients range from <Text strong>{posMin.toFixed(2)} to {posMax.toFixed(2)}</Text>, with a mean value equal to <Text strong>{posMean}</Text>.
        <Button 
            size='small' style={{display: 'inline-block', marginLeft: 3}}
            icon={<CopyOutlined />} type="dashed"
            onClick={() => handleGoodCopy()}
        ></Button>

        </Paragraph>;

    const negComponent = <Paragraph style={negDIVstyle}>
        <Text key={key} editable={{ onChange: updateNegName }}>{negAreas === "" ? neg_places_narr : negAreas}</Text>  
        , where the <Text strong style={{color: '#b2182b'}}>negative relationship</Text> is <Text strong>significant</Text> in <Text strong>{negPct}%</Text> of the study area. The significant local coefficients range from <Text strong>{negMin.toFixed(2)} to {negMax.toFixed(2)}</Text>, with a mean value equal to <Text strong>{negMean}</Text>.
        <Button 
            size='small' style={{display: 'inline-block', marginLeft: 3}}
            icon={<CopyOutlined />} type="dashed"
            onClick={() => handleBadCopy()}
        ></Button>

        </Paragraph>;

    const nullComponent = <Paragraph style={{textAlign: 'left'}}></Paragraph>;

    return(
        <>
        <Paragraph
            style={{textAlign: 'left'}}
        >
            The spatial distribution of the coefficient of the independent variable <Text strong>{key}</Text>. Based on the T-test results, the colored areas in the map indicate the significant relationships between <Text strong>{key}</Text> and <Text strong>{props.model_result.Y}</Text>.
        </Paragraph>

        { poscount > 0 ? posComponent : ""}
        { negcount > 0 ? negComponent : ""}

        </>
    );

}