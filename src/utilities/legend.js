import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

export function Histogram(props){
    const canvasRef = useRef(null);

    const clearCanvas = () => {
        const rootGroup = d3.select(canvasRef.current).select('g#root-group');
        rootGroup.selectAll('g').remove();
    };

    return(
        <div style={{height: 50, width: 100}} ref={canvasRef}> {/** 235px in 1080p */}
            <svg
                style={{
                    width: '100%',
                    height: '100%'
                }}
            >
            <g id="root-group"/>
            </svg>
        </div>        
    );
}
