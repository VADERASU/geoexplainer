import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';

const posColors = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
const negColors = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7'];
const biVarColors = [
    ['#4393c3','#2166ac','#636363'],
    ['#92c5de','#bdbdbd','#b2182b'],
    ['#f0f0f0','#f4a582','#d6604d']
];

export function Legend(props){
    const canvasRef = useRef(null);
    const [legendstyle, setLegendstyle] = useState({
        width: 500, height: 50
    });

    const coeffMapLegend = (legendData) => {
        clearCanvas();
        const margin = {
            top: 0,
            right: 0,
            bottom: 0,//props.container === 'dependent' ? 11 : 0,
            left: 0, //60
        };
        const svgRoot = d3.select(canvasRef.current).select("svg");
        const rootGroup = svgRoot.select('g#root-group');

        const legendGroup = rootGroup.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const boundedWidth = 500 - margin.left - margin.right;
        if(legendData.scheme === 'sequential'){
            const barWidth = boundedWidth / legendData.colors.length;
            //console.log(legendData.texts);
            const bars = legendGroup.selectAll('rect')
            .data(legendData.colors)
            .join('rect')
            .attr('x', (d,i) => barWidth*i)
            .attr("width", barWidth)
            .attr("y", 0)
            .attr("height", 20)
            .attr("fill", d=>d);

            const text = legendGroup.selectAll('text')
            .data(legendData.texts)
            .join('text')
            .attr('x', (d,i) => barWidth*(i+1)-15)
            .attr("y", 35)
            .style("font-size", 11)
            .text(d=>d.toFixed(3));

        }else if(legendData.scheme === 'diverge'){
            const colors = legendData.colors[0].concat(legendData.colors[1]);
            const barWidth = boundedWidth / colors.length;
            const texts = legendData.texts[0].concat(0, legendData.texts[1]);
            //console.log(colors, texts);
            const bars = legendGroup.selectAll('rect')
            .data(colors)
            .join('rect')
            .attr('x', (d,i) => barWidth*i)
            .attr("width", barWidth)
            .attr("y", 0)
            .attr("height", 20)
            .attr("fill", d=>d);

            const text = legendGroup.selectAll('text')
            .data(texts)
            .join('text')
            .attr('x', (d,i) => barWidth*(i+1)-15)
            .attr("y", 35)
            .style("font-size", 11)
            .text(d=>d.toFixed(3));
        }
    };

    const singleVarMapLegend = (legendData) => {
        clearCanvas();
        const {scrollWidth, scrollHeight} = canvasRef.current;
        const margin = {
            top: 0,
            right: 0,
            bottom: 0,//props.container === 'dependent' ? 11 : 0,
            left: 0, //60
        };
        const boundedWidth = 500 - margin.left - margin.right;
        const barWidth = legendData.colors.length === 5 ? boundedWidth / 5 : boundedWidth / 10;

        const svgRoot = d3.select(canvasRef.current).select("svg");
        const rootGroup = svgRoot.select('g#root-group');

        const legendGroup = rootGroup.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const bars = legendGroup.selectAll('rect')
            .data(legendData.colors)
            .join('rect')
            .attr('x', (d,i) => barWidth*i)
            .attr("width", barWidth)
            .attr("y", 0)
            .attr("height", 20)
            .attr("fill", d=>d);

        const text = legendGroup.selectAll('text')
            .data(legendData.texts)
            .join('text')
            .attr('x', (d,i) => barWidth*(i+1)-15)
            .attr("y", 35)
            .style("font-size", 11)
            .text(d=>d.toFixed(2));

    };

    const biVarMapLegend = (legendData) => {
        clearCanvas();
        //console.log(legendData);
        const {scrollWidth, scrollHeight} = canvasRef.current;
        const margin = {
            top: 0,
            right: 0,
            bottom: 40,//props.container === 'dependent' ? 11 : 0,
            left: 40, //60
        };
        const boundedWidth = 200 - margin.left - margin.right;
        const barWidth = boundedWidth / 3;
        //console.log(barWidth);
        const svgRoot = d3.select(canvasRef.current).select("svg");
        const rootGroup = svgRoot.select('g#root-group');

        const legendGroup = rootGroup.append('g')
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const barRowGroup = legendGroup.selectAll('g')
        .data(legendData.colors)
        .join('g')
        .attr('transform', (d, i)=>`translate(0, ${margin.top+barWidth*i})`);
        

        const barRow = barRowGroup.selectAll('rect')
        .data((d, i)=> d)
        .join('rect')
        .attr('x', (d,i) => barWidth*i)
        .attr("width", barWidth)
        .attr("y", 0)
        .attr("height", barWidth)
        .attr("fill", d=>d);

        /*const textGroup = legendGroup.append('g')
        .attr("class", "textGroup") 
        .selectAll('.textGroup g')
        .data(legendData.texts)
        .join('g')
        .attr('transform', (d, i)=>i===0?`translate(${0}, ${margin.top})`:`translate(${0}, ${margin.top+boundedWidth})`);
        */
        const textY = legendGroup.append('g')
        .attr("class", "textY")
        .selectAll('.textY text')
        .data(legendData.texts[0])
        .join('text')
        .attr('transform', (d, i)=>`translate(${-20}, ${margin.top+barWidth*(i+1)+7})`)
        .style("font-size", 11)
        .text(d=>d);

        const textX = legendGroup.append('g')
        .attr("class", "textX")
        .selectAll('.textX text')
        .data(legendData.texts[1])
        .join('text')
        .attr('transform', (d, i)=>`translate(${barWidth*(i+1)-7}, ${margin.top+boundedWidth+15})`)
        .style("font-size", 11)
        .text(d=>d);

        const annoX = legendGroup.append('g')
        .attr("class", "annoX")
        .append('text')
        .style("font-size", 11)
        .attr('transform', (d, i)=>`translate(${30}, ${margin.top+boundedWidth+30})`)
        .text('---- '+legendData.x+' ---->');

        const annoY = legendGroup.append('g')
        .attr("class", "annoY")
        .append('text')
        .style("font-size", 11)
        .attr('x',40)
        .attr('y',32)
        //.attr('transform', (d, i)=>`translate(${50}, ${200})`)
        .attr("transform", "rotate(90)")
        .text('<---- '+legendData.y+' ----');
    };

    const processLegendData = (mapLegend, loaded_map_data) => {
        const layer = mapLegend.layer;
        const id = mapLegend.id;

        if(layer === 'dependent'){
            const featureList = loaded_map_data.features.map(e=>e.properties[id]);
            const quantile = d3.scaleQuantile()
                .domain(featureList) // pass the whole dataset to a scaleQuantile’s domain
                .range(posColors);
            const classSteps = quantile.quantiles();
            const legendData = {
                colors: posColors,
                texts: classSteps
            };
            return legendData;
        }else if(layer === 'bi-var'){
            const clonedata = JSON.parse(JSON.stringify(loaded_map_data));
            const featureListY = clonedata.features.map(e=>e.properties[id[0]]);
            const featureListX = clonedata.features.map(e=>e.properties[id[1]]);
            const maxY = Math.max(...featureListY);
            const minY = Math.min(...featureListY);
            const maxX = Math.max(...featureListX);
            const minX = Math.min(...featureListX);
            
            const clusterIntervalY = parseInt((maxY - minY) / 4); // start from 0, 5 classes
            const clusterIntervalX = parseInt((maxX - minX) / 4); // start from 0, 5 classes
            const classStepsY = [];
            const classStepsX = [];
            for(let i = 1; i < 3; i++){
                let classBreakY = minY + clusterIntervalY * i;
                classStepsY.push(parseInt(classBreakY));
                let classBreakX = minX + clusterIntervalX * i;
                classStepsX.push(parseInt(classBreakX));
            }
            //console.log(classStepsY, classStepsX);
            const classSteps = [classStepsY.reverse(), classStepsX];
            const legendData = {
                colors: biVarColors,
                texts: classSteps,
                y: id[0],
                x: id[1]
            };
            return legendData;
        }else if(layer === 'result'){
            if(id === 'local_R2' || id === 'cooksD'){
                const featureList = loaded_map_data.features.map(e=>e.properties[id]);
                const quantile = d3.scaleQuantile()
                    .domain(featureList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(posColors);
                const classSteps = quantile.quantiles();
                const legendData = {
                    scheme: 'sequential',
                    colors: posColors,
                    texts: classSteps
                };
                return legendData;
            }else if(id === 'std_residuals'){
                const featureList = loaded_map_data.features.map(e=>e.properties[id]);
                const posList = featureList.filter(e=>e>0);
                const negList = featureList.filter(e=>e<0);
                const negColorScheme = ['#b2182b','#ef8a62','#fddbc7'];
                const posColorScheme = ['#d1e5f0','#67a9cf','#2166ac'];
                const quantile_neg = d3.scaleQuantile()
                    .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(negColorScheme);

                const quantile_pos = d3.scaleQuantile()
                    .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(posColorScheme);
                const classSteps_neg = quantile_neg.quantiles();
                const classSteps_pos = quantile_pos.quantiles();
                const legendData = {
                    scheme: 'diverge',
                    colors: [negColorScheme, posColorScheme],
                    texts: [classSteps_neg, classSteps_pos]
                };
                return legendData;
            }else{
                const featureName = id + '_coefficient';
                const featureList = loaded_map_data.features.map(e=>e.properties[featureName]);
                const posList = featureList.filter(e=>e>0);
                const negList = featureList.filter(e=>e<0);
                if(negList.length === 0){
                    const quantile_pos = d3.scaleQuantile()
                    .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(posColors);
                    const classSteps_pos = quantile_pos.quantiles();
                    const legendData = {
                        scheme: 'sequential',
                        colors: posColors,
                        texts: classSteps_pos
                    };
                    return legendData;
                }else if(posList.length === 0){
                    const quantile_neg = d3.scaleQuantile()
                    .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                    .range(negColors);
                    const classSteps_neg = quantile_neg.quantiles();
                    const legendData = {
                        scheme: 'sequential',
                        colors: negColors,
                        texts: classSteps_neg
                    };
                    return legendData;
                }else{
                    const quantile_neg = d3.scaleQuantile()
                        .domain(negList) // pass the whole dataset to a scaleQuantile’s domain
                        .range(negColors);
            
                    const quantile_pos = d3.scaleQuantile()
                        .domain(posList) // pass the whole dataset to a scaleQuantile’s domain
                        .range(posColors);
            
                    const classSteps_neg = quantile_neg.quantiles();
                    const classSteps_pos = quantile_pos.quantiles();
                    const legendData = {
                        scheme: 'diverge',
                        colors: [negColors, posColors],
                        texts: [classSteps_neg, classSteps_pos]
                    };
                    return legendData;
                }
            }
        }

    };

    const clearCanvas = () => {
        const rootGroup = d3.select(canvasRef.current).select('g#root-group');
        rootGroup.selectAll('g').remove();
    };

    useEffect(()=>{
        clearCanvas();
        if(props.mapLegend.layer !== null){
            const legendStyle = props.mapLegend.layer === 'bi-var' ?
                {width: 200, height: 200} : {width: 500, height: 50};
            setLegendstyle(legendStyle);
            const legendData = processLegendData(props.mapLegend, props.loaded_map_data);
            if(props.mapLegend.layer === 'bi-var'){
                biVarMapLegend(legendData);
            }else if(props.mapLegend.layer === 'result'){
                coeffMapLegend(legendData);
            }else{
                singleVarMapLegend(legendData);
            }
            
        }

    }, [props.mapLegend, props.loaded_map_data]);

    return(
        <div style={legendstyle} ref={canvasRef}> {/** 235px in 1080p */}
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
