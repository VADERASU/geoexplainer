import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Button, Row, Col} from 'antd';
import * as d3 from 'd3';
import { EditOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

export function NarrativeExplain (props) {
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});
    const [narrativeInfo, setNarrativeInfo] = useState(null);

    const cardBodyDisplay = {
        display: cardDisplay,
    };
    const btnDisplay = {
        display: cardDisplay,
        marginBottom: 5,
    };

    const closeBtnClick = () => {
        props.setNarrativeContainerDisplay({display: 'none'});
        props.setNarrativeBtnSelect(null);
    };

    const minBtnClick = () => {
        setCardDisplay('none');
        setMinCardDisplay({display: 'block'});
    };

    const maxBtnClick = () => {
        setCardDisplay('block');
        setMinCardDisplay({display: 'none'});
    };

    return(
        <div className="narrativeExplainContainer" style={props.narrativeContainerDisplay}>
            <Card
                title={'Narrative Explanation: '+ props.selectedRowKeys[0]}
                size="small"
                className="explorationCard"
                bodyStyle={cardBodyDisplay}
            >

            </Card>
            {/** float toolbar */}
            <div className="cardToolBar">
                <Button 
                    className="explorationCard" style={btnDisplay} 
                    shape="circle" size='small' icon={<CloseOutlined />}
                    onClick={() => closeBtnClick()}
                ></Button>

                <Button 
                    className="explorationCard" style={btnDisplay} 
                    shape="circle" size='small' icon={<MinusOutlined />}
                    onClick={() => minBtnClick()}
                ></Button>

                <Button 
                    className="explorationCard" size='small' style={btnDisplay}
                    shape="circle" icon={<EditOutlined />}
                ></Button>
                <Button 
                    className="explorationCard" size='small'  style={minCardDisplay}
                    shape="circle" icon={<PlusOutlined />}
                    onClick={() => maxBtnClick()}
                ></Button>
            </div>
        </div>
    );
}
