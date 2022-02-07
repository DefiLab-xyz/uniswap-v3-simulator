import { forwardRef, useRef, useState, useEffect, Fragment, createContext } from "react";
import { useSelector } from "react-redux";
import { selectWindowDimensions } from '../../store/window'
import { selectLoading } from '../../store/pool'
import chartscale from '../../helpers/chartscale'
import { Axis } from "./Axis";
import Loader from './Loader'
import { MouseOverMarker } from './MouseOverMarker'
import CurrentPriceLine from "./CurrentPriceLine";

const Axes = (props) => {

    return (<Fragment>
      <Axis 
        scale={props.scale} 
        width={props.width} height={props.height} 
        margin={props.margin}
        axisType="bottom" scaleType={props.chartProps.scaleTypeX || "linear"} dataType={props.chartProps.dataTypeX || "number"}>
      </Axis>
      <Axis 
        scale={props.scale} 
        width={props.width} height={props.height} 
        margin={props.margin}
        axisType="left" scaleType={props.chartProps.scaleTypeY || "linear"} dataType={props.chartProps.dataTypeY || "number"} textAnchor="end">
       </Axis>
    </Fragment>);
}

const AxesLabels = (props) => {

  const yLabel = !props.loading && props.height > 0 && props.margin && props.margin.left ? props.ylabel : "";
  return (
    <g>
      <text 
      className={"y-axis-label"}
      x={-props.height + (props.height / 2)} y={-props.margin.left / 1.5}
      textAnchor="middle" transform="rotate(-90)">{yLabel}
      </text>
    </g>
  )
}

export const ChartContext = createContext();

const ChartContainer = forwardRef((props, ref) => {

  const windowDim = useSelector(selectWindowDimensions);
  const loading = useSelector(selectLoading);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState();
  const [translate, setTranslate] = useState();
  const [margin, setMargin] = useState(props.margin || {top: 20, right: 30, bottom: 30, left: 70});

  const chartContainerRef = useRef();

  useEffect(() => {

    if (ref.current.clientWidth && props.domain && props.data && props.chartProps) {

      const margin = props.margin || {top: 20, right: 30, bottom: 30, left: 70};
      const width = ref.current.clientWidth - margin.left - margin.right;
      const height = ref.current.clientHeight - margin.top - margin.bottom;

      setMargin(margin);
      setWidth(width);
      setHeight(height);
      setTranslate("translate("+ margin.left +"," + margin.top + ")");

      const x = chartscale({domain: props.domain.x, range: [0, width], scaleType: props.chartProps.scaleTypeX || "linear"});
      const y = chartscale({domain: props.domain.y, range:[height, 0], scaleType: props.chartProps.scaleTypeY || "linear"});
     
      setScale({x: x, y: y});
    }

  }, [windowDim, props.domain, props.data, ref, props.chartProps, props.margin]);

  useEffect(() => {
    if (props.handleScale) { props.handleScale(scale) };
  }, [scale]);

  useEffect(() => {
    if (props.handleWidth) { props.handleWidth(width) };
  }, [width]);

  useEffect(() => {
    if (props.handleHeight) { props.handleHeight(height) };
  }, [height]);

  if (loading) {
    return (
      <div className={`${props.className}`} ref={ref}>
        <svg className={"chart-container-svg"}>
          <Loader cx={"50%"} cy={"50%"} loading={loading}></Loader>
        </svg>
      </div>
    )
  }

  return (
    <ChartContext.Provider value={{ scale:scale, chartContainer: chartContainerRef.current}}>
    <div className={`chart-container ${props.className}`} ref={ref}>
    <svg className={"chart-container-svg"}>
      <rect className={`mouseover-container`} x={margin.left} y={margin.top} 
        width={width} height={height} ref={chartContainerRef}></rect>
      <g className={"chart-container-g"} transform={translate}>
      <Axes scale={scale} 
            width={width} height={height} 
            margin={margin} chartProps={props.chartProps}>
      </Axes>
      <AxesLabels ylabel={props.chartProps.ylabel} xlabel={props.chartProps.ylabel} 
            margin={margin} height={height} 
            width={width}>
      </AxesLabels>
      {props.children}
      <MouseOverMarker mouseOverMarker={props.mouseOverMarker}
          width={width} height={height} scale={scale} 
          mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver}
      ></MouseOverMarker>
      <CurrentPriceLine domain={props.domain} scale={scale} currentPriceLine={props.currentPriceLine}></CurrentPriceLine>
      <Loader cx={"50%"} cy={"50%"} loading={loading}></Loader>
      </g>
    </svg>
   </div> 
   </ChartContext.Provider>
  )
});

export default ChartContainer