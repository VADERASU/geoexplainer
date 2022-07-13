import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Card } from 'antd';
import '../styles/App.css';

function DropCardContainer(props) {

    return(
        <Card
            title={props.title}
            size='small'
            bodyStyle={{
                minHeight: 50,
                backgroundColor: '#f6f6f6'
            }}
        >

        </Card>
    );

}
export default DropCardContainer;