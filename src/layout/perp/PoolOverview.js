import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import {selectProtocol} from '../../store/protocol'
import {selectBaseToken, selectQuoteToken, selectFeeTier, selectPoolDayData} from '../../store/pool'
import { formatLargeNumber } from '../../helpers/numbers';
import styles from '../../styles/modules/PoolOverview.module.css'
import BarChart from '../../components/charts/BarChart';
import {LineChart} from '../../components/charts/LineChart';
import PoolStats from '../../components/PoolStats'
import { Title, DailyVolume, DailyTVL } from '../../components/charts/PoolOverview';


const PoolOverview = (props) => {

  return (
    <div className={`dashboard-section outer-glow ${styles['pool-overview-container']}`}>
      <Title></Title>
      <div className={styles["chart-container"]}>
        <DailyVolume chartDataY="volumeToken1"></DailyVolume>
        <DailyVolume chartDataY="txCount" chartProps={{ylabel: "Transaction Count"}}></DailyVolume>
      </div>
      
    </div>
  )
}

export default PoolOverview