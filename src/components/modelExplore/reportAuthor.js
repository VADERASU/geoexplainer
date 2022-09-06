import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Button, Typography} from 'antd';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
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
    const [editableStr, setEditableStr] = useState(`
    Dependent Variable price_pp has the following values of model diagnostics - 
    AICc of 176.56, global R2 value of 0.56, Adj R2 value of 0.51.
    The impact of <b>num_spots</b> is statistically significant around colored areas. 
    The gray areas indicate regions where this attribute has no impact on the <b>price_pp</b>.
    `);

    const [content, setContent] = useState(
        <Paragraph
            style={{textAlign: 'left'}}
            editable={{
                onChange: setEditableStr,
            }}
        >
            {editableStr}
        </Paragraph>
    );

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
