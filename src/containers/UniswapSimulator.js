import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";

// Styles //
import styles from '../styles/modules/containers/UniswapSimulator.module.css';
import themeProps from '../data/themeProperties.json'

// Layout //
import NavBar from "../layout/NavBar";
import SideBar from "../layout/SideBar";
import DashBoard from "../layout/DashBoard";
import PoolOverview from '../layout/PoolOverview';
import StrategyOverview from '../layout/StrategyOverview';
import PoolPriceLiquidity from '../layout/PoolPriceLiquidity';
import StrategyBacktest from '../layout/StrategyBacktest';

// Components //
import Grid from "../components/Grid"
import UniswapLink from '../components/uniswap/UniswapLink';

// Data //
import { poolById } from '../api/thegraph/uniPools'
import { fetchPoolData, selectPool } from '../store/pool';
import { setWindowDimensions, selectWindowDimensions } from '../store/window';
import { selectProtocolId } from '../store/protocol';
import { setStrategyColors } from '../store/strategies';
import colors from '../data/colors.json'
import { setTokenRatioColors } from '../store/tokenRatios';
import { setStrategyRangeColors } from '../store/strategyRanges';


const UniswapSimulator = (props) => {

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
// Set CHART COLORS ON LOAD //
//-----------------------------------------------------------------------------------------------

useEffect(() => {
  dispatch(setStrategyColors("uniswap"));
  dispatch(setStrategyRangeColors("uniswap"));
  dispatch(setTokenRatioColors("uniswap"))
});


//-----------------------------------------------------------------------------------------------
// GET DEFAULT POOL ON LOAD (USDC / WETH) 0.3%
//-----------------------------------------------------------------------------------------------
const protocol = useSelector(selectProtocolId);
const poolS = useSelector(selectPool);


useEffect(() => {
  const abortController = new AbortController();

  poolById("0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8", abortController.signal, protocol).then( pool => {
    if (pool) dispatch(fetchPoolData(pool));
  });

  return () => abortController.abort();

}, []);

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

  return (
    <div className={styles["App"]}>
      <div className={styles["parent-container"]}>
        <NavBar page="uniswap"
          width={windowDim.width} minWidth={pageMinWidth}
          title="Uniswap V3 Strategy Simulator"
          themeProps={themeProps.uniswap}
          pageStyle={styles}
          pageid="UniswapV3"
          >
        </NavBar>
        <Grid className={styles["dashboard-container"]}
          rows={150} columns={62}
          cellAspectRatio={0.82} gridGap={5}
          gridWidth={windowDim.width} minWidth={pageMinWidth}>
          <PoolOverview page="uniswap" pageStyle={styles}></PoolOverview>
          <StrategyOverview page="uniswap" pageStyle={styles} colors={colors["uniswap"]}></StrategyOverview>
          <PoolPriceLiquidity page="uniswap" pageStyle={styles}></PoolPriceLiquidity>
          {
            protocol === 2 ?   <div className={styles["arbitrum-error-message"]}> Sorry, we're not able to genarate an accurate backtest for Arbitrum currently. We'll be sure to add it once accurate data becomes available.<br></br> </div> : <StrategyBacktest  page="uniswap" pageStyle={styles}></StrategyBacktest>
          }
          {/* <StrategyBacktest  page="uniswap" pageStyle={styles}></StrategyBacktest> */}
          <SideBar  page="uniswap" width={windowDim.width} minWidth={pageMinWidth} protocols={[0, 1, 2, 3, 5]} leverageHidden={true} pageStyle={styles}></SideBar>
          <UniswapLink></UniswapLink>
          <DashBoard page="uniswap" pageStyle={styles}></DashBoard>
        </Grid>
       
      </div>
    </div>
  )
}

export default UniswapSimulator