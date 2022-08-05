import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function ScatterEchart (props) {
    const [chartOption, setChartOption] = useState({});

    const setOption = (echartScatterData) => {
        const chartOption = {
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 5,
                data: echartScatterData,
                type: 'scatter'
              }]
        };
        setChartOption(chartOption);
    };

    useEffect(()=>{
        setOption(props.echartScatterData)
        /*
        if(props.echartScatterData !== null){
            setOption(props.echartScatterData);
        }*/
    }, [props.echartScatterData]);

    return(
        <div>
            <ReactECharts
                option={chartOption} 
                style={{height: 220, width: '100%'}}
            />               
        </div> 
     );
}
