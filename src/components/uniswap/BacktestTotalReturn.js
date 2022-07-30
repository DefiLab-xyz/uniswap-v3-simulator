import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { sumArray, maxInArray, minInArray } from '../../helpers/numbers';
import { selectBaseToken, selectBaseTokenId } from '../../store/pool';
import { LineChart, LineChartStacked } from '../charts/LineChart';
import { ButtonList } from '../ButtonList';
import StrategyDropdown from './StrategyDropdown';
import { selectEditableStrategyRanges } from '../../store/strategyRanges';
import { parsePrice } from '../../helpers/numbers';
import { selectCompareStrategies, selectStrategies } from '../../store/strategies';
import { selectInvestment } from '../../store/investment';
import colors from '../../data/colors.json'
import HelpText from '../../data/HelpText';
import ToolTip from '../ToolTip';

const BacktestTotalReturnSelect = (props) => {

  const [buttons, setButtons] = useState();

  useEffect(() => {
    setButtons(props.buttons.map( d => {
      return {id: d.key, label: d.name, style: props.page === "uniswap" ? {color: d.color} : {border: `1.2px solid ${d.color}` }, selected: d.selected || false}
    }));
  
  }, [props.buttons]);

 
  return (<ButtonList page={props.page} pageStyle={props.pageStyle} type="flex" buttons={buttons} handleSelected={props.handleSelected}></ButtonList>)
}

