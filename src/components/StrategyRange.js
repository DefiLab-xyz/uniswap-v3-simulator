import { useState, useRef, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {selectPool, selectBaseToken, selectFeeTier, selectQuoteToken} from '../store/pool'
import { selectInvestment } from '../store/investment';
import { selectSelectedStrategyRanges, updateStrategyRangeInputVal, setStrategyRangeInputVal, 
  setStrategyLeverage, selectStrategyRangeById, selectStrategyRanges, selectStrategyRangeType, setStrategyRangeType, setStrategyRangeInputPerc} from '../store/strategyRanges'
import { CrementButton } from '../components/Button'
import styles from '../styles/modules/SideBar.module.css'
import {parsePrice, round} from '../helpers/numbers'
import Hedging from './Hedging';
import { ButtonListToggle } from './ButtonList';
import { roundToNearestTick } from '../helpers/uniswap/liquidity';
import ToolTip from './ToolTip';
import HelpText from '../data/HelpText';

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
      <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', fontSize: 16, }}>Leverage: <span style={{fontWeight: 500}}>{props.strategy.leverage}x</span></label>
      <input type="range" min="1" max="10" className="leverage-range-control" step={0.1} value={props.strategy.leverage} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', width: '85%', marginLeft: '5%'}}
      onInput={handleInputChange}></input>
      <div className={`${styles["default-input"]} ${styles['leverage-value']}`} style={{width: "100%", textAlign: 'center', fontSize: 16}}>{parsePrice(props.strategy.leverage * investment)} {baseToken.symbol}</div>
    </div>
    );
  }
}

const StrategyInput = (props) => {

  const dispatch = useDispatch();
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const pool = useSelector(selectPool);
  const strategyRanges = useSelector(selectStrategyRanges);
  const type = useSelector(selectStrategyRangeType);
  const strategyRange = selectStrategyRangeById(strategyRanges, props.id);
  const inputRef = useRef();
  const [inputVal, setInputVal] = useState(parsePrice(props.inputVals.value));
  const [inputPerc, setInputPerc] = useState(props.inputVals.percent);
  const [oldInputVal, setOldInputVal] = useState();
  const [oldInputPerc, setOldInputPerc] = useState();
  const feeTier = useSelector(selectFeeTier);
  const tick = props.inputVals.value * ((feeTier / 1000000) * 2);

  const decimal0 = baseToken.id === 0 ? baseToken.decimals : quoteToken.decimals;
  const decimal1 = baseToken.id === 1 ? baseToken.decimals : quoteToken.decimals;

  useEffect(() => {
    setInputVal(props.inputVals.value);
  }, [props.inputVals.value]);

  useEffect(() => {
    setInputPerc(props.inputVals.percent);
  }, [props.inputVals.percent]);

  useEffect(() => {
    setOldInputVal(parsePrice(props.inputVals.value));
    setOldInputPerc(props.inputVals.percent);
  }, []);

  const handleCrement = (crement) => {

    let value, percent;

    if (type === 'amount') {
       value = roundToNearestTick((parseFloat(inputRef.current.value) + (tick * crement)), pool.feeTier, baseToken.decimals, quoteToken.decimals);
    }
    else if (type === 'percent') {
      value = roundToNearestTick((baseToken.currentPrice + ( baseToken.currentPrice * parseFloat((parseFloat(inputRef.current.value) + crement) / 100))), pool.feeTier,  baseToken.decimals , quoteToken.decimals);
    }

    percent = round((( value - baseToken.currentPrice) / baseToken.currentPrice) * 100, 1);
    dispatch(setStrategyRangeInputVal({id: props.id, key: props.keyId, value: value , percent: percent }));
  }

  const handleInputChange = (e) => {
    if (type === 'amount') {
      const percent = round(((e.target.value - baseToken.currentPrice) / baseToken.currentPrice) * 100, 1);
      dispatch(setStrategyRangeInputVal({id: props.id, key: props.keyId, value: e.target.value, percent:  percent}));
    }
    else if ( type === 'percent') {
      const value = parsePrice(baseToken.currentPrice + (baseToken.currentPrice * parseFloat(e.target.value / 100)));
      dispatch(setStrategyRangeInputPerc({id: props.id, key: props.keyId, percent: e.target.value, value: value }));
    }
  }

  const handleBlur = (e) => {

      const maxVal = strategyRange.inputs.max.value;
      const minVal = strategyRange.inputs.min.value;
  
      if ( (props.keyId === 'max' && maxVal < minVal)  ||  (props.keyId === 'min' && minVal > maxVal)) {
        dispatch(updateStrategyRangeInputVal({id: props.id, key: props.keyId, value: oldInputVal, percent: oldInputPerc }));
      }
      else {
        if (type === 'amount') {
          const percent = round(((e.target.value - baseToken.currentPrice) / baseToken.currentPrice) * 100, 1);
          dispatch(updateStrategyRangeInputVal({id: props.id, key: props.keyId, value: e.target.value, percent: percent }));
          setOldInputVal(e.target.value);
          setOldInputPerc(percent);
        }
        else if (type === 'percent') {
          const value = parsePrice(baseToken.currentPrice + (baseToken.currentPrice * parseFloat(e.target.value / 100)));
          dispatch(setStrategyRangeInputPerc({id: props.id, key: props.keyId, percent: e.target.value, value: value }));
          setOldInputVal(value);
          setOldInputPerc(e.target.value);
        }
      }
  }

  useEffect(() => {
    console.log(props.keyId , inputPerc, inputVal)
  }, [type])

  return (
    <Fragment>
      <CrementButton type="decrement" onCrement={handleCrement}></CrementButton>
      <label className={styles["input-label"]} style={{marginLeft: 20, marginRight: 20}}>{props.inputVals.name}</label>
      <CrementButton type="incremement" onCrement={handleCrement}></CrementButton><br></br>
      <input ref={inputRef}
        className={`${props.pageStyle["input"]} ${styles["default-input"]}`} 
        label={props.inputVals.label} 
        value={type ===  'percent' ? inputPerc : inputVal} 
        onChange={(e) => handleInputChange(e)}
        onBlur={(e) => handleBlur(e)}>
      </input><br></br>
    </Fragment>)
}

const StrategyRange = (props) => {

  const strategies = useSelector(selectSelectedStrategyRanges);
  const dispatch = useDispatch();

  const buttonList = [
    {id: "amount", label: "$", style: {width: 25, padding: 5, margin: 5}},
    {id: "percent", label: "%", style: {width: 25, padding: 5,  margin: 5}}
  ]

  const handleAmountType = (e) => {
    dispatch(setStrategyRangeType(e.id));
  }

  const containers = strategies.filter(strat => strat.id !== 'v2').map(strat => {
    return <div className={ props.pageStyle['sub-container'] ? `${props.pageStyle['sub-container']} ${styles['sidebar-scroll']}` : `${styles['sub-container']}`}>
      <div className={styles["input-container"]}>
      <div>
        <label className={styles["input-label"]} style={{color: strat.color}}>{strat.name}</label><br></br>
        <div style={{display: "flex", justifyContent: "center", marginTop: 5}}>
        <ButtonListToggle handleSelected={handleAmountType} page={props.page} pageStyle={props.pageStyle} buttons={buttonList} className={styles["strategy-amount-type-button"]}></ButtonListToggle>
        <ToolTip textStyle={{width: "150px", height: "fill-content", left:"-120px", top: "20px", textAlign: "left", border: props.page === 'perpetual' ? "0.5px solid black" : "",}} 
        buttonStyle={{width: 15, height: 15}} text={HelpText.perpetual.rangeToggle}>?</ToolTip>
      </div>
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