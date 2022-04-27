import {Hexagon, HexagonGreen, HexText} from './Hexagon'
import {useState, useEffect} from 'react'

const round = (number, decimalPlaces) => {
     const factorOfTen = Math.pow(10, decimalPlaces)
     return Math.round(number * factorOfTen) / factorOfTen
}

const EthLogo = (props) => {
     const width_ = parseFloat(props.width);
   
     const t1 = props.t1 * width_ / 250;
     const t2 = props.t2 * width_ / 250;
     const scale = props.scale * width_ / 250;
   
     return (
       <g transform={`translate(${t1}, ${t2}) scale(${scale},${scale})`} >
       <polygon filter="url(#shadowBlurETH)"  fill="rgba(194, 251,247,1)" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
       <polygon filter="url(#shadowBlurETH)"  fill="rgba(242, 213, 202,1)" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
       <polygon filter="url(#shadowBlurETH)" fill="rgba(209, 190,206,1)" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
       <polygon filter="url(#shadowBlurETH)" fill="rgba(242, 213, 202,1)" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
       <polygon filter="url(#shadowBlurETH)"  fill="rgba(209, 190,206,1)" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
       <polygon filter="url(#shadowBlurETH)"  fill="rgba(154, 183,242,1)" points="0,650.54 392.07,882.29 392.07,472.33 "/>
       </g>
     )
}


const PolygonLogo = (props) => {

     const width_ = parseFloat(props.width);
     const t1 = props.t1 * width_ / 250;
     const t2 = props.t2 * width_ / 250;
     const scale = props.scale * width_ / 250;
   
     return (
       <g transform={`translate(${t1}, ${t2}) scale(${scale},${scale})`} >
       <path filter="url(#shadowBlurTextG)" fill="url(#grad1)" class="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
             c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
             c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
             c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
             L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
             c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
       </g>
     )
}

const LogoText = (props) => {

     const SQRT3ovr2 = 0.866025403784439;
     const width_ = parseFloat(props.width);
     const margin_ = parseFloat(props.margin);
     const r = (width_ - margin_) / 2;
     const x = props.x * width_ / 250;
     const y = props.y * width_ / 250;
     const fontSize = props.fontSize * width_ / 440;
   
     const style = {fontFamily: "'Rajdhani', sans-serif", fontSize: fontSize, fontWeight: 400, fill: "#52565a", stroke: "none"}
   
     return (
       <text filter={props.filter} x={0} y={0} style={style}>
         <tspan x={x} y={y + (12 * width_ / 440)}>{props.poly}</tspan>    
         <tspan x={x} y={y + fontSize + (30 * width_ / 440)}>{props.eth}</tspan>      
       </text>
     )
   }
   


const GasCalcInput = (props) => {

     const [gasInput, setGasInput] = useState(21000);
     const [calcVisible, setCalcVisibile] = useState(null);

     const [calcMaticPrice, setCalcMaticPrice] = useState(0);
     const [calcEthPrice, setCalcEthPrice] = useState(0);

     const handleInputChange = (val) => {
          setGasInput(val);
          toggleCalcVisibility(val)
     }

     const toggleCalcVisibility = (val) => {
          const vis = val === "" ? "hidden" : null;
          setCalcVisibile(vis);
     }

     useEffect(() => {

          if(props.maticPrice && props.ethPrice) {
     
               setCalcMaticPrice(props.maticPrice.usd * gasInput);
               setCalcEthPrice(props.ethPrice.usd * gasInput);
          }
     }, [props.maticPrice, props.ethPrice, gasInput])

     return (
     <>
     <foreignObject x={53 * props.width / 200} y={95 * props.width / 300} width={props.width-10} height="150">
          <div xmlns="http://www.w3.org/1999/xhtml">
          <input className="gasInput" type="number" onChange={(e) => handleInputChange(e.target.value)} value={gasInput}></input>
          </div>
      </foreignObject>
      <g style={{visibility:calcVisible}}>
      <PolygonLogo t1={68} t2={125} scale={0.45} width={props.width}></PolygonLogo>
      <EthLogo t1={70} t2={148} scale={0.017} width={props.width} ></EthLogo>
      <LogoText x={93} y={132} fontSize={26} width={props.width} poly={`$${calcMaticPrice.toFixed(7)}`} eth={`$${round(calcEthPrice, 2)}`} filter="url(#shadowBlurTextG"></LogoText>
      </g>
      </>
     )
}


