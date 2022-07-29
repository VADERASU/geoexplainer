import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import { DropCardContainer } from '../../utilities/dropCardContainer';
//import { SortableItem } from '../../utilities/sortableItem';

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
        if(props.original_features.includes(id) || id === 'original'){
            return "original";
        }else if(props.dependent_features.includes(id) || id === 'dependent'){
            return "dependent";
        }else if(props.independent_features.includes(id) || id === 'independent'){
            return "independent";
        }else{
            return null;
        }
    };

    const retrieveVarList = (containerId) => {
        if(containerId === 'original'){
            return props.original_features;
        }else if(containerId === 'dependent'){
            return props.dependent_features;
        }else if(containerId === 'independent'){
            return props.independent_features;
        }else{
            return null;
        }
    };

    const handleDragStart = (event) =>{
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        setActiveId(null);
        //console.log(active.id, over.id);
        if (active.id !== over.id) {
            
            let activeContainer = findContainer(active.id);
            let activeList = retrieveVarList(activeContainer);
            let overContainer = findContainer(over.id);
            let overList = retrieveVarList(overContainer);
            //console.log(activeList, overList);
            if(activeContainer === overContainer){
                // singel sortable list
                let oldIndex = activeList.indexOf(active.id);
                let newIndex = overList.indexOf(over.id);
                let newSortableList = arrayMove(activeList, oldIndex, newIndex);
                props.updateSortableList(overContainer, newSortableList);
            }else{
                // drag between sortable lists
                let oldIndex = activeList.indexOf(active.id);
                activeList.splice(oldIndex, 1);
                // dependent list only have one variable
                if(overContainer === 'dependent' && overList.length > 0){
                    activeList.unshift(overList[0]);
                    overList.splice(0,1);
                }
                overList.unshift(active.id);
                props.updateSortableList(activeContainer, activeList);
                props.updateSortableList(overContainer, overList);
            }
            
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    //generateSortableComponents();

    return(
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <div className='variableSelectionContainer'>
                <SortableContext
                    items={props.dependent_features}
                    strategy={verticalListSortingStrategy}
                >
                    <DropCardContainer
                        title={'Dependent Variable Y'}
                        id={'dependent'}
                        key={'dependent'}
                        ifBottom={false}
                        sortableItems={props.dependent_features}
                        activeId={activeId}
                        sortable_components={props.sortable_components}

                        norm_test_result={props.norm_test_result}
                    />
                </SortableContext>
                
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
                        sortable_components={props.sortable_components}

                        norm_test_result={props.norm_test_result}
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
                        sortable_components={props.sortable_components}

                        norm_test_result={props.norm_test_result}
                    />
                </SortableContext>
                
            </div>

            <DragOverlay>
                {
                    activeId ? props.sortable_components.origin[activeId] : null
                }
            </DragOverlay>
        </DndContext>
        
    );
}
