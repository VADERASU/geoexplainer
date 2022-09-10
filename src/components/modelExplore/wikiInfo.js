import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Popover} from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const words = [
    {
      text: 'West Chicago Avenue',
      value: 0.08005367947355094,
    },
    {
      text: 'Chicago metropolitan area',
      value: 0.07970667932932353,
    },
    {
      text: 'Chicago Avenue',
      value: 0.07795969445910046,
    },
    {
      text: 'Downtown Chicago',
      value: 0.06911265604237112,
    },
    {
        text: 'Armour Square Park',
        value: 0.04416064765849588,
      },
  ];

export function ExternalInfo (props) {
    const containerStyle = props.displayFlag ? {display: 'block'} : {display: 'none'};
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});
    const [wordCloud, setWordCloud] = useState(null);

    const cardBodyDisplay = {
        display: cardDisplay,
        padding: 8,
        height: 250,
        //overflow: 'auto',
    };

    const options = {
        //fontFamily: "impact",
        fontSizes: [15, 40],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 1,
        rotations: 0,
        rotationAngles: [0, 90],
        scale: "sqrt",
    };

    const btnDisplay = {
        display: cardDisplay,
        marginLeft: 5,
        float: 'left'
    };

    const minBtnClick = () => {
        setCardDisplay('none');
        setMinCardDisplay({display: 'block', float: 'left'});
    };

    const maxBtnClick = () => {
        setCardDisplay('block');
        setMinCardDisplay({display: 'none'});
    };

    const makeWordCloud = () => {
        const wordCloud = 
            <ReactWordcloud
                words={words}
                options={options}
            />;
        
        setWordCloud(wordCloud);
    };

    useEffect(()=>{
        makeWordCloud();
    }, [props.displayFlag]);

    return(
        <div className="narrativeExplainContainer" style={containerStyle}>
            <Card
                className="explorationCard"
                title='External Information'
                size="small"
                bodyStyle={cardBodyDisplay}
                extra={
                    <div
                        style={{
                            display: 'inline-block',
                            fontSize: 12
                        }}
                    >
                        <Button 
                        style={btnDisplay} 
                        size='small' icon={<MinusOutlined />}
                        onClick={() => minBtnClick()}
                        ></Button>

                        <Button 
                            style={btnDisplay} 
                            size='small' 
                            icon={<CloseOutlined />}
                            //onClick={()=>toggleClick()}
                        ></Button>

                        <Button 
                        size='small' style={minCardDisplay}
                        icon={<PlusOutlined />}
                        onClick={() => maxBtnClick()}
                        ></Button>
                    </div>
                }
            >
                {wordCloud}
            </Card>
        </div>
    );
}