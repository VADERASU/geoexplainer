import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Typography, Popover, Select, Input} from 'antd';
import { GlobalOutlined, FormOutlined, ArrowsAltOutlined, ShrinkOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
//import { D3Map } from "../../utilities/d3Map";

const { Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const singleColorList = [
    ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'],
    ['#edf8e9','#bae4b3','#74c476','#31a354','#006d2c'],
    ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
    ['#feebe2','#fbb4b9','#f768a1','#c51b8a','#7a0177'],
    ['#feedde','#fdbe85','#fd8d3c','#e6550d','#a63603']
];

const biColors = [
    [['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'],
    ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']],
    [['#40004b','#762a83','#9970ab','#c2a5cf','#e7d4e8'],
    ['#d9f0d3','#a6dba0','#5aae61','#1b7837','#00441b']],
    [['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3'],
    ['#c7eae5','#80cdc1','#35978f','#01665e','#003c30']]
];

export function ReportAuthor (props) {
    const [bodyStyle, setBodyStyle] = useState({
        height: 55, //505 - expand
        transitionProperty: 'height',
        transitionDuration: '0.5s',
        overflow: 'auto',
        padding: 10,
        paddingLeft: 25,
    });
    const [expand, setExpand] = useState(false);
    const [content, setContent] = useState([]);
    const [textStyle, setTextStyle] = useState({
        marginBottom: '1em',
        display: 'none'
    });

    const toggleClick = () => {
        let style = {
            transitionProperty: 'height',
            transitionDuration: '0.5s',
            overflow: 'auto',
            paddingLeft: 25,
            padding:10,
        };
        expand ? style.height = 55 : style.height = 505;
        setExpand(!expand);
        setBodyStyle(style);
    };

    const updateContent = (val) => {
        console.log(val);
    };

    const genReportContent = (reportContent, mapImg) => {
        let reportList = [];
        reportContent.forEach((e, i)=>{
            if(e!=="" && e !== 'num_img' && e !== 'map_img'){
                let report = <Popover
                key={i}
                style={{padding: 0}}
                content={
                    <div
                        style={{
                            display: 'inline-block',
                        }}
                    >

                    <Button 
                    size='small'
                    disabled={i===1?true:false}
                    icon={<ArrowUpOutlined />} type="dashed"
                    onClick={() => props.moveUpClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    disabled={i===reportContent.length-1?true:false}
                    icon={<ArrowDownOutlined />} type="dashed"
                    onClick={() => props.moveDownClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    icon={<DeleteOutlined />} type="dashed"
                    onClick={() => props.deleteClick(i)}
                    ></Button>
                    </div>
                } 
                trigger="click"
                >
                <Paragraph
                key={i}
                style={{textAlign: 'left'}}
                editable={{
                    onChange: () => updateContent(i),
                }}
                >
                    {e}
                </Paragraph>
                </Popover>;
                reportList.push(report);
            }else if(e === 'num_img'){
                let report = <Popover
                key={i}
                style={{padding: 0}}
                content={
                    <div
                    style={{
                        display: 'inline-block',
                    }}
                    >
                    <Button 
                    size='small'
                    disabled={i===1?true:false}
                    icon={<ArrowUpOutlined />} type="dashed"
                    onClick={() => props.moveUpClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    disabled={i===reportContent.length-1?true:false}
                    icon={<ArrowDownOutlined />} type="dashed"
                    onClick={() => props.moveDownClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    icon={<DeleteOutlined />} type="dashed"
                    onClick={() => props.deleteClick(i)}
                    ></Button>
                    </div>
                } 
                trigger="click"
                ><img key={i} src={props.numDistImg} style={{width: 400, marginBottom: 10}} alt='Img' />
                </Popover>;
                reportList.push(report);
            }else if(e === 'map_img'){
                //console.log('here');
                let report = <Popover
                key={i}
                style={{padding: 0}}
                content={
                    <div
                    style={{
                        display: 'inline-block',
                    }}
                    >
                    <Select
                        defaultValue={0}
                        style={{
                            width: 100,
                            marginRight: 10
                        }}
                        size="small"
                        onChange={handleMapColorChange}
                    >
                        {singleColorList.map((item, i)=>(
                            <Option key={i} value={i}><div className='statusBarmap'>{item.map((subItem,j)=>{
                                let colorBarstyle = {backgroundColor: subItem, width:12};
                                return <span key={j+'_sub'+j} style={colorBarstyle}></span>
                            })}</div></Option>
                        ))}
                    </Select>

                    <Button 
                    size='small'
                    disabled={i===1?true:false}
                    icon={<ArrowUpOutlined />} type="dashed"
                    onClick={() => props.moveUpClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    disabled={i===reportContent.length-1?true:false}
                    icon={<ArrowDownOutlined />} type="dashed"
                    onClick={() => props.moveDownClick(i)}
                    ></Button>

                    <Button 
                    size='small'
                    icon={<DeleteOutlined />} type="dashed"
                    onClick={() => props.deleteClick(i)}
                    ></Button>
                    </div>
                } 
                trigger="click"
                ><img key={i} src={mapImg} style={{width: 500, marginBottom: 10}} alt='Map' />
                </Popover>;
                reportList.push(report);
            }
                
        });
        //console.log(reportList);
        setContent(reportList);
    };

    const handleMapColorChange = (val) => {
        props.resetMapColor(val);    
    };

    const editNewParagraph = () => {
        let style = {
            marginBottom: '1em',
            display: 'block'
        };
        setTextStyle(style);
    };

    const addNewParagraph = (event) => {
        console.log(event.target.value);
        let style = {
            marginBottom: '1em',
            display: 'none'
        };
        setTextStyle(style);
    };
    
    useEffect(()=>{
        //console.log(props.reportContent);
        genReportContent(props.reportContent, props.mapImg);
    },[props.reportContent, props.mapImg]);

    return(
        <div className="reportAuthoringContainer">
            <Card
                className="explorationCard"
                title='Report Authoring'
                size="small"
                bodyStyle={bodyStyle}
                extra={
                    <div
                        style={{
                            display: 'inline-block',
                            fontSize: 12
                        }}
                    >
                    <Button 
                        style={{marginLeft: 10, float: 'left'}} 
                        size='small' 
                        type="primary"
                        icon={<FormOutlined />}
                        onClick={editNewParagraph}
                    >New Paragraph</Button>   
                    <Button 
                        style={{marginLeft: 10, float: 'left'}} 
                        size='small' 
                        type="primary"
                        icon={<GlobalOutlined />}
                        onClick={()=>props.mapInfoGen()}
                    >Add Map</Button>                     
                    <Button 
                        style={{marginLeft: 10, float: 'left'}} 
                        size='small' 
                        icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                        onClick={()=>toggleClick()}
                    ></Button>
                </div>
                }
            >
                <TextArea 
                    defaultValue=""
                    style={textStyle}
                    rows={2} 
                    onPressEnter={addNewParagraph}
                />
                {content}
            </Card>
        </div>
    );
}
