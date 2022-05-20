import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, Fragment, useRef } from "react";

import styles from '../styles/modules/containers/PerpetualSimulator.module.css';
import themeProps from '../data/themeProperties.json'

// Layout //
import NavBar from "../layout/NavBar";
import SideBar from "../layout/SideBar";
import DashBoard from "../layout/DashBoard";
import PoolOverview from '../layout/perp/PoolOverview';
import StrategyOverview from '../layout/StrategyOverview';
import PoolPriceLiquidity from '../layout/PoolPriceLiquidity';
import StrategyBacktest from '../layout/StrategyBacktest';

// Components //
import Grid from "../components/Grid"
import PerpLink from '../components/perpetual/PerpLink';

// Data //
import { poolById, poolByIds } from '../api/thegraph/uniPools'
import { perpMarkets } from '../api/thegraph/uniPerpMarkets'
import { fetchPoolData } from '../store/pool';
import { setWindowDimensions, selectWindowDimensions } from '../store/window';
import { setProtocol } from '../store/protocol';
import { perpMarketStats, perpAddresses } from '../api/perpStats';
import { setStrategyColors } from '../store/strategies';
import { setStrategyRangeColors } from '../store/strategyRanges';
import { setTokenRatioColors } from '../store/tokenRatios';
import colors from '../data/colors.json';
import perplogo from '../assets/perpetual-logo.svg'

const PerpetualSimulator = (props) => {

//-----------------------------------------------------------------------------------------------
// WINDOW DIMENSION STATE
//-----------------------------------------------------------------------------------------------

const pageMinWidth = 1200;
const windowDim = useSelector(selectWindowDimensions);
const dispatch = useDispatch();

const handleResize = () => {
  const docEl = document.documentElement;
  docEl.style.setProperty("--window-height", parseInt(window.innerHeight) + "px");
  if (window.innerWidth >= pageMinWidth) {
    dispatch(setWindowDimensions({ width: window.innerWidth, height: window.innerHeight }));
  }
};

useEffect(() => {
  handleResize();
}, []);

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, );

//-----------------------------------------------------------------------------------------------
// SET PER STYLE OVERRIDES ON LOAD //
//-----------------------------------------------------------------------------------------------

useEffect(() => {
  dispatch(setStrategyColors("perpetual"));
  dispatch(setStrategyRangeColors("perpetual"));
  dispatch(setTokenRatioColors("perpetual"));
  
  const docEl = document.documentElement;
  docEl.style.setProperty("--font-color", "#0E1415");
  docEl.style.setProperty("--background", "#5AFBC7");
  docEl.style.setProperty("--background-linear-2", "#5AFBC7");
  docEl.style.setProperty("--semi-transparent-background", "#5AFBC7")
  docEl.style.setProperty("--outer-glow-intense", "none");
  docEl.style.setProperty("--border-color", "black");
  docEl.style.setProperty("--input-border", "none");
  docEl.style.setProperty("--search-icon-left-position", "440px");
  docEl.style.setProperty("--search-description-margin-left", "110px");
  docEl.style.setProperty("--axis-stroke-width", 1);
  docEl.style.setProperty("--strategy-backtest-container-row-start", 95);
  docEl.style.setProperty("--tooltip-background", '#DAC5E3');
  docEl.style.setProperty("--outer-glow", "none");
  docEl.style.setProperty("--pink-icon", "black");
  docEl.style.setProperty("--candle-red", "#408873");
  docEl.style.setProperty("--candle-green", "rgb(255, 102, 102)");
  docEl.style.setProperty("--bar-fill", "#FCD4D4");
  docEl.style.setProperty("--bar-stroke", "#FCD4D4");
  docEl.style.setProperty("--strategy-backtest-chart-span-column", 13);
  docEl.style.setProperty("--button-border", "1px solid black");
  docEl.style.setProperty("--button-border-hover", "none");
  docEl.style.setProperty("--strategy-dropdown-button-span", 3);
  docEl.style.setProperty("--sidebar-row", 4);
  docEl.style.setProperty("--sidebar-sticky-position", '60px');
  docEl.style.setProperty("--backtest-indicators-column-span", 13);
  docEl.style.setProperty("--sidebar-sub-container-background", "none");
  docEl.style.setProperty("--dashboard-section-background", "none");
  

}, []);


//-----------------------------------------------------------------------------------------------
// GET DEFAULT POOL ON LOAD WETH/PERP
//-----------------------------------------------------------------------------------------------

useEffect(() => {

  dispatch(setProtocol({id: 1}));
  const abortController = new AbortController();

  poolById("0x86f03c6e26b0488b6e39b34d7f10d843ae8e3d1b", abortController.signal, 1).then( pool => {
    if (pool) {
      dispatch(fetchPoolData({...pool, protocol: 1, toggleBase: true}));
    }
    
  });

  return () => abortController.abort();

}, []);

// --------------------------------------------------------------------------------------------
// FETCH POOL DATA FOR SEARCH 
// --------------------------------------------------------------------------------------------

const [searchData, setSearchData] = useState();
const [enrichedSearchData, setEnrichedSearchData] = useState();
const enrichedSearchDataRef = useRef();
const [perpMarketData, setPerpMarketData] = useState();
const [perpStatsData, setPerpStatsData] = useState();
const [perpAddressList, setPerpAddressList] = useState();

useEffect(() => {

  const abortController = new AbortController();

  perpMarkets(abortController.signal).then( markets => {

    if (markets && markets[0] && markets[0].pool) {
      setPerpMarketData(markets);
      const pools = markets.map( d => d.pool );
      
      poolByIds(pools, abortController.signal, 1).then( pools => {
        if (pools && pools.length && pools.length > 0) {

          const tempSearchData = pools.map( p => {
            p.feeTier = 1000;
            return p
          });

          setSearchData(tempSearchData);
        }
        
      });
    }
  });

  return () => abortController.abort();

}, []);

