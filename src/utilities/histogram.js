import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

export function Histogram(props){
    
    const canvasRef = useRef(null);

    const drawHistogram = (normResult) => {
        let data = normResult.Y;
        // draw histogram
        const {scrollWidth, scrollHeight} = canvasRef.current;
        // was d3.thresholdFreedmanDiaconis
        const dataBins = d3.bin().thresholds(10)(data);
        //console.log(dataBins);
        // Chart dimensions
        let dimensions = {
            width: scrollWidth,
            height: scrollHeight,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,//props.container === 'dependent' ? 11 : 0,
                left: 0, //60
            },
        };
        dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
        dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

        const svgRoot = d3.select(canvasRef.current).select("svg");
        const rootGroup = svgRoot.select('g#root-group');
        const histGroup = rootGroup.append('g')
            .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        /** setup scales */
        const xScale = d3.scaleLinear()
            .domain([dataBins[0].x0, dataBins[dataBins.length - 1].x1])
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataBins, d => d.length)]).nice()
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

        /** render bars for the hist */
        const barsGroup = histGroup.append('g').attr('class', 'bars');
        const bars = barsGroup.selectAll('rect')
        .data(dataBins)
        .join('rect')
        .attr('x', d => xScale(d.x0) + 1)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("y", d => yScale(d.length))
        .attr("height", d => yScale(0) - yScale(d.length))
        

        //change the color
        if(props.mapBtnActiv === 'primary'){
            const globalMax = d3.max(data);
            const globalMin = d3.min(data);
            const clusterInterval = parseInt((globalMax - globalMin) / 5); // start from 0, 5 classes
            const classSteps = [];
    
            for(let i = 1; i < 4; i++){
                let classBreak = globalMin + clusterInterval * i;
                classSteps.push(parseInt(classBreak));
            }

            bars.attr("fill", d => d.x1 <= classSteps[0] ? '#eff3ff' : 
            (d.x1 <=  classSteps[1] ? '#bdd7e7' : 
            (d.x1 <= classSteps[2] ? '#6baed6' : '#2171b5')));
        }else{
            bars.attr("fill", 'rgb(25, 183, 207)');
        }

        // Text information
        //if(props.container === 'dependent'){
            /*
            const normTestTooltip = normResult.p_value >= 0.05 ? 
            'Normal distribution' : 
            (normResult.skewness > 0 ? 'Positively skewed' : 'Negatively skewed');

            const textGroup = histGroup.append('g').attr('class', 'bars')
            .append('text')
            .attr('x', dimensions.margin.left)
            .attr('y', dimensions.height - 1)
            .attr('font-size', 11)
            .text(normTestTooltip);
            */
        //}
        
    };

    const clearCanvas = () => {
        const rootGroup = d3.select(canvasRef.current).select('g#root-group');
        rootGroup.selectAll('g').remove();
    };

    useEffect(()=>{
        //console.log(props);
        clearCanvas();
        if(props.data.length > 0){
            //let data = props.data[0].Y;
            drawHistogram(props.data[0]);
        }
        

    });

    return(
        <div style={{height: props.height, width: 100}} ref={canvasRef}> {/** 235px in 1080p */}
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
