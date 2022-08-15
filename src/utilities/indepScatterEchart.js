import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function IndepScatterEchart (props) {
    const [chartOption, setChartOption] = useState({});
    const [dimension, setDimension] = useState({});

    const setOption = (echartScatterData) => {
        const chartOption = {
            grid: { top: 15, bottom: 3, right: 15 },
            xAxis: {
                name: echartScatterData['xAxisName'],
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
                name: echartScatterData['yAxisName'],
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
                symbolSize: 10 / props.echartScatterData.colCount,
                data: echartScatterData['data'].map(d => [d['x'], d['y']]),
                type: 'scatter'
            }]
        };
        setChartOption(chartOption);
    };

    useEffect(() => {
        if (props.echartScatterData !== null) {
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
