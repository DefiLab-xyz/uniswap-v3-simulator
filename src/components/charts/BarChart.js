import React, { useState, useRef } from 'react'

import ChartContainer from './ChartContainer';
import AverageLine from './AverageLine'

const Bars = (props) => {

  if (props.data && props.data.length && props.data.length >= 1 && props.scale && props.height) {

     const rect = props.data.map((d, i) => {
      return <rect 
      className={"bar"}
      key={`bar-${i}`}
      style={props.style}
      x={props.scale.x(d.x)}
      y={props.scale.y(d.y)}
      height={props.height - props.scale.y( d.y )}
      width={props.scale.x.bandwidth()}
      rx="0.5" 
      ry="0.5"></rect>});

      return (<g className={"bars"}>{rect}</g>);
  }
  else {
    return (<g className={"bars"} />);
  }
  
}


const BarChart = (props) => {

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);  
  const [scale, setScale] = useState();
  const containerRef = useRef();

  const handleScale = (scale) => setScale(scale);
  const handleHeight = (height) => setHeight(height);
  const handleWidth = (width) => setWidth(width);


  return (
    <ChartContainer className={props.className} ref={containerRef} data={props.data}
    domain={props.domain} margin={props.margin} chartProps={props.chartProps} 
    handleScale={handleScale} handleHeight={handleHeight} handleWidth={handleWidth}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      <Bars data={props.data} scale={scale} 
        width={width} height={height}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}}
        classNames={props.classNames}>
      </Bars>
      <AverageLine data={props.data} scale={scale} domain={props.domain} avgLine={props.avgLine}></AverageLine>
      {props.children}
    </ChartContainer>
  );

};

export default BarChart