import { useSelector } from "react-redux";
import { useState, useEffect, useContext } from "react";
import {bisector} from 'd3-array'

// Helpers //
import { parsePrice } from "../../helpers/numbers";

// Data //
import { selectCurrentPrice, selectBaseToken, selectQuoteToken } from "../../store/pool"
import { ChartContext } from "../charts/ChartContainer";
import colors from '../../data/colors.json'

// Components //
import { Line } from "../charts/Line"
import { LineChartStacked } from "../charts/LineChart";


const TokenRatioInfo = (props) => {

  const chartContextData = useContext(ChartContext);

  return (
    <g>
    <circle 
    r={4} 
    cx={chartContextData.chartWidth / 1.5 - 15}
    cy={chartContextData.chartHeight + 49}
    fill="rgb(238, 175, 246)"
    stroke="rgb(238, 175, 246)"
    strokeOpacity="0.6"
    fillOpacity="0.4"
    ></circle>
    <circle 
    r={4} 
    cx={chartContextData.chartWidth / 1.5 - 15}
    cy={chartContextData.chartHeight + 69}
    fill="rgb(249, 193, 160)"
    stroke="rgb(249, 193, 160)"
    strokeOpacity="0.6"
    fillOpacity="0.4"
    ></circle>
    <text
    textAnchor="start"
    style={{fontSize: 11}}
    x={chartContextData.chartWidth / 1.5}
    y={chartContextData.chartHeight + 52}>Price &lt; Min:   &nbsp; &nbsp;{parsePrice(props.minToken)} &nbsp; {props.token}
    </text>
    <text
    textAnchor="start"
    style={{fontSize: 11}}
    x={chartContextData.chartWidth / 1.5}
    y={chartContextData.chartHeight + 72}>
      Price &gt; Max:   &nbsp;  {parsePrice(props.maxToken)} &nbsp; {props.base}
    </text>
    </g>
  )
}



const TokenValueSplitChart = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);
  const quoteToken = useSelector(selectQuoteToken);
  const baseToken = useSelector(selectBaseToken);
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [maxToken, setMaxToken] = useState();
  const [minToken, setMinToken] = useState();
  const [maxLineData, setMaxLineData] = useState({x1: 0, x2: 0});
  const [minLineData, setMinLineData] = useState({x1: 0, x2: 0});
  const [mouseOverText, setMouseOverText] = useState();

  const margin = {top: 40, right: 50, bottom: 100, left: 70};

  const chartProps = { dataTypeX: "number", dataTypeY: "number", dataTypeYRight: "number", 
  ylabel: `Value in ${baseToken.symbol}` , xlabel: ""}

  const handleMouseOver = (xEvent, scale) => {

    if (scale) {
      const bisect = bisector(d => d.x);
      const idx = bisect.left(chartData, parseFloat(scale.x.invert(xEvent)));
      const x = `Price: ${parsePrice(chartData[idx].x)} ${baseToken.symbol}`
      const y1 = `${quoteToken.symbol}: ${parsePrice(chartData[idx].l1)} ${baseToken.symbol}`
      const y2 = `${baseToken.symbol}: ${parsePrice(chartData[idx].l2)} ${baseToken.symbol}`
      setMouseOverText([x, y1, y2]);
    }
  }
  
  useEffect(() => {
    if (props.chartData) {
      const data = props.chartData.map(d => {
        return { x: parseFloat(d.x), l1: parseFloat(d.token) * parseFloat(d.x), l2: d.base } 
      });

      const xMin = Math.min(...data.map(d => d.x));
      const xMax = Math.max(...data.map(d => d.x));
      const yMin = Math.min(...data.map(d => d.l1));
      const yMax = Math.max(...data.map(d => d.l1 + d.l2));

      setChartData(data);
      setChartDomain({x: [xMin, xMax], y: [yMin, yMax]});
    }

  }, [props.chartData]);

  useEffect(() => {
    if (props.strategyLimits) {
      
      setMinLineData({x1: props.strategyLimits.min, x2: props.strategyLimits.min});
      setMaxLineData({x1: props.strategyLimits.max, x2: props.strategyLimits.max});
    }
  }, [props.strategyLimits]);
  
  return (
    <LineChartStacked className={`${props.className ? props.className : ""} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
      data={chartData} domain={chartDomain} lineType="area" keys={["l1", "l2"]}
      chartProps={chartProps} colors={colors[props.page]["tokenratio"]} fillOpacity={props.page === "perpetual" ? () => 0.85 : null}
      currentPriceLine={true} margin={margin} mouseOverMarker={true} mouseOverMarkerPos="fixed"
      mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}>
      <Line className="min-limit-line" useParentScale={true} data={minLineData} stroke={props.strategy && props.strategy.color ? props.strategy.color : "white"}></Line>
      <Line className="max-limit-line" useParentScale={true} data={maxLineData} stroke={props.strategy && props.strategy.color ? props.strategy.color : "white"}></Line>
    </LineChartStacked>
  )
}

export default TokenValueSplitChart