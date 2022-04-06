import React, { useState, useRef, useEffect } from 'react'
import ChartContainer from './ChartContainer';
import { scaleBand } from 'd3-scale';
import styles from '../../styles/modules/charts/CandleChart.module.css'

const heightScale = (height, val, domain) => {
  return (height * val) / (parseFloat(domain[1]) - parseFloat(domain[0]));
}

const Candles = (props) => {

  if (props.data && props.data.length && props.data.length >= 1 && props.scale && props.height && props.domain) {

     const rect = props.data.map((d, i) => {
      return <rect 
      className={`${styles["candle"]} ${styles[`candle-${d.green ? "green" : "red"}`]}`}
      key={`candle-${i}`}
      style={props.style}
      x={props.scale.x(d[props.xKey])}
      y={props.scale.y(d[props.yHighKey])}
      height={heightScale(props.height, (d[props.yHighKey] - d[props.yLowKey]), props.domain.y)}
      width={props.scale.x.bandwidth()}
      rx="0.5" 
      ry="0.5"></rect>});

      return (<g className={"candles"}>{rect}</g>);
  }
  else {
    return (<g className={"candles-empty"} />);
  }
  
}


const CandleChart = (props) => {

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);  
  const [fatScale, setFatScale] = useState();
  const [scale, setScale] = useState()
  const [thinScale, setThinScale] = useState();
  const containerRef = useRef();

  useEffect(() => {
    if (props.data && props.domain && width && scale ) {

      const xFat = scaleBand()
      .range([0, width])
      .domain(props.domain.x)
      .paddingInner(0.39)
      .paddingOuter(0.39);

      const xThin = scaleBand()
      .range([0, width])
      .domain(props.domain.x)
      .paddingInner(0.99)
      .paddingOuter(0.6);

      setFatScale({x: xFat, y: scale.y})
      setThinScale({x: xThin, y: scale.y})
    }

  }, [props.data, props.domain, width, scale])

  const handleScale = (scale) => {
    setScale(scale)
  }
  const handleHeight = (height) => setHeight(height);
  const handleWidth = (width) => setWidth(width);


  return (
    <ChartContainer className={props.className} ref={containerRef} data={props.data}
    domain={props.domain} margin={props.margin} chartProps={props.chartProps} 
    handleScale={handleScale} handleHeight={handleHeight} handleWidth={handleWidth}
    mouseOverMarker={props.mouseOverMarker} mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}>
      <Candles data={props.data} scale={fatScale} 
        width={width} height={height} domain={props.domain}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}}
        classNames={props.classNames}
        xKey={"date"} yLowKey={"min"} yHighKey={"max"}>
      </Candles>
      <Candles data={props.data} scale={thinScale} 
        width={width} height={height} domain={props.domain}
        margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}}
        classNames={props.classNames}
        xKey={"date"} yLowKey={"low"} yHighKey={"high"}>
      </Candles>
      {props.children}
    </ChartContainer>
  );

};

export default CandleChart