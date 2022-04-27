import { TextAlignedCenter, TextAlignedLeft } from './Text'
import { useEffect, useState, useRef } from 'react'
import Grid from '../Grid';
import ToolTip from '../ToolTip';

const GasButton = (props) => {

  const containerRef = useRef();
  const handleMouseEnter = () => {
  
    containerRef.current.className = `${containerRef.current.className}-hover` 
  }

  const handleMouseLeave = () => {
  
    containerRef.current.className = containerRef.current.className.split("-hover")[0]; 
  }

  return (
    <>
      <div 
      ref={containerRef} 
      className={props.className} 
      style={props.style[2]} 
      onMouseDown={() => props.onMouseDown(props.index)} 
      onMouseUp={() => props.onMouseUp(props.index)}
      onTouchStart={() => props.onMouseDown(props.index)} 
      onTouchEnd={() => props.onMouseUp(props.index)}
      onMouseEnter={()=> handleMouseEnter()}
      onMouseLeave={()=> handleMouseLeave()}>
      </div>
      <div 
      className="speed-text" 
      style={props.style[0]} 
      onMouseDown={() => props.onMouseDown(props.index)} 
      onMouseUp={() => props.onMouseUp(props.index)}
      onMouseEnter={()=> handleMouseEnter()}
      onTouchStart={() => props.onMouseDown(props.index)} 
      onTouchEnd={() => props.onMouseUp(props.index)}
      onMouseLeave={()=> handleMouseLeave()}
      >
        <TextAlignedCenter className="gas-font-h1" height="100%" width="100%" x="50%" y="50%" fill="#8b50e8" text={props.text}></TextAlignedCenter>
      </div>
      <div 
      className="speed-text" 
      style={props.style[1]} 
      onMouseDown={() => props.onMouseDown(props.index)} 
      onMouseUp={() => props.onMouseUp(props.index)}
      onTouchStart={() => props.onMouseDown(props.index)} 
      onTouchEnd={() => props.onMouseUp(props.index)}
      onMouseEnter={()=> handleMouseEnter()}
      onMouseLeave={()=> handleMouseLeave()}
      >
        <TextAlignedCenter className="gas-font-h2" height="100%" width="100%" x="50%" y="50%" fill="#4f475d" text={`$${props.prices.usd} | ${props.prices.gwei} GWEI`}></TextAlignedCenter>
      </div>
       
    </>
  )
}

const GasHelp = (props) => {

  const text = <div>
    <p>The Polygon Network aims to provide fast and economical blockchain transactions using Ethereum Layer 2 sidechains.</p>
    <p>Similarly to other blockchains (eg. Bitcoin, Ethereum), when we submit a transaction on the Polygon Network, a fee is required in order to have a transaction processed and mined.</p>
   <p><b>The total cost of a transaction </b>is determined using <b>Gas in MATIC GWEI * Gas Limit</b></p> 
   <p>Different Gas levels (fastest, fast, standard, safe low) can be used. Higher gas levels increase how quickly your transaction will be mined.</p>
   <p><b>Gas in MATIC GWEI </b> <br></br>(the values you see under the four Gas Speeds) <br></br>is the amount of gas necessary to perform a single unit of computation on the network.
    1 MATIC GWEI, or 0.00000001 Matic at current prices, is equal to ${(0.00000001 * props.maticUSD).toFixed(9)}
  </p>
  <p><b>The Gas Limit</b> is the number of single units of computation required to complete a transaction. <br></br>Gas limit is typicaly defaulted by the Dapp you are interacting with at the moment of submitting the transaction.
</p>

  </div>
  return (
    <div className={props.pageStyle["gasHelp"]} style={{gridRow: "3 / span 3", gridColumn: "61 / span 5"}}>
    <ToolTip tooltipStyle={{width: "25px", height: "25px", margin: 0, marginLeft: "5px", fontSize:"10px", fontWeight: "500", textAlign:"center"}} 
    textStyle={{width: "300px", height: "fill-content", left: "-190px", top: "25px"}} 
    text={text}>?
      {/* <TextAlignedCenter className="tooltip-container" text="?" fontSize={"1.3vw"} height="100%" width="100%" x="50%" y="50%" fill="#4f475d" fontWeight={500}></TextAlignedCenter> */}
    </ToolTip>
  </div>
  )

} 

