import NavBar from '../layout/NavBar';
import { useSelector, useDispatch } from 'react-redux';
import { selectWindowDimensions, setWindowDimensions } from '../store/window';
import { useState, useEffect, Fragment } from "react";

import styles from '../styles/modules/containers/PolygonNow.module.css';
import themeProps from '../data/themeProperties.json'
import { TextFilter } from '../components/polygon/SVGFilters';
import { GasPrices } from '../components/polygon/GasPrices';
import { CheckTransaction } from '../components/polygon/CheckTransaction';
import { TextAlignedLeft, TextAlignedRight } from '../components/polygon/Text';
import polygonlogo from '../assets/polygon.png'

const PolygonLogo = (props) => {

  return (
    <svg width="100%" height="100%">
    <g className={props.className}>
    <path filter="url(#text-filter-purple)"fill="url(#grad1)" class="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
		c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
		c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
		L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
    </g>
    </svg>
   
  )
}

const Logo = (props) => {
  return (
    <div className={styles["logo-container"]}>
    <div className={styles["pg-heading1-container"]}>
    <TextAlignedRight className={styles["pg-heading-text"]} height="100%" width="50%" x="100%" y="50%" fill="#8b50e8" text="Polygon"></TextAlignedRight>
    </div>

    <div className={styles["pg-heading2-container"]}>  
    <TextAlignedLeft className={styles["pg-heading-text"]} height="100%" width="20%" x="0%" y="50%" fill="#4f475d" text="Now">
    </TextAlignedLeft>
    </div>
    <div className={styles["heading-logo"]}>
    <PolygonLogo className={styles["heading-logo-img"]}></PolygonLogo>
    </div>
    </div>)
}

const PolygonNow = (props) => {

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

  return (

  <>
  <div className={styles["loading-gif"]}></div>
  <div className={styles["polygon-now-container"]}>
    <svg width={0} height={0}>
      <TextFilter filterId="text-filter-purple"></TextFilter>
      <TextFilter filterId="text-filter-green" dark0={"#c9e0f3"} dark={"#c9e0f3"}></TextFilter>
      <TextFilter filterId="text-filter-red" dark0={"#efb4b6"} dark={"#efb4b6"}></TextFilter> 
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style={{stopColor:"rgb(173,126,228)", stopOpacity:"1"}} />
      <stop offset="99%" style={{stopColor:"#b58ae6", stopOpacity:"1"}}  />
      <stop offset="100%" style={{stopColor:"rgb(173,126,228)", stopOpacity:"1"}} />
     </linearGradient>
    </svg>
    <NavBar
         width={windowDim.width} minWidth={pageMinWidth}
          themeToggleHidden={true} page="perpetual"
          // title={<Logo></Logo>}
          themeProps={themeProps.uniswap}
          pageStyle={styles}
          pageid="Polygon">
          <Logo></Logo>
         
        
    </NavBar>

    <GasPrices pageStyle={styles} dimensions={windowDim}></GasPrices>
    <CheckTransaction  pageStyle={styles} dimensions={windowDim}></CheckTransaction>
  </div>  
  </>

  )
}

export default PolygonNow