import styles from '../styles/modules/StrategyIndicators.module.css'
import { selectBaseToken, selectCurrentPrice, selectLoading, selectQuoteToken } from '../store/pool'
import { selectSelectedEditableStrategyRanges } from '../store/strategyRanges'
import { useDispatch, useSelector } from 'react-redux'
import { round } from '../helpers/numbers'
import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { genTokenRatios } from '../helpers/uniswap/strategies'
import { selectTokenRatios, setTokenRatio } from '../store/tokenRatios'
import HelpText from '../data/HelpText'
import ToolTip from './ToolTip'

export const ConcentratedLiquidityMultiplier = (props) => {

  return (
      <div className={styles['cli-container']}>
        <div className={styles['title']}>Concentrated Liquidity Multiplier<span className={props.pageStyle['help-icon']}>
      <ToolTip textStyle={{width: "450px", height: "fill-content", left:"-450px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].CLM}>?</ToolTip>
      </span></div>
        <div className={styles['cli-value-container']}>
          {
            props.strategies.map(d => {
             return <div className={`${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"} ${styles['cli-value']}`} style={{color: d.color}}>{round(d.liquidityMultiplier * d.leverage, 2)}x</div>
            })
          }
        </div> 
      </div> 
  )

}

export const StrategyRangeSize = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);

  const genRangeSizes = (min, max) => {
    const rangeSizeMin = currentPrice > 0 ? (min - currentPrice) / currentPrice: 0; 
    const rangeSizeMax = currentPrice > 0 ? (max - currentPrice) / currentPrice : 0;
    const minLine = rangeSizeMin < 0 ? (round(0.05 + (0.45 * (1 + (rangeSizeMin))), 2)) : (round(0.5 + (0.45 * (rangeSizeMin)), 2));
    const maxLine = rangeSizeMax < 0 ? (round(0.05 + (0.45 * (1 + (rangeSizeMax))), 2)) : (round(0.5 + (0.45 * (rangeSizeMax)), 2));

    return {rangeSizeMin: round((rangeSizeMin * 100), 1), rangeSizeMax: round((rangeSizeMax * 100), 1), minLine: minLine, maxLine: maxLine}
  }

  const MinMaxLabels =  () => {
    return  (
      <div className={styles['range-min-max-labels']}>
        <div className={styles['range-min-max-label']}>MIN</div>
        <div style={{width: "35%"}}></div>
        <div className={styles['range-min-max-label']}>MAX</div>
      </div>
    )}

  const RangeLine = (props) => {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <div className={styles['range-size-percent']}>{props.rangeSizeMin}%</div>
      <div style={{width: "40%"}}>
        <svg width="100%" height="30px">
          <line x1={`${props.minLine * 100}%`} x2={`${props.maxLine * 100}%`} y1="35%"  y2="35%" strokeWidth="2px" stroke={props.color} stroke-opacity="0.8" stroke-linecap="round"></line>
          <line x1={`${props.minLine * 100}%`} x2={`${props.maxLine * 100}%`} y1="35%"  y2="35%" strokeWidth="7px" stroke={props.color} stroke-opacity="0.3" stroke-linecap="round"></line>
          <line x1="5%" y1="35%" x2="95%" y2="35%" strokeWidth="1px" stroke={props.color} stroke-opacity="0.6" stroke-dasharray="1 1"></line>
          <circle cx="50%" cy="35%" r="1.5" fill="#ff6666" strokeWidth="1px"></circle>
          <circle cx="50%" cy="35%" r="3" fill="#ff6666" strokeWidth="1px" opacity="0.1"></circle>
        </svg>
      </div> 
      <div className={styles['range-size-percent']}>{props.rangeSizeMax}%</div>
    </div>
    )
  }
 

  return (
    <div className={`${styles['range-sizes-outer-container']} `}>
      <div className={styles['title']}>Range size
      <span className={props.pageStyle['help-icon']}>
      <ToolTip textStyle={{width: "250px", height: "fill-content", left:"-250px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].rangeSize}>?</ToolTip>
      </span>
      </div>
      <div className={`${styles['range-sizes-outer-container']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}>
        <MinMaxLabels></MinMaxLabels>
        {
          props.strategies.map(d => {
            const { rangeSizeMin, rangeSizeMax, minLine, maxLine}  = genRangeSizes(d.inputs.min.value, d.inputs.max.value);
            return ( <RangeLine rangeSizeMin={rangeSizeMin} rangeSizeMax={rangeSizeMax} minLine={minLine} maxLine={maxLine} color={d.color}></RangeLine> );
          })
        }
      </div>
  </div>
  )
}

export const StrategyTokenRatio = (props) => {

  const dispatch = useDispatch();
  const selectedStrategies = useSelector(selectSelectedEditableStrategyRanges);
  const base = useSelector(selectBaseToken);
  const quote = useSelector(selectQuoteToken);
  const currentPrice = useSelector(selectCurrentPrice);
  // const [tokenRatios, setTokenRatioss] = useState([]);
  const tokenRatios =  useSelector(selectTokenRatios);

  useEffect(() => {
    if (props.chartData && selectedStrategies) {

      selectedStrategies.forEach(sd => {
          const data = props.chartData.find(cd => cd.id === sd.id);
          if (data) {
            const ratioIndicators = genTokenRatios(data.data, currentPrice);

            if (ratioIndicators) {
              ratioIndicators.id = sd.id;
              dispatch(setTokenRatio(ratioIndicators))
             
            }
          }
      });
    }
  }, [selectedStrategies, props.chartData, currentPrice, dispatch]);

  const TokenRatioLine = (props) => {

    const loading = useSelector(selectLoading);
    if (loading) return (<></>);

    const ratioLine = (0.1 + (0.8 * (props.tokenRatio.token0 / 100))) * 100

    return (
      <div style={{gridColumn: "1 / span 5"}}>
      <svg width="100%" height="30px" >
        <line x1="10%" x2='90%' y1="17px" y2="17px" stroke={props.tokenRatio.color} strokeLinecap="round" strokeWidth="9px" opacity="0.2"></line>
        <line x1="10%" x2='90%' y1="17px" y2="17px" stroke={props.tokenRatio.color} strokeLinecap="round" strokeWidth="2px" opacity="0.4"></line>
        <line x1="10%" x2={`${ratioLine}%`} y1="17px" y2="17px" stroke={props.tokenRatio.color} strokeLinecap="round" strokeWidth="2px" opacity="0.7"></line>   
      </svg>
      </div>
    )
  }


  return (
    <div>
      <div className={styles['title']}>Token Ratio
      <span className={props.pageStyle['help-icon']}>
      <ToolTip textStyle={{width: "450px", height: "fill-content", left:"-450px", top: "20px", border: props.page === 'perpetual' ? "0.5px solid black" : "", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].tokenRatio}>?</ToolTip>
      </span>
      
      </div>
      <div className={` ${styles['token-ratio-container']} ${props.pageStyle ? props.pageStyle["inner-glow"] : "inner-glow"}`}>
        <div className={styles['token-ratio-base']} >{base.symbol ? base.symbol : ""}</div>
        <div className={styles['token-ratio-quote']}>{quote.symbol ? quote.symbol : ""}</div>
        {

          selectedStrategies.map(s => {
            const tr = tokenRatios.find( t => t.id === s.id);
            return tr ? (
              <Fragment>
                <TokenRatioLine tokenRatio={tr}></TokenRatioLine>
                <div className={styles['token-ratio-base']} >{tr.token0 ? tr.token0 + "%" : ""}</div>
                <div className={styles['token-ratio-quote']}>{tr.token1 ? tr.token1 + "%" : ""}</div>
              </Fragment>
            ) : <></>
          })
        }
      
      </div>
    </div>
   
  )
}