import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Table, Button} from 'antd';
import { EditOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Boxplot } from "../../utilities/boxplot";

export function NumDistribution (props) {
    const [containerDisplay, setContainerDisplay] = useState({display: 'block'});
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});

    const cardBodyDisplay = {
        display: cardDisplay,
    };
    const btnDisplay = {
        display: cardDisplay,
        marginBottom: 5,
    };

    const closeBtnClick = () => {
        console.log('click');
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
        <div className="globalNumericalDistributionContainer" style={containerDisplay}>
            <Card
                title='Numerical distribution'
                size="small"
                className="explorationCard"
                bodyStyle={cardBodyDisplay}
            >
                <div style={{height: 150}}></div>
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
