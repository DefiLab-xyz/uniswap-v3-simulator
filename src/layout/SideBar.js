import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from '../styles/modules/SideBar.module.css'
import {parsePrice} from '../helpers/numbers'

import {selectBaseToken, toggleBaseToken, refreshCurrentPrices, selectCurrentPrice, selectPoolID, setLoading, setCurrentPrice} from '../store/pool'
import { selectInvestment, setDefaultInvestment, setInvestment } from '../store/investment'
import { selectProtocol } from '../store/protocol'

import {PoolCurrentPrices} from '../api/thegraph/uniPools'

import PoolSearch from '../components/uniswap/PoolSearch'
import { ToggleButton, RefreshButton } from '../components/Button'
import StrategyRange from '../components/StrategyRange'
import StrategyPicker from '../components/StrategyPicker'

const BaseToken = (props) => {  

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);

  const handlePriceToggle = () => {
    dispatch(toggleBaseToken());
    dispatch(setDefaultInvestment());
  }

  return ( 
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>Base Token</label><br></br>
      <input className={`${props.pageStyle["input"]} ${styles["toggle-input"]}`} label="Base Token" value={baseToken ? baseToken.symbol : ""}></input>
      <ToggleButton pageStyle={props.pageStyle} onClick={handlePriceToggle} alt="toggle base currency"></ToggleButton>
    </div>
  );
}

const Investment = (props) => {

  const dispatch = useDispatch();
  const investment = useSelector(selectInvestment);
  const baseToken = useSelector(selectBaseToken)
  const handleInputChange = (e) => dispatch(setInvestment(e.target.value));

  return ( 
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>{`Investment ${baseToken.symbol}`}</label>
      <input type="number" className={`${styles["default-input"]} ${props.pageStyle['input']}`} label="Base Token" value={investment} onChange={(e) => handleInputChange(e)}></input>
    </div>
  );
  
}

const CurrentPrice = (props) => {

  const dispatch = useDispatch();
  const abortController = useRef(new AbortController());
  const protocol = useSelector(selectProtocol);
  const poolID = useSelector(selectPoolID);
  const currentPrice = useSelector(selectCurrentPrice) || 0;
  const handleInputChange = (e) => dispatch(setCurrentPrice(e.target.value));


  const handleRefresh = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    dispatch(setLoading(true));
    PoolCurrentPrices(abortController.current.signal, protocol.id, poolID).then(d => {
      dispatch(refreshCurrentPrices(d));
    });
  }

  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>Current Price</label>
      <RefreshButton pageStyle={props.pageStyle} onClick={handleRefresh} alt="Refresh Current Price"></RefreshButton>
      <input className={`${props.pageStyle["input"]} ${styles["default-input"]}`} label="Current Price" value={parsePrice(currentPrice)} onChange={(e) => handleInputChange(e)}></input>
    </div>     
  );

}

const SideBar = (props) => {

  const baseToken = props.baseTokenHidden === true ? false : <BaseToken pageStyle={props.pageStyle}></BaseToken>

  return (
    <div className={`${styles["sidebar"]} ${props.pageStyle["outer-glow"]}`}>
      <div className={props.pageStyle['sub-container'] ? props.pageStyle['sub-container'] : styles['sub-container']}>
        <PoolSearch pageStyle={props.pageStyle} protocols={props.protocols} customSearch={props.customSearch} baseTokenHidden={props.baseTokenHidden} perpStatsData={props.perpStatsData}></PoolSearch>
        {baseToken}
      </div>
      <div className={props.pageStyle['sub-container'] ? props.pageStyle['sub-container'] : styles['sub-container']}>
        <Investment pageStyle={props.pageStyle}></Investment>
        <CurrentPrice pageStyle={props.pageStyle}></CurrentPrice>
      </div>
      <StrategyPicker pageStyle={props.pageStyle} strategies={props.strategies}></StrategyPicker>
      <StrategyRange pageStyle={props.pageStyle} leverageHidden={props.leverageHidden}></StrategyRange>
    </div>
  )
}


export default SideBar

