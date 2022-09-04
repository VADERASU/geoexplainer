import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function HistogramEchart (props) {
    const [chartOption, setChartOption] = useState({});

    const setOption = (echartHistData) => {
        const chartOption = {
            grid: echartHistData.grid,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: echartHistData.binNames,
                axisLabel:{
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'value',
                axisLabel:{
                    fontSize: 10
                }
            },
            series: [{
                type: 'bar',
                name: echartHistData.featureName,
                data: echartHistData.binCount,
            }]
        };
        setChartOption(chartOption);
    };

    useEffect(()=>{
        if(props.echartHistData !== null){
            setOption(props.echartHistData);
        }
    }, [props.echartHistData]);

    return(
        <div>
             <ReactECharts
                 option={chartOption} 
                 style={{height: props.height, width: '100%'}}
             />               
        </div> 
     );
}
