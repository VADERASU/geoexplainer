import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Card } from 'antd';
import '../styles/App.css';

export function DropCardContainer(props) {

    return(
        <Card
            title={props.title}
            size='small'
            style={props.ifBottom ? {} : {marginBottom: 10}}
            bodyStyle={{
                minHeight: 50,
                maxHeight: 200,
                backgroundColor: '#f6f6f6',
                overflow: 'auto'
            }}
        >
            <ul className='sortableContainer'>
                {props.sortableItems}
            </ul>
        </Card>
    );

}