const Polygons = (props) => {

const width_ = props.dimensions.width > 760 ? props.dimensions.width : 760
const height_ = props.dimensions.width > 760 ? (500 * width_ / 1000)  : (700 * 760 / 1000)

const sizing = {
    hex1: {width: width_ / 5.5, margin: 50 * (width_ / 5.5) / 440, left: (width_ * 0.09) + 'px' , top: (width_ * 0.12) + 'px'} ,
    hex2: {width: width_ / 4.5, margin: 50 * (width_ / 4.5) / 440, left: (width_ * 0.211) + 'px', top: (width_ * 0.20) + 'px'} ,
    hex3: {width: width_ / 4, margin: 50 * (width_ / 4) / 440, left: (width_ * 0.368) + 'px', top: (width_ * 0.09) + 'px'} ,
    hex4: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * 0.385) + 'px', top: (width_ * 0.31) + 'px'} ,
    hex5: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * 0.560) + 'px', top: (width_ * 0.010) + 'px'},
    hexCompare: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * 0.213) + 'px', top: (width_ * 0.007) + 'px'},
    hexTx: {width: width_ / 3.5, margin: 50 * (width_ / 3.5) / 440, left: (width_ * 0.555) + 'px', top: (width_ * 0.190) + 'px'},
}

const sizingSm = {
     hex1: {width: width_ / 5.5, margin: 50 * (width_ / 5.5) / 440, left: (width_ * 0.01) + 'px' , top: (width_ * 0.12) + 'px'} ,
     hex2: {width: width_ / 4.5, margin: 50 * (width_ / 4.5) / 440, left: (width_ * 0.131) + 'px', top: (width_ * 0.20) + 'px'} ,
     hex3: {width: width_ / 4, margin: 50 * (width_ / 4) / 440, left: (width_ * 0.300) + 'px', top: (width_ * 0.09) + 'px'} ,
     hex4: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * 0.305) + 'px', top: (width_ * 0.31) + 'px'} ,
     hex5: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * -0.036) + 'px', top: (width_ * 0.29) + 'px'},
     hexCompare: {width: width_ / 4.7, margin: 50 * (width_ / 4.7) / 440, left: (width_ * 0.143) + 'px', top: (width_ * 0.016) + 'px'},
     hexTx: {width: width_ / 3.5, margin: 50 * (width_ / 3.5) / 440, left: (width_ * 0.095) + 'px', top: (width_ * 0.390) + 'px'},
 }

const [hex1, setHex1] = useState(sizing.hex1);
const [hex2, setHex2] = useState(sizing.hex2);
const [hex3, setHex3] = useState(sizing.hex3);
const [hex4, setHex4] = useState(sizing.hex4);
const [hex5, setHex5] = useState(sizing.hex5);

const [hexCompare, setHexCompare] = useState(sizing.hexCompare);
const [hexTxCalc, setHexTxCalc] = useState(sizing.hexTx);

useEffect(() => {
  
  if ( width_ > 760 ) {

     if (hex1 != sizing.hex1) { setHex1(sizing.hex1); }
     if (hex2 != sizing.hex2) { setHex2(sizing.hex2); }
     if (hex3 != sizing.hex3) { setHex3(sizing.hex3); }
     if (hex4 != sizing.hex4) { setHex4(sizing.hex4); }
     if (hex5 != sizing.hex5) { setHex5(sizing.hex5); }
     if (hexCompare != sizing.hexCompare) { setHexCompare(sizing.hexCompare); }
     if (hexTxCalc != sizing.hexTx) { setHexTxCalc(sizing.hexTx); }
  }
  else {

     setHex1(sizingSm.hex1);
     setHex2(sizingSm.hex2);
     setHex3(sizingSm.hex3);
     setHex4(sizingSm.hex4);
     setHex5(sizingSm.hex5);
     setHexCompare(sizingSm.hexCompare);
     setHexTxCalc(sizingSm.hexTx);
  }
 
}, [width_]);

