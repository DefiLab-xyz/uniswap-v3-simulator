import '../styles/UniswapSimulator.css';
import { useState, useEffect } from "react";
import NavBar from "../layout/NavBar";

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

//-----------------------------------------------------------------------------------------------

useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, );

  return (
    <div className="parent-container">
      <NavBar
        width={windowDim.width}
        minWidth={pageMinWidth}
        title="Uniswap V3 Strategy Simulator">
      </NavBar>
    </div>
  )
}

export default UniswapSimulator