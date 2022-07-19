import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Card } from 'antd';
import '../styles/App.css';
import { SortableItem } from './sortableItem';
import {useDroppable} from '@dnd-kit/core';

export function DropCardContainer(props) {
    //console.log(props.sortableItems);

    const {setNodeRef} = useDroppable({
        id: props.id,
    });

    return(
        <Card
            title={props.title}
            size='small'
            style={props.ifBottom ? {} : {marginBottom: 10}}
            bodyStyle={{
                minHeight: 50,
                maxHeight: 200,
                backgroundColor: '#f6f6f6',
                overflow: 'auto',
            }}
        >
            <ul className='sortableContainer' ref={setNodeRef}>
                {props.sortableItems.map(id => <SortableItem key={id} id={id} content={id} />)}
            </ul>
        </Card>
    );

}
