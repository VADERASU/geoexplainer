import React, {cloneElement} from 'react';
import { Card } from 'antd';
import '../styles/App.css';
//import { SortableItem } from './sortableItem';
import {useDroppable} from '@dnd-kit/core';

export function DropCardContainer(props) {
    //console.log(props.id);

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
                maxHeight: 300,
                backgroundColor: '#f6f6f6',
                overflow: 'auto',
            }}
        >
            <ul className='sortableContainer' ref={setNodeRef} style={{zIndex: 1}}>
                {props.sortableItems.map(id => {
                    if(props.activeId === id){
                        return (
                            props.id === 'dependent' ?
                            cloneElement(
                                props.sortable_components.activ[id],
                                {
                                    container: 'dependent',
                                    corrLegend: (props.currentActivCorrelation !== null) ? true : false
                                }
                            ) :
                            (props.id === 'independent' ?
                            cloneElement(
                                props.sortable_components.activ[id],
                                {
                                    container: 'independent'
                                }
                            ) :
                            props.sortable_components.activ[id])
                        );
                    }else{
                        return (
                            props.id === 'dependent' ?
                            cloneElement(
                                props.sortable_components.origin[id],
                                {
                                    container: 'dependent',
                                    corrLegend: (props.currentActivCorrelation !== null) ? true : false
                                }
                            ) :
                           (props.id === 'independent' ?
                            cloneElement(
                                props.sortable_components.origin[id],
                                {container: 'independent'}
                            ) :
                            props.sortable_components.origin[id])
                        );
                    }
                    
                })}
            </ul>
        </Card>
    );

}
