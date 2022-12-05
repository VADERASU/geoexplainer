import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Typography, Button, Popover, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const chicagoText = [
    {
        area: 'Loop',
        UID: 39009,
        text: <Paragraph>Athens County is a county in southeastern Ohio. As of the 2010 census, the population was 64,757. Its county seat is Athens. The county was formed in 1805 from Washington County. Because the original state university (<Text mark>Ohio University</Text>) was founded there in 1804, the town and the county were named for the ancient center of learning, Athens, Greece.</Paragraph>
    },{
        area: 'Loop',
        UID: 39009,
        text: <Paragraph>The largest employer in Athens County is <Text mark>Ohio University</Text></Paragraph>
    },{
        area: 'Lower West Side',
        UID: 39009,
        text: <Paragraph>Over one-quarter of the county's residents either attend or work at Hocking College or <Text mark>Ohio University</Text>.</Paragraph>,
    }
];

export function WikiText (props) {

    const componentStyle = props.wikiTextDisplay ? {display: 'block', marginTop: 10} : {display: 'none'};
    const [content, setContent] = useState([]);
    const [listStyle, setListStyle] = useState({});

    const onHover = (UID) => {
        //console.log(UID);
        //const style = UID === 32 ? {backgroundColor: 'rgba(0,0,0,0.1)'}
        setListStyle({backgroundColor: 'rgba(0,0,0,0.1)'});
        props.setMapFilter([UID]);
    };

    const offHover = (UID) => {
        //console.log(UID);
        setListStyle({});
        props.setMapFilter([]);
    };

    const makeContent = (textData) => {
        /*const contentComponent = <List
            itemLayout='horizontal'
            dataSource={textData}
            renderItem={(item)=>(
                <List.Item
                onMouseEnter={() => onHover(item.UID)}
                onMouseLeave={() => offHover(item.UID)}
                style={listStyle}
                >
                    <List.Item.Meta
                        title={<b>{item.area}</b>}
                        description={item.text}
                    />
                </List.Item>
            )}
        />*/

        setContent(textData);
    };

    useEffect(()=>{
        if(props.select_case === 'US_election') makeContent(chicagoText);
    },[props.select_case]);

    return(
        <Card
            className="explorationCard"
            title='Original external information'
            size="small"
            style={componentStyle}
            bodyStyle={{
                padding: 10,
                height: 300,
                textAlign: 'left',
                overflow: 'auto'
            }}
            extra={
                <div
                    style={{
                        display: 'inline-block',
                        fontSize: 12
                    }}
                >
                    <Button 
                        style={{marginLeft: 5, float: 'left'}} 
                        size='small' 
                        icon={<CloseOutlined />}
                        onClick={()=>props.setWikiTextDisplay(false)}
                    ></Button>
                </div>
            }
        >
        <List
            itemLayout='horizontal'
            dataSource={content}
            renderItem={(item)=>(
                <List.Item
                onMouseEnter={() => onHover(item.UID)}
                onMouseLeave={() => offHover(item.UID)}
                //style={listStyle}
                >
                    <List.Item.Meta
                        title={<b>{item.area}</b>}
                        description={item.text}
                    />
                </List.Item>
            )}
        />

        </Card>
    );
}