import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Popover} from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

export function ExternalInfo (props) {
    const containerStyle = props.displayFlag ? {display: 'block'} : {display: 'none'};
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});

    const cardBodyDisplay = {
        display: cardDisplay,
        padding: 8,
        height: 250,
        //overflow: 'auto',
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

    return(
        <div className="externalInfoContainer" style={containerStyle}>
            <Card
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

            </Card>
        </div>
    );
}