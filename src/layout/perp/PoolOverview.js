
import styles from '../../styles/modules/PoolOverviewPerp.module.css'
import { Title} from '../../components/charts/PoolOverview';
import { perpStats } from '../../api/perpStats';
import { useSelector } from 'react-redux';
import { selectPool } from '../../store/pool';
import { useEffect, useState } from 'react'
import { parsePrice, formatLargeNumber, round } from '../../helpers/numbers';
import { calcCLI } from '../../helpers/uniswap/liquidity';
import { selectYesterdaysPriceData, selectNormStd, selectLiquidity, selectBaseToken, selectQuoteToken } from '../../store/pool';


const StatContainer = (props) => {

  const yesterday = useSelector(selectYesterdaysPriceData);
  const pool =  useSelector(selectPool);
  const normStd = useSelector(selectNormStd);
  const liquidity = useSelector(selectLiquidity);
  const baseToken = useSelector(selectBaseToken);
  const basePrice = baseToken.currentPrice;
  const [CLI, setCLI] = useState("");
  const lowerBase = props.marketStats && props.marketStats.lowerBaseApr ? parsePrice(props.marketStats.lowerBaseApr, true) : ""
  const upperBase = props.marketStats && props.marketStats.upperBaseApr ? parsePrice(props.marketStats.upperBaseApr, true) : ""
  const lowerReward = props.marketStats && props.marketStats.lowerRewardApr ? parsePrice(props.marketStats.lowerRewardApr, true) : ""
  const upperReward = props.marketStats && props.marketStats.upperRewardApr ? parsePrice(props.marketStats.upperRewardApr, true) : ""
  const volume24H = props.stats && props.stats.volume24h ? formatLargeNumber(props.stats.volume24h) : ""

  useEffect(() => {
    if (pool && pool.token0) {
      setCLI(calcCLI(liquidity, normStd, pool, basePrice));
    }
  }, [pool, normStd, liquidity, basePrice]);

    return (
      <div className={styles['stat-container']}>
        <label class={`${styles['stat-label-1']} sub-title`}>Base APR%</label>
        <div class={`${styles['stat-1']} inner-glow`}>{`${lowerBase}% - ${upperBase}%`}</div>&nbsp;&nbsp;
        <label class={`${styles['stat-label-2']} sub-title`}>Reward APR%</label>
        <div class={`${styles['stat-2']} inner-glow`}>{`${lowerReward}% - ${upperReward}%`}</div>
        <label class={`${styles['stat-label-3']} sub-title`}>Volume 24h</label>
        <div class={`${styles['stat-3']} inner-glow`}>{volume24H}</div>
        <label class={`${styles['stat-label-4']} sub-title`}>Volatility</label>
        <div class={`${styles['stat-4']} inner-glow`}>{round(normStd, 2) + '%'}</div>
        <label class={`${styles['stat-label-5']} sub-title`}>Conc. Liquidity Index</label>
        <div class={`${styles['stat-5']} inner-glow`}>{round(CLI, 2) + '%'}</div>
      </div>
    )

} 

const PoolOverview = (props) => {

  const pool = useSelector(selectPool);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const [stats, setStats] = useState();
  const [marketStats, setMarketStats] = useState();


  useEffect(() => {
    if (pool && pool.id) {
      const market = props.markets.find( d => d.pool === pool.id); 
      const address = props.addresses.find( d => d.address_lower === market.id)
      console.log(pool.id);
      if (market) {
        perpStats(address.address).then(d => {
          console.log(address.address, d)
          if (d) setStats(d);
        });
      }
    }
  }, [pool, props.addresses, props.markets, props.stats]);

  useEffect(() => {
    if (props.stats && props.stats.length && pool && pool.token0) {
      setMarketStats(props.stats.find(f => f.marketSymbol === `${pool.token0.symbol}/${pool.token1.symbol}`));
    }
  },[props.stats, pool] );

  useEffect(() => {
    const docEl = document.documentElement;
    docEl.style.setProperty("--strategy-container-row-start", 12);
  }, [])


  return (
    <div className={`${ props.pageStyle ? props.pageStyle["dashboard-section"]: "dashboard-section"} 
    ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}  
    ${styles['pool-overview-container']}`}>
      <Title text={`Pool Stats ${quoteToken.symbol} / ${baseToken.symbol}`}></Title>
      <div className={styles["chart-container"]}>
       
        <StatContainer stats={stats} marketStats={marketStats}></StatContainer>
        {/* <PoolStats poolStatsHidden={props.poolStatsHidden}></PoolStats> */}
      </div>
      
    </div>
  )
}

export default PoolOverview