const [ERC20Transfer, setERC20Transfer] = useState({gasUSDETH: 0, gasMaticUSD: 0, estGas: 40000});
const [NftTransfer, setNftTransfer] = useState({gasUSDETH: 0, gasMaticUSD: 0, estGas: 50000});
const [DexSwap, setDexSwap] = useState({gasUSDETH: 0, gasMaticUSD: 0, estGas: 110000});
const [lendingDeposit, setLendingDeposit] = useState({gasUSDETH: 0, gasMaticUSD: 0, estGas: 190000});
const [AMMLPDeposit, setAMMLPDeposit] = useState({gasUSDETH: 0, gasMaticUSD: 0, estGas: 210000});
const [savings, setSavings] = useState(0);

useEffect(() => {
     if(props.selectedETHPrice && props.selectedMaticPrice) {
          setERC20Transfer({gasUSDETH: props.selectedETHPrice.usd * 40000, gasMaticUSD: props.selectedMaticPrice.usd * 40000, estGas: 40000});
          setNftTransfer({gasUSDETH: props.selectedETHPrice.usd * 50000, gasMaticUSD: props.selectedMaticPrice.usd * 50000, estGas: 50000});
          setDexSwap({gasUSDETH: props.selectedETHPrice.usd * 110000, gasMaticUSD: props.selectedMaticPrice.usd * 110000, estGas: 110000});
          setLendingDeposit({gasUSDETH: props.selectedETHPrice.usd * 190000, gasMaticUSD: props.selectedMaticPrice.usd * 190000, estGas: 190000});
          setAMMLPDeposit({gasUSDETH: props.selectedETHPrice.usd * 210000, gasMaticUSD: props.selectedMaticPrice.usd * 210000, estGas: 210000});
     }
}, [props.selectedMaticPrice, props.selectedETHPrice]);

