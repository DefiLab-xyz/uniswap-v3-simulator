import styles from '../styles/modules/PoolOverview.module.css'
import PoolStats from '../components/PoolStats'
import { Title, DailyVolume, DailyTVL } from '../components/charts/PoolOverview';

const PoolOverview = (props) => {

  return (
    <div className={`${props.pageStyle["dashboard-section"]} ${props.pageStyle["outer-glow"]}  ${styles['pool-overview-container']}`}>
      <Title page={props.page} pageStyle={props.pageStyle}></Title>
      <div className={styles["chart-container"]}>
        <DailyVolume page={props.page} pageStyle={props.pageStyle}></DailyVolume>
        <DailyTVL page={props.page} pageStyle={props.pageStyle}></DailyTVL>
        <PoolStats page={props.page} pageStyle={props.pageStyle}></PoolStats>
      </div>
    </div>
  )
}

export default PoolOverview