import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from "react";

import '../styles/UniswapSimulator.css';

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

// Data //
import { poolById, poolByIds } from '../api/thegraph/uniPools'
import { perpMarkets } from '../api/thegraph/uniPerpMarkets'
import { fetchPoolData } from '../store/pool';
import { setWindowDimensions, selectWindowDimensions } from '../store/window';
import { setProtocol } from '../store/protocol';
import { perpStats } from '../api/perpStats';



const PerpetualSimulator = (props) => {

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
// GET DEFAULT POOL ON LOAD 
//-----------------------------------------------------------------------------------------------

useEffect(() => {

  dispatch(setProtocol({id: 1}));
  const abortController = new AbortController();

  poolById("0xf993cc412edf1257f3e771bb744645daf4c19b14", abortController.signal, 1).then( pool => {
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
const [perpStatsData, setPerpStatsData] = useState();

useEffect(() => {

  const abortController = new AbortController();

  perpMarkets(abortController.signal).then( markets => {
    if (markets && markets[0] && markets[0].pool) {

      const pools = markets.map( d => d.pool);

      poolByIds(pools, abortController.signal, 1).then( pools => {

        if (pools && pools.length && pools.length > 0) {

          const tempSearchData = pools.map( p => {
            const tvl = markets.find( m => m.pool === p.id); 
            p.totalValueLockedUSD = tvl.quoteAmount;
            p.feeTier = 1000;
            p.poolDayData[0].volumeUSD = p.poolDayData[0].volumeToken1;
            p.poolDayData[0].feesUSD = parseFloat(p.poolDayData[0].volumeToken1) * 0.001;
            return p
          });

          setSearchData(tempSearchData);
        }
        
      });
    }
  });

  return () => abortController.abort();

}, []);

useEffect(() => {

  perpStats().then( pS => {
    console.log(pS)
    setPerpStatsData(pS);
  });

}, [])

//---------------------------------------------------------
// Custom search for perp
//---------------------------------------------------------

const handleSearch = (searchTerm) => {

  const searchStringIsAnId = (searchString) => searchString.length && searchString.length === 42 && searchString.startsWith('0x');
  const searchStringIsValid = (searchString) => searchString.trim() && typeof(searchString) === 'string' && searchString.trim().length > 0;

  if (searchStringIsAnId(searchTerm)) {
    return searchData.find( sd => sd.id === searchTerm);
  }

  if (searchStringIsValid(searchTerm) && searchData && searchData.length) {
    const results = searchData.filter( sd => sd.token0.symbol.toUpperCase().includes(searchTerm.toUpperCase()) || sd.token1.symbol.toUpperCase().includes(searchTerm.toUpperCase()));
    return results && results.length && results.length > 0 ? results : "empty"
  }

  return searchData;
}

useEffect(() => {
  perpStats().then(d => console.log(d))
}, [])

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

  return (
    <div className="App">
      <div className="parent-container">
        <NavBar
          width={windowDim.width} minWidth={pageMinWidth}
          title="Perpetual Liquidity Provider Strategy Simulator ">
        </NavBar>
        <Grid className="dashboard-container"
          rows={150} columns={62}
          cellAspectRatio={0.82} gridGap={5}
          gridWidth={windowDim.width} minWidth={pageMinWidth}>
          <PoolOverview poolStatsHidden={true}></PoolOverview>
          <StrategyOverview  chartDataOverride="leveraged" strategies={['S1', 'S2']}
            impLossHidden={true} zeroLine={true} extendedHoverData={true}> 
          </StrategyOverview>
          <PoolPriceLiquidity></PoolPriceLiquidity>
          <StrategyBacktest customFeeDivisor={3} supressIndicatorFields={['assetval', 'total', 'token0Fee', 'token1Fee']} amountKey={"amountTR"}
          totalReturnKeys={[{ key: 'amountTR', name: "Amount", selected: true, color: "rgb(238, 175, 246)" }, {key: 'feeAcc', name: "Fee", selected: true, color: "rgb(249, 193, 160)"}]}></StrategyBacktest>
          <SideBar width={windowDim.width} minWidth={pageMinWidth} baseTokenHidden={true} protocols={[4]}
           strategies={['S1', 'S2']}
           customSearch={handleSearch}
           perpStatsData={perpStatsData}>
          </SideBar>
          <DashBoard></DashBoard>
        </Grid>
      </div>
    </div>
  )
}

export default PerpetualSimulator