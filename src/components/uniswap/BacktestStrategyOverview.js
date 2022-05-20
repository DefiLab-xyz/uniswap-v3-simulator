import {useState, useEffect} from 'react' 
import { useSelector } from 'react-redux';
import StrategyOverviewChart from "./StrategyOverviewChart"
import { selectInvestment } from '../../store/investment';
import { selectStrategies, selectStrategiesByIds } from '../../store/strategies';
import { selectStrategyRanges, selectStrategyRangeType } from '../../store/strategyRanges';
import { genChartData, genV3StrategyData } from "../../helpers/uniswap/strategiesChartData"
import { selectPoolDayData } from '../../store/pool';
import { maxInArray, minInArray } from '../../helpers/numbers';


const BacktestStrategyOverview = (props) => {

  const investment = useSelector(selectInvestment);
  const strategiesAll = useSelector(selectStrategies);
  const strategyType = useSelector(selectStrategyRangeType)
  const [strategies, setStrategies] = useState(selectStrategiesByIds(strategiesAll, ["S1", "S2"])); 
  const strategyRanges = useSelector(selectStrategyRanges);
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [v3StrategyData, setV3StrategyData] = useState();

  const chartProps = { scaleTypeX: "linear", scaleTypeY:"linear", 
  dataTypeX: "number", dataTypeY: "number", ylabel: "" , xlabel: "" }
  const margin = {top: 20, right: 20, bottom: 30, left: 50};

  useEffect(() => {
      const data = genChartData(props.currentPrice, investment, strategyRanges, strategies, "leveraged", strategyType)
      setChartData(data);
  }, [props.currentPrice, investment, strategyRanges, strategies, strategyType]);

  // Generate Asset Value Chart's domain when chart data changes
  useEffect(() => {
    if (chartData && chartData.length) {
      const xMax = maxInArray(chartData.map(d => d['leveraged']), 'x');
      const yMax = maxInArray(chartData.map(d => d['leveraged']), 'y');
      const yMin = minInArray(chartData.map(d => d['leveraged']), 'y');
      const xMin = minInArray(chartData.map(d => d['leveraged']), 'x');

      setChartDomain({x: [Math.min(xMin, 0), Math.max(xMax, 0)], y: [Math.min(yMin, 0), Math.max(yMax, Math.abs(yMin * 0.2))]});
    }

  }, [chartData, props.chartDataOverride]);

    // Generate V3 Strategy data used for drag controls when chart data or Strategy Range values change
    useEffect(() => {
      if (chartData) {
        setV3StrategyData(genV3StrategyData(props.currentPrice, investment, strategyRanges, strategies, chartData, 'leveraged', strategyType));
      }
    }, [chartData, props.currentPrice, investment, props.chartDataOverride, strategies, strategyRanges, strategyType]);

  return (
      <StrategyOverviewChart handleLiquidationLines={props.handleLiquidationLines} page={props.page} pageStyle={props.pageStyle} className={props.className} chartData={chartData} v3StrategyData={v3StrategyData} chartDomain={chartDomain} 
      chartDataOverride={"leveraged"} zeroLine={props.zeroLine} currentPriceLine={true} price={props.currentPrice}
      chartProps={chartProps} margin={margin} currentPrice={props.currentPrice} hideStrategyControls={true}>
      </StrategyOverviewChart>
  )

}

export default BacktestStrategyOverview