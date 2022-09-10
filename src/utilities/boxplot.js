import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function Boxplot (props) {
    const [chartOption, setChartOption] = useState({});
    const inlineGrid =  { top: 0, bottom: 7, right: 15 };
    const normalGrid =  { top: 0, bottom: 8, right: 10 };

    const setOption = (echartBoxplotData, resource) => {
        const _chartOption = {
            dataset: [
                {
                    source: [
                        echartBoxplotData.value === undefined ? 
                        echartBoxplotData.param : echartBoxplotData.value
                    ]
                },
                {
                    fromDatasetIndex: 0,
                    transform: { type: 'boxplot' }
                },
                {
                    fromDatasetIndex: 1,
                    fromTransformResult: 1
                }
            ],
            grid: resource === 'inline' ? inlineGrid : normalGrid,
            yAxis: {
                type: 'category',
                show: false
            },
            xAxis: {
                type: 'value',
                axisLabel:{
                    fontSize: resource === 'inline' ? 9 : 11,
                    margin: -1
                },
                min: (echartBoxplotData.min - echartBoxplotData.min * 1 / 100),
                max: (echartBoxplotData.max + echartBoxplotData.max * 1 / 100),
            },
            series: [
                {
                  name: 'boxplot',
                  type: 'boxplot',
                  datasetIndex: 1,
                  itemStyle: {
                    borderWidth: resource === 'inline' ? 1 : 2,
                  },
                },
                {
                  name: 'outlier',
                  type: 'scatter',
                  symbolSize: 5,
                  //encode: { x: 1, y: 0 },
                  itemStyle: {
                    color: '#ef8a62',
                  },
                  datasetIndex: 2
                }
            ]
        };
        setChartOption(_chartOption);
    };

    useEffect(()=>{
        //console.log(props.echartBoxplotData);
        if(props.echartBoxplotData !== null){
            setOption(props.echartBoxplotData, props.resource);  
        }
    }, [props.echartBoxplotData, props.resource]);

    return(
        <div>
             <ReactECharts
                 option={chartOption} 
                 style={{height: props.height, width: props.width}}
             />               
        </div> 
    );
}
