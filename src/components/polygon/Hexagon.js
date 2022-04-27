import {ContainerFilter, ContainerFilterGreen, TextFilter, EthLogoFilter} from './SVGFilters'

// creates a simple Hex path using the side length as input
const HexPath = (props) => {
  const SQRT3ovr2 = 0.866025403784439;
  const width_ = parseFloat(props.width);
  const margin_ = parseFloat(props.margin);


  const r = (width_ - margin_) / 2;
  const s1 = [(r / 2) + margin_ / 2, margin_];
  const s2 = [r, 0];
  const s3 = [r / 2, (SQRT3ovr2 * r)]
  const s4 = [r / 2 * -1, (SQRT3ovr2 * r)]
  const s5 = [r * -1, 0]
  const s6 = [r / 2 * -1, (SQRT3ovr2 * r) * -1]

  return (
    <path 
    className={props.className}
    filter={props.filter}
    d={`M ${s1[0]} ${s1[1]} l ${s2[0]} ${s2[1]} l ${s3[0]} ${s3[1]} l ${s4[0]} ${s4[1]} l ${s5[0]} ${s5[1]} l ${s6[0]} ${s6[1]} Z`}
    fill={props.fill}
    stroke={props.stroke}
    ></path>
  )
  
}

export const HexText = (props) => {

  const SQRT3ovr2 = 0.866025403784439;
  const width_ = parseFloat(props.width);
  const margin_ = parseFloat(props.margin);
  const r = (width_ - margin_) / 2;
  const x = (r / 2) + margin_  + ( width_ / 440) - (props.x * width_ / 440 );
  const y = ((SQRT3ovr2 / 2 * r) * 4 ) + margin_ - ( props.y * width_ / 440);
  const fontSize = props.fontSize * width_ / 440;
  const fontWeight = props.fontWeight ? props.fontWeight : 400;
  const color = props.color ? props.color :"#674B88";

  const style = {fontFamily: "'Rajdhani', sans-serif", fontSize: fontSize, fontWeight: fontWeight, fill: color, stroke: "none"}


  return (
    <text filter={props.filter} x={x} y={y} style={style}>
      <tspan x={x} y={y}>{props.text1}</tspan>    
      <tspan x={x} y={y + fontSize}>{props.text2}</tspan>      
    </text>
  )
}

const LogoText = (props) => {

  const SQRT3ovr2 = 0.866025403784439;
  const width_ = parseFloat(props.width);
  const margin_ = parseFloat(props.margin);
  const r = (width_ - margin_) / 2;
  const x = 102 * width_ / 250;
  const y = 87 * width_ / 250;
  const fontSize = 38 * width_ / 440;

  const style = {fontFamily: "'Rajdhani', sans-serif", fontSize: fontSize, fontWeight: 400, fill: "#52565a", stroke: "none"}


  return (
    <text  x={0} y={0} style={style} filter={props.filter}>
      <tspan x={x} y={y + (12 * width_ / 440)} >{props.eth}</tspan>    
      <tspan x={x} y={y + fontSize + (32 * width_ / 440)}>{props.poly}</tspan>      
    </text>
  )
}

const PolygonLogo = (props) => {

  const width_ = parseFloat(props.width);
  const t1 = 70 * width_ / 250;
  const t2 = 110 * width_ / 250;
  const scale = 0.6 * width_ / 250;

  return (
    <g transform={`translate(${t1}, ${t2}) scale(${scale},${scale})`} >
    <path filter="url(#shadowBlurText)" fill="url(#grad1)" class="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
		c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
		c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
		L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
    </g>
  )
}


