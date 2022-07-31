import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Spin, Tag, Row, Col } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import '../styles/App.css';
import { CSS } from '@dnd-kit/utilities';
import { Histogram } from './histogram';

export function SortableItem(props){

    //console.log(props);

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

    const VIFresult = props.VIFresult === null ? <></> : 
        (props.VIFresult > 10 ? 
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
            {'VIF: ' + props.VIFresult.toFixed(1)}
        </Tag> : 
        <Tag color="success">{'VIF: ' + props.VIFresult.toFixed(1)}</Tag>);

    const { CheckableTag } = Tag;

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
                    <div className='space-align-block' style={{width: '5vw'}}>
                        {props.content}
                    </div>

                    <Spin spinning={props.norm_test_result.length > 0 ? false : true}>
                    <div className='space-align-block' style={{width: '6vw'}}>
                        <Histogram data={props.norm_test_result} height={22} />
                    </div>
                    </Spin>

                    <Spin spinning={props.VIFresult === null ? true : false}>
                    <div className='space-align-block' style={{width: '4.6vw', paddingLeft: 0}}>
                        {VIFresult}
                    </div>
                    </Spin>

                    <div className='space-align-block end' style={{width: '3vw'}}>
                    <CheckableTag
                        key={'A'}
                        checked={true}
                        
                    >
                        Norm
                    </CheckableTag>
                    </div>
                </div>
                
            </div>
        </li>
    );
}