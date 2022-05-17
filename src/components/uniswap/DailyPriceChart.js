import { Fragment, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectBaseToken, selectPool, selectPoolDayData, selectPriceBase, selectPriceToken } from "../../store/pool";
import { parsePrice } from "../../helpers/numbers";
import { selectSelectedEditableStrategyRanges, selectStrategyRangeType } from "../../store/strategyRanges";
import CandleChart from "../charts/CandleChart";
import { ChartContext } from "../charts/ChartContainer";

const dailyCandleData = (data, baseSymbol, quoteSymbol) => {

  const candleData = {}
  candleData[baseSymbol] = [];
  candleData[quoteSymbol] = [];

  data.forEach((d, i) => {

    const yesterday = data[ Math.min((data.length - 1), i + 1) ];

    const date = new Date(d.date * 1000);

    candleData[baseSymbol].push({ 
      date: date, 
      close: parseFloat(d.close) || 0, 
      open: parseFloat(yesterday.close) || 0,
      min: parseFloat(Math.min(d.close, yesterday.close)) || 0,
      max: parseFloat(Math.max(d.close, yesterday.close)) || 0,
      high: parseFloat(d.high) || 0,
      low: parseFloat(d.low) || 0,
      green: parseFloat(d.close) > parseFloat(yesterday.close) ? 1 : 0
    });

    candleData[quoteSymbol].push({ 
      date: date, 
      close: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.close) || 0, 
      open: parseFloat(yesterday.close) === 0 ? 0 : 1 / parseFloat(yesterday.close) || 0,
      min: parseFloat(d.close) === 0 ? 0 : parseFloat(Math.min(1 / d.close, 1 / yesterday.close)) || 0,
      max: parseFloat(d.close) === 0 ? 0 : parseFloat(Math.max(1 / d.close, 1 / yesterday.close)) || 0,
      high: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.low) || 0,
      low: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.high) || 0,
      green: parseFloat(d.close) > parseFloat(yesterday.close) ? 1 : 0
    });

  });

  return candleData;
}

const StrategyRangeOverlay = (props) => {
  return (
    <g className={"strategy-range-overlay"}>
      <rect
      x={props.line.x}
      y={props.line.y}
      width={props.line.width}
      height={props.line.height}
      fill={props.color}
      stroke={0}
      fillOpacity={0.1}>
    </rect>
    <line x1={props.line.x} x2={props.line.x + props.line.width}  
      y1={props.line.y} y2={props.line.y}
      stroke={props.color} strokeWidth={0.5}>
    </line>
    <line x1={props.line.x} x2={props.line.x + props.line.width}  
      y1={props.line.y + props.line.height} y2={props.line.y + props.line.height}
      stroke={props.color} strokeWidth={0.5}>
    </line>
    </g>
    
  )
}

const StrategyOverlays = (props) => {

  const chartContextData = useContext(ChartContext);
  const strategyType = useSelector(selectStrategyRangeType);

  const rangeValFromPercent = (currentPrice, strategy, key) => {
    return parsePrice(currentPrice + (currentPrice * parseFloat(strategy.inputs[key].percent / 100)))
  }

  if (props.strategyRanges && chartContextData && chartContextData.chartWidth && chartContextData.scale) {
    return (
      props.strategyRanges.map(d => {

        const min = strategyType === 'percent' && props.entryPrice ? rangeValFromPercent(props.entryPrice, d, 'min') : d.inputs.min.value;
        const max = strategyType === 'percent' && props.entryPrice ? rangeValFromPercent(props.entryPrice, d, 'max') : d.inputs.max.value;

        return <StrategyRangeOverlay 
          line={{ x: 0, width: chartContextData.chartWidth , y: chartContextData.scale.y(max), height: chartContextData.scale.y(min) - chartContextData.scale.y(max)}}
          color={d.color}>
          </StrategyRangeOverlay>
      })
    )
  }
  
  return <Fragment></Fragment>
}
 
 
 export default function DailyPriceChart (props) {

  const dailyPrices = useSelector(selectPoolDayData);
  const pool = useSelector(selectPool);
  const strategyRanges = useSelector(selectSelectedEditableStrategyRanges);
  const priceBase = useSelector(selectPriceBase);
  const priceToken = useSelector(selectPriceToken);
  const baseToken = useSelector(selectBaseToken);

  const [candleData, setCandleData] = useState();
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [mouseOverText, setMouseOverText] = useState();

  const chartProps = { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: `Price ${baseToken.symbol}` , xlabel: "" }

  useEffect(() => {
    if (dailyPrices && pool) {
      setCandleData(dailyCandleData(dailyPrices, priceBase , priceToken));
    }
  }, [dailyPrices, pool, priceBase, priceToken]);

  useEffect(() => {
    if (baseToken && candleData && candleData[baseToken.symbol]) {

      const newChartData = candleData[baseToken.symbol];
      if (props.days && props.days > 1 && newChartData.length - props.days > 0) {
        setChartData(newChartData.slice(0, props.days));
       
      }
      else {
        setChartData(newChartData);
      }
     
    }
  }, [baseToken, candleData, props.days]);



  const handleMouseOver = (xEvent, scale) => {

    if (chartData && chartData[0] && scale) {

      const dates = chartData.map( d => d.date ); 
      const idx = dates.findIndex(d => d === scale.x.invert(xEvent));

      if (idx >= 0) {
        const date = new Date(chartData[idx].date);
        const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
  
        const x = `Date: ${formattedDate}`
        const close = `Close: ${parsePrice(chartData[idx].close)}`;
        const open = `Open: ${parsePrice(chartData[idx].open)}`;
        const high = `High: ${parsePrice(chartData[idx].high)}`;
        const low = `Low: ${parsePrice(chartData[idx].low)}`;
  
        setMouseOverText([x, close, open, high, low]);
      }
    }
  }

  useEffect(() => {

    if ( chartData && strategyRanges && pool && pool.normStd ) {
      const selectedStrategies = strategyRanges.filter(d => d.selected === true && d.id !== 'v2');
      const additionalChecks = props.minMaxVals ? props.minMaxVals : [];
      const yMax = Math.max(...chartData.map(d => d.high), ...selectedStrategies.map(d => d.inputs.max.value), ...additionalChecks);
      const yMin = Math.min(...chartData.map(d => d.low), ...selectedStrategies.map(d => d.inputs.min.value), ...additionalChecks);

      if (pool.normStd === 1) {
        setChartDomain({x: chartData.map(d => d.date).reverse(), y: [yMin * .9 , yMax * 1.1]});
      }
      else {
        setChartDomain({x: chartData.map(d => d.date).reverse(), y: [yMin * (1 - (pool.normStd / 100)) , yMax * (1 + (pool.normStd / 100))]});
      }
    }
  }, [strategyRanges, chartData, pool, props.minMaxVals])

  return (
    <CandleChart
      className={`${props.className} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} 
      mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}
      data={chartData} domain={chartDomain}
      avgLine={false} chartProps={chartProps}
      mouseOverMarker={true}>
        <StrategyOverlays strategyRanges={strategyRanges} entryPrice={props.entryPrice} ></StrategyOverlays>
        {props.children}
    </CandleChart>
  )
  
}