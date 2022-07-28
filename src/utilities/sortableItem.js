import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Spin } from 'antd';
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
                style={props.style}
            >
                <div className='space-align-container'>
                    <div className='space-align-block' style={{width: '5vw'}}>
                        {props.content}
                    </div>

                    <Spin spinning={props.norm_test_result.length > 0 ? false : true}>
                    <div className='space-align-block' style={{width: '7.5vw'}}>
                        <Histogram data={props.norm_test_result} height={20} />    
                    </div>
                    </Spin>

                    <Spin spinning={true}>
                    <div className='space-align-block' style={{width: '4vw'}}>
                        VIF:10
                    </div>
                    </Spin>

                    <Spin spinning={true}>
                    <div className='space-align-block end' style={{width: '2vw'}}>
                        ICON
                    </div>
                    </Spin>
                </div>
                
            </div>
        </li>
    );
}