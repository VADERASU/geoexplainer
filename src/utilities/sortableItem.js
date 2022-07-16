import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../styles/App.css';

export function SortableItem(props){
    return(
        <li
            className='sortableListItemWrapper'
        >
            <div
                className='sortableItem'
            >
                {props.content}
            </div>
        </li>
    );
}