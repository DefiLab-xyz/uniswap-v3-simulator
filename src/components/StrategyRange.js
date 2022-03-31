import { useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {selectBaseToken, selectFeeTier} from '../store/pool'
import { selectInvestment } from '../store/investment';
import { selectSelectedStrategyRanges, crementStrategyRangeInputVal, setStrategyRangeInputVal, setStrategyLeverage } from '../store/strategyRanges'
import { CrementButton } from '../components/Button'
import styles from '../styles/modules/SideBar.module.css'
// import sliderStyles
import {parsePrice} from '../helpers/numbers'

const Leverage = (props) => {

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);
  const investment = useSelector(selectInvestment)

  const handleInputChange = (e) => {
    if (props.handleInputChange) props.handleInputChange(e.target.value);
    dispatch(setStrategyLeverage({id: props.strategy.id, leverage: e.target.value}));
  }

  if (props.leverageHidden) {
    return (<></>)
  }
  else {
    return (
    <div class="leverage-container">
      <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leverage: {props.strategy.leverage}x</label>
      <input type="range" min="1" max="10" className="leverage-range-control" step={0.1} value={props.strategy.leverage} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', width: '90%'}}
      onInput={handleInputChange}></input>
      <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leveraged {baseToken.symbol}:</label>
      <div className={styles["default-input"]} style={{display: 'grid', alignItems: 'center', justifyContent: 'center'}}>{parsePrice(props.strategy.leverage * investment)}</div>
    </div>);
  }
}

const StrategyInput = (props) => {

  const dispatch = useDispatch();
  const feeTier = useSelector(selectFeeTier);
  const tick = props.inputVals.value * ((feeTier / 1000000) * 2);

  const handleCrement = (crement) => {
    dispatch(crementStrategyRangeInputVal({id: props.id, key: props.keyId, crement: (tick * crement)}));
  }

  const handleInputChange = (e) => {
    dispatch(setStrategyRangeInputVal({id: props.id, key: props.keyId, value: e.target.value}));
  }

  return (
    <Fragment>
      <CrementButton type="decrement" onCrement={handleCrement}></CrementButton>
      <label className={styles["input-label"]} style={{marginLeft: 20, marginRight: 20}}>{props.inputVals.name}</label>
      <CrementButton type="incremement" onCrement={handleCrement}></CrementButton><br></br>
      <input 
        type="number" 
        className={styles["default-input"]} 
        label={props.inputVals.label} 
        value={parsePrice(props.inputVals.value)} 
        onChange={(e) => handleInputChange(e)}>
      </input><br></br>
    </Fragment>)
}

const StrategyRange = (props) => {

  const strategies = useSelector(selectSelectedStrategyRanges);

  const containers = strategies.filter(strat => strat.id !== 'v2').map(strat => {
    return <div className={styles['sub-container']}>
      <div className={styles["input-container"]}>
      <label className={styles["input-label"]} style={{color: strat.color}}>{strat.name}</label><br></br>
      <StrategyInput inputVals={strat.inputs.min} id={strat.id} keyId={"min"}></StrategyInput>
      <StrategyInput inputVals={strat.inputs.max} id={strat.id} keyId={"max"}></StrategyInput>
      </div>
      { props.leverageHidden ? <></> : <Leverage strategy={strat}></Leverage> }
    </div>
  });

  return (containers);

}

export default StrategyRange