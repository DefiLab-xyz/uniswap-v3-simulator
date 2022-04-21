
// external libs
import { useState, useEffect, Fragment } from "react"
import { useDispatch, useSelector } from "react-redux"

// internal helpers
import styles from '../styles/modules/StrategyOverview.module.css'
import { maxInArray, minInArray } from "../helpers/numbers"
import { genTokenRatios } from "../helpers/uniswap/strategies"
import { genChartData, genV3StrategyData } from "../helpers/uniswap/strategiesChartData"

// Data //
import { selectCurrentPrice, selectBaseToken, selectQuoteToken } from "../store/pool"
import { selectInvestment } from "../store/investment"
import { selectStrategies, selectStrategiesByIds } from "../store/strategies"
import { selectStrategyRanges, selectSelectedEditableStrategyRanges, selectEditableStrategyRanges, setTokenRatio } from "../store/strategyRanges"
import HelpText from "../data/HelpText"
// Components //
import { ConcentratedLiquidityMultiplier, StrategyRangeSize, StrategyTokenRatio } from "../components/StrategyIndicators"
import { ToggleButtonsFlex } from "../components/ButtonList"
import TokenRatioChart from "../components/uniswap/TokenRatioChart"
import TokenValueSplitChart from "../components/uniswap/TokenValueSplitChart"
import ImpermanentLossChart from "../components/uniswap/ImpermanentLossChart"
import StrategyOverviewChart from "../components/uniswap/StrategyOverviewChart"
import ToolTip from "../components/ToolTip"

