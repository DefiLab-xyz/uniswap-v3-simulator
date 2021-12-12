import '../styles/UniswapSimulator.css';
import { useState, useEffect } from "react";
import Grid from "../components/Grid"
import NavBar from "../layout/NavBar";
import SideBar from "../layout/SideBar";
import DashBoard from "../layout/DashBoard";
import { setPool } from '../store/pool';
import {poolById} from '../api/thegraph/uniPools'
import { useSelector, useDispatch } from 'react-redux';
import { selectProtocolId } from '../store/protocol';


const UniswapSimulator = (props) => {

//-----------------------------------------------------------------------------------------------
// WINDOW DIMENSION STATE
//-----------------------------------------------------------------------------------------------

const pageMinWidth = 1200;
const [windowDim, setWindowDim] = useState({width: window.innerWidth, height: window.innerHeight});

const handleResize = () => {
    setWindowDim({width: window.innerWidth, height: window.innerHeight});
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
const dispatch = useDispatch();

useEffect(() => {
  const abortController = new AbortController();
  poolById("0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8", abortController.signal, protocol).then( pool => {
    if (pool) dispatch(setPool(pool));
  });
  return () => abortController.abort();
}, []);

  return (
    <div className="App">
      <div className="parent-container">
        <NavBar
          width={windowDim.width}
          minWidth={pageMinWidth}
          title="Uniswap V3 Strategy Simulator">
        </NavBar>
        <Grid className="dashboard-container"
          rows={150}
          columns={62}
          cellAspectRatio={0.82}
          gridGap={5}
          gridWidth={windowDim.width}
          minWidth={pageMinWidth}
        >
          <SideBar
            width={windowDim.width}
            minWidth={pageMinWidth}>
          </SideBar>
          <DashBoard></DashBoard>
        </Grid>
      </div>
    </div>
  )
}

export default UniswapSimulator