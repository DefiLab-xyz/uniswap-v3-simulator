import { useEffect, useState, useCallback, useContext, Fragment } from 'react'
import { ChartContext } from '../charts/ChartContainer';
import { useSelector } from 'react-redux';
import { selectBaseToken, selectBaseTokenId, selectCurrentPrice, selectLiquidity, selectPool, selectQuoteToken } from '../../store/pool';
import { selectStrategyRangeMinValues, selectStrategyRangeMaxValues, selectSelectedEditableStrategyRanges} from '../../store/strategyRanges'
import { filterTicks, getTickFromPrice, getPriceFromTick } from '../../helpers/uniswap/liquidity'
import BarChart from '../charts/BarChart';
import { parsePrice, formatLargeNumber } from '../../helpers/numbers';
import { Line } from '../charts/Line';

const genDomain = (data, baseSelected, minVals, maxVals) => {

  const firstRecord = data[0];
  const lastRecord = data[(data.length - 1)];

  const min0 = minVals && minVals.length ? Math.min(...minVals, lastRecord.tickIdx1) : lastRecord.tickIdx1;
  const max0 = maxVals && minVals.length ? Math.max(...maxVals, (firstRecord.tickIdx1 + firstRecord.width)) : firstRecord.tickIdx1 + firstRecord.width;

  const min1 = minVals && minVals.length ? Math.min(...minVals, firstRecord.tickIdx0) : firstRecord.tickIdx0;
  const max1 = maxVals && minVals.length ? Math.max(...maxVals, (lastRecord.tickIdx0 + lastRecord.width)) : lastRecord.tickIdx0 + lastRecord.width;

  const xDomain =  baseSelected === 1 ? [min1, max1] : [min0, max0]; 
  const liquidity = Array.from(data, d => parseFloat(d.liquidity));
  const yDomain = [Math.min(...liquidity), Math.max(...liquidity)];
  return { x: xDomain, y: yDomain }

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
      strokeWidth={"1px"}
      strokeOpacity={props.strokeOpacity || 0}
      fillOpacity={props.fillOpacity || 0.1}>
    </rect>
    {/* <line x1={props.line.x} x2={props.line.x + props.line.width}  
      y1={props.line.y} y2={props.line.y}
      stroke={props.color} strokeWidth={0.5}>
    </line>
    <line x1={props.line.x} x2={props.line.x + props.line.width}  
      y1={props.line.y + props.line.height} y2={props.line.y + props.line.height}
      stroke={props.color} strokeWidth={0.5}>
    </line> */}
    </g>
    
  )
}

const StrategyOverlays = (props) => {

  const chartContextData = useContext(ChartContext);

  if (props.strategyRanges && chartContextData && chartContextData.chartWidth && chartContextData.scale) {
    return (
      props.strategyRanges.map(d => {

        const min = getTickFromPrice(d.inputs.min.value, props.pool, props.baseTokenId);
        const max = getTickFromPrice(d.inputs.max.value, props.pool, props.baseTokenId);

        return <StrategyRangeOverlay
          fillOpacity={props.fillOpacity} strokeOpacity={props.strokeOpacity} 
          line={{ x: chartContextData.scale.x(min), y: 0,  
            height: chartContextData.chartHeight , width: chartContextData.scale.x(max) - chartContextData.scale.x(min) }}
          color={d.color}>
          </StrategyRangeOverlay>
      })
    )
  }
  
  return <Fragment></Fragment>
}

