import React, {useState, useEffect, useRef} from 'react';
import * as d3 from 'd3';

const cate2Color = {
    'Introduction': '#ff7f00',
    'Demographics': '#33a02c',
    'Education': '#1f78b4',
    'Crime and policing': '#e7298a',
    'Politics': '#b2df8a',
    'Other': '#80b1d3'
};

export function WordBar (props) {
    const canvasRef = useRef(null);

    const drawBar = (data, dataDomain) => {
        //clearCanvas();
        const {scrollWidth, scrollHeight} = canvasRef.current;
        const margin = {
            top: 5,
            right: 40,
            bottom: 0,
            left: 0,
        };
        const svgRoot = d3.select(canvasRef.current).select("svg");
        const rootGroup = svgRoot.select('g#root-group');

        const barsGroup = rootGroup.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        const xScale = d3.scaleLinear()
            .domain(dataDomain)
            .range([margin.left+10, 150 - margin.right]);

        const bar = barsGroup.append('rect')
        .datum(data)
        .attr('x', margin.right)
        .attr('y', 0)
        .attr('width', d=>xScale(d.coefficient))
        .attr('height', 20)
        .attr("fill", d=>cate2Color[d.category]);

        const text = barsGroup.append('text')
        .datum(data)
        .attr('x', 0)
        .attr('y', 14)
        .style("font-size", 11)
        .text(d=>d.coefficient.toFixed(4))
        .attr("fill", d=>cate2Color[d.category]);
    };

    const clearCanvas = () => {
        const rootGroup = d3.select(canvasRef.current).select('g#root-group');
        rootGroup.selectAll('g').remove();
    };

    useEffect(()=>{
        //console.log(props);
        clearCanvas();
        if(props.data !== null){
            //console.log(props.dataDomain);
            drawBar(props.data, props.dataDomain);
        }
    }, [props.data, props.dataDomain]);

    return(
        <div style={{height: 30, width: 150}} ref={canvasRef}> {/** 235px in 1080p */}
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
