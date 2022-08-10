import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function ScatterEchart (props) {
    const [chartOption, setChartOption] = useState({});
    const [onEvents, setEvents] = useState({});

    const setOption = (echartScatterData) => {
        const chartOption = {
            xAxis: {},
            yAxis: {},
            brush: {
                toolbox: ['rect', 'polygon', 'clear']
            },
            toolbox: {
                feature: {
                    dataZoom: {}
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            series: [{
                symbolSize: 5,
                data: echartScatterData.map(d => [d['x'], d['y']]),
                type: 'scatter'
              }]
        };
        setChartOption(chartOption);
    };

    useEffect(()=>{
        if (props.echartScatterData !== null) {
                setEvents({'brushSelected': (params) => {
                    var brushComponent = params.batch[0];
                    var brushed = brushComponent.selected[0].dataIndex;
                    var brushedUIDs = brushed.map(d => props.echartScatterData[d].UID);
                    console.log("selected", brushedUIDs);
                }});
                setOption(props.echartScatterData);
        }
    }, [props.echartScatterData]);

    /*
    const onBrushSelected = (params) => {
        console.log(params);
    }

    const onEvents = {
        'brushSelected': onBrushSelected
    }
      */

    return(
        <div>
            <ReactECharts
                option={chartOption} 
                style={{height: 220, width: '100%'}}
                onEvents={onEvents}
            />               
        </div> 
     );
}
