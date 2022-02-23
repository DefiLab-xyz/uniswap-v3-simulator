import styles from '../styles/modules/PoolOverview.module.css'
import PoolStats from '../components/PoolStats'
import { Title, DailyVolume, DailyTVL } from '../components/charts/PoolOverview';


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