const EthLogo = (props) => {
  const width_ = parseFloat(props.width);

  const t1 = 73 * width_ / 250;
  const t2 = 73 * width_ / 250;

  const scale = 0.02 * width_ / 250;

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



export const HexagonGreen = (props) => {

  const dark = "rgba(82,86,90, 0.6)";
  const dark0 = "rgba(149,155,160, 0.5)";
  const dark1 = "rgba(161,166,171, 0.5)";
  const dark2 = "rgba(196,199,202, 0.5)";
  const light0 = "rgba(236,253,252, 0.5)";
  const light1 = "rgba(243,254,253,0.5)";
  const light2 = "rgba(243,254,253,0.2)";
  const light3 = "rgba(250,254,254,0.2)";

  return (
    <svg width={props.width + props.margin} height={props.width + props.margin} className={props.hexagon}>
      <defs>
      <ContainerFilterGreen
      width={props.width + props.margin} 
      height={props.width + props.margin} 
      dark={dark}
      dark0={dark0}
      dark1={dark1}
      dark2={dark2}
      light0={light0}
      light1={light1}
      light2={light2}
      light3={light3}
      filterId="shadowBlurGreen">
      </ContainerFilterGreen>
      <TextFilter
      width={(36 * props.width / 440)} 
      height={65} 
      element="rgba(152,118,210, 0.2)"
      filterId="shadowBlurTextG">
      </TextFilter>
      </defs>
      <HexPath  
      filter="url(#shadowBlurGreen)" 
      class={`hex-path 
      ${props.uniqueId}`} 
      width={props.width} 
      margin={props.margin}
      fill="rgba(218,252,250, 1)"
      ></HexPath>
      {props.children}
    </svg>
  )
}


export const Hexagon = (props) => {

  const width_ = props.width ? parseFloat(props.width) : 100;
  const margin_ = props.margin ?  parseFloat(props.margin) : 25;
  const svgWidth = width_ + margin_;

  const dark = "rgba(138, 144, 150, 0.6)";
  const dark0 = "rgba(161,168,175, 0.5)";
  const dark1 = "rgba(184,192,200, 0.5)";
  const dark2 = "rgba(207,216,225,0.5)";
  const light0 = "rgba(249,249,253, 0.5)";
  const light1 = "rgba(248,249,254,0.5)";
  const light2 = "rgba(248,249,254,0.2)";
  const light3 = "rgba(248,249,254,0.2)";

  return (
    <svg width={svgWidth} height={svgWidth} className="hexagon">
      <defs> 
      <ContainerFilterGreen
      width={props.width + props.margin} 
      height={props.width + props.margin} 
      dark={dark}
      dark0={dark0}
      dark1={dark1}
      dark2={dark2}
      light0={light0}
      light1={light1}
      light2={light2}
      light3={light3}
      filterId="shadowBlurHex1">
      </ContainerFilterGreen>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style={{stopColor:"rgb(173,126,228)", stopOpacity:"1"}} />
      <stop offset="99%" style={{stopColor:"#b58ae6", stopOpacity:"1"}}  />
      <stop offset="100%" style={{stopColor:"rgb(173,126,228)", stopOpacity:"1"}} />
     </linearGradient>
      <ContainerFilter
      width={svgWidth} 
      height={svgWidth} 
      element="rgba(231, 241, 250, 0.6)"
      filterId="shadowBlur">
      </ContainerFilter>
      <ContainerFilter
      width={10} 
      height={65} 
      element="rgba(152,118,210, 0.2)"
      filterId="shadowBlurLogo">
      </ContainerFilter>
      <TextFilter
      width={(36 * width_ / 440)} 
      height={65} 
      element="rgba(152,118,210, 0.2)"
      filterId="shadowBlurText">
      </TextFilter>
      <EthLogoFilter
      width={(50 * width_ / 440)} 
      height={65} 
      element="rgba(152,118,210, 0.2)"
      filterId="shadowBlurETH">
      </EthLogoFilter>
      </defs>
      <g filter="url(#shadowBlurHex1)">
        <HexPath   class={`hex-path ${props.uniqueId}`} width={width_} margin={margin_}></HexPath>
      </g>
      
      {/* <HexPath  class={`hex-path ${props.uniqueId}`} width={width_} margin={margin_} fill="rgba(231, 241, 250, 0.3)"/> */}
      <HexText 
      filter="url(#shadowBlurText)" 
      width={width_} 
      margin={margin_} 
      text1={props.text1} 
      text2={props.text2}
      x={15}
      y={95}
      fontSize={40}
      ></HexText>
      <PolygonLogo width={width_}></PolygonLogo>
      <EthLogo width={width_}></EthLogo>
      <LogoText filter="url(#shadowBlurText)" width={width_} margin={margin_} eth={props.eth} poly={props.poly}></LogoText>
      {props.children}
    </svg>
  )

}