export const BacktestTotalReturn = (props) => {

  const baseToken = useSelector(selectBaseToken);
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();

  const chartProps =  { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: `Value in ${baseToken.symbol}`, xlabel: "", ...props.chartProps };
  const totalReturnKeysDefault =  [{ key: 'amountV', name: "Amount", selected: true, color: colors[props.page]["tokenratio"][0] }, 
  {key: 'feeAcc', name: "Fee", selected: true, color: colors[props.page]["tokenratio"][1]}];

  //-------------------------------------------------------------------------------------------------------------
  // Lines on Total Return chart can be displayed or hidden using BacktestTotalReturnSelect component 
  // selectedKeys is passed to the chart component which determines which values are taken from chartData to generate the chart 
  //-------------------------------------------------------------------------------------------------------------

  const [chartKeys, setChartKeys] = useState( props.totalReturnKeys || totalReturnKeysDefault );
  const filterSelectedKeys = (chartKeys) => chartKeys.filter(cK => cK.selected === true).map(c => c.key);
  const filterSelectedKeyColors = (chartKeys) => chartKeys.filter(cK => cK.selected === true).map(c => c.color);
  const [selectedKeys, setSelectedKeys] = useState(filterSelectedKeys(chartKeys));
  const [selectedKeyColors, setSelectedKeyColors] = useState(filterSelectedKeyColors(chartKeys));

  const handleKeySelect = (clicked) => {
    const chartKeysTemp = chartKeys;
    const clickedIndex = chartKeysTemp.findIndex(cK => clicked.id === cK.key);

    if (clickedIndex >= 0) {
      chartKeysTemp[clickedIndex].selected = !chartKeysTemp[clickedIndex].selected;
      setChartKeys([...chartKeysTemp]);
    }
  }

  useEffect(() => {
    setSelectedKeys(filterSelectedKeys(chartKeys));
    setSelectedKeyColors(filterSelectedKeyColors(chartKeys));
  }, [chartKeys]);

  //-------------------------------------------------------------------------------------------------------------
  // Generate chartdata and chart domain
  //-------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (props.data && props.data.length && props.strategy) {

      const chartDataTemp = props.data.find( d => d.id === props.strategy.id);
      let sum = 0;

      if (chartDataTemp && chartDataTemp.data) {
        chartDataTemp.data = chartDataTemp.data.map(d => {
          sum += d.feeV;
          return {...d, feeAcc: sum}
        })
        setChartData(chartDataTemp.data);
      }
    }  
  }, [props.data, props.strategy]);

  useEffect(() => {
    if (chartData && chartData.length) {

      const yMax = chartData.map( cD =>  {
        return sumArray(selectedKeys.map(s => cD[s]));
      });

      const yMin = minInArray([chartData], selectedKeys[0]);
      
      setChartDomain({x: chartData.map(d => d.date), y: [Math.min(0, yMin), Math.max(...yMax)]});
    }
  }, [chartData, selectedKeys]);

  //-------------------------------------------------------------------------------------------------------------
  // Mouseover Text
  //-------------------------------------------------------------------------------------------------------------

  const [mouseOverText, setMouseOverText] = useState();

  const handleMouseOver = (xEvent, scale) => {

    if (chartData && chartData[0] && scale) {
      const dates = chartData.map( d => d.date ); 
      const idx = dates.findIndex(d => d === scale.x.invert(xEvent));

      if (idx >= 0) {
        const item = chartData[idx];
        const date = new Date(item.date);
        const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
        const x = `Date: ${formattedDate}`
        const y = chartKeys.map(d => `${d.name}: ${parsePrice(item[d.key])}`)
        setMouseOverText([x, ...y]);
      }
    }
  }
  //-------------------------------------------------------------------------------------------------------------

  return ( 
    <>
    <div className={props.classNameTitle}>
      <span>LP Total Return  
      &nbsp;&nbsp;&nbsp;</span>
      <BacktestTotalReturnSelect page={props.page} pageStyle={props.pageStyle} buttons={chartKeys} handleSelected={handleKeySelect} ></BacktestTotalReturnSelect>
      <ToolTip textStyle={{width: "300px", height: "fill-content", left:"-0px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].totalReturn}>?</ToolTip>
    </div>
    <LineChartStacked loading={props.loading} className={`${props.className ? props.className : ""} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
      data={chartData} domain={chartDomain} lineType="area" keys={selectedKeys}
      chartProps={chartProps} colors={selectedKeyColors}
      currentPriceLine={false} mouseOverMarker={true} xScaleKey={'date'}
      mouseOverText={mouseOverText} handleMouseOver={handleMouseOver} fillOpacity={props.page === "perpetual" ? () => 0.85 : null}
    >
    </LineChartStacked>
    </>)
}

export const BacktestTotalReturnPercent = (props) => {

  const editableStrategyRanges = useSelector(selectEditableStrategyRanges);
  const baseID = useSelector(selectBaseTokenId);
  const strategies = useSelector(selectStrategies)
  const compareStrategies = useSelector(selectCompareStrategies);
  const investment = useSelector(selectInvestment);
  const [chartData, setChartData] = useState();
  const [selectedStrategy, setSelectedStrategy] = useState();
  const [selectedCompareStrategy, setSelectedCompareStrategy] = useState();
  const [selectedChartData, setSelectedChartData] = useState();
  const [selectedChartColors, setSelectedChartColors] = useState();
  const [chartDomain, setChartDomain] = useState();


  const chartProps =  { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "percent", ylabel: `% Return`, xlabel: "", ...props.chartProps };

  useEffect(() => {

    const genRowForChartData = (id, firstClose, row, sumFee) => {
      const baseClose = baseID === 1 ? 1 /  row.close : row.close;
      switch (id) {
        case 'S1': return { x: row.date, y: ((row.feeV + sumFee) / investment) + (((row[props.amountKey]  || row.amountV) - investment) / investment)};
        case 'S2': return { x: row.date, y: ((row.feeV + sumFee) / investment) + (((row[props.amountKey]  || row.amountV) - investment) / investment)};
        case 'v2': return { x: row.date, y: (((Math.sqrt( Math.pow(investment / 2, 2) / firstClose * baseClose )) - investment) / investment) + row.feeUnb + sumFee};
        case 'hodl1': return {x: row.date, y: ((investment / firstClose * baseClose) - investment) / investment };
        case 'hodl2': return {x: row.date, y: 0};
        case 'hodl5050': return {x: row.date, y: (((investment / firstClose * baseClose) - investment) / investment) / 2 };
        default: return 0;
      }
    }

    const genChartData = (data, strategies, feeKey) => {
      const tempData = [];
      const firstClose =  baseID === 1 ? 1 /  data[0].close :  data[0].close;
  
      strategies.forEach( s => {
        let sumFee = 0;
        const chartData = data.map(d => {
          const row = genRowForChartData(s.id, firstClose, d, sumFee);
          sumFee += d[feeKey];
          return row;
      });
      tempData.push({ id: s.id, color: s.style ? s.style.color : s.color, name: s.name, data: chartData});
    });
  
      return tempData;
  
    }

    if (props.data && props.data.length) {
      const compareChartData = genChartData(props.data[0].data, compareStrategies, "feeUnb");
      const strategy1 = props.data[0] ? genChartData(props.data[0].data, props.data.filter(d => d.id === 'S1'), "feeV") : [];
      const strategy2 = props.data[1] ? genChartData(props.data[1].data, props.data.filter(d => d.id === 'S2'), "feeV") : [];
      setChartData([...compareChartData, ...strategy1, ...strategy2]);
    }
  }, [baseID, compareStrategies, investment, props.amountKey, props.data]);

  //----------------------------------------------------------------------------------------------------------
  // Update local state when Strategy is toggled or different compare Strategy is selected
  //----------------------------------------------------------------------------------------------------------

  const handleSelectedCompareStrategy = (strat) => {
    setSelectedCompareStrategy(strategies.find(d => d.id === strat.id));
  }

  useEffect(() => {
    const strategy = editableStrategyRanges.find(s => s.id === props.strategy.id);
    if (strategy) setSelectedStrategy(strategy);
  }, [editableStrategyRanges, props.strategy]);

  //----------------------------------------------------------------------------------------------------------
  // Generate selected chart data when either Strategy is toggled or different compare Strategy is selected
  //----------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (chartData && chartData.length) {

      const compare = chartData.find(d => d.id === selectedCompareStrategy.id);
      const strategy = chartData.find(d => d.id === selectedStrategy.id);

      if (compare && compare.data && strategy && strategy.data) {
        setSelectedChartData([compare.data, strategy.data]);
        setSelectedChartColors([compare.color, strategy.color]);
      }
      
    }
  }, [selectedCompareStrategy, selectedStrategy, chartData]);

  useEffect(() => {
    if (selectedChartData && selectedChartData.length) {
      const yMax = maxInArray(selectedChartData, 'y');
      const yMin = minInArray(selectedChartData, 'y');
      setChartDomain({x: selectedChartData[0].map(d => d.x), y: [yMin, yMax]});
  
    }
  }, [selectedChartData]);

  //-------------------------------------------------------------------------------------------------------------
  // Mouseover Text
  //-------------------------------------------------------------------------------------------------------------

  const [mouseOverText, setMouseOverText] = useState();

  const handleMouseOver = (xEvent, scale) => {

    if (selectedChartData && selectedChartData[0] && scale) {
      const dates = selectedChartData[0].map( d => d.x ); 
      const idx = dates.findIndex(d => d === scale.x.invert(xEvent));

      if (idx >= 0) {
        const date = new Date(dates[idx]);
        const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
        const x = `Date: ${formattedDate}`;
        const strat = `${selectedStrategy.name}: ${parsePrice((selectedChartData[1][idx].y * 100), true)}%`
        const compare = `${selectedCompareStrategy.name}: ${parsePrice((selectedChartData[0][idx].y * 100), true)}%`
        // const y = selectedChartData.map( d => `${d.name}: ${}`); 
        //chartKeys.map(d => `${d.name}: ${parsePrice(item[d.key])}`)
        setMouseOverText([x, strat, compare]);
      }
    }
  }
  //-------------------------------------------------------------------------------------------------------------


  return (
    <>
     <StrategyDropdown page={props.page} pageStyle={props.pageStyle} className={props.strategyDropdownClass} selectedStrategy={selectedStrategy} handleSelected={handleSelectedCompareStrategy}></StrategyDropdown>
     <LineChart loading={props.loading} className={`${props.className ? props.className : ""} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
     chartProps={chartProps} data={selectedChartData} colors={selectedChartColors} domain={chartDomain}
     mouseOverText={mouseOverText} handleMouseOver={handleMouseOver} mouseOverMarker={true}></LineChart>
    </>
  );
}