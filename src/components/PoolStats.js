import { useSelector } from "react-redux";
import styles from '../styles/modules/PoolOverview.module.css'
import { selectYesterdaysPriceData, selectPool, selectNormStd, selectLiquidity, selectBaseToken } from "../store/pool";
import { calc24HrFee, calcCLI } from '../helpers/uniswap/liquidity'
import { round } from "../helpers/numbers";
import { Fragment, useEffect, useState } from "react";
import HelpText from "../data/HelpText";
import ToolTip from '../components/ToolTip'

const Stat = (props) => {
  return (
  <Fragment>
      <div className={`${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"} ${styles['stat-container']} ${styles[`stat-${props.row}`]}`}>{props.stat}</div>
      <div className={`${styles['stat-container']} ${styles['stat-label']} ${styles[`stat-label-${props.row}`]}`}>{props.label}</div>
      <div className={`${styles['stat-container']} ${props.pageStyle[`help-icon`]} ${styles[`stat-help-${props.row}`]}`} >
        <ToolTip textStyle={{width: "400px", height: "fill-content", left:"-450px", top: "20px", textAlign: "left"}} 
      buttonStyle={{width: 15, height: 15}} text={props.helpText}>?</ToolTip></div>
  </Fragment>);
}

const PoolStats = (props) => {
 
  const yesterday = useSelector(selectYesterdaysPriceData);
  const pool =  useSelector(selectPool);
  const normStd = useSelector(selectNormStd);
  const liquidity = useSelector(selectLiquidity);
  const baseToken = useSelector(selectBaseToken);
  const basePrice = baseToken.currentPrice;
  const [fee24Hr, setFee24Hr] = useState("");
  const [CLI, setCLI] = useState("");

  useEffect(() => {
    if (pool && pool.token0) {
      setFee24Hr(calc24HrFee(yesterday, pool));
      setCLI(calcCLI(liquidity, normStd, pool, basePrice));
    }
  }, [yesterday, pool, normStd, liquidity, basePrice]);



  return (
    <div className={styles["pool-stats-container"]}>
      <Stat row={1} stat={round(normStd, 2) + '%'} 
        label="Volatility" pageStyle={props.pageStyle} helpText={HelpText[props.page].volatility}>
      </Stat>
      { 
        props.poolStatsHidden ? <></> : 
        <Stat row={2} stat={round(fee24Hr, 2) + '%'} 
        label="Active Liquidity 24h Fee"  pageStyle={props.pageStyle} helpText={HelpText[props.page].aL24hFee}></Stat>
      }
      <Stat row={props.poolStatsHidden ? 2 : 3} stat={round(CLI, 2) + '%'} 
        label="Concentrated Liquidity Index" pageStyle={props.pageStyle} helpText={HelpText[props.page].CLI}>
      </Stat>
    </div>
  )
}

export default PoolStats

