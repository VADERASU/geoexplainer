import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Button, Row, Col} from 'antd';
import * as d3 from 'd3';
import { CopyOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
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
        marginLeft: 5,
        float: 'left'
    };

    const closeBtnClick = () => {
        props.setNumericalContainerDisplay({display: 'none'});
        props.setNumericalBtnSelect(null);
    };

    const minBtnClick = () => {
        setCardDisplay('none');
        setMinCardDisplay({display: 'block', float: 'left'});
    };

    const maxBtnClick = () => {
        setCardDisplay('block');
        setMinCardDisplay({display: 'none'});
    };

    const makeHistoData = (numericalDist, key) => {
        const data = numericalDist.value === undefined ? numericalDist.param : numericalDist.value;
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
        }else if(key === 'cooksD'){
            const dependentColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
            const quantile = d3.scaleQuantile()
                .domain(data) // pass the whole dataset to a scaleQuantile’s domain
                .range(dependentColorScheme);
            const threshold = 4 / data.length;

            dataBins.forEach(e=>{
                let name = e.x0 + '-' + e.x1;
                let color = e.x1 > threshold ? quantile(e.x1) : 'gray';
                
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
        }else if(key === 'std_residuals'){
            const posList = data.filter(e=>e>=0);
            const negList = data.filter(e=>e<0);

            const negColorScheme = ['#b2182b','#ef8a62','#fddbc7'];
            const posColorScheme = ['#d1e5f0','#67a9cf','#2166ac'];

            const quantile_neg = d3.scaleQuantile()
                .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                .range(negColorScheme);

            const quantile_pos = d3.scaleQuantile()
                .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                .range(posColorScheme);

            dataBins.forEach(e=>{
                let name = e.x0 + '-' + e.x1;
                let color = e.x1 >= 0 ? quantile_pos(e.x1) : 
                    (e.x1 < 0 ? quantile_neg(e.x1) : '#ffffff');
                
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
        }else{
            // coefficients
            const posList = data.filter(e=>e>=0);
            const negList = data.filter(e=>e<0);

            if(negList.length === 0){
                // all positive values
                const posColorScheme = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
                const quantile_pos = d3.scaleQuantile()
                .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                .range(posColorScheme);

                dataBins.forEach(e=>{
                    let name = e.x0 + '-' + e.x1;
                    let color = quantile_pos(e.x1);
                    
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
            }else if(posList.length === 0){
                const negColorScheme = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'];
                const quantile_neg = d3.scaleQuantile()
                .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                .range(negColorScheme);

                dataBins.forEach(e=>{
                    let name = e.x0 + '-' + e.x1;
                    let color = quantile_neg(e.x1);
                    
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
            }else{
                const negColorScheme = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'];
                const posColorScheme =['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];

                const quantile_neg = d3.scaleQuantile()
                    .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(negColorScheme);

                const quantile_pos = d3.scaleQuantile()
                    .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(posColorScheme);

                dataBins.forEach(e=>{
                    let name = e.x0 + '-' + e.x1;
                    let color = e.x1 >= 0 ? quantile_pos(e.x1) : 
                        (e.x1 < 0 ? quantile_neg(e.x1) : '#ffffff');
                    
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
                extra={
                    <div
                    style={{
                        display: 'inline-block',
                        fontSize: 12
                    }}
                >
                    <Button 
                        size='small' style={btnDisplay}
                        icon={<CopyOutlined />}
                        onClick={()=>props.numDistInfoGen()}
                    ></Button>
                    <Button 
                        size='small'  style={minCardDisplay}
                        icon={<PlusOutlined />}
                        onClick={() => maxBtnClick()}
                    ></Button>
                     <Button 
                        style={btnDisplay} 
                        size='small' icon={<MinusOutlined />}
                        onClick={() => minBtnClick()}
                    ></Button>
                    <Button 
                        style={btnDisplay} 
                        size='small' icon={<CloseOutlined />}
                        onClick={() => closeBtnClick()}
                    ></Button>
                </div>
                }
            >
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col span={24}>
                                <HistogramEchart
                                    echartHistData={echartHistData}
                                    height={100}
                                />
                            </Col>
                            <Col span={24}>
                            <Boxplot
                                echartBoxplotData={boxPlotData}
                                resource={'normal'}
                                height={30}
                                width={337}
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

            </div>
        </div>
    );
}
