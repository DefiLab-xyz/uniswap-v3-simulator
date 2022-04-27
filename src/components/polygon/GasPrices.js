import {GasNowSpeeds} from './GasNowSpeeds'
import {lazy, useState, useEffect, Suspense} from 'react'
import {getEthGas, getMaticGas, getGraphETHData} from '../../api/polygonData'

const Polygons = lazy(() => import('./Polygons'));

const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(number * factorOfTen) / factorOfTen
}


export const GasPrices = (props) => {

// -----------------------------------------------------------------------  //
//   Spot Price Data and Gas values used to display Est. Gas Prices        //
// ---------------------------------------------------------------------  //

const [spotPrices, setSpotPrices] = useState({maticEth: 0, ethUSD: 0, maticUSD: 0});
const [ethGas, setEthGas] = useState();
const [maticGas, setMaticGas] = useState({fast: 5, fastest: 7.5, safeLow: 1, standard: 1});

// Gas prices calculated using spotPrices and eth / matic Gas from above
const [ethGasPrices, setEthGasPrices] = useState();
const [maticGasPrices, setMaticGasPrices] = useState();

// We display gas prices depending on selected speed in the UI
const [selectedMaticPrice, setSelectedMaticPrice] = useState({name: "fast", usd: 0, gwei: 0 });
const [selectedETHPrice, setSelectedETHPrice] = useState({name: "fast", usd: 0, gwei: 0 });
const [selectedSpeed, setSelectedSpeed] = useState("fast");

// Update Matic Gas Prices when spot Prices Change
useEffect(() => {

  if(maticGas && spotPrices) {

    const prices = Object.entries(maticGas).map(e => {
      // console.log(e[0] + " " + e[1] + ' ' + spotPrices.maticUSD + ' ')
      return {name: e[0], usd: e[1] * round(spotPrices.maticUSD, 2) / 100000000, gwei: e[1] }
    });

    setMaticGasPrices(prices); 
    const idx = prices.findIndex( i => i.name === selectedSpeed );
    setSelectedMaticPrice(prices[idx]);
    
  }
}, [spotPrices, maticGas]);

// Update ETH Gas Prices when ETH USD price changes
useEffect(() => {

  if(ethGas && spotPrices) {
    console.log(ethGas);
    console.log(spotPrices);

    const prices = Object.entries(ethGas).map(e => {
      return {name: e[0], usd: (e[1] * 0.000000001 / 10) * spotPrices.ethUSD, gwei: e[1] }
    });

    const idx = prices.findIndex( i => i.name === selectedSpeed );
    console.log(prices[idx])
    setSelectedETHPrice(prices[idx]);
    setEthGasPrices(prices);
  }
}, [spotPrices, ethGas]);

// Map ETH Gas values to Matic 

const handleEthGasChange = (data) => {

  const keyMap = [
    {eth: "fastest", poly: "fastest"},
    {eth: "fast", poly: "fast"},
    {eth: "average", poly: "standard"},
    {eth: "safeLow", poly: "safeLow"},
    {eth: "block_time", poly: "timestamp"}
  ];

  if (data) {  

    const parsed = {}
    Object.entries(data).forEach((d) => {
      
      const idx = keyMap.findIndex((i) => {return d[0] === i.eth}); 
      if (idx !== -1) {
        parsed[keyMap[idx].poly] = d[1];
      }
     
    });
    console.log(parsed)
    setEthGas(parsed);
  }
}

  // Fetch market data from various API's on mount 
  useEffect(() => {
   
    getGraphETHData().then( d => setSpotPrices(d));
    getMaticGas().then(d => { setMaticGas(d); });
    getEthGas().then(d => { handleEthGasChange(d); });

  }, []);


 // When user selects speed of transaction in UI, we update the estimated transaction prices. 
  const handleSpeedChange = (speed) => {
    setSelectedSpeed(speed);

    if(maticGasPrices) {
      const idx = maticGasPrices.findIndex( i => i.name === speed );
      setSelectedMaticPrice(maticGasPrices[idx]);
    }

    if (ethGasPrices) {
      const idx = ethGasPrices.findIndex( i => i.name === speed );
      setSelectedETHPrice(ethGasPrices[idx]);
    }
  
  }



  return(
  <>
  <GasNowSpeeds pageStyle={props.pageStyle} dimensions={props.dimensions} handleSpeedChange={handleSpeedChange} maticGasPrices={maticGasPrices} maticUSD={spotPrices.maticUSD}></GasNowSpeeds>
  <Suspense fallback={<div></div>}><Polygons pageStyle={props.pageStyle} dimensions={props.dimensions} selectedETHPrice={selectedETHPrice} selectedMaticPrice={selectedMaticPrice}></Polygons></Suspense>
  </>
  )
}