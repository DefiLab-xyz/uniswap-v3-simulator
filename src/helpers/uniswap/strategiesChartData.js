import { current } from '@reduxjs/toolkit'
import { V3MaxLimit, V3MinLimit, genTokenRatios } from './strategies'
import { parsePrice } from '../numbers'

const rangeValFromPercent = (currentPrice, strategy, key) => {
  return parsePrice(currentPrice + (currentPrice * parseFloat(strategy.inputs[key].percent / 100)))
}

const inputsForChartData = (currentPrice, investment, strategyRanges, strategies, type) => {
  
  const min0 = type === 'percent' ? rangeValFromPercent(currentPrice, strategyRanges[0], 'min') : strategyRanges[0].inputs.min.value;
  const max0 = type === 'percent' ? rangeValFromPercent(currentPrice, strategyRanges[0], 'max') : strategyRanges[0].inputs.max.value;
  const min1 = type === 'percent' ? rangeValFromPercent(currentPrice, strategyRanges[1], 'min') : strategyRanges[1].inputs.min.value;
  const max1 = type === 'percent' ? rangeValFromPercent(currentPrice, strategyRanges[1], 'max') : strategyRanges[1].inputs.max.value;

  const range1Inputs = { minPrice: min0, maxPrice: max0, investment: investment * strategyRanges[0].leverage };
  const range2Inputs = { minPrice: min1, maxPrice: max1, investment: investment * strategyRanges[1].leverage };
  const step = Math.max(currentPrice, (range1Inputs.maxPrice * 1.1) / 2, (range2Inputs.maxPrice * 1.1) / 2);
  const inputsAll = { investment: investment, currentPrice: currentPrice, step: step };

  return { range1Inputs: range1Inputs, range2Inputs: range2Inputs, inputsAll: inputsAll  }
}

export const genChartData = (currentPrice, investment, strategyRanges, strategies, chartDataOverride, type) => {
  
  if (!chartDataOverride) {
    const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies, type);
    return strategies.map(d => {
      const inputs = d.id === 'S1' ? {...inputsAll, ...range1Inputs } : d.id === 'S2' ? {...inputsAll, ...range2Inputs} : {...inputsAll};
      return {id: d.id, data: d.genData(inputs)};
    });
  }


  if (chartDataOverride === 'leveraged') {

    const tokenCoeff = (chartData, strategyRange) => {
      const leveragedInvestment = strategyRange.leverage * investment;
      
      const tokenRatio = genTokenRatios(chartData.data, currentPrice);
      const y0 = leveragedInvestment * (tokenRatio.token0 / 100);
      const x0 = leveragedInvestment * (tokenRatio.token1 / 100) / currentPrice;
      return {x0: x0, y0: y0}
    }
  
    const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies, type);

    const chartDataTemp = strategies.map(d => {
      const inputs = d.id === 'S1' ? {...inputsAll, ...range1Inputs } : d.id === 'S2' ? {...inputsAll, ...range2Inputs} : {...inputsAll};
      return {id: d.id, data: d.genData(inputs)};
    });

    const chartData = chartDataTemp.map( cd => {
      const strategyRange = strategyRanges.find(sr => sr.id === cd.id);
      if ( cd.id === 'S1' || cd.id === 'S2') {

        const {x0, y0} = tokenCoeff(cd, strategyRange) ;
        const test = tokenCoeff(cd, strategyRange);
        const newData = cd.data.map( d => {
  
          const perpDebtVal = (x0 * parseFloat(d.x)) + y0;
          const impLoss = d.y - perpDebtVal;

          const hedging = strategyRange.hedging; 
    
          const impLossHedge = hedging.type === 'long' ? ( hedging.amount * hedging.leverage * ( (d.x - currentPrice) / currentPrice) )  :
          hedging.type === 'short' ? ( hedging.amount * hedging.leverage * (( (d.x - currentPrice) / currentPrice) * -1) )  : 0;

          const impPos = x0 - d.token;
          const notionalSize = Math.abs(impPos * d.x);
          // const margin = (impLoss >= 0 && impLoss < 0.00001) ?  "∞" : ((parseFloat(investment) + parseFloat(impLoss)) / notionalSize) * 100;
          const margin = (impLoss >= 0 && impLoss < 0.00001) ?  "∞" : 
          ((parseFloat(investment) + impLoss + parseFloat(hedging.amount) + impLossHedge ) / (notionalSize + ((parseFloat(hedging.amount) * parseFloat(hedging.leverage)) + impLossHedge ))) * 100;
          

          //  (Investment LP (not leveraged) + Impermanent Loss LP + Investment Hedge  (not leveraged) + Impermanent Loss hedge ) / (Notional size LP + ((Hedge investment leverage)+Impermanent loss hedge ))



          return {...d, investment: investment, test: test, perpDebtVal: perpDebtVal, impLoss: impLoss, impPos: impPos, notionalSize: notionalSize, margin: margin, y: impLoss + impLossHedge }
        });
  
        cd[chartDataOverride] = newData;
      }
      else {
        cd[chartDataOverride] = cd.data
      }
      return cd;

    });

    return chartData
  }

 

}