export const GasNowSpeeds = (props) => {

  const [buttonData, setButtonData] = useState([
    {id: 0, className: `${props.pageStyle["speed-container-selected"]} ${props.pageStyle["gas-fastest"]}`, speed:"fastest"},
    {id: 1, className: `${props.pageStyle["speed-container"]} ${props.pageStyle["gas-fast"]}` , speed:"fast"},
    {id: 2, className: `${props.pageStyle["speed-container"]} ${props.pageStyle["gas-standard"]}`, speed:"standard"},
    {id: 3, className: `${props.pageStyle["speed-container"]} ${props.pageStyle["gas-safelow"]}`, speed:"safeLow"}
  ]);

  const [prices, setPrices] = useState([
    {id: "fastest", name: "Fastest", usd: 0, gwei: 0},
    {id: "fast", name: "Fast", usd: 0, gwei: 0},
    {id: "standard", name: "Standard", usd: 0, gwei: 0},
    {id: "safeLow", name: "Safe Low", usd: 0, gwei: 0},
  ]);

  const handleButtonChange = (clickedId, className) => {
    const newData = [...buttonData];
    newData.forEach((d, i) => {
      newData[i] = clickedId === d.id ? {id: d.id, className: `${className} ${props.pageStyle[`gas-${d.speed}`]}` , speed:d.speed} : {id: d.id, className: `${props.pageStyle["speed-container"]} ${props.pageStyle[`gas-${d.speed}`]}`, speed:d.speed}
    });
    setButtonData(newData);
  }

  const handleMouseDown = (clickedId) => {
    handleButtonChange(clickedId, props.pageStyle["speed-container-selected-keydown"]);
  }

  const handleMouseUp = (clickedId) => {
    handleButtonChange(clickedId, props.pageStyle["speed-container-selected"]);
    props.handleSpeedChange(buttonData[clickedId].speed);
  }

  const handlePriceChange = () => {
    if(props.maticGasPrices) {
      const pricesCopy = [...prices];
      prices.forEach((e, i) => {
          const index = props.maticGasPrices.findIndex( i => i.name === e.id );
          pricesCopy[i].usd = props.maticGasPrices[index].usd.toFixed(9);
          pricesCopy[i].gwei = props.maticGasPrices[index].gwei;
      });

      setPrices(pricesCopy);
    }
  }

  useEffect(() => {
    handlePriceChange();
  }, [props.maticGasPrices]);

  const [columns, setColumns] = useState(62);
  const [rows, setRows] = useState(7);

  const BDLarge = {
    col: ["10 / span 11", "23 / span 11", "36 / span 11", "49 / span 11"],
    rowt1: ["4 / span 3","4 / span 3","4 / span 3","4 / span 3"],
    rowt2: ["6 / span 2","6 / span 2","6 / span 2","6 / span 2"],
    rowc: ["3 / span 6","3 / span 6","3 / span 6","3 / span 6"],
    container: {gridRow: "2 / span 8", gridColumn: "7 / span 60"}
   }
  
   const BDSmall = {
    col: ["5 / span 31", "37 / span 31", "5 / span 31", "37 / span 31"],
    rowt1: ["7 / span 4","7 / span 4","20 / span 4","20 / span 4"],
    rowt2: ["11 / span 3","11 / span 3","24 / span 3","24 / span 3"],
    rowc: ["5 / span 12","5 / span 12","18 / span 12","18 / span 12"],
    container: {gridRow: "3 / span 30", gridColumn: "3 / span 67"}
   }

  useEffect(() => {

    if( props.dimensions.width < 400) {
      setColumns(72);
      setRows(42);
      setButtonDims(BDSmall);
    }
    else {
      setColumns(72);
      setRows(14);
      setButtonDims(BDLarge);
    }

  }, [props.dimensions.width]);


 const [buttonDims, setButtonDims] = useState(BDLarge);


  return (
    <Grid
    gridWidth={props.dimensions.width}
    minWidth={0}
    columns={columns}
    rows={rows}
    print={true}
    dimensions={props.dimensions}
    cellAspectRatio={0.82}
    gridGap={5}>

     

      <div className={props.pageStyle["chart-container"]} style={buttonDims.container}></div>
      
      <GasButton
      style={[
        {gridColumn: buttonDims.col[0], gridRow: buttonDims.rowt1[0], zIndex:5},
        {gridColumn: buttonDims.col[0], gridRow: buttonDims.rowt2[0], zIndex:5},
        {gridColumn: buttonDims.col[0], gridRow: buttonDims.rowc[0], zIndex:5}
      ]}
      onMouseDown={() => handleMouseDown(0)}
      onMouseUp={() => handleMouseUp(0)}
      prices={prices[0]}
      text="FASTEST"
      className={buttonData[0].className}
      fontSizeT1={buttonDims.fontT1}
      fontSizeT2={buttonDims.fontT2}
      dimensions={props.dimensions}
      ></GasButton>
      <GasButton
      style={[
        {gridColumn: buttonDims.col[1], gridRow: buttonDims.rowt1[1], zIndex:5},
        {gridColumn: buttonDims.col[1], gridRow: buttonDims.rowt2[1], zIndex:5},
        {gridColumn: buttonDims.col[1], gridRow: buttonDims.rowc[1], zIndex:5}
      ]}
      onMouseDown={() => handleMouseDown(1)}
      onMouseUp={() => handleMouseUp(1)}
      prices={prices[1]}
      text="FAST"
      className={buttonData[1].className}
      fontSizeT1={buttonDims.fontT1}
      fontSizeT2={buttonDims.fontT2}
      dimensions={props.dimensions}
      ></GasButton>
      <GasButton
      style={[
        {gridColumn: buttonDims.col[2], gridRow: buttonDims.rowt1[2], zIndex:5},
        {gridColumn: buttonDims.col[2], gridRow: buttonDims.rowt2[2], zIndex:5},
        {gridColumn: buttonDims.col[2], gridRow: buttonDims.rowc[2], zIndex:5}
      ]}
      onMouseDown={() => handleMouseDown(2)}
      onMouseUp={() => handleMouseUp(2)}
      prices={prices[2]}
      text="STANDARD"
      className={buttonData[2].className}
      fontSizeT1={buttonDims.fontT1}
      fontSizeT2={buttonDims.fontT2}
      dimensions={props.dimensions}
      ></GasButton>

      <GasButton
      style={[
        {gridColumn: buttonDims.col[3], gridRow: buttonDims.rowt1[3], zIndex:5},
        {gridColumn: buttonDims.col[3], gridRow: buttonDims.rowt2[3], zIndex:5},
        {gridColumn: buttonDims.col[3], gridRow: buttonDims.rowc[3], zIndex:5}
      ]}
      onMouseDown={() => handleMouseDown(3)}
      onMouseUp={() => handleMouseUp(3)}
      prices={prices[3]}
      text="SAFE LOW"
      className={buttonData[3].className}      
      fontSizeT1={buttonDims.fontT1}
      fontSizeT2={buttonDims.fontT2}
      dimensions={props.dimensions}
      ></GasButton> 
      <GasHelp pageStyle={props.pageStyle} maticUSD={props.maticUSD}></GasHelp>
      
      <div className={props.pageStyle["gas-prices-header"]}>
     
        <TextAlignedLeft className={props.pageStyle["gas-prices-header"]} height="100%" width="100%" x="0%" y="50%" fill="#4f475d" text="Estimated Transaction Costs"></TextAlignedLeft>

      </div>
     
   </Grid>
  )
}