import styles from '../styles/modules/StrategyIndicators.module.css'
import { selectBaseToken, selectCurrentPrice, selectLoading, selectQuoteToken } from '../store/pool'
import { selectSelectedStrategyRanges } from '../store/strategyRanges'
import { useSelector } from 'react-redux'
import { round } from '../helpers/numbers'
import React, { Fragment, useCallback, useEffect, useState } from 'react'


export const ConcentratedLiquidityMultiplier = (props) => {

  return (
      <div className={styles['cli-container']}>
        <div className={styles['title']}>Concentrated Liquidity Multiplier</div>
        <div className={styles['cli-value-container']}>
          {
            props.strategies.map(d => {
             return <div className={`inner-glow ${styles['cli-value']}`} style={{color: d.color}}>{d.liquidityMultiplier}x</div>
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
      <div className={styles['title']}>Range Size</div>
      <div className={`${styles['range-sizes-outer-container']} inner-glow`}>
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

  const selectedStrategies = useSelector(selectSelectedStrategyRanges);
  const base = useSelector(selectBaseToken);
  const quote = useSelector(selectQuoteToken);
  const currentPrice = useSelector(selectCurrentPrice);
  const [tokenRatios, setTokenRatios] = useState([]);
 
  const getRatioIndsForPrice = (strategyData, currentPrice) =>  {
    return strategyData.reduce((acc, obj) =>
       Math.abs(currentPrice - obj.x) < Math.abs(currentPrice - acc.x) ? obj : acc
     );
   }

  const genRatioIndicators = useCallback((strategyData, currentPrice) => {
    const ratioVals = getRatioIndsForPrice(strategyData, currentPrice);
    if (ratioVals) {
      const token0 = round((ratioVals.base / ratioVals.y) * 100, 2);
      const token1 = round(100 - token0, 2);
      return {token0: token0, token1: token1 };
    }
  }, []);

  useEffect(() => {
    const tempTokenRatios = [];

    if (props.chartData && selectedStrategies) {
      selectedStrategies.forEach(sd => {
          const data = props.chartData.find(cd => cd.id === sd.id);
          if (data) {
            const ratioIndicators = genRatioIndicators(data.data, currentPrice);
            if (ratioIndicators) {
              ratioIndicators.color = sd.color;
              tempTokenRatios.push(ratioIndicators);
            }
          }
      });
      setTokenRatios(tempTokenRatios);
    }
  }, [selectedStrategies, props.chartData, currentPrice, genRatioIndicators]);

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
      <div className={styles['title']}>Token Ratio</div>
      <div className={` ${styles['token-ratio-container']} inner-glow`}>
        <div className={styles['token-ratio-base']} >{base.symbol ? base.symbol : ""}</div>
        <div className={styles['token-ratio-quote']}>{quote.symbol ? quote.symbol : ""}</div>
        {
          tokenRatios.map(tr => {
            return (
              <Fragment>
                <TokenRatioLine tokenRatio={tr}></TokenRatioLine>
                <div className={styles['token-ratio-base']} >{tr.token0 ? tr.token0 + "%" : ""}</div>
                <div className={styles['token-ratio-quote']}>{tr.token1 ? tr.token1 + "%" : ""}</div>
              </Fragment>
            )
          })
        }
      
      </div>
    </div>
   
  )
}