import { useState } from 'react';
import styles from '../styles/modules/PoolPriceLiquidity.module.css'
import DailyPriceChart from '../components/uniswap/DailyPriceChart';
import LiquidityDensityChart from '../components/uniswap/LiquidityDensityChart';
import { CrementButton } from '../components/Button';

const Title = (props) => {
  return (
    <div className={`title ${props.className}`}>{props.title}{props.children}</div>
  )
}

const PoolPriceLiquidity = (props) => {

  const [liquidityZoom, setLiquidityZoom] = useState(0.9);

  const handleLiquidityZoom = (zoom) => {
    const newZoom = liquidityZoom + (zoom / 10 * -1)
    console.log(newZoom)
    if (newZoom >= 0.001) setLiquidityZoom(newZoom);
  }

  return (
    <div className={`${styles['pool-price-liquidity-container'] } outer-glow dashboard-section`}>
      <Title className={`title ${styles['daily-prices-title']}`} title="Daily Prices"></Title>
      <DailyPriceChart className={`${styles['chart-container']} ${styles['daily-price-chart-container']} `}></DailyPriceChart>
      <Title className={`title ${styles['liquidity-density-title']}`} title="Liquidity Density">
      <div className={`${styles['liquidity-density-zoom']}`}>
        <CrementButton type='decrement' onCrement={handleLiquidityZoom}></CrementButton>
        <CrementButton type='increment' onCrement={handleLiquidityZoom}></CrementButton>
      </div>
      </Title>
      <LiquidityDensityChart className={`${styles['chart-container']} ${styles['liquidity-density-chart-container']}`}
        zoomLevel={liquidityZoom}>
      </LiquidityDensityChart>
    </div>
  )
}

export default PoolPriceLiquidity;