import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import { DropCardContainer } from '../../utilities/dropCardContainer';
import { SortableItem } from '../../utilities/sortableItem';

import {
    DndContext, 
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function VariableSelection(props) {
    const [activeId, setActiveId] = useState(null);

    const findContainer = (id) => {
        if(props.original_features.includes(id)){
            return "original";
        }else if(props.dependent_features.includes(id)){
            return "dependent";
        }else{
            
        }
    };

    const handleDragStart = (event) =>{
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        setActiveId(null);
        console.log(active.id, over.id);
        if (active.id !== over.id) {
            //find which container item comes from
            
            const oldIndex = props.original_features.indexOf(active.id);
            const newIndex = props.original_features.indexOf(over.id);

            //findContainer(newIndex);
            //console.log(activeContainer);
        
            const newSortableList = arrayMove(props.original_features, oldIndex, newIndex);
            props.updateSortableList('original', newSortableList);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    return(
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className='variableSelectionContainer'>
                <DropCardContainer
                    title={'Dependent Variable Y'}
                    id={'dependent'}
                    key={'dependent'}
                    ifBottom={false}
                    sortableItems={props.dependent_features}
                    activeId={activeId}
                />
                <SortableContext
                    items={props.independent_features}
                    strategy={verticalListSortingStrategy}
                >
                    <DropCardContainer
                        title={'Independent Variable X'}
                        id={'independent'}
                        key={'independent'}
                        ifBottom={false}
                        sortableItems={props.independent_features}
                        activeId={activeId}
                    />
                </SortableContext>
                
                <SortableContext
                    items={props.original_features}
                    strategy={verticalListSortingStrategy}
                >
                    <DropCardContainer
                        id={'original'}
                        key={'original'}
                        title={'Original Feature List'}
                        ifBottom={true}
                        sortableItems={props.original_features}
                        activeId={activeId}
                    />
                </SortableContext>
                
            </div>

            <DragOverlay>
                {
                    activeId ? ( <SortableItem key={activeId} id={activeId} content={activeId} />) : null
                }
            </DragOverlay>
        </DndContext>
        
    );
}
