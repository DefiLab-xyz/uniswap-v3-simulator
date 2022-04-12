import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/modules/StrategyBacktest.module.css'

import { liquidityForStrategy, tokensForStrategy } from '../helpers/uniswap/liquidity';
import { maxInArray, parsePrice } from '../helpers/numbers';
import { calcFees, pivotFeeData, backtestIndicators } from '../helpers/uniswap/backtest';

import { getPoolHourData } from '../api/thegraph/uniPoolHourDatas';

import { selectBaseToken, selectBaseTokenId, selectPool, selectPoolID } from '../store/pool';
import { selectProtocolId } from '../store/protocol';
import {  selectSelectedStrategyRanges } from '../store/strategyRanges';
import { selectInvestment } from '../store/investment';
import { selectSelectedEditableStrategyRanges, selectEditableStrategyRanges } from '../store/strategyRanges';
import { selectTokenRatios } from '../store/tokenRatios'

import { BarChartGrouped } from '../components/charts/BarChart';
import { MouseOverText } from '../components/charts/MouseOverMarker';
import { ToggleButtonsFlex } from '../components/ButtonList';
import BacktestIndicators from '../components/uniswap/BacktestIndicators';
import { BacktestTotalReturn, BacktestTotalReturnPercent } from '../components/uniswap/BacktestTotalReturn';
import RangeSlider from '../components/RangeSlider';

const fromDateForHourlyData = (days) => {
  const date = new Date();
  return Math.round( (date.setDate(date.getDate() - days) / 1000 ));
}


const StrategyToggle = (props) => {
  
  const strategies = useSelector(selectSelectedEditableStrategyRanges);

  const buttons = strategies.map( d => {
    return {id: d.id, label: d.name, style: {color: d.color}}
  });

  const handleToggle = (strategy) => {
    if (props.handleToggle) props.handleToggle(strategy);
  }

  return (
    <div className={styles["strategy-toggle-container"]}>
      <ToggleButtonsFlex buttons={buttons} className={styles["strategy-toggle"]} handleToggle={handleToggle}></ToggleButtonsFlex>
    </div>
   
  )
}

