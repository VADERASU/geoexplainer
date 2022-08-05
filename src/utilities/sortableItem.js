import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Spin, Tag, Button } from 'antd';
import { ExclamationCircleOutlined, DotChartOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import '../styles/App.css';
import { CSS } from '@dnd-kit/utilities';
import { Histogram } from './histogram';

export function SortableItem(props){

    //console.log(props.norm_test_result);
    const mapBtnRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 999,
    };

    const featureNameStyle = {width: '4.9vw', marginRight: 3};
    const histogramStyle = {width: '5.6vw', marginRight: 3, padding: 0};
    const VIFStyle = {
        width: '4.6vw', paddingLeft: 0, marginRight: 3, 
        display: props.container !== 'dependent'? 'block' : 'none',
    };
    const collationIconStyle = {
        marginRight: 3,
        display: props.container !== 'dependent'? 'block' : 'none',
    };
    const mapIconStyle = {marginRight: 0, display: 'block'};
    const logTransStyle = {
        width: '6.3vw', paddingLeft: 0, marginRight: 3, fontSize: 11.5, paddingTop: 8,
        display: props.container === 'dependent'? 'block' : 'none',
    };

    const VIFresult = props.VIFresult === null ? <></> : 
        (props.VIFresult > 10 ? 
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {'VIF: ' + props.VIFresult.toFixed(1)}
        </Tag> : 
        <Tag color="success">{'VIF: ' + props.VIFresult.toFixed(1)}</Tag>);

    const normTransformInfo = props.norm_test_result.length > 0 ? 
    (parseFloat(props.norm_test_result[0].p_value)>=0.05 ? 'Normal distribution' : (
        parseFloat(props.norm_test_result[0].skewness) > 0 ? 'Positively skewed' : 'Negatively skewed'
    )) : null;

    const normTransBtnDisable = props.norm_test_result.length > 0 ? (parseFloat(props.norm_test_result[0].p_value)>=0.05 ? true : false) : false;

    const handleMapRefClick = event => {
        props.handleMapBtnClick(props.id);
    };

    useEffect(() => {
        const mapRef = mapBtnRef.current;
    
        mapRef.addEventListener('mousedown', handleMapRefClick);
    
        return () => {
            mapRef.removeEventListener('mousedown', handleMapRefClick);
        };
      }, []);

    return(
        <li
            className='sortableListItemWrapper'
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <div
                className='sortableItem'
                style={props.active ? {opacity: 0.33} : {}}
            >
                <div className='space-align-container'>

                    <div className='space-align-block' style={featureNameStyle}>
                        {props.content}
                    </div>

                    <Spin spinning={props.norm_test_result.length > 0 ? false : true}>
                    <div className='space-align-block' style={histogramStyle}>
                        <Histogram 
                            data={props.norm_test_result} 
                            height={30} 
                            container={props.container}
                            mapBtnActiv={props.mapBtnActiv}
                        />
                    </div>
                    </Spin>

                    <Spin spinning={props.VIFresult === null ? true : false}>
                    <div className='space-align-block' style={VIFStyle}>
                        {VIFresult}
                    </div>
                    </Spin>

                    <div className='space-align-block' style={logTransStyle}>
                        {normTransformInfo}
                    </div>

                    <div className='space-align-block' style={collationIconStyle}>
                        <Button disabled={props.corrBtnActiv} size='small' icon={<DotChartOutlined />}></Button>
                    </div>

                    <div className='space-align-block' style={mapIconStyle}>
                        <Button size='small' type={props.mapBtnActiv} ref={mapBtnRef} icon={<GlobalOutlined />}></Button>
                    </div>
                </div>
                
            </div>
        </li>
    );
}