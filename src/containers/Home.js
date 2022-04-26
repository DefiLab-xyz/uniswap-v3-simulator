import logo from './../assets/logo.jpeg'
import uniswap from './../assets/uniswap-uni-logo.png'
import polygon from './../assets/polygon.png'
import NavBar from '../layout/NavBar';
import { Link } from "react-router-dom";

// Styles //
import styles from '../styles/modules/containers/Home.module.css';
import stylesUni from '../styles/modules/containers/UniswapSimulator.module.css';
import themeProps from '../data/themeProperties.json'

import { setWindowDimensions, selectWindowDimensions } from '../store/window';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, Fragment } from "react";

import Genart from '../components/Genart';


const Home = (props) => {

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


  return(
   <>
   <Genart width={windowDim.width} height={windowDim.height}></Genart>
   <div className={styles["home-container"]}>
    <div className={`${styles["home-container-half"]} ${styles["home-container-half-a"]}`}>
      <div className={styles["logo-container"]}>
        <NavBar
         width={windowDim.width} minWidth={pageMinWidth}
          themeToggleHidden={true} page="perpetual"
          title={<Fragment><span><img style={{height: 32, width: 32}} src={logo} alt="Defi-lab logo"></img></span><span>Defi Simulators and Analytics</span></Fragment>}
          themeProps={themeProps.uniswap}
          pageStyle={stylesUni}>
        </NavBar>
      </div>
      <div className={styles["tag-line"]}>
        <span className="block" style={{color:"#AF81E4"}}>Building&nbsp;</span>
        <span className="star" style={{color:"#7CC2F6" }}>☆&nbsp;</span>
        <span className="block" style={{color:"#F9C1A0"}}>Tools&nbsp;</span>
        <span className="star" style={{color:"#80E8DD"}}>☆&nbsp;</span><br></br>
        for the
        <br></br>
        <span style={{color:"#E784BA"}}>Defi&nbsp;</span>
        <span style={{color:"#E784BA"}}>Community &nbsp;</span></div>
      <div className={styles["link-container"]}>
        <div className={styles["link-uniswap"]}>
        <Link to="/uniswapv3simulator"><button className={styles["logo-img-container"]}><img src={uniswap} alt="Uniswap V3 Simulator"></img></button></Link>
         <div className={styles["link-uniswap-text-container"]}><div></div>
        <Link to="/uniswapv3simulator"><button>Uniswap V3 Simulator</button></Link></div>
        </div>
        <div className={styles["link-polygon"]}>
        <Link to="/polygon"><button className={styles["logo-img-container"]}>
            <img src={polygon} alt="Polyon Gas and Network Stats"></img>
          </button></Link>
          <div className={styles["link-uniswap-text-container"]}><div>
            </div><Link to="/polygon"><button>Polygon Gas & Network Stats</button></Link></div>
        </div>
      </div>
      <div className={styles["bg bg1"]}></div>
      <div className={styles["bg bg2"]}></div>
      <div className={styles["bg bg3"]}></div>
      </div>
    <div className={styles["contact-us"]}>✉ <a href="mailto:contact@defi-lab.xyz">contact@defi-lab.xyz</a><span>&nbsp; Property of FestaLab BV 2021</span></div>
  </div>
 
    </>
  )
}

export default Home
