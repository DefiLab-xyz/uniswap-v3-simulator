import { Fragment, useEffect, useState } from "react"
import StrategyDropdown from "./StrategyDropdown"
import { V3ImpLossData } from "../../helpers/uniswap/strategies";
import { LineChart } from "../charts/LineChart";
import {bisector} from 'd3-array'
import { useSelector } from "react-redux";
import { selectBaseToken } from "../../store/pool";
import { parsePrice, round } from "../../helpers/numbers";

const ImpermanentLossChart = (props) => {

  const baseToken = useSelector(selectBaseToken)
  const [selectedCompareStrategy, setSelectedCompareStrategy] = useState();
  const [chartData, setChartData] = useState();
  const [chartDomain, setChartDomain] = useState();
  const [chartColor, setChartColor] = useState();
  const [mouseOverText, setMouseOverText] = useState();

  const margin = {top: 40, right: 50, bottom: 100, left: 70};

  const chartProps = { scaleTypeX: "linear", scaleTypeY:"linear", 
  dataTypeX: "number", dataTypeY: "percent", ylabel: `% Difference` , xlabel: "" }

  const handleMouseOver = (xEvent, scale) => {

    if (scale && chartData) {
      const bisect = bisector(d => d.x);
      const idx = bisect.left(chartData, parseFloat(scale.x.invert(xEvent)));
      const x = `${baseToken.symbol} Price: ${parsePrice(chartData[idx].x)}`
      const y = "Difference: " + round(chartData[idx].y * 100, 2) + '%'
      setMouseOverText([x, y]);
    }
  }


  const handleSelectedCompareStrategy = (strategy) => {
    setSelectedCompareStrategy(strategy);
  }

  useEffect(() => {
      if (props.data && selectedCompareStrategy && props.selectedStrategy) {
        const strategy = props.data.find(d => d.id === props.selectedStrategy.id);
        const compareStrategy = props.data.find(d => d.id === selectedCompareStrategy.id);

        setChartData(V3ImpLossData(strategy.data, compareStrategy.data))
        setChartColor(selectedCompareStrategy.style.color);
      }
  }, [props.data, selectedCompareStrategy, props.selectedStrategy]);

  useEffect(() => {
    if (chartData) {
      const yMin = Math.min(...chartData.map(d => d.y), 0);
      const xMax = Math.max(...chartData.map(d => d.x));
      const yMax = Math.max(...chartData.map(d => d.y));

      setChartDomain({x: [0, xMax], y: [yMin, yMax]});
    }
  }, [chartData]);

  const Title = (props) => {

    return (
      <div class={`${props.pageStyle ? props.pageStyle["sub-title"] : "sub-title"} ${props.className}`}>
        <span>{`Price Risk / Impermanent Loss`}</span>
      </div>
    );
  }

  return (
    <Fragment>
      <Title pageStyle={props.pageStyle} className={props.classNameTitle}></Title>
      <LineChart
      className={`${props.className} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}
      data={[chartData]} domain={chartDomain}
      mouseOverMarker={true} mouseOverMarkerPos={"fixed"}
      chartProps={chartProps} colors={[chartColor]}
      margin={margin} lineType={"area"} mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}>
      </LineChart>
      <StrategyDropdown pageStyle={props.pageStyle} className={props.classNameDropdown} selectedStrategy={props.selectedStrategy} handleSelected={handleSelectedCompareStrategy}></StrategyDropdown>
    </Fragment>
    
  )
}

export default ImpermanentLossChart