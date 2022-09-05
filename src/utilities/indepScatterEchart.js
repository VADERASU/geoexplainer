import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function IndepScatterEchart (props) {
    const [chartOption, setChartOption] = useState({});
    const [dimension, setDimension] = useState({});

    const setOption = (echartScatterData) => {
        const chartOption = {
            grid: { top: echartScatterData['xAxisShow']?15:2, bottom: 2, right: echartScatterData['yAxisShow']?15:2 },
            xAxis: {
                name: echartScatterData['xAxisShow'] ? echartScatterData['xAxisName'] : '',
                nameLocation: 'middle',
                nameGap: 0,
                position: 'top',
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: echartScatterData['xAxisShow'],
                    onZero: false
                },
                axisTick: {
                    show: echartScatterData['xAxisShow'],
                    inside: true
                }
            },
            yAxis: {
                name: echartScatterData['yAxisShow'] ? echartScatterData['yAxisName'] : '',
                nameLocation: 'middle',
                nameGap: 5,
                position: 'right',
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: echartScatterData['yAxisShow'],
                    onZero: false
                },
                axisTick: {
                    show: echartScatterData['yAxisShow'],
                    inside: true
                }
            },
            series: [{
                symbolSize: 15 / props.echartScatterData.colCount,
                data: echartScatterData['data'].map(d => {
                    if(echartScatterData['yAxisName'] === 'income_pc'){
                        if(echartScatterData['xAxisName'] === 'poverty' || echartScatterData['xAxisName'] === 'unemployed'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#feb24c'
                                },
                            }
                        }else if(echartScatterData['xAxisName']==='income_pc'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#bdbdbd'
                                },
                            }
                        }else{
                            return {
                                value: [d['x'], d['y']],
                            }
                        }
                    }else if(echartScatterData['yAxisName'] === 'poverty'){
                        if(echartScatterData['xAxisName'] === 'income_pc' || echartScatterData['xAxisName'] === 'unemployed'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#feb24c'
                                },
                            }
                        }else if(echartScatterData['xAxisName']==='poverty'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#bdbdbd'
                                },
                            }
                        }else{
                            return {
                                value: [d['x'], d['y']],
                            }
                        }
                    }else if(echartScatterData['yAxisName'] === 'unemployed'){
                        if(echartScatterData['xAxisName'] === 'income_pc' || echartScatterData['xAxisName'] === 'poverty'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#feb24c'
                                },
                            }
                        }else if(echartScatterData['xAxisName']==='unemployed'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#bdbdbd'
                                },
                            }
                        }else{
                            return {
                                value: [d['x'], d['y']],
                            }
                        }
                    }else if(echartScatterData['yAxisName'] === 'num_crimes'){
                        if(echartScatterData['xAxisName'] === 'num_theft'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#feb24c'
                                },
                            }
                        }else if(echartScatterData['xAxisName']==='num_crimes'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#bdbdbd'
                                },
                            }
                        }else{
                            return {
                                value: [d['x'], d['y']],
                            }
                        }
                    }else if(echartScatterData['yAxisName'] === 'num_theft'){
                        if(echartScatterData['xAxisName'] === 'num_crimes'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#feb24c'
                                },
                            }
                        }else if(echartScatterData['xAxisName']==='num_theft'){
                            return {
                                value: [d['x'], d['y']],
                                itemStyle: {
                                    color: '#bdbdbd'
                                },
                            }
                        }else{
                            return {
                                value: [d['x'], d['y']],
                            }
                        }
                    }else if(echartScatterData['yAxisName'] === echartScatterData['xAxisName']){
                        return {
                            value: [d['x'], d['y']],
                            itemStyle: {
                                color: '#bdbdbd'
                            },
                        }
                    }else{
                        return {
                            value: [d['x'], d['y']],
                        }
                    }
                    
                }),
                type: 'scatter'
            }]
        };
        setChartOption(chartOption);
    };

    useEffect(() => {
        if (props.echartScatterData !== null) {
            //console.log(props.echartScatterData);
            setDimension({
                width: (props.echartScatterData.dimension.width / props.echartScatterData.colCount) * 0.9,
                height: (props.echartScatterData.dimension.height / props.echartScatterData.colCount) * 0.9
            });
            setOption(props.echartScatterData);
        }
    }, [props.echartScatterData.colCount]);

    return(
        <div style={{width: '100%', height: '100%'}}>
            <ReactECharts
                option={chartOption} 
                style={{height: dimension.height, width: dimension.width}}
            />
        </div>
     );
}
