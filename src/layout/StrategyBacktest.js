import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/modules/StrategyBacktest.module.css'

import { liquidityForStrategy, tokensForStrategy } from '../helpers/uniswap/liquidity';
import { maxInArray, parsePrice } from '../helpers/numbers';
import { calcFees, pivotFeeData, backtestIndicators } from '../helpers/uniswap/backtest';

import { getPoolHourData } from '../api/thegraph/uniPoolHourDatas';

import { selectBaseToken, selectBaseTokenId, selectPool, selectPoolID } from '../store/pool';
import { selectProtocolId } from '../store/protocol';
import {  selectSelectedStrategyRanges, selectStrategyRangeType } from '../store/strategyRanges';
import { selectInvestment } from '../store/investment';
import { selectSelectedEditableStrategyRanges, selectEditableStrategyRanges } from '../store/strategyRanges';
import { selectTokenRatios } from '../store/tokenRatios'
import HelpText from '../data/HelpText';

import { BarChartGrouped } from '../components/charts/BarChart';
import { MouseOverText } from '../components/charts/MouseOverMarker';
import { ToggleButtonsFlex } from '../components/ButtonList';
import BacktestIndicators from '../components/uniswap/BacktestIndicators';
import { BacktestTotalReturn, BacktestTotalReturnPercent } from '../components/uniswap/BacktestTotalReturn';
import RangeSlider from '../components/RangeSlider';
import BacktestStrategyOverview from '../components/uniswap/BacktestStrategyOverview';
import DailyPriceChart from '../components/uniswap/DailyPriceChart';
import { Line } from '../components/charts/Line';
import ToolTip from '../components/ToolTip';


const fromDateForHourlyData = (days) => {
  const date = new Date();
  return Math.round( (date.setDate(date.getDate() - days) / 1000 ));
}


const StrategyToggle = (props) => {
  
  const strategies = useSelector(selectEditableStrategyRanges);

  const buttons = strategies.map( d => {
    return {id: d.id, label: d.name, style: {color: d.color}}
  });

  const handleToggle = (strategy) => {
    if (props.handleToggle) props.handleToggle(strategy);
  }

  return (
    <div className={styles["strategy-toggle-container"]}>
      <ToggleButtonsFlex page={props.page} pageStyle={props.pageStyle} buttons={buttons} className={styles["strategy-toggle"]} handleToggle={handleToggle}></ToggleButtonsFlex>
    </div>
   
  )
}

