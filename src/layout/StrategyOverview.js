
import { useState, useEffect, useRef, useCallback } from "react"
import { useSelector } from "react-redux"
import styles from '../styles/modules/StrategyOverview.module.css'
import { maxInArray } from "../helpers/numbers"
import { V3MaxLimit, V3MinLimit } from "../helpers/uniswap/strategies"

// Data //
import { selectCurrentPrice, selectBaseToken, selectQuoteToken } from "../store/pool"
import { selectInvestment } from "../store/investment"
import { selectStrategies } from "../store/strategies"
import { selectStrategyRanges } from "../store/strategyRanges"

// Components //
import {LineChart} from "../components/charts/LineChart"
import StrategyDrag from "../components/charts/StrategyDrag"
import { ConcentratedLiquidityMultiplier, StrategyRangeSize, StrategyTokenRatio } from "../components/StrategyIndicators"

const Title = (props) => {

  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  
  return (
    <div class={`title ${styles['title']}`}>
      <span>{`Asset Value (excl. fees) vs ${baseToken.symbol} / ${quoteToken.symbol} Price`}</span>
    </div>
  );
}


const inputsForChartData = (currentPrice, investment, strategyRanges, strategies) => {
  const range1Inputs = { minPrice: strategyRanges[0].inputs.min.value, maxPrice: strategyRanges[0].inputs.max.value };
  const range2Inputs = { minPrice: strategyRanges[1].inputs.min.value, maxPrice: strategyRanges[1].inputs.max.value };
  const step = Math.max(currentPrice, (range1Inputs.maxPrice * 1.1) / 2, (range2Inputs.maxPrice * 1.1) / 2);
  const inputsAll = { investment: investment, currentPrice: currentPrice, step: step };

  return { range1Inputs: range1Inputs, range2Inputs: range2Inputs, inputsAll: inputsAll  }
}

const genChartData = (currentPrice, investment, strategyRanges, strategies) => {

  const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies);

  return strategies.map(d => {
    const inputs = d.id === 'S1' ? {...range1Inputs, ...inputsAll} : d.id === 'S2' ? {...range2Inputs, ...inputsAll} : {...inputsAll};
    return {id: d.id, data: d.genData(inputs)};
  });
}

const filterV3StrategyData = (strategyData, chartData) => {

  if (chartData) {
    const filteredData = chartData.filter( d => d.x >= strategyData.min.cx && d.x <= strategyData.max.cx );
    filteredData.push({x: strategyData.max.cx, y: strategyData.max.cy});
    filteredData.unshift({x: strategyData.min.cx, y: strategyData.min.cy});
    return filteredData;
  }

  return [];
}

const genV3StrategyData = (currentPrice, investment, strategyRanges, strategies, chartData) => {

  const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies);
  const s1DragData = {max: V3MaxLimit({...range1Inputs, ...inputsAll}), min: V3MinLimit({...range1Inputs, ...inputsAll})};
  const s2DragData = {max: V3MaxLimit({...range2Inputs, ...inputsAll}), min: V3MinLimit({...range2Inputs, ...inputsAll})};

  return [ { id: "S1" , data: filterV3StrategyData(s1DragData, chartData.find(strat => strat.id === "S1").data)} , 
  { id: "S2" , data: filterV3StrategyData(s2DragData, chartData.find(strat => strat.id === "S2").data)} ];

}

const genSelectedStrategyData = (data, strategies) => {

  const strategyDragData = [];
  const strategyDragColors = [];
  const strategyIds = [];

  data.forEach(d => {
    const strat = strategies.find(strat => strat.id === d.id);
    if (strat && strat.selected === true) {
      strategyDragData.push(d.data);
      strategyDragColors.push(strat.color);
      strategyIds.push(d.id);
    }  
  });

  return { data: strategyDragData, colors: strategyDragColors, ids: strategyIds }
}

const genSelectedChartData = (data, strategies) => {

    const chartData = [];
    const chartColors = [];

      strategies.forEach(d => {
        if (d.selected) {
          const tempdata = data.find(strat => strat.id === d.id);
          if (tempdata && tempdata.hasOwnProperty('data')) {
            chartData.push(tempdata.data);
            chartColors.push(d.color);
          }        
        }
      });

      return { data: chartData, colors: chartColors }
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
  return (
    <div></div>
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

  useEffect(() => {
    setChartData(genChartData(currentPrice, investment, strategyRanges, strategies));
  }, [currentPrice, investment, strategies, strategyRanges]);

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
      <StrategyOverviewIndicators></StrategyOverviewIndicators>
    </div>
  )
}

export default StrategyOverview