import styles from '../styles/modules/PoolPriceLiquidity.module.css'

import DailyPriceChart from '../components/uniswap/DailyPriceChart';
import LiquidityDensityChart from '../components/uniswap/LiquidityDensity';

const PoolPriceLiquidity = (props) => {

  const Title = (props) => {
    return (
      <div className={`title ${props.className}`}>{props.title}</div>
    )
  }

  return (
    <div className={`${styles['pool-price-liquidity-container'] } outer-glow dashboard-section`}>
      <Title className={`title ${styles['daily-prices-title']}`} title="Daily Prices"></Title>
      <DailyPriceChart className={`${styles['chart-container']} ${styles['daily-price-chart-container']} `}></DailyPriceChart>
      <Title className={`title ${styles['liquidity-density-title']}`} title="Liquidity Density"></Title>
      <LiquidityDensityChart className={`${styles['chart-container']} ${styles['liquidity-density-chart-container']}`}></LiquidityDensityChart>
    </div>
  )
}

export default PoolPriceLiquidity;