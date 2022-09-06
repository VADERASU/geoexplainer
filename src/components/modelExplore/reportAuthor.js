import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Typography, Popover} from 'antd';
import { ArrowsAltOutlined, ShrinkOutlined, DeleteOutlined } from '@ant-design/icons';
const { Paragraph, Text } = Typography;

export function ReportAuthor (props) {
    const [bodyStyle, setBodyStyle] = useState({
        height: 55, //505 - expand
        transitionProperty: 'height',
        transitionDuration: '0.5s',
        overflow: 'auto',
        padding: 10
    });
    const [expand, setExpand] = useState(false);
    const [content, setContent] = useState([]);

    const toggleClick = () => {
        let style = {
            transitionProperty: 'height',
            transitionDuration: '0.5s',
            overflow: 'auto',
            padding: 10
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
            if(e!==""){
                let report = <Popover
                style={{padding: 0}}
                content={
                    <Button 
                    size='small' style={{}}
                    icon={<DeleteOutlined />} type="dashed"
                    onClick={() => props.deleteClick(i)}
                    ></Button>
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