const Title = (props) => {

  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const title = props.page === 'perpetual' ?  `Impermanent loss (excl. Funding rates) vs ${quoteToken.symbol} / ${baseToken.symbol} Price` :
  `Asset Value (excl. fees) vs ${quoteToken.symbol} / ${baseToken.symbol} Price`
  return (
    <div class={`title ${styles['title']}`}>
      <span>{title}</span><span className={props.pageStyle['help-icon']}>
      <ToolTip textStyle={{width: "450px", height: "fill-content", left:"-0px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].chart1}>?</ToolTip>
      </span>
    </div>
  );
}

const StrategyOverviewIndicators = (props) => {

  const selectedStrategies = useSelector(selectSelectedEditableStrategyRanges);

  return (
    <div className={`${styles['strategy-indicators']}`}>
      <ConcentratedLiquidityMultiplier page={props.page} pageStyle={props.pageStyle} strategies={selectedStrategies}></ConcentratedLiquidityMultiplier>
      <StrategyRangeSize page={props.page} pageStyle={props.pageStyle} strategies={selectedStrategies}></StrategyRangeSize>
      <StrategyTokenRatio page={props.page} pageStyle={props.pageStyle} chartData={props.chartData}></StrategyTokenRatio>
    </div>
  )
}

const StrategyToggle = (props) => {

  const strategies = useSelector(selectEditableStrategyRanges);
  
  const buttons = strategies.map( d => {
    return {id: d.id, label: d.name, style: {color: d.color}}
  });

  const handleStrategyChange = (strategy) => {
    if (props.handleStrategyChange) props.handleStrategyChange(strategy);
  }

  return (
   <ToggleButtonsFlex page={props.page} pageStyle={props.pageStyle} buttons={buttons} className={styles["strategy-buttons"]} handleToggle={handleStrategyChange}></ToggleButtonsFlex>
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
      <div class={`${props.pageStyle ? props.pageStyle["sub-title"] : "sub-title"} ${styles['position-breakdown-title']}`}>
        <span>{`Position Breakdown By`}</span>&nbsp;&nbsp;&nbsp;
        <ToggleButtonsFlex page={props.page} pageStyle={props.pageStyle} buttons={buttons} className={styles["strategy-buttons"]} handleToggle={handleBreakdownToggle}></ToggleButtonsFlex>
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
      <Title page={props.page} pageStyle={props.pageStyle}></Title>
      <div className={`${styles["position-breakdown-container"]} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}>
        <TokenRatioChart page={props.page} pageStyle={props.pageStyle} className={`${styles["token-ratio-chart"]} ${styles[`token-ratio-${tokenRatioClass}`]} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} chartData={props.chartData} strategy={props.selectedStrategy} strategyLimits={strategyLimits}></TokenRatioChart>
        <TokenValueSplitChart page={props.page} pageStyle={props.pageStyle} className={`${styles["token-ratio-chart"]} ${styles[`token-value-${valueSplitClass}`]} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} chartData={props.chartData} strategy={props.selectedStrategy} strategyLimits={strategyLimits}></TokenValueSplitChart>
      </div>
    </Fragment>
  )

}


const StrategyOverview = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);
  const investment = useSelector(selectInvestment);
  const strategiesAll = useSelector(selectStrategies);
  const strategies = props.strategies ? selectStrategiesByIds(strategiesAll, props.strategies) : strategiesAll; 
  const strategyRanges = useSelector(selectStrategyRanges);

  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();

  const [v3StrategyData, setV3StrategyData] = useState();

  const [selectedStrategyToggle, setSelectedStrategyToggle] = useState(strategyRanges[0]);
  const [selectedStrategyChartData, setSelectedStrategyChartData] = useState();
  const [strategyLimits, setStrategyLimits] = useState();

  //-------------------------------------------------------------------------------------------------
  // Asset Value Chart 
  //-------------------------------------------------------------------------------------------------

  // Generate new Asset Value chart data when input values change 
  useEffect(() => {
      const newChartData =  genChartData(currentPrice, investment, strategyRanges, strategies, props.chartDataOverride);
      setChartData(newChartData);
  }, [currentPrice, investment, props.chartDataOverride, strategies, strategyRanges]);

  // Generate V3 Strategy data used for drag controls when chart data or Strategy Range values change
  useEffect(() => {
    if (chartData) {
      setV3StrategyData(genV3StrategyData(currentPrice, investment, strategyRanges, strategies, chartData, props.chartDataOverride || 'data'));
    }
  }, [chartData, currentPrice, investment, props.chartDataOverride, strategies, strategyRanges]);

  // Generate Asset Value Chart's domain when chart data changes
  useEffect(() => {
    if (chartData && chartData.length) {

      const xMax = maxInArray(chartData.map(d => d[props.chartDataOverride || 'data']), 'x');
      const yMax = maxInArray(chartData.map(d => d[props.chartDataOverride || 'data']), 'y');
      const yMin = minInArray(chartData.map(d => d[props.chartDataOverride || 'data']), 'y');
      const xMin = minInArray(chartData.map(d => d[props.chartDataOverride || 'data']), 'x');

      setChartDomain({x: [Math.min(xMin, 0), Math.max(xMax, 0)], y: [Math.min(yMin, 0), Math.max(yMax, Math.abs(yMin * 0.2))]});
    }

  }, [chartData]);

  //-------------------------------------------------------------------------------------------------
  // Strategy Toggle
  //-------------------------------------------------------------------------------------------------

   // Toggle which Strategy is used for Position breakdown and Impermanant Loss Charts (displays one strategy at a time)
  const updateSelectedStrategyToggle = (strategy) => {
    const selected = strategyRanges.find(d => d.id === strategy.id);
    setSelectedStrategyToggle(selected);
  }

  useEffect(() => {
    updateSelectedStrategyToggle(selectedStrategyToggle);
  }, [strategyRanges]);

  // Set chart data for Position breakdown and Impermanant Loss Charts when Strategy Toggle changes
    useEffect(() => {
      if (chartData && selectedStrategyToggle) {
        const selectedChartData = chartData.find(d => d.id === selectedStrategyToggle.id);
        setSelectedStrategyChartData(selectedChartData.data);
      }
    }, [chartData, selectedStrategyToggle]);

    // save min max values of selected strategies in an object to pass to child components

    useEffect(() => {
      if (selectedStrategyToggle && selectedStrategyToggle.inputs) {
        setStrategyLimits({ min: selectedStrategyToggle.inputs.min.value, max: selectedStrategyToggle.inputs.max.value })
      }
    }, [selectedStrategyToggle])

  //-------------------------------------------------------------------------------------------------
  // Extend grid area if Asset Value Chart should display additional hover values
  //-------------------------------------------------------------------------------------------------

  useEffect(() => {

    if (props.extendedHoverData) {

      const styles = getComputedStyle(document.body);
      const docEl = document.documentElement;

      const strategyContainerRowSpan = styles.getPropertyValue("--strategy-container-row-span-extended");
      const strategyChartRowSpan = styles.getPropertyValue("--strategy-chart-row-span-extended");

      docEl.style.setProperty("--strategy-container-row-span", strategyContainerRowSpan);
      docEl.style.setProperty("--strategy-chart-row-span", strategyChartRowSpan);
    }

  }, [props.extendedHoverData]);

  return (
    <div className={`${styles['strategy-overview-container']} 
    ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}
    ${props.pageStyle ? props.pageStyle["dashboard-section"] : "dashboard-section"}`}>
      <Title page={props.page} pageStyle={props.pageStyle}></Title>
      <StrategyOverviewChart  page={props.page} pageStyle={props.pageStyle} chartData={chartData} v3StrategyData={v3StrategyData} chartDomain={chartDomain} 
        chartDataOverride={props.chartDataOverride} zeroLine={props.zeroLine} extendedHoverData={props.extendedHoverData} currentPriceLine={true}>
      </StrategyOverviewChart>
      <StrategyOverviewIndicators page={props.page} pageStyle={props.pageStyle} chartData={chartData}></StrategyOverviewIndicators>
      <StrategyToggle page={props.page} pageStyle={props.pageStyle} handleStrategyChange={updateSelectedStrategyToggle}></StrategyToggle>
      
      { props.impLossHidden ? 
      <Fragment>
         <div class={`sub-title ${styles['position-breakdown-token-ratio-title']}`}>{props.page === 'perpetual' ? "Leveraged LP Position Breakdown By Token Ratio" : "Position Breakdown By Token Ratio"}</div>
        <TokenRatioChart page={props.page} pageStyle={props.pageStyle} className={`${styles["position-breakdown-token-ratio-container"]} inner-glow`} chartData={selectedStrategyChartData} strategy={selectedStrategyToggle} strategyLimits={strategyLimits}></TokenRatioChart>
        <div class={`sub-title ${styles['position-breakdown-value-title']}`}>{props.page === 'perpetual' ? "Leveraged LP Position Breakdown By Token Value" : "Position Breakdown By Token Value"}</div>
        <TokenValueSplitChart page={props.page} pageStyle={props.pageStyle} className={`${styles["position-breakdown-value-container"]} inner-glow`} chartData={selectedStrategyChartData} strategy={selectedStrategyToggle} strategyLimits={strategyLimits}></TokenValueSplitChart>
      </Fragment> :
      <Fragment>
        <PositionBreakdown page={props.page} pageStyle={props.pageStyle} selectedStrategy={selectedStrategyToggle} chartData={selectedStrategyChartData}></PositionBreakdown>
        <ImpermanentLossChart page={props.page} pageStyle={props.pageStyle} className={styles['imp-loss-chart-container']} 
        classNameTitle={styles['imp-loss-chart-title']}
        classNameDropdown={styles['imp-loss-chart-dropdown']}
        selectedStrategy={selectedStrategyToggle} data={chartData}>
      </ImpermanentLossChart>
      </Fragment>
        
      }
      
    </div>
  )
}

export default StrategyOverview