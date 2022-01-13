import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import {selectProtocol} from '../store/protocol'
import {selectBaseToken, selectQuoteToken, selectFeeTier, selectPoolDayData} from '../store/pool'
import { formatLargeNumber } from '../helpers/numbers';
import styles from '../styles/modules/PoolOverview.module.css'
import BarChart from '../components/charts/BarChart';
import {LineChart} from '../components/charts/LineChart';
import PoolStats from '../components/PoolStats'

const Title = (props) => {

  const protocol = useSelector(selectProtocol);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const feeTier = useSelector(selectFeeTier);
  
  return (
    <div className={`title ${styles['title']}`}>
      <span><img src={protocol.logo} alt="optimism" style={{ width: "18px", height: "18px", marginRight: 5}}></img></span>
      <span>{`Pool Overview - ${baseToken.symbol} / ${quoteToken.symbol} ${(feeTier / 10000) + '%' }`}</span>
    </div>
  );
}

const genMouseOverText = (xEvent, data, scale, yLabel) => {

  const dates = data.map( d => d.x ); 
  const idx = dates.findIndex(d => d === scale.x.invert(xEvent));

  const date = new Date(data[idx].x);
  const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
  const x = `Date: ${formattedDate}`
  const y = `${yLabel}: ${formatLargeNumber(data[idx].y)}`
  return [x, y];

}

const genChartData = (data, yKey) => {
  return data.map(d => {
    const date = new Date(0);
    return { x: date.setUTCSeconds(d.date), y: parseFloat(d[yKey]) || 0}
  });
}

const genDomain = (data) => {
  const maxY = Math.max(...data.map(d => d.y)); 
  const datesForX = data.map(d => d.x).reverse();
  return {x: datesForX, y: [0, maxY] };
}

export const DailyTVL = (props) => {

  const [chartDomain, setChartDomain] = useState();
  const [chartData, setChartData] = useState();
  const [mouseOverText, setMouseOverText] = useState();
  const poolVolumeData = useSelector(selectPoolDayData);
  const chartProps = { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: "TVL USD", xlabel: "" }
  
  useEffect(() => {
    if (poolVolumeData) {
      const data = genChartData(poolVolumeData, "tvlUSD");
      setChartData(data);
      setChartDomain(genDomain(data));
    }
  }, [poolVolumeData]);

  const handleMouseOver = (xEvent, scale) => {
    setMouseOverText(genMouseOverText(xEvent, chartData, scale, "TVL"));
  }

  return (
    <LineChart
      className={`${styles['chart']} ${styles['tvl-chart']} inner-glow`}
      data={[chartData]} domain={chartDomain}
      avgLine={true} mouseOverMarker={true} 
      mouseOverText={mouseOverText} handleMouseOver={handleMouseOver}
      chartProps={chartProps} lineType="area">
    </LineChart>
  );

}

export const DailyVolume = (props) => {

  const [chartDomain, setChartDomain] = useState();
  const [chartData, setChartData] = useState();
  const [mouseOverText, setMouseOverText] = useState();
  const poolVolumeData = useSelector(selectPoolDayData);
  const chartProps = { scaleTypeX: "band", scaleTypeY:"linear", 
  dataTypeX: "date", dataTypeY: "number", ylabel: "Daily Volume USD", xlabel: "" }
  
  useEffect(() => {
    if (poolVolumeData) {
      const data = genChartData(poolVolumeData, "volumeUSD");
      setChartData(data);
      setChartDomain(genDomain(data));
    }
  }, [poolVolumeData]);

  const handleMouseOver = (xEvent, scale) => {
    setMouseOverText(genMouseOverText(xEvent, chartData, scale, "Volume"));
  }

  return (
    <BarChart
      className={`${styles['chart']} ${styles['volume-chart']} inner-glow`} classNames={{bar: styles['bar']}}
      data={chartData} domain={chartDomain}
      avgLine={true} chartProps={chartProps}
      mouseOverMarker={true} mouseOverText={mouseOverText}
      handleMouseOver={handleMouseOver}>
    </BarChart>
  );

}

const PoolOverview = (props) => {

  return (
    <div className={`dashboard-section outer-glow ${styles['pool-overview-container']}`}>
      <Title></Title>
      <div className={styles["chart-container"]}>
        <DailyVolume></DailyVolume>
        <DailyTVL></DailyTVL>
        <PoolStats></PoolStats>
      </div>
      
    </div>
  )
}

export default PoolOverview