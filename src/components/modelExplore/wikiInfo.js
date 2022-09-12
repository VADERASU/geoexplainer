import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Popover, Checkbox, Tag, Divider} from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import income_textrank from '../../data/incomeKey/income_textrank.json';

const CheckboxGroup = Checkbox.Group;

const chicagoCate = ['Introduction', 'Demographics', 'Education', 'Crime and policing', 'Other'];
const chicagoCateDefault = ['Introduction', 'Demographics', 'Education', 'Crime and policing', 'Other'];
const colors = ['#8dd3c7', '#33a02c', '#bebada', '#fb8072', '#80b1d3'];

export function ExternalInfo (props) {
    const containerStyle = props.displayFlag ? {display: 'block'} : {display: 'none'};
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});
    const [wordCloud, setWordCloud] = useState(null);

    const [checkedList, setCheckedList] = useState(chicagoCateDefault);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const size = [450, 370];

    const onCheckChange = (list) => {
        console.log(list);
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < chicagoCate.length);
        setCheckAll(list.length === chicagoCate.length);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? chicagoCate : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
      };

    const cardBodyDisplay = {
        display: cardDisplay,
        padding: 9,
        height: 450,
        //overflow: 'auto',
    };

    const options = {
        //fontFamily: "impact",
        fontSizes: [15, 50],
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

    const makeWordCloud = (externalCase) => {
        if(externalCase === 'general'){
            const wordCloud = 
            <ReactWordcloud
                words={income_textrank.keywords}
                options={options}
                size={size}
            />;
        
            setWordCloud(wordCloud);
        }
        
    };

    const extractCategory = (externalCase) => {
        if(externalCase === 'general'){
            
        }

    };

    useEffect(()=>{
        //console.log(props.selectedRowKeys);
        makeWordCloud(props.externalCase);
    }, [props.displayFlag, props.externalCase]);
//<CheckboxGroup options={chicagoCate} value={checkedList} onChange={onCheckChange} />
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
                        <Checkbox 
                        style={{
                            marginLeft: 5,
                            float: 'left'
                        }}
                        indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                            Check all
                        </Checkbox>

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
                <div style={{textAlign: 'left'}}>
                    <Checkbox.Group style={{ width: '100%' }} onChange={onCheckChange}>
                        {chicagoCate.map(
                            (e,i)=><Checkbox 
                                key={e} value={e}
                                >
                                    <Tag color={colors[i]} style={{fontSize: 12}}>{e}</Tag>
                                </Checkbox>)}
                    </Checkbox.Group>
                </div>
                <Divider style={{marginTop: 10, marginBottom: 10}} />
                <div>{wordCloud}</div>
            </Card>
        </div>
    );
}