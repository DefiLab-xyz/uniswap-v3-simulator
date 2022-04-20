import { useContext, useEffect, useState } from "react";
import { ChartContext } from "./ChartContainer";

export const Line = (props) => {
  
  const opacity = props.data && props.data.x1 && props.data.x1 < 0 ? 0 : 1;
  const [lineData, setLineData] = useState({x1: 0, x2: 0, y1: 0, y2: 0});
  const chartContextData = useContext(ChartContext);

  useEffect(() => {
    if ( chartContextData.scale && props.useParentScale && props.data) {

      const lineDataTemp = { 
        x1: props.data.x1 ? chartContextData.scale.x(props.data.x1) : 0, 
        x2: props.data.x2 ? chartContextData.scale.x(props.data.x2) : chartContextData.chartWidth || 0, 
        y1: props.data.hasOwnProperty("y1") ? chartContextData.scale.y(props.data.y1) : 0, 
        y2: props.data.hasOwnProperty("y2") ? chartContextData.scale.y(props.data.y2) : chartContextData.chartHeight || 0, 
      };
      setLineData(lineDataTemp)
    }
    else if( chartContextData.scale && !props.useParentScale && props.data) {
      const lineDataTemp = { 
        x1: props.data.x1 ? props.data.x1 : 0, 
        x2: props.data.x2 ? props.data.x2 : 0, 
        y1: props.data.y1 ? props.data.y1 : 0, 
        y2: props.data.y2 ? props.data.y2 : 0, 
      };

      setLineData(lineDataTemp)
    }
  }, [chartContextData.chartHeight, chartContextData.height, chartContextData.scale, props.data, props.useParentScale]);

  return (
    <g className={props.className}>
      <line 
        strokeWidth={props.strokeWidth || "0.7px" }
        stroke={props.stroke} 
        strokeLinecap={props.strokeLinecap || "round"}
        strokeDasharray={props.strokeDasharray}
        opacity={props.opacity || opacity}
        x1={lineData.x1}
        x2={lineData.x2}
        y1={lineData.y1}
        y2={lineData.y2}
      ></line>
    </g>
 )
}