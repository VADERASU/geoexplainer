import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Button, Row, Col} from 'antd';
import * as d3 from 'd3';
import { EditOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Boxplot } from "../../utilities/boxplot";
import { HistogramEchart } from "../../utilities/histogramEchart";

export function NumDistribution (props) {
    const [cardDisplay, setCardDisplay] = useState('block');
    const [minCardDisplay, setMinCardDisplay] = useState({display: 'none'});

    const [echartHistData, setEchartHistData] = useState(null);
    const [boxPlotData, setBoxPlotData] = useState(null);
    const [narrativeInfo, setNarrativeInfo] = useState({
        mean: 0.000,
        std : 0.000,
        min: 0.000,
        max: 0.000,
        mid: 0.000,
        feature: null,
    });

    const cardBodyDisplay = {
        display: cardDisplay,
    };
    const btnDisplay = {
        display: cardDisplay,
        marginBottom: 5,
    };

    const closeBtnClick = () => {
        props.setNumericalContainerDisplay({display: 'none'});
        props.setNumericalBtnSelect(null);
    };

    const minBtnClick = () => {
        setCardDisplay('none');
        setMinCardDisplay({display: 'block'});
    };

    const maxBtnClick = () => {
        setCardDisplay('block');
        setMinCardDisplay({display: 'none'});
    };

    const makeHistoData = (numericalDist, key) => {
        const data = numericalDist.value;
        setBoxPlotData(numericalDist);
        const narrative = {
            mean: numericalDist.mean.toFixed(2),
            std: numericalDist.std.toFixed(2),
            min: numericalDist.min.toFixed(2),
            max: numericalDist.max.toFixed(2),
            mid: numericalDist.median.toFixed(2),
            feature: key,
        };
        setNarrativeInfo(narrative);
        
        // make echart histogram data
        const dataBins = d3.bin().thresholds(10)(data);
        const echartHistData = {
            binNames: [],
            binCount: [],
            featureName: key,
            grid: { top: 8, bottom: 20, right: 10 },
        };
        // get color encoding - 4 situations
        if(key === 'local_R2'){
            const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
            const quantile = d3.scaleQuantile()
            .domain(data) // pass the whole dataset to a scaleQuantile’s domain
            .range(dependentColorScheme);

            //const classSteps = quantile.quantiles();
            dataBins.forEach(e=>{
                let name = e.x0 + '-' + e.x1;
                let color = quantile(e.x1);
                
                let length = {
                    value: e.length,
                    itemStyle: {
                        color: color,
                    }
                };
                echartHistData.binNames.push(name);
                echartHistData.binCount.push(length);
            });
            setEchartHistData(echartHistData);
        }


    };

    useEffect(()=>{
        if(props.numericalDist !== null){
            makeHistoData(props.numericalDist.data, props.numericalDist.key);
        }
    }, [props.numericalDist]);

    return(
        <div className="globalNumericalDistributionContainer" style={props.numericalContainerDisplay}>
            <Card
                title={'Numerical distribution: '+narrativeInfo.feature}
                size="small"
                className="explorationCard"
                bodyStyle={cardBodyDisplay}
            >
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={24}>
                                <HistogramEchart
                                    echartHistData={echartHistData}
                                    height={90}
                                />
                            </Col>
                            <Col span={24}>
                            <Boxplot
                                echartBoxplotData={boxPlotData}
                                resource={'normal'}
                                height={40}
                            />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Descriptions
                            column={1} size={'small'} contentStyle={{fontSize: 12}} labelStyle={{fontSize: 12}}
                            style={{marginLeft: 5}}
                        >
                            <Descriptions.Item label="Mean">{narrativeInfo.mean}</Descriptions.Item>
                            <Descriptions.Item label="Deviation">{narrativeInfo.std}</Descriptions.Item>
                            <Descriptions.Item label="Max">{narrativeInfo.max}</Descriptions.Item>
                            <Descriptions.Item label="Median">{narrativeInfo.mid}</Descriptions.Item>
                            <Descriptions.Item label="Min">{narrativeInfo.min}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                
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
