import React, {useEffect, useState} from "react";
import { Card, Drawer, Alert } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import { IndepScatterEchart } from "../../utilities/indepScatterEchart";
import { Correlation } from "./correlation";
import '../../styles/modelConfig.css';

export function IndependentVars(props) {

    const dimension = {width: 580, height: 425};
    //const [indepFeatures, setIndepFeatures] = useState([]);
    const [colCount, setColCount] = useState(0);
    //const [VIFresult, setVIFresult] = useState(new Set());
    const [visible, setVisible] = useState(false);
    const [columns, setCols] = useState([]);
    const [corrDetail, setCorrDetail] = useState(<></>);
    const [suggestion, setSuggestion] = useState({
        msg: '',
        type: 'info',
    });

    const showDrawer = (event) => {
        //console.log(event.target.value);
        let corrDetail = props.loaded_map_data !== null ? <Correlation
        dependent_features={['unemployed']}
        currentActivCorrelation={'poverty'}
        loaded_map_data={props.loaded_map_data}
        select_case={props.select_case}
        independCorr={true}
        /> : <></>;
        setCorrDetail(corrDetail);
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

    const setVIFannotation = (independent_features, VIF_test_result) => {
        let highVifList = [];
        let sugText = '';
        independent_features.forEach(e=>{
            if(VIF_test_result[e] > 10){
                highVifList.push(e);
                sugText = sugText+'['+e+'] ';
            }
        });
        
        let suggestion = {
            msg: highVifList.length === 0 ? 
            'No multicollinearity detected.' : 
            sugText+'have high multicollinearities. Check the detail correlations by click the plot.',
            type: highVifList.length === 0 ? 'success' : 'warning',
        };
        setSuggestion(suggestion);
    };

    useEffect(() => {
        //setIndepFeatures([...props.independent_features].sort());
        setVIFannotation(props.independent_features, props.VIF_test_result);
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
                    echartScatterData['xAxisName'] = xFeature;//i === 0 ? xFeature : '';
                    echartScatterData['xAxisShow'] = i === 0 ? true : false;
                    echartScatterData['yAxisName'] = yFeature;//(j+1) % props.independent_features.length === 0 ? yFeature : '';
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
            <div
                className="VIFnotation"
                style={{
                    height: 140,
                    width: 280,
                }}
            >
                <Alert 
                    message={suggestion.msg}
                    type={suggestion.type} 
                    showIcon
                    style={{
                        textAlign: 'left',
                    }}
                />
            </div>
            <Drawer
                title={'Correlation of '}
                placement="right"
                headerStyle={{height: 30}}
                width={dimension.width}
                onClose={onClose}
                closeIcon={<LeftCircleOutlined />}
                visible={visible}
                getContainer={false}
                style={{
                    position: 'absolute'
                }}
            >
                {corrDetail}
            </Drawer>
        </Card>
    );
}