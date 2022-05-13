import { useState, useRef, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {selectBaseToken, selectFeeTier} from '../store/pool'
import { selectInvestment } from '../store/investment';
import { selectSelectedStrategyRanges, updateStrategyRangeInputVal, setStrategyRangeInputVal, 
  setStrategyLeverage, selectStrategyRangeById, selectStrategyRanges, setStrategyHedgingAmount, setStrategyHedgingLeverage, setStrategyHedgingType } from '../store/strategyRanges'
import { CrementButton } from '../components/Button'
import styles from '../styles/modules/SideBar.module.css'
import {parsePrice} from '../helpers/numbers'
import Hedging from './Hedging';
import { ButtonListToggle } from './ButtonList';

const Leverage = (props) => {

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);
  const investment = useSelector(selectInvestment);

  const handleInputChange = (e) => {
    if (props.handleInputChange) props.handleInputChange(e.target.value);
    dispatch(setStrategyLeverage({id: props.strategy.id, leverage: e.target.value}));
  }

  if (props.leverageHidden) {
    return (<></>)
  }
  else {
    return (
    <div className={ props.pageStyle['sub-container'] ? `${props.pageStyle['sub-container']}` : `${styles['sub-container']}`} style={{backgroundColor: "#8bfcd7"}}>
      <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', fontSize: 16, }}>Leverage: <span style={{fontWeight: 600}}>{props.strategy.leverage}x</span></label>
      <input type="range" min="1" max="10" className="leverage-range-control" step={0.1} value={props.strategy.leverage} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', width: '85%', marginLeft: '5%'}}
      onInput={handleInputChange}></input>
      <div className={`${styles["default-input"]} ${styles['leverage-value']}`} style={{width: "100%", textAlign: 'center', fontSize: 16}}>{parsePrice(props.strategy.leverage * investment)} {baseToken.symbol}</div>
    </div>
    );
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
        className={`${props.pageStyle["input"]} ${styles["default-input"]}`} 
        label={props.inputVals.label} 
        value={inputVal} 
        onChange={(e) => handleInputChange(e)}
        onBlur={(e) => handleBlur(e)}>
      </input><br></br>
    </Fragment>)
}

const StrategyRange = (props) => {

  const strategies = useSelector(selectSelectedStrategyRanges);

  const buttonList = [
    {id: "amount", label: "$", style: {color: "black", width: 25, padding: 5, margin: 5}},
    {id: "percent", label: "%", style: {color: "black", width: 25, padding: 5,  margin: 5}}
  ]

  const handleAmountType = (e) => {
    console.log(e)
  }

  const containers = strategies.filter(strat => strat.id !== 'v2').map(strat => {
    return <div className={ props.pageStyle['sub-container'] ? `${props.pageStyle['sub-container']}` : `${styles['sub-container']}`}>
      <div className={styles["input-container"]}>
      <div>
        <label className={styles["input-label"]} style={{color: strat.color}}>{strat.name}</label><br></br>
        <ButtonListToggle handleSelected={handleAmountType} page={props.page} pageStyle={props.pageStyle} buttons={buttonList} className={styles["strategy-amount-type-button"]}></ButtonListToggle>
      </div>
      <StrategyInput pageStyle={props.pageStyle} inputVals={strat.inputs.min} id={strat.id} keyId={"min"}></StrategyInput>
      <StrategyInput pageStyle={props.pageStyle} inputVals={strat.inputs.max} id={strat.id} keyId={"max"}></StrategyInput>
     
      </div>
      { props.leverageHidden ? <></> : <Leverage pageStyle={props.pageStyle} strategy={strat}></Leverage> }
      { props.leverageHidden ? <></> : <Hedging pageStyle={props.pageStyle} strategy={strat}></Hedging> }
      
    </div>
  });

  return (containers);

}

export default StrategyRange