export const filterV3StrategyData = (strategyData, chartData, dataName) => {
  if (chartData && (!dataName || dataName === 'data')) {
    const filteredData = chartData.filter( d => d.x >= strategyData.min.cx && d.x <= strategyData.max.cx );
    filteredData.push({x: strategyData.max.cx, y: strategyData.max.cy});
    filteredData.unshift({x: strategyData.min.cx, y: strategyData.min.cy});
    return filteredData;
  }
  else if (dataName === 'leveraged') {
    const filteredData = chartData.filter( d => d.x >= strategyData.min.cx && d.x <= strategyData.max.cx );
    return filteredData;
  }

  return [];
}

export const genV3StrategyData = (currentPrice, investment, strategyRanges, strategies, chartData, dataName, type) => {

  const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies, type);
  const s1DragData = {max: V3MaxLimit({...range1Inputs, ...inputsAll}), min: V3MinLimit({...range1Inputs, ...inputsAll})};
  const s2DragData = {max: V3MaxLimit({...range2Inputs, ...inputsAll}), min: V3MinLimit({...range2Inputs, ...inputsAll})};

  return [ { id: "S1" , data: filterV3StrategyData(s1DragData, chartData.find(strat => strat.id === "S1")[dataName], dataName)} , 
  { id: "S2" , data: filterV3StrategyData(s2DragData, chartData.find(strat => strat.id === "S2")[dataName], dataName)} ];

}

export const genSelectedStrategyData = (data, strategies) => {

  const strategyDragData = [];
  const strategyDragColors = [];
  const strategyIds = [];
  const strategyNames = [];

  data.forEach(d => {
    const strat = strategies.find(strat => strat.id === d.id);
    if (strat && strat.selected === true) {
      strategyDragData.push(d.data);
      strategyDragColors.push(strat.style.color);
      strategyIds.push(d.id);
      strategyNames.push(strat.name);
    }  
  });

  return { data: strategyDragData, colors: strategyDragColors, ids: strategyIds, names: strategyNames }
}

export const genSelectedChartData = (data, strategies, dataName) => {

  const chartData = [];
  const chartColors = [];
  const chartDash = [];
  const chartDataForHover = [];

  if (!dataName || dataName === 'data') {

    strategies.forEach(d => {
      if (d.selected) {
        const tempdata = data.find(strat => strat.id === d.id);
        if (tempdata && tempdata.hasOwnProperty(dataName)) {
          chartData.push(tempdata[dataName]);
          chartColors.push(d.style.color);
          chartDash.push(false);
          chartDataForHover.push({label: d.name, data: tempdata[dataName]});
        }        
      }
    });
    
  }

  if (dataName === "leveraged") {

    strategies.forEach(d => {
      if (d.selected) {

        const tempdata = data.find(strat => strat.id === d.id);

        if (tempdata && tempdata.hasOwnProperty(dataName)) {

          const idx = tempdata[dataName].findIndex( cd => cd.margin >= 6.25 || cd.margin === "∞");
          const notLiquidatedTemp = tempdata[dataName].slice(idx);
          const idx2 = notLiquidatedTemp.findIndex( cd => cd.margin < 6.25); 

          const liquidatedMin = tempdata[dataName].slice(0, idx);
          const notLiquidated = notLiquidatedTemp.slice(0, idx2);
          const liquidatedMax = notLiquidatedTemp.slice(idx2);

          chartData.push(liquidatedMin, notLiquidated, liquidatedMax);
          chartColors.push(d.style.color, d.style.color, d.style.color);
          chartDash.push(true, false, true);
          chartDataForHover.push({ label: d.name, data:tempdata[dataName] });
      
        }        
      }
    });
  }

  return { data: chartData, colors: chartColors, dash: chartDash, chartDataForHover: chartDataForHover }

}