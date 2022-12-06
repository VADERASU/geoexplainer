import React, {useEffect, useState} from "react";
import * as d3 from 'd3';
import '../../styles/modelExplor.css';
import { Card, Button, Popover, Checkbox, Tag, Table, Typography } from 'antd';
import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { WordBar } from "../../utilities/echartBar";

import us_textrank from '../../data/case2_key/us_textrank.json';
import selected_textrank from '../../data/case2_key/athens_textrank.json';

const chicagoCate = ['Introduction', 'Demographics', 'Education', 'Crime and policing', 'Politics', 'Other'];
const cate2Color = {
    'Introduction': '#ff7f00',
    'Demographics': '#33a02c',
    'Education': '#1f78b4',
    'Crime and policing': '#e7298a',
    'Politics': '#b2df8a',
    'Other': '#80b1d3'
};
const colors = ['#ff7f00', '#33a02c', '#1f78b4', '#e7298a', '#b2df8a', '#80b1d3'];

const { Text } = Typography;

export function ExternalInfo (props) {
    const containerStyle = props.displayFlag ? {display: 'block'} : {display: 'none'};
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});
    const [wordCloud, setWordCloud] = useState(null);
    const [wordData, setWordData] = useState([]);
    const [dataDomain, setDataDomain] = useState(null);

    const cardBodyDisplay = {
        display: cardDisplay,
        padding: 5,
        height: 390,
        overflow: 'auto',
    };

    const getDataDomain = (data) => {
        return d3.extent(data.map(e=>e.coefficient));
    };

    const makeTableData = (externalCase) => {
        if(externalCase === 'general'){
            setDataDomain(getDataDomain(us_textrank.keywords));
            const tableData = [];
            us_textrank.keywords.forEach(e=>{
                const wordData = {
                    key: e['text'],
                    word: e,
                    textrank: e,
                    operations: e
                };
                tableData.push(wordData);
            });
            setWordData(tableData);
        }else if(externalCase === 'select'){
            setDataDomain(getDataDomain(selected_textrank.keywords));
            const tableData = [];
            selected_textrank.keywords.forEach(e=>{
                const wordData = {
                    key: e['text'],
                    word: e,
                    textrank: e,
                    operations: e
                };
                tableData.push(wordData);
            });
            setWordData(tableData);
        }
    };

    const local_columns = [
        {
            title: 'Key phrases',
            dataIndex: 'word',
            key: 'word',
            render: (_, { word }) => {
                let wordStyle = {color: cate2Color[word.category]};
                return <Text style={wordStyle}>{word.text}</Text>;
            },
        },
        {
            title: 'Word with weight',
            dataIndex: 'textrank',
            key: 'textrank',
            render: (_, { textrank }) => {
                //console.log(numerical_distribution);
                return(
                    <WordBar
                        data={textrank}
                        height={30}
                        dataDomain={dataDomain}
                    />
                );
            },
        },
        {
            title: 'Operations',
            dataIndex: 'opeartions',
            key: 'operations',
            render: (_, { operations }) => {
                //console.log(operations, props.numericalBtnSelect);
                return(
                    <>
                    <Button 
                        size='small' style={{marginRight: 5, fontSize: 11}}
                        onClick={() => props.setWikiTextDisplay(true)}
                    >Original Paragraphs</Button>
                    <Button 
                        size='small'
                        style={{fontSize: 11}}
                        onClick={() => window.open(`https://duckduckgo.com/?q=${operations.text}`, "_blank")}
                    >Search online</Button>
                    </>
                    
                );
            },
        },
    ];

    const options = {
        //fontFamily: "impact",
        fontSizes: [12, 50],
        fontFamily: "times new roman",
        fontStyle: "normal",
        fontWeight: "normal",
        padding: 2,
        rotations: 0,
        rotationAngles: [0, 90],
        scale: "sqrt",
        //transitionDuration: 0
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
                words={us_textrank.keywords}
                options={options}
                callbacks={callbacks}               
            />;
        
            setWordCloud(wordCloud);
        }else if(externalCase === 'select'){
            const optionsSelect = {
                //fontFamily: "impact",
                fontSizes: [20, 90],
                fontFamily: "times new roman",
                fontStyle: "normal",
                fontWeight: "normal",
                padding: 5,
                rotations: 0,
                rotationAngles: [0, 90],
                scale: "sqrt",
                //transitionDuration: 0
            };
            //console.log("select!")
            const wordCloud = 
            <ReactWordcloud
                words={selected_textrank.keywords}
                options={optionsSelect}
                callbacks={callbacks}               
            />;
        
            setWordCloud(wordCloud);
        }
        
    };

    const getCallback = (callback) => {
        return (word, event) => {
            const isActive = callback !== "onWordMouseOut";
            const element = event.target;
            const text = d3.select(element);
            text
            .on("dblclick", () => {
                if (isActive) {
                window.open(`https://duckduckgo.com/?q=${word.text}`, "_blank");
                }
            })
            .on("click", function (d, i) {
               // react on right-clicking
               if (isActive) props.setWikiTextDisplay(true);
            })
            .transition()
            .attr("text-decoration", isActive ? "underline" : "none");
        };
    };

    const callbacks = {
        getWordColor: (word) => (cate2Color[word.category]),
        getWordTooltip: (word) =>
            `The textrank weight of "${word.text}" is ${word.coefficient.toFixed(5)}.`,
        onWordClick: getCallback("onWordClick"),
        onWordMouseOut: getCallback("onWordMouseOut"),
        onWordMouseOver: getCallback("onWordMouseOver")
    };

    useEffect(()=>{
        //console.log(props.selectedRowKeys);
        //makeWordCloud(props.externalCase);
        makeTableData(props.externalCase);
    }, [props.externalCase]);

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
                        checked={true}>
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
                            onClick={()=>props.setDisplayFlag(false)}
                        ></Button>

                        <Button 
                        size='small' style={minCardDisplay}
                        icon={<PlusOutlined />}
                        onClick={() => maxBtnClick()}
                        ></Button>
                    </div>
                }
            >    
                <Table
                size="small"
                columns={local_columns}
                dataSource={wordData}
                pagination={false}
                />
            </Card>
            <div
                className="explorationCard"
                style={{textAlign: 'left',
                    backgroundColor: '#fff',
                    padding: 6}}>
                {chicagoCate.map((e,i)=>
                <Checkbox 
                    key={e} defaultValue={e} checked={true}
                >
                    <Tag color={colors[i]} style={{fontSize: 12}}>{e}</Tag>
                </Checkbox>)}
            </div>
        </div>
    );
}