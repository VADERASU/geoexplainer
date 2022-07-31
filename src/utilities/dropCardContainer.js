import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Card } from 'antd';
import '../styles/App.css';
//import { SortableItem } from './sortableItem';
import {useDroppable} from '@dnd-kit/core';

export function DropCardContainer(props) {
    //console.log(props);

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
                maxHeight: 400,
                backgroundColor: '#f6f6f6',
                overflow: 'auto',
            }}
        >
            <ul className='sortableContainer' ref={setNodeRef} style={{zIndex: 1}}>
                {props.sortableItems.map(id => {
                    if(props.activeId === id){
                        return (
                            props.sortable_components.activ[id]
                        );
                    }else{
                        return (
                            props.sortable_components.origin[id]
                        );
                    }
                    
                })}
            </ul>
        </Card>
    );

}
