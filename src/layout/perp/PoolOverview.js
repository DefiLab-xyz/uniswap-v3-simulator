
import styles from '../../styles/modules/PoolOverviewPerp.module.css'
import { perpStats } from '../../api/perpStats';
import { useSelector } from 'react-redux';
import { selectPool, selectFeeTier } from '../../store/pool';
import { useEffect, useState, Fragment } from 'react'
import { parsePrice, formatLargeNumber, round } from '../../helpers/numbers';
import { calcCLI } from '../../helpers/uniswap/liquidity';
import { selectYesterdaysPriceData, selectNormStd, selectLiquidity, selectBaseToken, selectQuoteToken } from '../../store/pool';
import { selectProtocol } from '../../store/protocol';
import ToolTip from '../../components/ToolTip';
import HelpText from '../../data/HelpText';

const StatContainer = (props) => {

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
  const fee24h = props.stats && props.stats.volume24h ? props.stats.volume24h * 0.001 : ""

  useEffect(() => {
    if (pool && pool.token0) {
      setCLI(calcCLI(liquidity, normStd, pool, basePrice));
    }
  }, [pool, normStd, liquidity, basePrice]);

    return (
      <div className={styles['stat-container']}>
        <label class={`${styles['stat-label-1']} sub-title`}>Base APR%
          <span><ToolTip textStyle={{width: "200px", height: "fill-content", left:"0px", top: "20px", border: "0.5px solid black", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].baseFee}>?</ToolTip>
          </span>
        </label>
        <div class={`${styles['stat-1']} inner-glow`}>{`${lowerBase}% - ${upperBase}%`}</div>&nbsp;&nbsp;
        <label class={`${styles['stat-label-2']} sub-title`}>Reward APR%
        <span><ToolTip textStyle={{width: "200px", height: "fill-content", left:"0px", top: "20px", border: "0.5px solid black", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].rewardAPR}>?</ToolTip>
          </span>
        </label>
        <div class={`${styles['stat-2']} inner-glow`}>{`${lowerReward}% - ${upperReward}%`}</div>
        <label class={`${styles['stat-label-3']} sub-title`}>Volume 24h</label>
        <div class={`${styles['stat-3']} inner-glow`}>$ {volume24H}</div>
        <label class={`${styles['stat-label-4']} sub-title`}>Fee 24h</label>
        <div class={`${styles['stat-4']} inner-glow`}>$ {formatLargeNumber(fee24h)}</div>
        <label class={`${styles['stat-label-5']} sub-title`}>Volatility
        <span><ToolTip textStyle={{width: "400px", height: "fill-content", left:"-400px", top: "20px", border: "0.5px solid black", textAlign: "left"}} 
            buttonStyle={{width: 15, height: 15}} text={HelpText[props.page].volatility}>?</ToolTip>
          </span>
        </label>
        <div class={`${styles['stat-5']} inner-glow`}>{round(normStd, 2) + '%'}</div>

      </div>
    )

} 

export const Title = (props) => {

  const protocol = useSelector(selectProtocol);
  
  return (
    <div className={`${props.pageStyle ? props.pageStyle["title"] : "title"} ${styles['title']}`}>
      <span><img src={protocol.logo} alt={protocol.title} style={{ width: "18px", height: "18px", marginRight: 5}}></img></span>
      <span>{props.text}</span>
    </div>
  );
}

const PoolOverview = (props) => {

  const pool = useSelector(selectPool);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const [stats, setStats] = useState();
  const [marketStats, setMarketStats] = useState();


  useEffect(() => {
    if (pool && pool.id && props.markets && props.markets.length && props.addresses && props.addresses.length) {
      const market = props.markets.find( d => d.pool === pool.id); 
      if (market) {
        const address = props.addresses.find( d => d.address_lower === market.id)
        perpStats(address.address).then(d => {
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
    docEl.style.setProperty("--strategy-container-row-start", 14);
  }, [])


  return (
    <Fragment>
    <div className={styles['tab']}></div>
    <div className={styles['tab2']}></div>
    <Title className={styles['title']} text={`Pool Stats ${quoteToken.symbol} / ${baseToken.symbol}`}></Title>
    <div className={`${ props.pageStyle ? props.pageStyle["dashboard-section"]: "dashboard-section"} 
    ${props.pageStyle ? props.pageStyle["outer-glow"] : "outer-glow"}  
    ${styles['pool-overview-container']}`}>
     
      <div className={styles["chart-container"]}>
        <StatContainer page={props.page} pageStyle={props.pageStyle} stats={stats} marketStats={marketStats}></StatContainer>
        {/* <PoolStats poolStatsHidden={props.poolStatsHidden}></PoolStats> */}
      </div>
    </div>
    </Fragment>
  )
}

export default PoolOverview