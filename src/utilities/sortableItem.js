import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import '../styles/App.css';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props){

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
            >
                {props.content}
            </div>
        </li>
    );
}