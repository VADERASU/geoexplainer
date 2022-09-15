import React, {useEffect, useState} from "react";
import * as d3 from 'd3';
//import * as d3HB from "d3-hexgrid";

export function D3Map (props) {

    useEffect(()=>{
        console.log(props.loaded_map_data, props.selectedRowKeys, props.colorScheme);
    }, [props.loaded_map_data, props.selectedRowKeys, props.colorScheme]);

    return(
        <div style={{height: 300}} ref={this.canvasRef}>
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