// external libs
import { Fragment, useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { bisector } from 'd3-array';

// internal helpers
import styles from '../../styles/modules/StrategyOverview.module.css';
import { genSelectedChartData, genSelectedStrategyData } from "../../helpers/uniswap/strategiesChartData";
import { parsePrice } from "../../helpers/numbers";

// Data
import { selectStrategies } from "../../store/strategies";
import { selectBaseToken, selectCurrentPrice, selectQuoteToken } from "../../store/pool";

// Components //
import { Line } from "../charts/Line";
import { LineChart } from "../charts/LineChart";
import StrategyDrag from "../charts/StrategyDrag";
import { MouseOverText } from "../charts/MouseOverMarker";
import { ChartContext } from "../charts/ChartContainer";

const ZeroLine = (props) => {

  const [lineData, setLineData] = useState({x1: 0, x2: 0, y1: 0, y2: 0});

  useEffect(() => {
    setLineData({x1: props.xMin, x2: props.xMax, y1: 0, y2: 0})
  }, [props.xMin, props.xMax])

  if (props.zeroLine) {
    return (
      <Line className="zero-line" useParentScale={true} data={lineData} stroke={props.strategy && props.strategy.color ? props.strategy.color : "grey"}></Line>
    )
  }

  return (<></>)
  
}


const StrategyOverviewChart = (props) => {

  const strategies = useSelector(selectStrategies);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const currentPrice = useSelector(selectCurrentPrice);
  const [chartData, setChartData] = useState([]);
  const [hoverData, setHoverData] = useState([]);
  const [v3StrategyData, setV3StrategyData] = useState([]);
  const [mouseOverText, setMouseOverText] = useState();

  const margin = props.extendedHoverData ? {top: 20, right: 30, bottom: 220, left: 70} : {top: 20, right: 30, bottom: 120, left: 70};
  const chartProps = { scaleTypeX: "linear", scaleTypeY:"linear", 
  dataTypeX: "number", dataTypeY: "number", ylabel: `Asset Value ${baseToken.symbol}` , xlabel: "" }
  const bisect = bisector(d => d.x);

  const handleMouseOver = (xEvent, scale) => {

    const mouseOverText = [];
    const mouseOverTextExtended = [];

    if (scale && hoverData && hoverData.length) {

      const idx = bisect.left(hoverData[0].data, parseFloat(scale.x.invert(xEvent)));
      if (props.extendedHoverData) {

        

        hoverData.forEach(hd => {
          const longShort = currentPrice < hd.data[idx].x ? "LONG" : "SHORT";
          const margin = hd.data[idx].margin === "∞" ? hd.data[idx].margin : hd.data[idx].margin < 6.25 ? "LIQUIDATION" : `${parsePrice(hd.data[idx].margin, true)}%`;
          mouseOverTextExtended.push([`${hd.label}:`,
          `Price: ${parsePrice(hd.data[idx].x)} ${baseToken.symbol}`,
          `Impermanant Loss: ${parsePrice(hd.data[idx].impLoss)} USD`,
          `Impermanant Position: ${parsePrice(hd.data[idx].impPos)} ${quoteToken.symbol} ${longShort}`,
          `Notional Size: ${parsePrice(hd.data[idx].notionalSize)}`,
          `Margin: ${margin}`]);
        });
        setMouseOverText(mouseOverTextExtended);
      }
      else {
        mouseOverText.push(`Price: ${parsePrice(hoverData[0].data[idx].x)} ${baseToken.symbol}`);
        hoverData.forEach(hd => {
          mouseOverText.push(`${hd.label}: ${parsePrice(hd.data[idx].y)} ${baseToken.symbol}`);
        });
        setMouseOverText(mouseOverText);
      }
    }
  }

  useEffect(() => {
    if (props.v3StrategyData) {
      const strategyData = genSelectedStrategyData(props.v3StrategyData, strategies);
      setV3StrategyData(strategyData);

    }
  }, [strategies, props.v3StrategyData]);

  useEffect(() => {
    if (props.chartData) {
      const chartData = genSelectedChartData(props.chartData, strategies, props.chartDataOverride || 'data');
      setChartData(chartData);
   
    }
  }, [strategies, props.chartData, props.chartDataOverride]);

  useEffect(() => {
    if (chartData && chartData.chartDataForHover) setHoverData(chartData.chartDataForHover.reverse())
  }, [chartData]);

  return (    
  <LineChart
    className={`${styles['chart']} ${styles['strategy-chart']} ${ props.extendedHoverData ? styles['strategy-chart-extended'] : ""} inner-glow`}
    data={chartData.data} domain={props.chartDomain}
    avgLine={true} mouseOverMarker={true} mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}
    chartProps={chartProps} colors={chartData.colors} mouseOverTextExtended={ props.extendedHoverData ? true : false } mouseOverMarkerPos={ props.extendedHoverData ? "fixed" : null }
    currentPriceLine={true} margin={margin} dash={chartData.dash}>
    <ZeroLine zeroLine={props.zeroLine}
      xMin={props.chartDomain && props.chartDomain.x ? props.chartDomain.x[0] : 0} 
      xMax={props.chartDomain && props.chartDomain.x ? props.chartDomain.x[1] : 0}>
    </ZeroLine> 
    <StrategyDrag data={v3StrategyData.data} colors={v3StrategyData.colors} ids={v3StrategyData.ids} domain={props.chartDomain}></StrategyDrag>
  </LineChart>
  )
}

export default StrategyOverviewChart;