export default function LiquidityDensityChart (props) {

  const liquidityData = useSelector(selectLiquidity);
  const pool =  useSelector(selectPool);
  const strategyMinRanges = useSelector(selectStrategyRangeMinValues);
  const strategyMaxRanges = useSelector(selectStrategyRangeMaxValues);
  const baseTokenId = useSelector(selectBaseTokenId);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const currentPrice = useSelector(selectCurrentPrice);
  const selectedRanges = useSelector(selectSelectedEditableStrategyRanges);

  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [mouseOverText, setMouseOverText] = useState();

  const handleMouseOver = (xEvent, scale, chartContextData) => {

    const findChartDataIndex = (data, tick) => {
      let index = -1;
      for (let i = 0; i < data.length; i += 1) {
        if (data[i] >= tick) { index = i; }
        else { break; }
      }
      return index;
    }

    let tick;
    const bisectData = chartData.map(cD => cD.tickIdx1);
  
    if (chartContextData && chartContextData.chartWidth) {
      tick = ((((chartDomain.x[1] - chartDomain.x[0]) * xEvent) /  chartContextData.chartWidth)) + chartDomain.x[0];
    }

    const basePrice = parsePrice(getPriceFromTick(tick, pool, baseTokenId));
    const quotePrice = parsePrice( 1 / basePrice );
    const dataRow = findChartDataIndex(bisectData, parseInt(tick));
    const currentPriceX = scale.x(currentPrice);

    // const tvl = currentPriceX < xEvent && dataRow >= 0 ? chartData[dataRow].tvlAmount0 : chartData[dataRow].tvlAmount1;
    // const symbol = currentPriceX < xEvent && dataRow >= 0 ? baseToken.symbol : quoteToken.symbol;
    // console.log(chartData[dataRow].tvlAmount0,chartData[dataRow].tvlAmount1)
    setMouseOverText([`Price in ${baseToken.symbol}: ${basePrice} `, 
    `Price in ${quoteToken.symbol}: ${quotePrice} `,
    // `TVL in ${symbol}: ${formatLargeNumber(tvl)}`
    ]);
  
  }

  const calcBarWidth = (d, props) => {
    return (props.width * d.width) / (props.domain.x[1] - props.domain.x[0]);
  }

  const handleChartProps = useCallback(() => {
    return { scaleTypeX: "linear", scaleTypeY:"linear", xProp: baseTokenId === 1 ?  "tickIdx0" : "tickIdx1",
    yProp: "liquidity", dataTypeX: "number", dataTypeY: "number", ylabel: `TVL` , xlabel: "Price", supressTickText: true }
  }, [baseTokenId]);

  const [chartProps, setChartProps] = useState(handleChartProps);
  const [currentPriceLineData, setCurrentPriceLineData] = useState({x1:0, x2:0})

  useEffect(() => {
    setChartProps(handleChartProps());
  }, [handleChartProps])

  useEffect(() => {
    if (liquidityData && liquidityData[0]) {
      const min = currentPrice - (pool.std * 3);
      const max = currentPrice + (pool.std * 3);
      const chartData = filterTicks(liquidityData, liquidityData[0].pool.tick, [min, max], pool, props.zoomLevel || 0.9);
      setChartData(chartData);
      setCurrentPriceLineData({x1: liquidityData[0].pool.tick, x2: liquidityData[0].pool.tick});
    }
  }, [currentPrice, liquidityData, pool, props.zoomLevel])

  useEffect(() => {
    if (chartData) {
      // const minTicks = strategyMinRanges.map( sMin => getTickFromPrice(sMin, pool, baseTokenId));
      // const maxTicks = strategyMaxRanges.map( sMax => getTickFromPrice(sMax, pool, baseTokenId));
      const domain = genDomain(chartData, baseTokenId);
      setChartDomain(domain);
    }

  }, [baseTokenId, chartData, pool, strategyMaxRanges, strategyMinRanges]);

  return (
    <BarChart
    className={`${props.className} liquidity-density-chart ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} classNames={{bar: 'bar'}}
    data={chartData} domain={chartDomain}  mouseOverMarker={true} handleMouseOver={handleMouseOver}
    mouseOverText={mouseOverText} chartProps={chartProps} barWidth={calcBarWidth}>
      <Line className="current-price-line" useParentScale={true} data={currentPriceLineData}></Line>
      <StrategyOverlays fillOpacity={props.fillOpacity} strokeOpacity={props.strokeOpacity} strategyRanges={selectedRanges} pool={pool} baseTokenId={baseTokenId}></StrategyOverlays>
  </BarChart>
  )
}