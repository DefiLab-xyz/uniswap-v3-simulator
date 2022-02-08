
// external libs
import { useState, useEffect, useRef, useCallback } from "react"
import { useSelector } from "react-redux"
import { bisector } from 'd3-array'

// internal helpers
import styles from '../styles/modules/StrategyOverview.module.css'
import { maxInArray, parsePrice } from "../helpers/numbers"
// import { V3MaxLimit, V3MinLimit } from "../helpers/uniswap/strategies"

// Data //
import { selectCurrentPrice, selectBaseToken, selectQuoteToken } from "../store/pool"
import { selectInvestment } from "../store/investment"
import { selectStrategies } from "../store/strategies"
import { selectStrategyRanges, selectSelectedStrategyRanges } from "../store/strategyRanges"
import { genChartData, genV3StrategyData, genSelectedChartData, genSelectedStrategyData } from "../helpers/uniswap/strategiesChartData"

// Components //
import { LineChart, LineChartDoubleAxis } from "../components/charts/LineChart"
import StrategyDrag from "../components/charts/StrategyDrag"
import { ConcentratedLiquidityMultiplier, StrategyRangeSize, StrategyTokenRatio } from "../components/StrategyIndicators"
import { ToggleButtonsFlex } from "../components/ButtonList"

const Title = (props) => {

  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  
  return (
    <div class={`title ${styles['title']}`}>
      <span>{`Asset Value (excl. fees) vs ${baseToken.symbol} / ${quoteToken.symbol} Price`}</span>
    </div>
  );
}


const StrategyOverviewChart = (props) => {

  const strategies = useSelector(selectStrategies);
  const baseToken = useSelector(selectBaseToken);
  const [chartData, setChartData] = useState([]);
  const [v3StrategyData, setV3StrategyData] = useState([]);

  const margin = {top: 20, right: 30, bottom: 120, left: 70};
  const chartProps = { scaleTypeX: "linear", scaleTypeY:"linear", 
  dataTypeX: "number", dataTypeY: "number", ylabel: `Asset Value ${baseToken.symbol}` , xlabel: "" }

  useEffect(() => {
    if (props.v3StrategyData) {
      const strategyData = genSelectedStrategyData(props.v3StrategyData, strategies);
      setV3StrategyData(strategyData);
    }
  }, [strategies, props.v3StrategyData]);

  useEffect(() => {
    if (props.chartData) {
      const chartData = genSelectedChartData(props.chartData, strategies);
      setChartData(chartData);
    }
  }, [strategies, props.chartData]);

  return (    
  <LineChart
    className={`${styles['chart']} ${styles['strategy-chart']} inner-glow`}
    data={chartData.data} domain={props.chartDomain}
    avgLine={true} mouseOverMarker={true} 
    chartProps={chartProps} colors={chartData.colors}
    currentPriceLine={true} margin={margin}>
      <StrategyDrag data={v3StrategyData.data} colors={v3StrategyData.colors} ids={v3StrategyData.ids} domain={props.chartDomain} ></StrategyDrag>
  </LineChart>
  )
}

const StrategyOverviewIndicators = (props) => {

  const selectedStrategies = useSelector(selectSelectedStrategyRanges);
  return (
    <div className={`${styles['strategy-indicators']}`}>
      <ConcentratedLiquidityMultiplier strategies={selectedStrategies}></ConcentratedLiquidityMultiplier>
      <StrategyRangeSize strategies={selectedStrategies}></StrategyRangeSize>
      <StrategyTokenRatio chartData={props.chartData}></StrategyTokenRatio>
    </div>
  )
}

const StrategyToggle = (props) => {

  const strategies = useSelector(selectStrategyRanges);
  const buttons = strategies.map( d => {
    return {id: d.id, label: d.name, style: {color: d.color}}
  });

  const handleStrategyChange = (strategy) => {
    if (props.handleStrategyChange) props.handleStrategyChange(strategy);
  }

  useEffect(() => {
    handleStrategyChange(buttons[0]);
  }, [])

  return (
   <ToggleButtonsFlex buttons={buttons} className={styles["strategy-buttons"]} handleToggle={handleStrategyChange}></ToggleButtonsFlex>
  )
}


