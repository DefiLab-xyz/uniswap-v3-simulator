import { V3MaxLimit, V3MinLimit } from './strategies'

const inputsForChartData = (currentPrice, investment, strategyRanges, strategies) => {
  const range1Inputs = { minPrice: strategyRanges[0].inputs.min.value, maxPrice: strategyRanges[0].inputs.max.value };
  const range2Inputs = { minPrice: strategyRanges[1].inputs.min.value, maxPrice: strategyRanges[1].inputs.max.value };
  const step = Math.max(currentPrice, (range1Inputs.maxPrice * 1.1) / 2, (range2Inputs.maxPrice * 1.1) / 2);
  const inputsAll = { investment: investment, currentPrice: currentPrice, step: step };

  return { range1Inputs: range1Inputs, range2Inputs: range2Inputs, inputsAll: inputsAll  }
}

export const genChartData = (currentPrice, investment, strategyRanges, strategies) => {

  const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies);

  return strategies.map(d => {
    const inputs = d.id === 'S1' ? {...range1Inputs, ...inputsAll} : d.id === 'S2' ? {...range2Inputs, ...inputsAll} : {...inputsAll};
    return {id: d.id, data: d.genData(inputs)};
  });

}

export const filterV3StrategyData = (strategyData, chartData) => {

  if (chartData) {
    const filteredData = chartData.filter( d => d.x >= strategyData.min.cx && d.x <= strategyData.max.cx );
    filteredData.push({x: strategyData.max.cx, y: strategyData.max.cy});
    filteredData.unshift({x: strategyData.min.cx, y: strategyData.min.cy});
    return filteredData;
  }

  return [];
}

export const genV3StrategyData = (currentPrice, investment, strategyRanges, strategies, chartData) => {

  const { range1Inputs, range2Inputs, inputsAll } = inputsForChartData(currentPrice, investment, strategyRanges, strategies);
  const s1DragData = {max: V3MaxLimit({...range1Inputs, ...inputsAll}), min: V3MinLimit({...range1Inputs, ...inputsAll})};
  const s2DragData = {max: V3MaxLimit({...range2Inputs, ...inputsAll}), min: V3MinLimit({...range2Inputs, ...inputsAll})};

  return [ { id: "S1" , data: filterV3StrategyData(s1DragData, chartData.find(strat => strat.id === "S1").data)} , 
  { id: "S2" , data: filterV3StrategyData(s2DragData, chartData.find(strat => strat.id === "S2").data)} ];

}

export const genSelectedStrategyData = (data, strategies) => {

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

export const genSelectedChartData = (data, strategies) => {

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