useEffect(() => {
if (ERC20Transfer && ERC20Transfer.gasUSDETH > 0 && ERC20Transfer.gasMaticUSD > 0) {

          const maxSave = round(ERC20Transfer.gasUSDETH / ERC20Transfer.gasMaticUSD, 0);
          let interval;

          if (savings < maxSave) {
               const steps = round( (maxSave - savings) / 100, 0);
               let save = savings;

               interval = setInterval(() => {
                    save += steps;
              
                    if ( save + steps > maxSave) {
                         clearInterval(interval);
                         setSavings(maxSave);
                    }
                    else {
               
                         setSavings(save + steps);
                         save += steps;
                    }
                    
               }, 10);

          }
          else if (savings > maxSave) {
               // decrement down to new savings 
               const steps = round((savings - maxSave) / 100, 0);
           
               let save = savings;

               interval = setInterval(() => {
                    save -= steps;
               
                    if ( save - steps < maxSave) {
                         clearInterval(interval);
                         setSavings(maxSave);
                    }
                    else {
                    
                         setSavings(save - steps);
                         save -= steps;
                    }
                    
               }, 10);
          }

          return () => clearInterval(interval);


          // setSavings(round(ERC20Transfer.gasUSDETH / ERC20Transfer.gasMaticUSD, 0));
     }
}, [ERC20Transfer]);


  return (
    <div style={{display: "flex", zIndex:4}}>
      <div style={{padding: "10px", position:"relative", height: height_ + 'px', zIndex:4, width: '100%'}}>
      <div style={{ position:"absolute", left: hexCompare.left, top: hexCompare.top}}>
           <HexagonGreen width={hexCompare.width} margin={hexCompare.margin} text1="AMM LP" text2="Deposit" eth={`$${DexSwap.gasUSDETH.toFixed(2)}`} poly={`$${DexSwap.gasMaticUSD.toFixed(5)}`}>
           <HexText 
               
               filter="url(#shadowBlurTextG)" 
               width={hexCompare.width} 
               margin={hexCompare.margin} 
               text1={`${savings}x`} 
               text2={""}
               x={32}
               y={200}
               fontSize={68}
               fontWeight={500}
               color={"rgb(138,187,230)"}
           ></HexText>    
          <HexText 
               
               filter="url(#shadowBlurTextG)" 
               width={hexCompare.width} 
               margin={hexCompare.margin} 
               text1={`Savings with`} 
               text2={"Polygon"}
               x={32}
               y={140}
               fontSize={47}
           ></HexText>   
         
           </HexagonGreen>
      </div>
      <div style={{ position:"absolute", left: hex1.left, top: hex1.top}}>
           <Hexagon width={hex1.width} margin={hex1.margin} text1="DEX" text2="SWAP" eth={`$${DexSwap.gasUSDETH.toFixed(2)}`} poly={`$${DexSwap.gasMaticUSD.toFixed(5)}`}></Hexagon>
      </div>
      <div style={{ position:"absolute", left: hex2.left, top: hex2.top}}>
           <Hexagon width={hex2.width} margin={hex2.margin} text1="NFT" text2="TRANSFER" eth={`$${NftTransfer.gasUSDETH.toFixed(2)}`} poly={`$${NftTransfer.gasMaticUSD.toFixed(5)}`}></Hexagon>
      </div>
      <div style={{overflow: "hidden"}}>
      <div style={{ position:"absolute", left: hex3.left, top: hex3.top}}>
           <Hexagon width={hex3.width} margin={hex3.margin} text1="ERC20" text2="TRANSFER" eth={`$${ERC20Transfer.gasUSDETH.toFixed(2)}`} poly={`$${ERC20Transfer.gasMaticUSD.toFixed(5)}`}></Hexagon>
      </div>
      </div>
     
      <div style={{ position:"absolute", left: hex4.left, top: hex4.top}}>
           <Hexagon width={hex4.width} margin={hex4.margin} text1="LENDING" text2="DEPOSIT" eth={`$${lendingDeposit.gasUSDETH.toFixed(2)}`} poly={`$${lendingDeposit.gasMaticUSD.toFixed(5)}`}></Hexagon>
      </div>
      <div style={{ position:"absolute", left: hex5.left, top: hex5.top}}>
           <Hexagon width={hex5.width} margin={hex5.margin} text1="AMM LP" text2="DEPOSIT" eth={`$${AMMLPDeposit.gasUSDETH.toFixed(2)}`} poly={`$${AMMLPDeposit.gasMaticUSD.toFixed(5)}`}></Hexagon>
      </div>
  
      <div style={{ position:"absolute", left: hexTxCalc.left, top: hexTxCalc.top}}>
           <HexagonGreen width={hexTxCalc.width} margin={hexTxCalc.margin} text1="AMM LP" text2="DEPOSIT" eth={`$${DexSwap.gasUSDETH.toFixed(2)}`} poly={`$${DexSwap.gasMaticUSD.toFixed(5)}`}>
           <HexText 
               filter="url(#shadowBlurTextG)" 
               width={hexTxCalc.width} 
               margin={hexTxCalc.margin} 
               text1={"GAS LIMIT:"} 
               text2={""}
               x={15}
               y={264}
               fontSize={18}
               fontWeight={400}
           ></HexText>
            <HexText 
               filter="url(#shadowBlurTextG)" 
               width={hexTxCalc.width} 
               margin={hexTxCalc.margin} 
               text1={"FEE"} 
               text2={"CALCULATOR"}
               x={10}
               y={52}
               fontSize={30}
               fontWeight={400}
           ></HexText>
           <GasCalcInput width={hexTxCalc.width} maticPrice={props.selectedMaticPrice} ethPrice={props.selectedETHPrice}></GasCalcInput>
           </HexagonGreen>
      </div>
      {props.children}
    </div>
    </div>
  )
}

export default Polygons