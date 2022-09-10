import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Typography, Popover} from 'antd';
import { ArrowsAltOutlined, ShrinkOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
const { Paragraph, Text } = Typography;

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

    const genReportContent = (reportContent) => {
        let reportList = [];
        reportContent.forEach((e, i)=>{
            if(e!=="" && e !== 'num_img'){
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
            }
                
        });
        //console.log(reportList);
        setContent(reportList);
    };
    
    useEffect(()=>{
        //console.log(props.reportContent);
        genReportContent(props.reportContent);
    },[props.reportContent]);

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
                        size='small' 
                        icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
                        onClick={()=>toggleClick()}
                    ></Button>
                </div>
                }
            >
                {content}
            </Card>
        </div>
    );
}
