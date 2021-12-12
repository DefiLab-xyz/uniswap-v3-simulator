import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {selectFeeTier} from '../store/pool'
import { selectStrategyRanges, crementStrategyRangeInputVal, setStrategyRangeInputVal } from '../store/strategyRanges'
import { CrementButton } from '../components/Button'
import styles from '../styles/modules/SideBar.module.css'
import {parsePrice} from '../helpers/numbers'

const StrategyInput = (props) => {

  const dispatch = useDispatch();
  const feeTier = useSelector(selectFeeTier);
  const tick = props.inputVals.value * ((feeTier / 1000000) * 2);

  const handleCrement = (crement) => {
    console.log(`props.id: ${props.id}`)
    console.log(`props.keyId: ${props.keyId}`)
    console.log(`crement: ${(tick * crement)}`)
    console.log(feeTier)
    dispatch(crementStrategyRangeInputVal({strategyId: props.id, InputValueKey: props.keyId, crement: (tick * crement)}));
   
  }

  const handleInputChange = (e) => {
    dispatch(setStrategyRangeInputVal({strategyId: props.id, InputValueKey: props.keyId, value: e.target.value}));
  }

  return (
    <React.Fragment>
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
    </React.Fragment>)
}

const StrategyRange = (props) => {

  const strategies = useSelector(selectStrategyRanges);

  const containers = strategies.map(strat => {
    return <div className={styles['sub-container']}>
      <div className={styles["input-container"]}>
      <label className={styles["input-label"]} style={{color: strat.color}}>{strat.name}</label><br></br>
      <StrategyInput inputVals={strat.inputs.min} id={strat.id} keyId={"min"}></StrategyInput>
      <StrategyInput inputVals={strat.inputs.max} id={strat.id} keyId={"max"}></StrategyInput>
      </div>
    </div>
  });

  return (containers);

}

export default StrategyRange