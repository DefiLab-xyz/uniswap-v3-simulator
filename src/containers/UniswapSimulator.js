import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from "react";

import '../styles/UniswapSimulator.css';

// Layout //
import NavBar from "../layout/NavBar";
import SideBar from "../layout/SideBar";
import DashBoard from "../layout/DashBoard";
import PoolOverview from '../layout/PoolOverview';
import StrategyOverview from '../layout/StrategyOverview';
import PoolPriceLiquidity from '../layout/PoolPriceLiquidity';

// Components //
import Grid from "../components/Grid"

// Sata //
import { poolById } from '../api/thegraph/uniPools'
import { fetchPoolData, selectPool } from '../store/pool';
import { setWindowDimensions, selectWindowDimensions } from '../store/window';
import { selectProtocolId } from '../store/protocol';



const UniswapSimulator = (props) => {

//-----------------------------------------------------------------------------------------------
// WINDOW DIMENSION STATE
//-----------------------------------------------------------------------------------------------

const pageMinWidth = 1200;
const windowDim = useSelector(selectWindowDimensions);
const dispatch = useDispatch();

const handleResize = () => {
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
// GET DEFAULT POOL ON LOAD (USDC / WETH) 0.3%
//-----------------------------------------------------------------------------------------------
const protocol = useSelector(selectProtocolId);
const poolS = useSelector(selectPool);

useEffect(() => {
  console.log(poolS)
}, [ poolS])

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
    <div className="App">
      <div className="parent-container">
        <NavBar
          width={windowDim.width} minWidth={pageMinWidth}
          title="Uniswap V3 Strategy Simulator">
        </NavBar>
        <Grid className="dashboard-container"
          rows={150} columns={62}
          cellAspectRatio={0.82} gridGap={5}
          gridWidth={windowDim.width} minWidth={pageMinWidth}>
          <PoolOverview></PoolOverview>
          <StrategyOverview></StrategyOverview>
          <PoolPriceLiquidity></PoolPriceLiquidity>
          <SideBar width={windowDim.width} minWidth={pageMinWidth} protocols={[0, 1, 2, 3]} leverageHidden={true}></SideBar>
          <DashBoard></DashBoard>
        </Grid>
      </div>
    </div>
  )
}

export default UniswapSimulator