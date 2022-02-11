
// external libs
import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import { useSelector } from "react-redux"
import { bisector } from 'd3-array'

// internal helpers
import styles from '../styles/modules/StrategyOverview.module.css'
import { maxInArray } from "../helpers/numbers"

// Data //
import { selectCurrentPrice, selectBaseToken, selectQuoteToken } from "../store/pool"
import { selectInvestment } from "../store/investment"
import { selectStrategies } from "../store/strategies"
import { selectStrategyRanges, selectSelectedStrategyRanges } from "../store/strategyRanges"
import { genChartData, genV3StrategyData, genSelectedChartData, genSelectedStrategyData } from "../helpers/uniswap/strategiesChartData"

// Components //

import { LineChart } from "../components/charts/LineChart"
import StrategyDrag from "../components/charts/StrategyDrag"
import { ConcentratedLiquidityMultiplier, StrategyRangeSize, StrategyTokenRatio } from "../components/StrategyIndicators"
import { ToggleButtonsFlex } from "../components/ButtonList"
import TokenRatioChart from "../components/uniswap/TokenRatioChart"
import TokenValueSplitChart from "../components/uniswap/TokenValueSplitChart"
import ImpermanentLossChart from "../components/uniswap/ImpermanentLossChart"

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
      <StrategyDrag data={v3StrategyData.data} colors={v3StrategyData.colors} ids={v3StrategyData.ids} domain={props.chartDomain}></StrategyDrag>
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

  return (
   <ToggleButtonsFlex buttons={buttons} className={styles["strategy-buttons"]} handleToggle={handleStrategyChange}></ToggleButtonsFlex>
  )
}


const PositionBreakdown = (props) => {

  const [strategyLimits, setStrategyLimits] = useState();
  const [tokenRatioClass, setTokenRatioClass] = useState("visible");
  const [valueSplitClass, setValueSplit] = useState("hidden");

  const handleBreakdownToggle = (toggled) => {
    if (toggled.id === "token") {
      setTokenRatioClass("visible");
      setValueSplit("hidden");
    }
    else if (toggled.id === "value") {
      setValueSplit("visible");
      setTokenRatioClass("hidden");
    }
  }

  const Title = (props) => {

    const buttons = [{id: "token", label: "Token", style: {width: 50}}, {id: "value", label: "Value", style: {width: 50}}];
  
    return (
      <div class={`sub-title ${styles['position-breakdown-title']}`}>
        <span>{`Position Breakdown By`}</span>&nbsp;&nbsp;&nbsp;
        <ToggleButtonsFlex buttons={buttons} className={styles["strategy-buttons"]} handleToggle={handleBreakdownToggle}></ToggleButtonsFlex>
      </div>
    );
  }
  
  useEffect(() => {
    if (props.selectedStrategy && props.selectedStrategy.inputs) {
      setStrategyLimits({ min: props.selectedStrategy.inputs.min.value, max: props.selectedStrategy.inputs.max.value })
    }
  }, [props.selectedStrategy])

  return (
    <Fragment>
      <Title></Title>
      <div className={`${styles["position-breakdown-container"]} inner-glow`}>
        <TokenRatioChart className={`${styles["token-ratio-chart"]} ${styles[`token-ratio-${tokenRatioClass}`]} inner-glow`} chartData={props.chartData} strategy={props.selectedStrategy} strategyLimits={strategyLimits}></TokenRatioChart>
        <TokenValueSplitChart className={`${styles["token-ratio-chart"]} ${styles[`token-value-${valueSplitClass}`]} inner-glow`} chartData={props.chartData} strategy={props.selectedStrategy} strategyLimits={strategyLimits}></TokenValueSplitChart>
      </div>
    </Fragment>
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

  const [selectedStrategyToggle, setSelectedStrategyToggle] = useState(strategyRanges[0]);
  const [selectedStrategyChartData, setSelectedStrategyChartData] = useState();

  const updateSelectedStrategyToggle = (strategy) => {
    const selected = strategyRanges.find(d => d.id === strategy.id);
    setSelectedStrategyToggle(selected);
  }

  useEffect(() => {
    updateSelectedStrategyToggle(selectedStrategyToggle);
  }, [strategyRanges])

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
      <ImpermanentLossChart className={styles['imp-loss-chart-container']} 
        classNameTitle={styles['imp-loss-chart-title']}
        classNameDropdown={styles['imp-loss-chart-dropdown']}
        selectedStrategy={selectedStrategyToggle} data={chartData}>
      </ImpermanentLossChart>
    </div>
  )
}

export default StrategyOverview