const enrichSearchData = (searchData, perpStatsData) => {

  if (searchData && searchData.length && perpStatsData && perpStatsData.length) {

    return searchData.map( d => {

      const stats = perpStatsData.find( f => f.marketSymbol === `${d.token0.symbol}/${d.token1.symbol}`);

      return stats ? {...d, lowerBaseApr: stats.lowerBaseApr, lowerRewardApr: stats.lowerRewardApr, upperBaseApr: stats.upperBaseApr, upperRewardApr: stats.upperRewardApr} :
      {...d, lowerBaseApr: 0, lowerRewardApr: 0, upperBaseApr: 0, upperRewardApr: 0}

    }).sort((a, b) => { return parseFloat(a["lowerBaseApr"]) > parseFloat(b["lowerBaseApr"]) ? -1 : 1; });
          
  } else {
    return searchData;
  }
}

useEffect(() => {

  perpMarketStats().then( pS => {
    setPerpStatsData(pS);
  });

  perpAddresses().then( pA => {
    setPerpAddressList(pA);
  });

}, []);

useEffect(() => {
  if (searchData && searchData.length) {
    enrichedSearchDataRef.current = enrichSearchData(searchData, perpStatsData);
    setEnrichedSearchData(enrichSearchData(searchData, perpStatsData));
  }
}, [perpStatsData, searchData]);

//---------------------------------------------------------
// Custom search for perp
//---------------------------------------------------------

const handleSearch = (searchTerm) => {

  const searchStringIsAnId = (searchString) => searchString.length && searchString.length === 42 && searchString.startsWith('0x');
  const searchStringIsValid = (searchString) => searchString.trim() && typeof(searchString) === 'string' && searchString.trim().length > 0;

  if (searchStringIsAnId(searchTerm)) {

    return enrichedSearchData.find( sd => sd.id === searchTerm);
  }
  if (searchStringIsValid(searchTerm) && enrichedSearchData && enrichedSearchData.length) {
    const results = enrichedSearchData.filter( sd => sd.token0.symbol.toUpperCase().includes(searchTerm.toUpperCase()) || sd.token1.symbol.toUpperCase().includes(searchTerm.toUpperCase()));
    return results && results.length && results.length > 0 ? results : "empty";
  }
  
  if (searchTerm === "") {
      return enrichedSearchData; 
  }

  return null;
}

const isEnriched = () => {
  return enrichedSearchDataRef.current && Array.isArray(enrichedSearchDataRef.current)
}
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

  return (
    <div className={styles["App"]}>
      <div className={styles["parent-container"]}>
        <NavBar
          width={windowDim.width} minWidth={pageMinWidth}
          themeToggleHidden={true} page="perpetual"
          title={<Fragment><span><img style={{height: 32, width: 32}} src={perplogo} alt="Perpetual Logo"></img></span><span>Perpetual Liquidity Strategy Simulator</span></Fragment>}
          themeProps={themeProps.uniswap}
          pageStyle={styles}
          pageid="PerpetualV2">
        </NavBar>
        <Grid className={styles["dashboard-container"]}
          rows={150} columns={62}
          cellAspectRatio={0.82} gridGap={5}
          gridWidth={windowDim.width} minWidth={pageMinWidth}
          pageStyle={styles}>
          <PoolOverview page="perpetual" pageStyle={styles} colors={colors["perpetual"]} poolStatsHidden={true} markets={perpMarketData} addresses={perpAddressList} stats={perpStatsData}></PoolOverview>
          
          <div className={`${styles['tab-so']} ${styles['tab']}`}></div>
          <div className={`${styles['tab-so']} ${styles['tab2']}`}>
            <div className={`${styles['tab-so']} ${styles['tab-title']}`}>Strategy Overview</div>
          </div>
          
        
          <StrategyOverview page="perpetual" pageStyle={styles} chartDataOverride="leveraged" strategies={['S1', 'S2']}
            impLossHidden={true} zeroLine={true} extendedHoverData={true}> 
          </StrategyOverview>
          <PoolPriceLiquidity page="perpetual" pageStyle={styles}></PoolPriceLiquidity>
          
          <div className={`${styles['tab-bt']} ${styles['tab']}`}></div>
          <div className={`${styles['tab-bt']} ${styles['tab2']}`}>
            <div className={`${styles['tab-bt']} ${styles['tab-title']}`}>Strategy Backtest</div>
          </div>
          
          <StrategyBacktest chartDataOverride="leveraged" page="perpetual" pageStyle={styles} customFeeDivisor={3} supressIndicatorFields={['assetval', 'total', 'token0Fee', 'token1Fee']} amountKey={"amountTR"}
          totalReturnKeys={[{ key: 'amountTR', name: "Amount", selected: true, color: colors['perpetual']['tokenratio'][0] }, {key: 'feeAcc', name: "Fee", selected: true, color: colors['perpetual']['tokenratio'][1]}]}></StrategyBacktest>
         
          <SideBar page="perpetual" pageStyle={styles} width={windowDim.width} minWidth={pageMinWidth} baseTokenHidden={true} protocols={[4]}
           strategies={['S1', 'S2']}
           customSearch={handleSearch}
           enrichedSearchData={enrichedSearchData}
           perpStatsData={perpStatsData}>
          </SideBar>
          <PerpLink></PerpLink>
          <DashBoard page="perpetual" pageStyle={styles}></DashBoard>
        </Grid>
      </div>
    </div>
  )
}

export default PerpetualSimulator