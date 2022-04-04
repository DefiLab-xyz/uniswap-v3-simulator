import { useState, useRef, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {selectBaseToken, selectFeeTier} from '../store/pool'
import { selectInvestment } from '../store/investment';
import { selectSelectedStrategyRanges, updateStrategyRangeInputVal, setStrategyRangeInputVal, setStrategyLeverage, selectStrategyRangeById, selectStrategyRanges } from '../store/strategyRanges'
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
  const strategyRanges = useSelector(selectStrategyRanges);
  const strategyRange = selectStrategyRangeById(strategyRanges, props.id);
  const inputRef = useRef();
  const [inputVal, setInputVal] = useState(parsePrice(props.inputVals.value));
  const [oldInputVal, setOldInputVal] = useState()
  const feeTier = useSelector(selectFeeTier);
  const tick = props.inputVals.value * ((feeTier / 1000000) * 2);

  useEffect(() => {
    setInputVal(props.inputVals.value)
  }, [props.inputVals.value]);

  useEffect(() => {
    setOldInputVal(parsePrice(props.inputVals.value));
  }, [])

  const handleCrement = (crement) => {
    dispatch(updateStrategyRangeInputVal({id: props.id, key: props.keyId, value: (parseFloat(inputRef.current.value) + (tick * crement)) }));
  }

  const handleInputChange = (e) => {
    dispatch(setStrategyRangeInputVal({id: props.id, key: props.keyId, value: e.target.value }));
  }

  const handleBlur = (e) => {
    const maxVal = strategyRange.inputs.max.value;
    const minVal = strategyRange.inputs.min.value;

    if ( (props.keyId === 'max' && maxVal < minVal)  ||  (props.keyId === 'min' && minVal > maxVal)) {
      dispatch(updateStrategyRangeInputVal({id: props.id, key: props.keyId, value: oldInputVal }));
    }
    else {
      dispatch(updateStrategyRangeInputVal({id: props.id, key: props.keyId, value: e.target.value }));
      setOldInputVal(e.target.value);
    }
  }

  return (
    <Fragment>
      <CrementButton type="decrement" onCrement={handleCrement}></CrementButton>
      <label className={styles["input-label"]} style={{marginLeft: 20, marginRight: 20}}>{props.inputVals.name}</label>
      <CrementButton type="incremement" onCrement={handleCrement}></CrementButton><br></br>
      <input ref={inputRef}
        type="number" 
        className={styles["default-input"]} 
        label={props.inputVals.label} 
        value={inputVal} 
        onChange={(e) => handleInputChange(e)}
        onBlur={(e) => handleBlur(e)}>
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