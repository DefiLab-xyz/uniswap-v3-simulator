import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {parsePrice} from '../helpers/numbers'
import styles from '../styles/modules/SideBar.module.css'
import {selectBaseToken, toggleBaseToken, refreshCurrentPrices, selectCurrentPrice, selectPoolID, selectFeeTier} from '../store/pool'
import { selectInvestment, setDefaultInvestment, setInvestment } from '../store/investment'
import { selectProtocol } from '../store/protocol'
import {PoolCurrentPrices} from '../api/thegraph/uniPools'
import PoolSearch from '../components/PoolSearch'
import { ToggleButton, RefreshButton } from '../components/Button'
import StrategyRange from '../components/StrategyRange'
import StrategyPicker from '../components/StrategyPicker'

const BaseToken = (props) => {  

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);
  const currentPrice = useSelector(selectCurrentPrice);

  const handlePriceToggle = () => {
    dispatch(toggleBaseToken());
    dispatch(setDefaultInvestment(currentPrice));
  }

  return ( 
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>Base Token</label>
      <input className={styles["toggle-input"]} label="Base Token" value={baseToken ? baseToken.symbol : ""}></input>
      <ToggleButton onClick={handlePriceToggle} alt="toggle base currency"></ToggleButton>
    </div>
  );
}

const Investment = (props) => {

  const dispatch = useDispatch();
  const investment = useSelector(selectInvestment);
  const handleInputChange = (e) => dispatch(setInvestment(e.target.value));

  return ( 
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>Investment</label>
      <input type="number" className={styles["default-input"]} label="Base Token" value={investment} onChange={(e) => handleInputChange(e)}></input>
    </div>
  );
  
}

const CurrentPrice = (props) => {

  const dispatch = useDispatch();
  const abortController = useRef(new AbortController());
  const protocol = useSelector(selectProtocol);
  const poolID = useSelector(selectPoolID);
  const currentPrice = useSelector(selectCurrentPrice) || 0;

  const handleRefresh = () => {
    abortController.current.abort();
    abortController.current = new AbortController();

    PoolCurrentPrices(abortController.current.signal, protocol.id, poolID).then(d => {
      dispatch(refreshCurrentPrices(d));
    });
  }

  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>Current Price</label>
      <RefreshButton onClick={handleRefresh} alt="Refresh Current Price"></RefreshButton>
      <input className={styles["default-input"]} label="Current Price" value={parsePrice(currentPrice)}></input>
    </div>     
  );

}

const SideBar = (props) => {

  return (
    <div className={`${styles["sidebar"]} outer-glow`}>
      <div className={styles['sub-container']}>
        <PoolSearch></PoolSearch>
        <BaseToken></BaseToken>
      </div>
      <div className={styles['sub-container']}>
        <Investment></Investment>
        <CurrentPrice></CurrentPrice>
      </div>
      <StrategyRange></StrategyRange>
      <StrategyPicker></StrategyPicker>
    </div>
  )
}


export default SideBar

