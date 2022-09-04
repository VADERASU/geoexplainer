import React, {useState, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';

export function ScatterEchart (props) {
    const [chartOption, setChartOption] = useState({});
    const [onEvents, setEvents] = useState({});
    //const [brushed, setBrushed] = useState([]);
    let brushed = [];

    const setOption = (echartScatterData) => {
        const chartOption = {
            grid: { top: 18, bottom: 25, right: 10 },
            xAxis: {
                axisLabel:{
                    fontSize: 10
                },
                type: 'value',
                name: props.xName,
                nameLocation: 'middle',
                nameGap: 18,
                nameTextStyle: {
                    fontSize: 10
                },
            },
            yAxis: {
                axisLabel:{
                    fontSize: 10
                },
                type: 'value',
                name: props.yName,
                nameLocation: 'end',
                nameGap: 5,
                nameTextStyle: {
                    fontSize: 10
                },
            },
            brush: {
                toolbox: ['rect', 'polygon', 'clear']
            },
            toolbox: {
                feature: {
                    dataZoom: {}
                },
                itemSize: 10,
                top: -5,
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
            tooltip: {
                showDelay: 0,
                formatter: (params) => {
                    return (
                        params.data.county_name +
                        ' :<br/>' +
                        params.data.yName +
                        ' : ' +
                        params.data.value[1] +
                        '<br/> ' +
                        params.data.xName +
                        ' : ' +
                        params.data.value[0]
                    );
                },
            },
            series: [{
                symbolSize: 5,
                data: echartScatterData.map(d => {
                    return {
                        value: [d['x'], d['y']],
                        itemStyle: {
                            color: d['color']
                        },
                        county_name: d['county_name'],
                        xName: d['xName'],
                        yName: d['yName']
                    };
                }),
                type: 'scatter'
              }]
        };
        setChartOption(chartOption);
    };

    useEffect(() => {
        if (props.echartScatterData !== null) {
                setEvents({
                    'brushSelected': (params) => {
                        var brushComponent = params.batch[0];
                        var brushed = brushComponent.selected[0].dataIndex;
                        var brushedUIDs = brushed.map(d => props.echartScatterData[d].UID);
                        //console.log("selected UIDs:", brushedUIDs);
                        
                    },
                });

                setOption(props.echartScatterData);
        }
    }, [props.echartScatterData]);

    return(
        <div>
            <ReactECharts
                option={chartOption} 
                style={{height: props.height, width: '100%'}}
                onEvents={onEvents}
            />               
        </div> 
     );
}
