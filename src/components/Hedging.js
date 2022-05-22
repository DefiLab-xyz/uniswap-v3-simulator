import {Fragment, useRef, useState} from 'react'
import { useDispatch } from 'react-redux';
import { setStrategyHedgingType, setStrategyHedgingLeverage,  setStrategyHedgingAmount} from '../store/strategyRanges';
import { parsePrice } from '../helpers/numbers';
import { ButtonListToggle } from './ButtonList';
import styles from '../styles/modules/Hedging.module.css'

const HedgingTitle = (props) => {

  const  arrows = ["up", "down"];
  
  const arrow = useRef(1); 
  const handleToggle = () => {
    arrow.current = 1 - arrow.current;
    if ( props.handleToggle ) props.handleToggle();
  }

  return (
  <div className={`${styles["input-label"]} ${styles['hedging-label']}`} onClick={handleToggle}>
    <div>Hedging Strategy</div>
    <div className={styles["hedging-arrow"]} ><i className={`${styles['arrow']} ${styles[arrows[arrow.current]]}`}></i></div>
  </div>
  )
}

const HedgingType = (props) => {

  const dispatch = useDispatch();
  const handleType = (type) => {
    dispatch(setStrategyHedgingType({id: props.strategy.id, type: type.id }));
  }

  const buttonList = [
    {id: "short", label: "short", style: {color: "black", width: 60, padding: 5, margin: 5}},
    {id: "long", label: "long", style: {color: "black", width: 60, padding: 5,  margin: 5}}
  ]

  return (
    <ButtonListToggle handleSelected={handleType} page={props.page} pageStyle={props.pageStyle} buttons={buttonList} className={styles["hedging-type-button"]}></ButtonListToggle>
  )
}


const HedgingAmount = (props) => {

  const dispatch = useDispatch();
  const handleAmount = (e) => {

    dispatch(setStrategyHedgingAmount({id: props.strategy.id, amount: e.target.value === "" ? 0 : e.target.value}))

  }

  return (
    <div className={styles['hedging-amount']}>
    <label for="hedgingamount">Amount vUSD</label>
    <input id="hedgingamount" onChange={(e) => handleAmount(e)} className={`${props.pageStyle["input"]} ${styles["default-input"]}`} value={props.strategy.hedging.amount}></input>
  </div>
  )

}

const HedgingLeverage = (props) => {
  const dispatch = useDispatch();
  const handleLeverage = (e) => {
    dispatch(setStrategyHedgingLeverage({id: props.strategy.id, leverage: e.target.value}))
  }

  return (
    <div class="leverage-container">
    <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leverage: {props.strategy.hedging.leverage}x</label>
    <input type="range" min="1" max="10" className="leverage-range-control" step={0.1} value={props.strategy.hedging.leverage} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', width: '85%', marginLeft: '5%'}}
    onInput={(e) => handleLeverage(e)}></input>
    <label className={`${styles["input-label"]} ${styles['leverage-label']}`} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leveraged vUSD:</label>
    <div className={`${styles["default-input"]} ${styles['leverage-value']}`} style={{display: 'grid', alignItems: 'center', justifyContent: 'center'}}>{parsePrice(props.strategy.hedging.leverage * props.strategy.hedging.amount)}</div>
  </div>
  )
}

export const Hedging = (props) => {

    const [visibility, setVisibility] = useState(false);
    const dispatch = useDispatch();
    const handleToggle = () => setVisibility(!visibility);

    const handleType = (type) => {
      dispatch(setStrategyHedgingType({id: props.strategy.id, type: type}));
    }

    const handleLeverage = (e) => {
      dispatch(setStrategyHedgingLeverage({id: props.strategy.id, leverage: e.target.value}))
    }

    return (
      <Fragment>
      <HedgingTitle page={props.page} pageStyle={props.pageStyle} handleToggle={handleToggle}></HedgingTitle>
      <div 
      style={{display: visibility ? null : 'none'}} 
      className={styles['sub-container']}>
        <HedgingType page={props.page} pageStyle={props.pageStyle} strategy={props.strategy}></HedgingType>
        <HedgingAmount page={props.page} pageStyle={props.pageStyle} strategy={props.strategy}></HedgingAmount>
        <HedgingLeverage page={props.page} pageStyle={props.pageStyle} strategy={props.strategy}></HedgingLeverage>
        {/* <div  style={{ display: visibility ? 'grid' : 'none', alignItems: 'center', justifyContent:'center' }}>
          <div className={styles['hedging-type']}>
            <label for="short">Short</label>
            <input onChange={() => handleType('short')} type="radio" id="short" name="hedgingtype" value="short" checked={ props.strategy.hedging.type === 'short' ? true : false}></input>
            <label for="long">Long</label>
            <input onChange={() => handleType('long')} type="radio" id="long" name="hedgingtype" value="long" checked={ props.strategy.hedging.type === 'long' ? true : false}></input>
          </div>
        
          <div className={styles['hedging-amount']}>
            <label for="hedgingamount">Amount vUSD</label>
            <input id="hedgingamount" onChange={(e) => handleAmount(e)} className={`${props.pageStyle["input"]} ${styles["default-input"]}`} value={props.strategy.hedging.amount}></input>
          </div>

          <div class="leverage-container">
            <label className={styles["input-label"]} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leverage: {props.strategy.hedging.leverage}x</label>
            <input type="range" min="1" max="10" className="leverage-range-control" step={0.1} value={props.strategy.hedging.leverage} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center', width: '85%', marginLeft: '5%'}}
            onInput={(e) => handleLeverage(e)}></input>
            <label className={`${styles["input-label"]} ${styles['leverage-label']}`} style={{ display: 'grid', alignItems: 'center', justifyContent: 'center'}}>Leveraged vUSD:</label>
            <div className={`${styles["default-input"]} ${styles['leverage-value']}`} style={{display: 'grid', alignItems: 'center', justifyContent: 'center'}}>{parsePrice(props.strategy.hedging.leverage * props.strategy.hedging.amount)}</div>
          </div>
        </div> */}
      </div>
      </Fragment>
      
    )
}

export default Hedging