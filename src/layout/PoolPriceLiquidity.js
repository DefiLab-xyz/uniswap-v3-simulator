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
    if (newZoom >= 0.001) setLiquidityZoom(newZoom);
  }

  return (
    <div className={`${styles['pool-price-liquidity-container'] } 
    ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}
    ${props.pageStyle ? props.pageStyle["dashboard-section"] : "dashboard-section"}`}>
      <Title pageStyle={props.pageStyle} className={`${props.pageStyle ? props.pageStyle["title"] : "title"} ${styles['daily-prices-title']}`} title="Daily Prices"></Title>
      <DailyPriceChart pageStyle={props.pageStyle} className={`${styles['chart-container']} ${styles['daily-price-chart-container']} `}></DailyPriceChart>
      <Title className={`${props.pageStyle ? props.pageStyle["title"] : "title"} ${styles['liquidity-density-title']}`} title="Liquidity Density">
      <div className={`${styles['liquidity-density-zoom']}`}>
        <CrementButton type='decrement' onCrement={handleLiquidityZoom}></CrementButton>
        <CrementButton type='increment' onCrement={handleLiquidityZoom}></CrementButton>
      </div>
      </Title>
      <LiquidityDensityChart pageStyle={props.pageStyle} className={`${styles['chart-container']} ${styles['liquidity-density-chart-container']}`}
        zoomLevel={liquidityZoom}
        strokeOpacity={props.page === 'perpetual' ? 1 : 0.4}
        fillOpacity={props.page === 'perpetual' ? 0.3 : 0.2}>
      </LiquidityDensityChart>
    </div>
  )
}

export default PoolPriceLiquidity;