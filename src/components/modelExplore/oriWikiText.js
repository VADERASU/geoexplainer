import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Typography, Button, Popover, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const chicagoText = [
    {
        area: 'Loop',
        UID: 32,
        text: <Paragraph><Text mark>The Loop</Text>, one of Chicago's 77 designated community areas, is the central business district of the city and is the main section of Downtown Chicago. Home to Chicago's commercial core, it is the second largest commercial business district in North America and contains the headquarters and regional offices of several global and national businesses, retail establishments, restaurants, hotels, and theaters, as well as many of Chicago's most famous attractions. It is home to Chicago's City Hall, the seat of Cook County, and numerous offices of other levels of government and consulates of foreign nations. In it, at the intersection of State Street and Madison Street, is the origin of Chicago's street grid addresses, established in 1909. Most of Grant Park's 319 acres (1.29 km2) are in the eastern section of the community area. The <Text mark>Loop community area</Text> is bounded on the north and west by the Chicago River, on the east by Lake Michigan, and on the south by Roosevelt Road, although the commercial core has greatly expanded into adjacent community areas.</Paragraph>
    },{
        area: 'Loop',
        UID: 32,
        text: <Paragraph><Text mark>The Loop</Text>, along with the rest of downtown Chicago, is the second largest commercial business district in the United States after New York City's Midtown Manhattan. Its financial district near LaSalle Street is home to the CME Group's Chicago Board of Trade and Chicago Mercantile Exchange. Aon Corporation maintains an office in the Aon Center. Chase Tower houses the headquarters of Exelon. United Airlines has its headquarters in Willis Tower, having moved its headquarters to Chicago from suburban Elk Grove Township in early 2007. Blue Cross and Blue Shield Association has its headquarters in the Michigan Plaza complex. Sidley Austin has an office in <Text mark>the Loop</Text>. The <Text mark>Chicago Loop</Text> Alliance is located at 55 West Monroe, the Chicagoland Chamber of Commerce is located in an office in the Aon Center, the French-American Chamber of Commerce in Chicago has an office in 35 East Wacker, the Netherlands Chamber of Commerce in the United States is located in an office at 303 East Wacker Drive, and the US Mexico Chamber of Commerce Mid-America Chapter is located in an office in One Prudential Plaza.McDonald's was headquartered in the Loop until 1971, when it moved to suburban Oak Brook. When Bank One Corporation existed, its headquarters were in the Bank One Plaza, which is now Chase Tower. When Amoco existed, its headquarters were in the Amoco Building, which is now the Aon Center.The plurality of Loop residents, 39.9 percent, also work there. 26.6 percent work outside of Chicago. Respectively 10.8, 8.3, and 2.8 percent work in the Near North Side, the Near West Side, and Hyde Park. The plurality of those employed within the Loop, at 45.5 percent, live outside of Chicago. The community area of Lake View is the second most prevalent residence, housing 4 percent of Loop employees. The Near North Side, West Town, and Lincoln Park respectively house 3.8, 2.6, and 2.5 percent of those working in the Loop.The professional sector is the largest source of employment of both Loop residents and Loop employees, at respectively 22 and 23.9 percent. Finance was the second most common employment for both groups, at respectively 13.2 and 17.9 percent. Education was the third largest sector for both groups, at respectively 9.3 and 13.7 percent. Health care was the fourth largest employer of residents at 10.8 percent. Administration was the fifth largest sector for both groups, at respectively 6.6 and 7.3 percent.</Paragraph>
    },{
        area: 'Lower West Side',
        UID: 31,
        text: <Paragraph>Lower West Side is a community area on the West Side of Chicago, Illinois, United States. It is three miles southwest of the <Text mark>Chicago Loop</Text> and its main neighborhood is Pilsen. The Heart of Chicago is a neighborhood in the southwest corner of the Lower West Side.</Paragraph>,
    },{
        area: 'Near South Side',
        UID: 33,
        text: <Paragraph>The Near South Side is a community area of Chicago, just south of the downtown central business district, <Text mark>the Loop</Text>.</Paragraph>,
    },{
        area: 'West Town',
        UID: 24,
        text: <Paragraph>The Kennedy Expressway, part of Interstate 90, passes through West Town. The area is also served by four stops on the CTA Blue Line, providing direct access to O'Hare International Airport and the <Text mark>Chicago Loop</Text>. From southeast to northwest, the stations are at Grand Avenue, Chicago Avenue, Division Street, and Damen Avenue.</Paragraph>,
    },
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
        if(props.select_case === 'chicago') makeContent(chicagoText);
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