const TokenRatioChart = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);
  const quoteToken = useSelector(selectQuoteToken);
  const baseToken = useSelector(selectBaseToken);
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [maxToken, setMaxToken] = useState();
  const [minToken, setMinToken] = useState();
  const [hoverVals, setHoverVals] = useState();

  const margin = {top: 20, right: 90, bottom: 140, left: 70};

  const chartProps = { dataTypeX: "number", dataTypeY: "number", dataTypeYRight: "number", 
  ylabel: `Qty ${quoteToken.symbol}` , ylabelRight: `Qty ${baseToken.symbol}` , xlabel: "", 
  yScaleKey: "token", yScaleKeyRight: "base" }

  const handleHover = (xEvent, data, scale) => {

    if (scale ) {
      const bisect = bisector(d => d.x);
      const idx = bisect.left(data[0], parseFloat(scale.x.invert(xEvent)));
      const x = `Price: ${parsePrice(data[0][idx].x)} ${props.base}`
      const y1 = `${parsePrice(data[0][idx].token)} ${props.token}`
      const y2 = `${parsePrice(data[0][idx].base)} ${props.base}`

      setHoverVals([x, y1, y2]);
    }
  }
  
  useEffect(() => {

    if (props.chartData && props.strategyLimits) {

      const filteredData = props.chartData.filter((d, i) => {
        const min = Math.min(props.strategyLimits.min * 0.6, currentPrice * 0.6);
        const max = Math.max(props.strategyLimits.max * 1.6, currentPrice * 1.6);
        return parseFloat(d.x) > min && parseFloat(d.x) < max;
      });

      const xMin = Math.min(...filteredData.map(d => d.x));
      const xMax = Math.max(...filteredData.map(d => d.x));
      const yMax1 = Math.max(...filteredData.map(d => d.token));
      const yMax2 = Math.max(...filteredData.map(d => d.base));

      setChartData(filteredData);
      setChartDomain({x: [xMin, xMax], y: [0, yMax1 * 1.03], yRight: [0, yMax2 * 1.03]});
      setMaxToken(yMax2);
      setMinToken(yMax1);
      
    }

  }, [currentPrice, props.chartData, props.strategyLimits]);
  
  return (
    <LineChartDoubleAxis  className={`${styles['token-ratio-chart']} inner-glow`}
    data={[chartData]} domain={chartDomain} lineType="area"
    chartProps={chartProps} colors={["rgb(238, 175, 246)", "rgb(249, 193, 160)"]}
    currentPriceLine={true} margin={margin} mouseOverMarker={true}>
    </LineChartDoubleAxis>
  )
}

const PositionBreakdown = (props) => {

  const [strategyLimits, setStrategyLimits] = useState();

  useEffect(() => {
    if (props.selectedStrategy && props.selectedStrategy.inputs) {
      setStrategyLimits({min: props.selectedStrategy.inputs.min.value, max: props.selectedStrategy.inputs.max.value })
    }
  }, [props.selectedStrategy])

  return (
    <div className={`${styles["position-breakdown-container"]} inner-glow`}>
        <TokenRatioChart chartData={props.chartData} strategy={props.selectedStrategy} strategyLimits={strategyLimits}></TokenRatioChart>
    </div>
  )

}


const StrategyOverview = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);
  const investment = useSelector(selectInvestment);
  const strategies = useSelector(selectStrategies);
  const strategyRanges = useSelector(selectStrategyRanges);

  const [chartData, setChartData] = useState();
  const [v3StrategyData, setV3StrategyData] = useState();
  const [chartDomain, setChartDomain] = useState();

  const [selectedStrategyToggle, setSelectedStrategyToggle] = useState();
  const [selectedStrategyChartData, setSelectedStrategyChartData] = useState();

  const updateSelectedStrategyToggle = (strategy) => {
    const selected = strategyRanges.find(d => d.id === strategy.id);
    setSelectedStrategyToggle(selected);
  }

  useEffect(() => {
    setChartData(genChartData(currentPrice, investment, strategyRanges, strategies));
  }, [currentPrice, investment, strategies, strategyRanges]);

  useEffect(() => {
    if (chartData && selectedStrategyToggle) {
      const selectedChartData = chartData.find(d => d.id === selectedStrategyToggle.id)
      setSelectedStrategyChartData(selectedChartData.data);
    }
  }, [chartData, selectedStrategyToggle])

  useEffect(() => {
    if (chartData) {
      setV3StrategyData(genV3StrategyData(currentPrice, investment, strategyRanges, strategies, chartData));
    }
  }, [chartData, currentPrice, investment, strategies, strategyRanges]);

  useEffect(() => {
    if (chartData && chartData.length) {
      const x = maxInArray(chartData.map(d => d.data), 'x');
      const y = maxInArray(chartData.map(d => d.data), 'y');
      setChartDomain({x: [0, x], y: [0, y]});
    }
  }, [chartData]);

  return (
    <div className={`${styles['strategy-overview-container']} dashboard-section outer-glow`}>
      <Title></Title>
      <StrategyOverviewChart chartData={chartData} v3StrategyData={v3StrategyData} chartDomain={chartDomain}></StrategyOverviewChart>
      <StrategyOverviewIndicators chartData={chartData}></StrategyOverviewIndicators>
      <StrategyToggle handleStrategyChange={updateSelectedStrategyToggle}></StrategyToggle>
      <PositionBreakdown selectedStrategy={selectedStrategyToggle} chartData={selectedStrategyChartData}></PositionBreakdown>
    </div>
  )
}

export default StrategyOverview