const StrategyBreakdown = (props) => {

  return (
    <div className={props.className}>
      <BacktestTotalReturn page={props.page} pageStyle={props.pageStyle} loading={props.loading} className={`${styles['strategy-breakdown-chart']} ${styles['strategy-breakdown-chart-left']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`} 
        classNameTitle={`${styles['strategy-breakdown-total-return-title']} sub-title`}
        data={props.data} strategy={props.strategy} totalReturnKeys={props.totalReturnKeys}>
      </BacktestTotalReturn>
      <div page={props.page} className={`${styles['strategy-breakdown-total-return-perc-title']} sub-title`}>LP Total Return %
      <ToolTip textStyle={{width: "300px", height: "fill-content", left:"-0px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].totalReturnPerc}>?</ToolTip></div>
      <BacktestTotalReturnPercent page={props.page} pageStyle={props.pageStyle} loading={props.loading} className={`${styles['strategy-breakdown-chart']} ${styles['strategy-breakdown-chart-right']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
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
  const strategyType = useSelector(selectStrategyRangeType)
  const editableStrategyRanges = useSelector(selectSelectedEditableStrategyRanges);
  const tokenRatios = useSelector(selectTokenRatios);
  const [strategies, setStrategies] = useState();
  const [dataLoading, setDataLoading] = useState(true)
 
  const [days, setDays] = useState(30);
  const [entryPrice, setEntryPrice] = useState();
  const [liquidationData, setLiquidationData] = useState();
  const [liquidationLines, setLiquidationLines] = useState([]);
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

  const rangeValFromPercent = (currentPrice, strategy, key) => {
    return parsePrice(parseFloat(currentPrice) + (parseFloat(currentPrice) * parseFloat(strategy.inputs[key].percent / 100)))
  }


  const genChartData = (strategyRanges, pool, investment, price, hourlyPoolData, baseTokenId, customFeeDivisor, type) => {

    return strategyRanges.map(d => {

      const min = type === 'percent' && d.id !== 'v2' ? rangeValFromPercent(price, d, 'min') : d.inputs.min.value;
      const max = type === 'percent' && d.id !== 'v2' ? rangeValFromPercent(price, d, 'max') : d.inputs.max.value;

      const tokenRatio = tokenRatios ? tokenRatios.find(t => d.id === t.id) : null;
      const tokens = tokensForStrategy(min, max, investment * d.leverage, price, pool.token1.decimals - pool.token0.decimals);
      const liquidity = liquidityForStrategy(price, min, max, tokens[0], tokens[1], pool.token0.decimals, pool.token1.decimals);
      const unboundedLiquidity = liquidityForStrategy(price, Math.pow(1.0001, -887220), Math.pow(1.0001, 887220), tokens[0], tokens[1], pool.token0.decimals, pool.token1.decimals);
      const fees = calcFees( hourlyPoolData, pool, baseTokenId, liquidity, unboundedLiquidity, min, max, customFeeDivisor || 1, d.leverage, investment, tokenRatio, d.hedging );
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
      setChartData(genChartData(strategies, pool, investment, startPrice,  hourlyPoolData, baseTokenId, props.customFeeDivisor, strategyType));
    }
  }, [baseTokenId, hourlyPoolData, investment, pool, props.customFeeDivisor, strategies, strategyType]);

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
        return {...cD, data: backtestIndicators(cD.data, investment, customCalc, strategies.find(d => d.id === cD.id).hedging)};
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
      setEntryPrice(chartData[0].data[0].baseClose);
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

  const handleLiquidationLines = (data) => {
    setLiquidationData(data);
  }

  // Generate data to display the point of liquidation on Daily prices chart
  useEffect(() => {
    const liquidationLinesTemp = [];
    if (liquidationData && liquidationData.dash && liquidationData.dash.length && entryPrice > 0) {
      liquidationData.dash.forEach((d, i) => {
        const strategy = editableStrategyRanges.find(sR => sR.color === liquidationData.colors[i]);
        if (d === true && liquidationData.data[i] && liquidationData.data[i].length > 0 && strategy && strategy.leverage > 1) {

          let l1 = liquidationData.data[i][0].x;
          let l2 = liquidationData.data[i][liquidationData.data[i].length - 1].x;

          if ( l1 < entryPrice && l2 < entryPrice) {
            liquidationLinesTemp.push({y: l2, color:  liquidationData.colors[i]})
          }
          else {
            liquidationLinesTemp.push({y: l1, color:  liquidationData.colors[i]})
          }     
        }
      });
      setLiquidationLines(liquidationLinesTemp);
    }
  }, [liquidationData, entryPrice, editableStrategyRanges]);

  return (
    <div className={`${styles['strategy-backtest-container']}
      ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}
      ${props.pageStyle ? props.pageStyle["dashboard-section"] : "dashboard-section"}`} 
      onMouseLeave={() => { setMouseOverText([])}}>
      <div className={`title ${styles['strategy-backtest-title']}`}>
        <span>{props.page === "uniswap" ? "Strategy Backtest" : ""}</span>
        
        <RangeSlider className={styles['range-slider-backtest-days']} handleInputChange={handleDaysChange} min={5} max={30} value={days} step={1}></RangeSlider>
        
        <span className={props.pageStyle['help-icon']} style={{marginLeft: 0}}>
        <ToolTip textStyle={{width: "450px", height: "fill-content", left:"-450px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].backtest}>?</ToolTip>
        </span>
        
        <span style={{fontSize:12}}>Last {days} days &nbsp; |  &nbsp;{entryPrice && entryPrice > 0 ? `Entry price: ${parsePrice(entryPrice)} ${baseToken.symbol}` : ""}

        {
          editableStrategyRanges.map(d => {
           return <span style={{fontSize:12}}>&nbsp;|  &nbsp; {d.name} &nbsp; Min:  {strategyType === 'percent' ? d.inputs.min.percent + '%' : d.inputs.min.value + " " + baseToken.symbol}
           &nbsp; Max:  {strategyType === 'percent' ? d.inputs.max.percent + '%' : d.inputs.max.value + " " + baseToken.symbol}</span>
          })
        }
        
        </span>
{/*         
        {
          editableStrategyRanges.map(d => {
           return <span style={{fontSize:12}}>|  &nbsp; {d.name} &nbsp; Min:  {strategyType === 'percent' ? d.inputs.min.percent + '%' : d.inputs.min.value + " " + baseToken.symbol}
           &nbsp; Max:  {strategyType === 'percent' ? d.inputs.max.percent + '%' : d.inputs.max.value + " " + baseToken.symbol}</span>
          })
        } */}
        

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

      {
        props.page === 'perpetual' ? <BacktestStrategyOverview handleLiquidationLines={handleLiquidationLines} page={props.page} pageStyle={props.pageStyle}
        className={styles['strategy-overview']} currentPrice={ chartData && chartData[0] ? chartData[0].data[0].baseClose : 0 } ></BacktestStrategyOverview> 
        : <></>
      }

      <div className={`${styles["backtest-indicators-container"]}`}>
        <BacktestIndicators page={props.page} pageStyle={props.pageStyle} className={styles["backtest-indicators"]} data={selectedIndicatorsData} loading={dataLoading} supressFields={props.supressIndicatorFields}></BacktestIndicators>
        
        {
        props.page === 'perpetual' ? <DailyPriceChart entryPrice={entryPrice} page={props.page} pageStyle={props.pageStyle} className={styles['daily-prices']} days={days} 
        minMaxVals={liquidationLines.map(d => d.y)}>
          {
            liquidationLines.map( (d, i) => {

              return d && d.y ? 
              <Line className={styles["liquidation-line"]} 
              useParentScale={true} data={{ y1: d.y, y2: d.y }} stroke={d.color}
              strokeWidth={1} strokeDasharray={"6 6"}>
              </Line> : <></>
            })
          }
        </DailyPriceChart> 
        : <></>
        }
        
        <StrategyToggle page={props.page} pageStyle={props.pageStyle} className={styles["strategy-toggle"]} handleToggle={handleStrategyChange}></StrategyToggle>
        <StrategyBreakdown loading={dataLoading} page={props.page} pageStyle={props.pageStyle} className={styles["strategy-breakdown-container"]} data={chartData} strategy={strategyToggled} totalReturnKeys={props.totalReturnKeys} amountKey={props.amountKey}></StrategyBreakdown>
      </div>

    </div>

  )
}

export default StrategyBacktest