import { useState, useRef, useEffect } from 'react'
import {line, area, curveBasis, curveCardinal, stack} from 'd3-shape'
import ChartContainer from './ChartContainer'


const genLine = (type, scale, domain, xScaleKey, yScaleKey, curveType, stacked) => {

  if (type === 'area') {
    if (stacked) {

      return area()
      .x((d) => { return scale.x(d.data[xScaleKey])})
      .y0((d) => { return scale.y(d[0])})
      .y1((d) => { return scale.y(d[1])})
      .curve(!curveType ? curveBasis: curveType)

    }
    else {
      return area()
      .x((d) => { return scale.x(d[xScaleKey])})
      .y0((d) => { return scale.y(domain.y[0])})
      .y1((d) => { return scale.y(d[yScaleKey])})
      .curve(!curveType ? curveBasis: curveType);
    }
   
  }
  else {
      return line()
      .x((d) => { return scale.x(d.x)})
      .y((d) => { return scale.y(d.y)})
      .curve(!curveType ? curveBasis: curveType);
  }
}

const dataForLine = (props) => {
  return props.data && props.data.length && props.data.length >= 1 && props.scale;
}

export const Lines = (props) => {

  if (dataForLine(props)) {

    const line = genLine(props.lineType, props.scale, props.domain, props.xScaleKey || 'x', props.yScaleKey || 'y', props.curveType, props.stacked); 
    const lines = props.data.map((d, i) => {

      if (props.lineType === 'area') {
        
        return (
          <g key={`area-line-${i}`}>
            <path 
            class={`path-two-${props.uniqueName}`} 
            stroke={ props.colors && props.colors.length ? props.colors[i] : "rgba(238, 175, 246, 0.8)"}
            strokeWidth={ props.strokeWidth ? props.strokeWidth(d, i) : "0.5px"}
            strokeLinecap="round"
            d={line(d)}
            fill={ props.colors && props.colors.length ? props.colors[i] : "rgb(238, 175, 246)" }
            fillOpacity={ props.fillOpacity ? props.fillOpacity(d, i) : 0.3}>
            </path>
          </g>);
      }
      else {
        return (
          <g key={`line-${i}`}>
             <path 
              class={`path-two-${props.uniqueName}`} 
              stroke={ props.colors && props.colors.length ? props.colors[i] : "rgba(238, 175, 246, 0.8)"}
              strokeWidth={ props.strokeWidth ? props.strokeWidth(d, i) : "4px"}
              strokeDasharray={ props.dash && props.dash.length && props.dash[i] === true ? " 6 6" : ""}
              strokeLinecap="round"
              d={line(d)}
              fill="none"
              strokeOpacity={props.strokeWidth ? props.fillOpacity(d, i) : 0.2}>
            </path>
            <path 
              class={`path-two-${props.uniqueName}`} 
              stroke={ props.colors && props.colors.length ? props.colors[i] : "rgba(238, 175, 246, 0.8)"}
              strokeWidth={ props.strokeWidth ? props.strokeWidth(d, i) : "1px"}
              strokeDasharray={ props.dash && props.dash.length && props.dash[i] === true ? "6 6" : ""}
              strokeLinecap="round"
              d={line(d)}
              fill="none"
              strokeOpacity={props.strokeWidth ? props.fillOpacity(d, i) : 0.8}>
            </path> 
          </g>);
      }
    });

    return (<g className={`lines-${props.uniqueName}`}>{lines}</g>);

  }
  else {
    return (<g className={`lines-${props.uniqueName}`} />);
  }
  
}

export const LineChart = (props) => {

  const containerRef = useRef();
  const [scale, setScale] = useState();

  const handleScale = (newScale) => {
    setScale(newScale);
  }

  return (
   <ChartContainer className={props.className} ref={containerRef} data={props.data}
    domain={props.domain} margin={props.margin} mouseOverMarkerPos={props.mouseOverMarkerPos} mouseOverTextExtended={props.mouseOverTextExtended}
    chartProps={props.chartProps} handleScale={handleScale} currentPriceLine={props.currentPriceLine} price={props.price}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}
    mouseOverMarkerPosX={props.mouseOverMarkerPosX}  mouseOverMarkerPosY={ props.mouseOverMarkerPosY}>
      <Lines colors={props.colors} data={props.data} dash={props.dash}
        scale={scale} domain={props.domain}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}} lineType={props.lineType}
        strokeWidth={props.strokeWidth} fillOpacity={props.fillOpacity}>
      </Lines>
      {props.children}
   </ChartContainer>
  );

}

export const LineChartStacked = (props) => {

  const containerRef = useRef();
  const [scale, setScale] = useState();
  const [stackedData, setStackedData] = useState();

  const handleScale = (newScale) => {
    setScale(newScale);
  }

  useEffect(() => {
    if (props.data && props.keys) {
      var stacker = stack();
      stacker.keys(props.keys);
      setStackedData(stacker(props.data));
    }
  }, [props.data, props.keys, props.domain])


  return (
   <ChartContainer className={props.className} ref={containerRef} data={stackedData}
    domain={props.domain} margin={props.margin} mouseOverMarkerPos={props.mouseOverMarkerPos}
    chartProps={props.chartProps} handleScale={handleScale} currentPriceLine={props.currentPriceLine}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      <Lines colors={props.colors} data={stackedData} dash={props.dash}
        scale={scale} domain={props.domain} stacked={true}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}} lineType={props.lineType}
        strokeWidth={props.strokeWidth} fillOpacity={props.fillOpacity} xScaleKey={props.xScaleKey}>
      </Lines>
      {props.children}
   </ChartContainer>
  );

}

export const LineChartDoubleAxis = (props) => {

  const containerRef = useRef();
  const [scale, setScale] = useState();
  const [scaleRight, setScaleRight] = useState();

  const handleScale = (newScale) => {
    
    setScale(newScale);

    if (newScale && newScale.yRight && newScale.x) {
      setScaleRight({x: newScale.x, y: newScale.yRight});
    }
  }

  return (
   <ChartContainer className={props.className} ref={containerRef} data={props.data}
    domain={props.domain} margin={props.margin}
    chartProps={props.chartProps} handleScale={handleScale} currentPriceLine={props.currentPriceLine} mouseOverMarkerPos={props.mouseOverMarkerPos}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      <Lines colors={[props.colors[0]]} data={props.data} 
        scale={scale} domain={props.domain}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}} lineType={props.lineType}
        strokeWidth={props.strokeWidth} fillOpacity={props.fillOpacity}
        xScaleKey={props.chartProps && props.chartProps.xScaleKey ? props.chartProps.xScaleKey : 'x'}
        yScaleKey={props.chartProps && props.chartProps.yScaleKey ? props.chartProps.yScaleKey : 'y'}
        curveType={curveCardinal}>
      </Lines>
      <Lines colors={[props.colors[1]]} data={props.data} 
        scale={scaleRight} domain={props.domain && props.domain.yRight ? {x: props.domain.x, y: props.domain.yRight} : null}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}} lineType={props.lineType}
        strokeWidth={props.strokeWidth} fillOpacity={props.fillOpacity}
        xScaleKey={props.chartProps && props.chartProps.xScaleKey ? props.chartProps.xScaleKey : 'x'}
        yScaleKey={props.chartProps && props.chartProps.yScaleKey ? props.chartProps.yScaleKeyRight : 'y'}
        curveType={curveCardinal}
        >
      </Lines>
      {props.children}
   </ChartContainer>
  );

}
