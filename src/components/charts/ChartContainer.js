import { forwardRef, useRef, useState, useEffect, Fragment, createContext } from "react";
import { useSelector } from "react-redux";
import { selectWindowDimensions } from '../../store/window'
import { selectLoading } from '../../store/pool'
import chartscale from '../../helpers/chartscale'
import { Axis } from "./Axis";
import Loader from './Loader'
import { MouseOverMarker } from './MouseOverMarker'
import CurrentPriceLine from "./CurrentPriceLine";
import styles from '../../styles/modules/charts/Chart.module.css'

const Axes = (props) => {

    return (<Fragment>
      <Axis 
        scale={props.scaleBottom || props.scale} 
        width={props.width} height={props.height} 
        margin={props.margin} supressTickText={props.supressTickText}
        axisType="bottom" scaleType={props.scaleTypeX || "linear"} dataType={props.dataTypeX ||  "number"}>
      </Axis>
      <Axis 
        scale={props.scaleLeft || props.scale} 
        width={props.width} height={props.height} 
        margin={props.margin} supressTickText={props.supressTickText}
        axisType="left" scaleType={props.scaleTypeY || "linear"} dataType={props.dataTypeY ||  "number"} textAnchor="end">
       </Axis>
       <Axis 
        scale={props.scaleRight} 
        width={props.width} height={props.height} 
        margin={props.margin} supressTickText={props.supressTickText}
        axisType="right" scaleType={props.scaleTypeYRight || "linear"} dataType={props.dataTypeYRight ||  "number"} 
        >
       </Axis>
    </Fragment>);
}

const AxesLabels = (props) => {

  const yLabel = !props.loading && props.height > 0 && props.margin && props.margin.left ? props.ylabel : "";
  const yLabelRight = !props.loading && props.height > 0 && props.margin && props.margin.right ? props.ylabelRight : "";

  return (
    <g>
      <text 
        className={styles["y-axis-label"]}
        x={-props.height + (props.height / 2)} y={-props.margin.left / 1.5}
        textAnchor="middle" transform="rotate(-90)">{yLabel}
      </text>
      <text 
        className={`${styles["y-axis-label"]} ${styles["y-axis-label-right"]}`}
        x={-props.height + props.height / 2} y={ props.width + props.margin.left - (10)}
        textAnchor="middle" transform="rotate(-90)">{yLabelRight}
      </text>
    </g>
  )
}

export const ChartContext = createContext();