const StrategyBreakdown = (props) => {

  return (
    <div className={props.className}>
      <BacktestTotalReturn loading={props.loading} page={props.page} className={`${styles['strategy-breakdown-chart']} ${styles['strategy-breakdown-chart-left']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} 
        classNameTitle={`${styles['strategy-breakdown-total-return-title']} sub-title`}
        data={props.data} strategy={props.strategy} totalReturnKeys={props.totalReturnKeys}>
      </BacktestTotalReturn>
      <div page={props.page} className={`${styles['strategy-breakdown-total-return-perc-title']} sub-title`}>LP Total Return %</div>
      <BacktestTotalReturnPercent loading={props.loading} className={`${styles['strategy-breakdown-chart']} ${styles['strategy-breakdown-chart-right']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
        strategyDropdownClass={styles['strategy-dropdown']} strategy={props.strategy} data={props.data} amountKey={props.amountKey}>
      </BacktestTotalReturnPercent>
    </div>
  )
}


const StrategyBacktest = (props) => {

  const pool = useSelector(selectPool);
  const poolID = useSelector(selectPoolID);
  const protocolID = useSelector(selectProtocolId);
  const baseTokenId = useSelector(selectBaseTokenId);
  const baseToken = useSelector(selectBaseToken)
  const investment = useSelector(selectInvestment);
  const strategyRanges = useSelector(selectSelectedStrategyRanges);
  const editableStrategyRanges = useSelector(selectSelectedEditableStrategyRanges);
  const tokenRatios = useSelector(selectTokenRatios);
  const [strategies, setStrategies] = useState();
  const [dataLoading, setDataLoading] = useState(true)
 
  const [days, setDays] = useState(30);
  const [hourlyPoolData, setHourlyPoolData] = useState();
  const [chartData, setChartData] = useState();
  const [indicatorsData, setIndicatorsData] = useState();
  const [selectedIndicatorsData, setSelectedIndicatorsData] = useState();
  const [selectedChartData, setSelectedChartData] = useState();
  const [selectedChartColors, setSelectedChartColors] = useState();
  const [selectedBarGroups, setSelectedBarGroups] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [mouseOverText, setMouseOverText] = useState();
  const [strategyToggled, setStrategyToggled] = useState({id: 'S1', label: 'Strategy 1'});

  const handleDaysChange = (days) => {
    setDays(days);
  }


  const genChartData = (strategyRanges, pool, investment, price, hourlyPoolData, baseTokenId, customFeeDivisor) => {
    return strategyRanges.map(d => {
      const tokenRatio = tokenRatios ? tokenRatios.find(t => d.id === t.id) : null;
      const tokens = tokensForStrategy(d.inputs.min.value, d.inputs.max.value, investment * d.leverage, price, pool.token1.decimals - pool.token0.decimals);
      const liquidity = liquidityForStrategy(price, d.inputs.min.value, d.inputs.max.value, tokens[0], tokens[1], pool.token0.decimals, pool.token1.decimals);
      const unboundedLiquidity = liquidityForStrategy(price, Math.pow(1.0001, -887220), Math.pow(1.0001, 887220), tokens[0], tokens[1], pool.token0.decimals, pool.token1.decimals);
      const fees = calcFees( hourlyPoolData, pool, baseTokenId, liquidity, unboundedLiquidity, d.inputs.min.value, d.inputs.max.value, customFeeDivisor || 1, d.leverage, investment, tokenRatio  );
      return { id: d.id, name: d.name, color: d.color, data: pivotFeeData(fees, baseTokenId, investment, d.leverage, tokenRatio) } ;
    });
  }

  const chartProps =  { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: `Daily Fees ${baseToken.symbol}`, xlabel: "", ...props.chartProps }

  useEffect(() => {
    if (props.customFeeDivisor) { setStrategies(editableStrategyRanges) } else { setStrategies(strategyRanges) }
  }, [props.customFeeDivisor, editableStrategyRanges, strategyRanges])

  // Hourly Pool Data
  useEffect(() => {
   
    const abortController = new AbortController();
    getPoolHourData(poolID, fromDateForHourlyData(days), abortController.signal, protocolID).then( d => 
      setHourlyPoolData(d && d.length ? d.reverse() : null) 
    );
    return () => { abortController.abort() };

  }, [poolID, days, protocolID]);

  // Generate Estimated Fees displayed on Backtest chart for all Strategies

  useEffect(() => {
    if (pool && pool.token0 && hourlyPoolData && hourlyPoolData.length && pool.id === hourlyPoolData[0].pool.id) {
      
      const startPrice = baseTokenId === 0 ? hourlyPoolData[0].close : 1 / hourlyPoolData[0].close;
      setChartData(genChartData(strategies, pool, investment, startPrice,  hourlyPoolData, baseTokenId, props.customFeeDivisor));
    }
  }, [baseTokenId, hourlyPoolData, investment, pool, props.customFeeDivisor, strategies]);

  // Generate chart data using selected Strategies. 
  // ChartData is restructured to fit into the required data structure for a grouped bar chart
  useEffect(() => {
    if (strategies && chartData && chartData.length) {
      // setDataLoading(true);
      let selectedDataTemp = [];
      const selectedColorsTemp = [];
      const selectedGroupsTemp = [];

      strategies.forEach(sR => {
        if (sR.selected === true) {
          const data = chartData.find( cD => cD.id === sR.id);
          if (data) {
            const latestChartData = data.data.map((dd, i) => {
              const bar = selectedDataTemp && selectedDataTemp[i] ? selectedDataTemp[i] : {};
              bar[sR.id] = dd.feeV;
              bar.date = dd.date;
              return bar;
            });

            selectedDataTemp = latestChartData;
            selectedColorsTemp.push(sR.color);
            selectedGroupsTemp.push(sR.id);
          }
        }
      });

      setSelectedChartData(selectedDataTemp,  setDataLoading(false));
      setSelectedChartColors(selectedColorsTemp);
      setSelectedBarGroups(selectedGroupsTemp);
      // setDataLoading(false);
    }
  }, [chartData, strategies]);


  // Generate backtest indicators when chartData changes
  useEffect(() => {
    if (chartData && chartData.length) {
      const customCalc = props.customFeeDivisor ? true : false
      const indicators = chartData.map( cD => {
        return {...cD, data: backtestIndicators(cD.data, investment, customCalc)};
      });
      setIndicatorsData(indicators);
    }
  }, [chartData, investment, props.customFeeDivisor]);

  useEffect(() => {
    if (strategies && strategies.length && indicatorsData && indicatorsData.length) {
      const selected = [];
      strategies.forEach( s => {
        const indicator = indicatorsData.find(d => { return d.id === s.id });
        if (indicator) selected.push(indicator)
      });

      setSelectedIndicatorsData(selected);
    }
    else {
      setSelectedIndicatorsData();
    }
  }, [strategies, indicatorsData]);

  // Update chart domain when chartData changes
  useEffect(() => {
    if (chartData && chartData.length) {
      const yMax = maxInArray(chartData.map(d => d.data), 'feeV');
      setChartDomain({x: chartData[0].data.map(d => d.date), y: [0, yMax]});
    }
  }, [chartData]);

  const handleMouseOver = (group, data, scale, groupScale) => {
    
    const groupData = chartData.find( cD => cD.id === group).data;
    const hoverData = groupData.find(gD => gD.date === data.date);
    const strategy = strategyRanges.find(sR => sR.id === group);
   
    const text = [`Date: ${data.date}`, 
    `Daily Fees:`, `${ parsePrice(hoverData.feeV / investment * 100, true)} %`,
    `${parsePrice(hoverData.feeV)} ${baseToken.symbol}`, !props.customFeeDivisor ? `${parsePrice(hoverData.feeUSD)} USD` : ""];
    setMouseOverText(text);
  }

  const handleStrategyChange = (strategy) => {
    setStrategyToggled(strategy);
  }

  return (
    <div className={`${styles['strategy-backtest-container']}
      ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}
      ${props.pageStyle ? props.pageStyle["dashboard-section"] : "dashboard-section"}`} 
      onMouseLeave={() => { setMouseOverText([])}}>
      <div className={`title ${styles['strategy-backtest-title']}`}>
        <RangeSlider className={styles['range-slider-backtest-days']} handleInputChange={handleDaysChange} min={5} max={30} value={days} step={1}></RangeSlider>
        <span>Last {days} days</span>
      </div>
      
      <BarChartGrouped className={`${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"} ${styles['strategy-backtest-chart']}`}
        onMouseLeave={() => { setMouseOverText([]) } }
        domain={chartDomain} chartProps={chartProps} loading={dataLoading}
        data={selectedChartData}
        barGroups={selectedBarGroups}
        colors={selectedChartColors}
        mouseOverClass={styles['bar-mouseover']}
        handleMouseOver={handleMouseOver}
       >
      <MouseOverText text={mouseOverText} textPosition={{x: 10, y: 10}} visibility={null}></MouseOverText>  
      </BarChartGrouped>
      <div className={`${styles["backtest-indicators-container"]}`}>
        <BacktestIndicators page={props.page} pageStyle={props.pageStyle} className={styles["backtest-indicators"]} data={selectedIndicatorsData} loading={dataLoading} supressFields={props.supressIndicatorFields}></BacktestIndicators>
        <StrategyToggle page={props.page} pageStyle={props.pageStyle} className={styles["strategy-toggle"]} handleToggle={handleStrategyChange}></StrategyToggle>
        <StrategyBreakdown loading={dataLoading} page={props.page} pageStyle={props.pageStyle} className={styles["strategy-breakdown-container"]} data={chartData} strategy={strategyToggled} totalReturnKeys={props.totalReturnKeys} amountKey={props.amountKey}></StrategyBreakdown>
      </div>

    </div>

  )
}

export default StrategyBacktest