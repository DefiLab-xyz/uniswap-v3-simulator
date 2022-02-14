import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectBaseToken, selectPool, selectPoolDayData } from "../../store/pool";
import { parsePrice } from "../../helpers/numbers";
import { selectStrategyRanges } from "../../store/strategyRanges";
import CandleChart from "../charts/CandleChart";

const dailyCandleData = (data, baseSymbol, quoteSymbol) => {

  const candleData = {}
  candleData[baseSymbol] = [];
  candleData[quoteSymbol] = [];

  data.forEach((d, i) => {

    const yesterday = data[ Math.min((data.length - 1), i + 1) ];

    candleData[baseSymbol].push({ 
      date: d.date, 
      close: parseFloat(d.close) || 0, 
      open: parseFloat(yesterday.close) || 0,
      min: parseFloat(Math.min(d.close, yesterday.close)) || 0,
      max: parseFloat(Math.max(d.close, yesterday.close)) || 0,
      high: parseFloat(d.high) || 0,
      low: parseFloat(d.low) || 0,
      green: parseFloat(d.close) > parseFloat(yesterday.close) ? 1 : 0
    });

    candleData[quoteSymbol].push({ 
      date: d.date, 
      close: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.close) || 0, 
      open: parseFloat(yesterday.close) === 0 ? 0 : 1 / parseFloat(yesterday.close) || 0,
      min: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(Math.min(d.close, yesterday.close)) || 0,
      max: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(Math.max(d.close, yesterday.close)) || 0,
      high: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.high) || 0,
      low: parseFloat(d.close) === 0 ? 0 : 1 / parseFloat(d.low) || 0,
      green: parseFloat(d.close) > parseFloat(yesterday.close) ? 1 : 0
    });

  });

  return candleData;
}
 
 
 export default function DailyPriceChart (props) {

  const dailyPrices = useSelector(selectPoolDayData);
  const pool = useSelector(selectPool);
  const strategyRanges = useSelector(selectStrategyRanges);
  const baseToken = useSelector(selectBaseToken);
  const [candleData, setCandleData] = useState();
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [mouseOverText, setMouseOverText] = useState();

  const chartProps = { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: `Price ${baseToken.symbol}` , xlabel: "" }

  useEffect(() => {
    if (dailyPrices && pool && pool.token0) {
      setCandleData(dailyCandleData(dailyPrices, pool.token0.symbol , pool.token1.symbol));
    }
  }, [dailyPrices, pool]);

  useEffect(() => {
    if (baseToken && candleData && candleData[baseToken.symbol]) {
      setChartData(candleData[baseToken.symbol]);
    }
  }, [baseToken, candleData]);

  const handleMouseOver = (xEvent, scale) => {
    if (chartData && chartData[0] && scale) {

      const dates = chartData.map( d => d.date ); 
      const idx = dates.findIndex(d => d === scale.x.invert(xEvent));

      const date = new Date(chartData[idx].date);
      console.log(chartData[idx].date)
      const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();

      const x = `Date: ${formattedDate}`
      const close = `Close: ${parsePrice(chartData[idx].close)}`;
      const open = `Open: ${parsePrice(chartData[idx].open)}`;
      const high = `High: ${parsePrice(chartData[idx].high)}`;
      const low = `Low: ${parsePrice(chartData[idx].low)}`;

      setMouseOverText([x, close, open, high, low]);
    }
  }

  useEffect(() => {

    if ( chartData && strategyRanges && pool && pool.normStd ) {
      const selectedStrategies = strategyRanges.filter(d => d.selected === true);
      const yMax = Math.max(...chartData.map(d => d.high), ...selectedStrategies.map(d => d.inputs.max.value))
      const yMin = Math.min(...chartData.map(d => d.low), ...selectedStrategies.map(d => d.inputs.min.value))

      if (pool.normStd === 1) {
        setChartDomain({x: chartData.map(d => d.date).reverse(), y: [yMin * .9 , yMax * 1.1]});
      }
      else {
        setChartDomain({x: chartData.map(d => d.date).reverse(), y: [yMin * (1 - (pool.normStd / 100)) , yMax * (1 + (pool.normStd / 100))]});
      }
    }
  }, [strategyRanges, chartData, pool])

  return (
    <CandleChart
      className={`${props.className} inner-glow`} 
      mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}
      data={chartData} domain={chartDomain}
      avgLine={false} chartProps={chartProps}
      mouseOverMarker={true}>
    </CandleChart>
  )
  
}