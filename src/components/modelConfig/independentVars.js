import React, {useEffect, useState} from "react";
import { Card, Drawer } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import { IndepScatterEchart } from "../../utilities/indepScatterEchart";

export function IndependentVars(props) {

    const dimension = {width: 600, height: 450};
    //const [indepFeatures, setIndepFeatures] = useState([]);
    const [colCount, setColCount] = useState(0);
    //const [VIFresult, setVIFresult] = useState(new Set());
    const [visible, setVisible] = useState(false);
    const [columns, setCols] = useState([]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const mouseOver = (event) => {
        event.preventDefault();
        event.currentTarget.style.boxShadow = 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px';
    };

    const mouseOut = (event) => {
        event.preventDefault();
        event.currentTarget.style.boxShadow = 'none';
    };

    useEffect(() => {
        //setIndepFeatures([...props.independent_features].sort());
        setColCount(props.independent_features.length);
        //setVIFresult(new Set(props.independent_features.filter(feature => feature in props.VIF_test_result && props.VIF_test_result[feature] > 10)));
        //console.log(props.independent_features.filter(feature => feature in props.VIF_test_result && props.VIF_test_result[feature] > 10));
        
        setCols(update());
    }, [props.independent_features.length]);

    const update = () => {
        var cols = [];
  
        var VIFresult = new Set(props.independent_features.filter(feature => feature in props.VIF_test_result && props.VIF_test_result[feature] > 10));
        var indepFeatures = [...props.independent_features].sort();
        
        indepFeatures.forEach((yFeature, i) => {
            indepFeatures.forEach((xFeature, j) => {
                
                if (j >= i) {        
                    var echartScatterData = {};
                    echartScatterData['data'] = props.loaded_map_data.features.map(d => {
                        return {
                            x: d.properties[xFeature],
                            y: d.properties[yFeature],
                            UID: d.properties['UID']
                        }
                    });
                    echartScatterData['xAxisName'] = i === 0 ? xFeature : '';
                    echartScatterData['xAxisShow'] = i === 0 ? true : false;
                    echartScatterData['yAxisName'] = (j+1) % props.independent_features.length === 0 ? yFeature : '';
                    echartScatterData['yAxisShow'] = (j+1) % props.independent_features.length === 0 ? true: false;
                    echartScatterData['dimension'] = dimension;
                    echartScatterData['colCount'] = props.independent_features.length;

                    cols.push(
                        <div key={(i*props.independent_features.length+j).toString()}
                            onClick={showDrawer}
                            onMouseOver={mouseOver}
                            onMouseOut={mouseOut}
                            style={{
                                backgroundColor: VIFresult.has(xFeature) && VIFresult.has(yFeature) ? '#feffe6' : 'white'
                            }}
                        >
                            <IndepScatterEchart echartScatterData={echartScatterData} />
                        </div>
                    );
                } else {
                    cols.push(
                        <div key={(i*props.independent_features.length+j).toString()}></div>
                    );
                }
                /*
                cols.push(
                    <div style={{border: '1px solid'}}>[{yFeature}, {xFeature}]</div>
                )*/
                
            });
        });
        return cols;
    };



    return(
        <Card
            title={'Correlations of X'}
            size='small'
            style={{width: dimension.width, overflow: 'hidden'}}
            bodyStyle={{height: dimension.height, padding: 8}}
        >
            <div style={{display: 'grid', gridTemplateColumns: Array(props.independent_features.length).fill('auto').join(' '), width: '100%', height: '100%'}}>
                {columns}
            </div>
            <Drawer
                title="Basic Drawer"
                placement="right"
                width={dimension.width}
                onClose={onClose}
                closeIcon={<LeftCircleOutlined />}
                visible={visible}
                getContainer={false}
                style={{
                    position: 'absolute'
                }}
            >
                <p>Some contents...</p>
            </Drawer>
        </Card>
    );
}