import React, { useState, useRef, useEffect, Fragment } from 'react'
import chartscale from '../../helpers/chartscale'
import ChartContainer from './ChartContainer';
import AverageLine from './AverageLine'
import styles from '../../styles/modules/charts/BarChart.module.css'

const Bars = (props) => {

  if (props.data && props.data.length && props.data.length >= 1 && props.scale && props.height) {

    const xProp = props.chartProps && props.chartProps.xProp ? props.chartProps.xProp : 'x';
    const yProp = props.chartProps && props.chartProps.yProp ? props.chartProps.yProp : 'y';

     const rect = props.data.map((d, i) => {
      return <rect 
      className={styles["bar"]}
      key={`bar-${i}`}
      style={props.style}
      x={props.scale.x(d[xProp])}
      y={props.scale.y(d[yProp])}
      height={props.height - props.scale.y( d[yProp] )}
      width={props.barWidth ? props.barWidth(d, props) : props.scale.x.bandwidth()}
      rx="0.5" 
      ry="0.5"></rect>});

      return (<g className={styles["bars"]}>{rect}</g>);
  }
  else {
    return (<g className={styles["bars"]} />);
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
    domain={props.domain} margin={props.margin} chartProps={props.chartProps} pageStyle={props.pageStyle}
    handleScale={handleScale} handleHeight={handleHeight} handleWidth={handleWidth}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      <Bars data={props.data} scale={scale} 
        width={width} height={height}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}}
        classNames={props.classNames} domain={props.domain} chartProps={props.chartProps}
        barWidth={props.barWidth} scaleY={props.scaleY}>
      </Bars>
      <AverageLine data={props.data} scale={scale} domain={props.domain} avgLine={props.avgLine}></AverageLine>
      {props.children}
    </ChartContainer>
  );

};

const Bar = (props) => {
  const [mouseOverClass, setMouseOverClass] = useState('bar-mouseover-false');

  const handleMouseOver = (mouseOver) => {
    if (mouseOver) {
      setMouseOverClass(`bar-mouseover-true ${props.mouseOverClass}` || 'bar-mouseover-true');
      if (props.handleMouseOver) props.handleMouseOver(props.group, props.data, props.scale, props.groupScale);
    }
    else {
      setMouseOverClass('bar-mouseover-false');
    }
  } 

  return (
    <Fragment>
      <rect className={mouseOverClass} x={props.barGroupScale.x(props.group)} y={props.scale.y(props.data[props.group])} 
        width={props.barGroupScale.x.bandwidth()} fill={props.color} stroke={props.color} 
        strokeWidth={0.5} fillOpacity={0.5} strokeOpacity={0.6}
        height={props.height - props.scale.y(props.data[props.group])}>
      </rect>
      {
        props.mouseOver ? 
        <rect x={props.barGroupScale.x(props.group)} y={0} 
          width={props.barGroupScale.x.bandwidth()} fill={props.color} stroke={props.colors} 
          strokeWidth={0} fillOpacity={0} height={props.height}
          onMouseOver={() => handleMouseOver(true)}
          onMouseLeave={() => handleMouseOver(false)}>
        </rect> : <></>
      }
    </Fragment>
    
  )
}

const BarGroup = (props) => {
  if ( props.barGroupScale && props.barGroupScale.x && props.scale && props.scale.y) {
    const bars = props.barGroups.map((d, i) => {
      return <Bar group={d} color={props.colors[i]} 
        data={props.data} barGroupScale={props.barGroupScale} scale={props.scale} 
        height={props.height} mouseOver={true} mouseOverClass={props.mouseOverClass}
        handleMouseOver={props.handleMouseOver}>
      </Bar>
    });
  
    return (bars);  
  }
  return (<></>);
}

export const BarChartGrouped = (props) => {

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);  
  const [scale, setScale] = useState();
  const containerRef = useRef();

  const handleScale = (scale) => setScale(scale);
  const handleHeight = (height) => setHeight(height);
  const handleWidth = (width) => setWidth(width);

  const [barGroupScale, setBarGroupScale] = useState();

  useEffect(() => {
    if (scale && scale.x) {
      const groupScale = chartscale({domain: props.barGroups, range: [0, scale.x.bandwidth()], scaleType: "band"});
      setBarGroupScale({x: groupScale});
    }
  }, [props.barGroups, scale]);

  return (
    <ChartContainer className={props.className} ref={containerRef} data={props.data} loading={props.loading} pageStyle={props.pageStyle}
    domain={props.domain} margin={props.margin} chartProps={props.chartProps} barPadding={0.3} onMouseLeave={props.onMouseLeave}
    handleScale={handleScale} handleHeight={handleHeight} handleWidth={handleWidth} handleHoverMouseIn={props.handleHoverMouseIn} handleHoverMouseOut={props.handleHoverMouseOut}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      {
        props.data && scale && scale.x ? 
        props.data.map(d => {
          return ( 
          <g transform={`translate(${scale.x(d.date)}, 0)`}>
            <BarGroup
            data={d}
            barGroupScale={barGroupScale}
            colors={props.colors}
            height={height}
            barGroups={props.barGroups}
            scale={scale}
            mouseOverClass={props.mouseOverClass} 
            handleMouseOver={props.handleMouseOver}
            ></BarGroup>
          </g>);
        }) 
        : <></>
      }
      {props.children}
    </ChartContainer>
  );

}

export default BarChart