const ChartContainer = forwardRef((props, ref) => {

  const windowDim = useSelector(selectWindowDimensions);
  const [chartProps, setChartProps] = useState();
  const loading = useSelector(selectLoading);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState();
  const [translate, setTranslate] = useState();
  const [margin, setMargin] = useState(props.margin || {top: 20, right: 30, bottom: 30, left: 70});

  const chartContainerRef = useRef();

  useEffect(() => {
    const defaultProps = { scaleTypeX: "linear", scaleTypeY:"linear", scaleTypeYRight: "linear",
    dataTypeX: "date", dataTypeY: "number", ylabel: "", xlabel: "", ylabelRight: "", supressTickText: false, barPadding: 0.3 };
    setChartProps({...defaultProps, ...props.chartProps});

  }, [props.chartProps]);

  useEffect(() => {

    if (ref.current.clientWidth && props.domain && props.data && chartProps) {

      const margin = props.margin || {top: 20, right: 30, bottom: 30, left: 70};
      const width = ref.current.clientWidth - margin.left - margin.right;
      const height = ref.current.clientHeight - margin.top - margin.bottom;

      setMargin(margin);
      setWidth(width);
      setHeight(height);
      setTranslate("translate("+ margin.left +"," + margin.top + ")");

      const x = chartscale({domain: props.domain.x, range: [0, width], scaleType: chartProps.scaleTypeX || "linear", barPadding: chartProps.barPadding || 0});
      const y = chartscale({domain: props.domain.y, range:[height, 0], scaleType: chartProps.scaleTypeY || "linear"});
      const yRight = props.domain.hasOwnProperty('yRight') ? chartscale({domain: props.domain.yRight, range:[height, 0], scaleType: chartProps.scaleTypeYRight || "linear"}) : null;
      setScale({x: x, y: y, yRight: yRight });
    }

  }, [windowDim, props.domain, props.data, ref, chartProps, props.margin]);

  useEffect(() => {
    if (props.handleScale) { props.handleScale(scale, chartProps) };
  }, [scale, chartProps]);

  useEffect(() => {
    if (props.handleWidth) { props.handleWidth(width) };
  }, [width]);

  useEffect(() => {
    if (props.handleHeight) { props.handleHeight(height) };
  }, [height]);

  if (loading || props.loading) {
    return (
      <div className={`${props.className}`} ref={ref}>
        <svg className={"chart-container-svg"}>
          <Loader cx={"50%"} cy={"50%"} loading={props.loading || loading} pageStyle={props.pageStyle}></Loader>
        </svg>
      </div>
    )
  }

  return (
    <ChartContext.Provider value={{ scale: scale, chartContainer: chartContainerRef.current, chartWidth: width, chartHeight: height}}>
      <div className={`${styles["chart-container"]} ${props.className}`} ref={ref} onMouseLeave={props.onMouseLeave}>
        <svg>
          <rect className={styles[`mouse-over-container`]} x={margin.left} y={margin.top} 
            width={width} height={height} ref={chartContainerRef}></rect>
          <g transform={translate}>
          <Axes scale={scale} scaleRight={scale && scale.yRight && scale.x ? {x: scale.x, y: scale.yRight} : null}
                width={width} height={height} supressTickText={chartProps && chartProps.supressTickText ? chartProps.supressTickText : false }
                margin={margin} chartProps={chartProps} scaleTypeX={chartProps && chartProps.scaleTypeX ? chartProps.scaleTypeX : "linear"}
                scaleTypeY={chartProps && chartProps.scaleTypeY ? chartProps.scaleTypeY : "linear"}
                dataTypeX={chartProps && chartProps.dataTypeX ? chartProps.dataTypeX : "number"}
                dataTypeY={chartProps && chartProps.dataTypeY ? chartProps.dataTypeY : "number"}
                scaleTypeYRight={chartProps && chartProps.scaleTypeYRight ? chartProps.scaleTypeYRight : "linear"}
                dataTypeYRight={chartProps && chartProps.dataTypeYRight ? chartProps.dataTypeYRight : "number"}>
          </Axes>
          <AxesLabels ylabel={chartProps && chartProps.ylabel ? chartProps.ylabel : ""} xlabel={chartProps && chartProps.xlabel ? chartProps.xlabel : ""} ylabelRight={chartProps && chartProps.ylabelRight ? chartProps.ylabelRight : ""}
                margin={margin} height={height} 
                width={width}>
          </AxesLabels>
          {props.children}
          <MouseOverMarker mouseOverMarker={props.mouseOverMarker} mouseOverMarkerPos={props.mouseOverMarkerPos}
            mouseOverMarkerPosX={props.mouseOverMarkerPosX || 0}  mouseOverMarkerPosY={ height + props.mouseOverMarkerPosY || height +20} pageStyle={props.pageStyle}
            width={width} height={height} scale={scale} mouseOverTextExtended={props.mouseOverTextExtended}
            mouseOverText={props.mouseOverText || []} handleMouseOver={props.handleMouseOver} handleHoverMouseIn={props.handleHoverMouseIn} handleHoverMouseOut={props.handleHoverMouseOut}
          ></MouseOverMarker>
          <CurrentPriceLine price={props.price} domain={props.domain} scale={scale} currentPriceLine={props.currentPriceLine} pageStyle={props.pageStyle}></CurrentPriceLine>
          <Loader cx={"50%"} cy={"50%"} loading={props.loading || loading}></Loader>
          </g>
        </svg>
    </div> 
   </ChartContext.Provider>
  )
});

export default ChartContainer