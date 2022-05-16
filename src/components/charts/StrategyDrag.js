import { useContext, useEffect, useState, useRef } from "react";

//helpers 

import { round } from "../../helpers/numbers";

// redux store
import { selectStrategyRanges, selectStrategyRangeById, updateStrategyRangeInputVal, validateStrategyRangeValue } from "../../store/strategyRanges";
import { selectBaseToken } from "../../store/pool";

// Components
import { Lines } from "./LineChart"
import { ChartContext } from "./ChartContainer";
import { useDispatch, useSelector } from "react-redux";


const DoubleRangeHorizontal = (props) => {

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);
  const chartContextData = useContext(ChartContext);
  const [xPosition, setXPosition] = useState();
  const dragging = useRef({id: "", key: "", dragging: false});

  const startDrag = (e, className) => {    
    const strategy = className.split("-");
    setXPosition(props[`${strategy[1]}X`]); 
    dragging.current = {id: strategy[0], key: strategy[1], dragging: true};
  }

  const endDrag = (e) => { 
    dragging.current.dragging = false;
  };


  const onDrag = (e) => {

    if (dragging.current.dragging === true && props.scale && props.scale.x) {
      let xEvent = parseFloat(e.clientX) -  parseFloat(chartContextData.chartContainer.getBoundingClientRect().left);

      if (validateStrategyRangeValue(props.strategyRange, dragging.current.key, props.scale.x.invert(xEvent))) {
        setXPosition(xEvent);
        const value = props.scale.x.invert(xEvent);
        const percent = round((( value - baseToken.currentPrice) / baseToken.currentPrice) * 100, 1);
        console.log(baseToken)
        dispatch(updateStrategyRangeInputVal({id: dragging.current.id, key: dragging.current.key, value: value, percent: percent}));
      }
    }
  }

  const genControlPoints = (key) => {
      const x = dragging.current.dragging === true && dragging.current.key === key ? xPosition : props[`${key}X`];
      const y = props.y;
      const xAdj = 7;
      const yAdj = 23;
      return `M ${x} ${y}  L ${x - xAdj}, ${y - xAdj} L ${x - xAdj} ${y - yAdj} L ${x + xAdj} ${y - yAdj} L ${x + xAdj} ${y - xAdj} Z` 
  }


  return (
    <g>
      <rect  onMouseUp={ (e) => endDrag(e) }  onMouseMove={ (e) => onDrag(e) }
          x={0} y={props.y - 25} 
          width={chartContextData.chartContainer ? chartContextData.chartContainer.getBoundingClientRect().width : 0} height={30} style={{fill: "blue", opacity: 0.0}}>
      </rect>
      <g onMouseDown={ (e) => startDrag(e, `${props.id}-min`) } onMouseUp={ (e) => endDrag(e)} >
        <path d={genControlPoints("min")} strokeLinejoin="round" strokeWidth={0.8} fill={props.color} stroke={props.color} strokeOpacity={1} fillOpacity={props.fillOpacity || 0.4}></path>
      </g>
      <g onMouseDown={ (e) => startDrag(e, `${props.id}-max`) } onMouseUp={ (e) => endDrag(e)} >
        <path d={genControlPoints("max")} strokeLinejoin="round" strokeWidth={0.8} fill={props.color} stroke={props.color} strokeOpacity={1} fillOpacity={props.fillOpacity || 0.4}></path>
      </g>
    </g>

  )

}

const StrategyDragControl = (props) => {

  const strategyRanges = useSelector(selectStrategyRanges);
  const strategyRange = selectStrategyRangeById(strategyRanges, props.id);
  const [lineCoords, setLineCoords] = useState({x1: 0, x2: 0, y1: 0, y2: 0});

  useEffect(() => {
    if (props.scale && props.scale.x && strategyRange && strategyRange.inputs) {
      const x1 = props.scale.x(strategyRange.inputs.min.value);
      const x2 = props.scale.x(strategyRange.inputs.max.value);
      const y = props.y;
      setLineCoords({x1: x1, x2: x2, y1: y, y2: y});
    } 
  }, [props.scale, props.y, strategyRange]);
  

  return (
    <g className="strategy-drag-control">
      <line x1={lineCoords.x1} x2={lineCoords.x2} y1={lineCoords.y1} y2={lineCoords.y2} stroke={props.color} strokeWidth={1} strokeLinecap="round"></line>
      <line x1={lineCoords.x1} x2={lineCoords.x2} y1={lineCoords.y1} y2={lineCoords.y2} stroke={props.color} strokeWidth={4} strokeLinecap="round" strokeOpacity={0.2}></line>      
      <DoubleRangeHorizontal id={props.id} scale={props.scale} 
        maxX={lineCoords.x2} minX={lineCoords.x1} y={lineCoords.y1 - 5} color={props.color}
        strategyRange={strategyRange} fillOpacity={props.fillOpacity}>
      </DoubleRangeHorizontal>
    </g>
  )
}

const StrategyDragControls = (props) => {
  if (props.scale && props.domain && props.domain.y) {
    return (
      props.ids.map((d,i) => {
        return (<StrategyDragControl key={d} id={d} scale={props.scale} color={props.colors[i]} y={props.scale.y(props.domain.y[0]) + (50 * (i + 1) - (i * 2))} ></StrategyDragControl>)
      })
    )
  }
  else {
    return (<></>)
  }
}

const StrategyDrag = (props) => {

      const chartContextData = useContext(ChartContext);

      if (chartContextData.scale && chartContextData.scale.x && props.domain && props.data) {
        return (
          <g className="strategy-drag"> 
            <Lines colors={props.colors} data={props.data} 
            scale={chartContextData.scale} domain={props.domain}
            margin={props.margin || {top: 20, right: 30, bottom: 30, left: 70}} lineType="area"
            strokeWidth={() => { return props.page === 'perpetual' ? 0.5 : 0} } fillOpacity={props.fillOpacity}>
            </Lines>
            {
              props.hideStrategyControls ? <></> : <StrategyDragControls ids={props.ids} scale={chartContextData.scale} colors={props.colors} domain={props.domain} fillOpacity={props.fillOpacity}></StrategyDragControls>
            }
        </g>
        )
      }
      else {
        return (<></>)
      }
}

export default StrategyDrag