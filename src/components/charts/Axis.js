import {scaleQuantize} from 'd3-scale'
import styles from '../../styles/modules/charts/Axis.module.css'

const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(number * factorOfTen) / factorOfTen
}

const parsePrice = (price) => {
  if (price === 0) {
    return 0;
  }
  else {
    const m = -Math.floor( Math.log(price) / Math.log(10) + 1);
    return round(price, m + 4);
  }
}

// formats tick value for date //
const formatDate = (scale, val, margin) => {

  scale.x.invert = function(x) {
    var domain = this.domain();
    var range = this.range();

    if (domain && domain.length > 0 && range) {
      var scale = scaleQuantize().domain(range).range(domain);
      return scale((x));
    }
    else {
      return x
    }
  
  };

  const date = new Date(scale.x.invert(val));

  return date.toLocaleDateString( 'en-gb', { 
    month: "2-digit",
    day: "2-digit",
  });
}

const formatNumber = (scale, val, decimals) => {

  function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if(num < 900){

        return round(num, decimals || 2);
    }
  }

  return scale && scale.hasOwnProperty('y') ? numFormatter(scale.y.invert(val)) : 0;

}


const axisTickText = (props, coords) => {

  const axisType = props.axisType || 'bottom';

  if (axisType === 'bottom') {
    if (props.dataType === 'date') {
      return formatDate(props.scale, coords.x, props.margin);
    }
    else {
      return parsePrice(props.scale.x.invert(coords.x))
    }
  }
  else if (axisType === 'left' || axisType === 'right') {

    if (props.dataType === 'number') {

      if(!props.format) {
        return formatNumber(props.scale, coords.y);
      }
      else {
        if (props.scale.y.invert(coords.y) === 0) {
          return 0
        }
        else {
          const m = -Math.floor( Math.log(props.scale.y.invert(coords.y)) / Math.log(10) + 1);
          return round(props.scale.y.invert(coords.y), m + 4);
        }
       
      }
     
    }
    else if (props.dataType === 'percent') {
      if (props.formattedPercent) {
        return round(props.scale.y.invert(coords.y), 2) + '%'
      }
      else {
        return round(props.scale.y.invert(coords.y) * 100, 2) + '%'
      }
      
    }
  }
    
}
    

// helper function to generate x, y coords for Axis based on its orientation //

const axisLineCoords = (props) => {
  const axisType = props.axisType || 'bottom';
  let x1, x2, y1, y2;

    if (axisType === "bottom") {
      x1 = 0;
      x2 = props.width;
      y1 = props.height;
      y2 = props.height;
    }
    else if (axisType === "left") {
      x1 = 0;
      x2 = 0;
      y1 = props.height;
      y2 = 0;
    }
    else if (axisType === "right") {
      x1 = props.width;
      x2 = props.width;
      y1 = props.height;
      y2 = 0;
    }

    return { x1: x1, x2: x2, y1: y1, y2: y2 }

}

// helper function to generate spacing values for ticks
const axisTickCoords = (props) => {

  const ticks = props.ticks || 5;
  const axisType = props.axisType || 'bottom';
  let space, x2, y2, dx, dy;

  if (axisType === 'bottom' ) {
    space = (props.x2 - props.x1) / ticks;
    x2 = "";
    y2 = props.tickLength || 6;
    dx= (space / 6) * -1
    dy="1.71em"
  }
  else if (axisType === 'left') {
    space = (props.y2 - props.y1) / ticks;
    x2 = props.tickLength * -1 || -6;
    y2 = "";
    dx= "-1em";
    dy= "0.25em"
  }
  else if (axisType === 'right') {
    space = (props.y2 - props.y1) / ticks;
    x2 = props.tickLength * 1 || 6;
    y2 = "";
    dx= "1em";
    dy= "0.25em"
  }

  return { space:space, x2:x2, y2:y2, dx:dx, dy:dy }

}

// generate transform translate for each tick 
const AxisTickTranslate = (props, space, i) => {

  const axisType = props.axisType || 'bottom';
  let x, y;
  if (axisType === 'bottom' ) { 
    x = (props.x1 + (space * (i + 1))) - (space / 2) ;
    y = props.y2;
    
  }
  else if (axisType === 'left') {
    x = props.x1 ;
    y = (props.y1 + (space * (i + 1))) - (space / 2);
  }
  else if (axisType === 'right') {
    x = props.x1 ;
    y = (props.y1 + (space * (i + 1))) - (space / 2);
  }

  return {x: x, y: y};
}

const Ticks = (props) => {

  const ticks = props.ticks || 5;
  const tickCoords = axisTickCoords(props);

  const tickLines = [...Array(ticks)].map((t, i) => {

    const translateCoords = AxisTickTranslate(props, tickCoords.space, i);
    const tickText = props.supressTickText ? "" : axisTickText(props, translateCoords);

    return <g 
      className={styles["chart-axis-ticks"]}
      transform={"translate(" + translateCoords.x + ", " + translateCoords.y + ")"}
      key={`tick-${i}`}>
        <line 
        style={{strokeWidth:"0.4"}}
        x2={tickCoords.x2} 
        y2={tickCoords.y2} 
        stroke="#5f696f"/>
        <text className={styles["tick-text"]}
        textAnchor={props.textAnchor || "start"}
          dx={tickCoords.dx}
          dy={tickCoords.dy}
        >{tickText}</text>
    </g>
    
  });

  return (
    <g>
      {tickLines}
    </g>
  )
}

export const Axis = (props) => {

  if (props.scale && props.width && props.height) { 

    const lineCoords = axisLineCoords(props);   
    
    return (
      <g className={`${styles["chart-axis"]} ${props.axisType}-axis-${props.className}`} >
        <line 
        x1={lineCoords.x1} 
        y1={lineCoords.y1} 
        x2={lineCoords.x2} 
        y2={lineCoords.y2} />
        <Ticks 
        x1={lineCoords.x1} 
        x2={lineCoords.x2} 
        y1={lineCoords.y1} 
        y2={lineCoords.y2} 
        tickLength={props.tickLength || 6} 
        scale={props.scale}
        axisType={props.axisType}
        scaleType={props.scaleType}
        dataType={props.dataType}
        margin={props.margin}
        textAnchor={props.textAnchor}
        format={props.format}
        supressTickText={props.supressTickText}>
        </Ticks>
      </g>
    );
  }
  else {
    return(<g className={`chart-axis-empty ${props.axisType}-axis-${props.uniqueName}`}></g>)
  }

}


export const AxisLabelY = (props) => {
    return (
      <g>
      <text 
      className={`${styles["y-label"]} y-label-${props.uniqueName}`}
      x={props.x}
      y={props.y}
      style={{fontSize: "12px", fill: "rgb(95, 105, 111)", stroke:"none", fontWeight:400, ...props.style}}
      transform="rotate(-90)">{props.label}
      </text>
    </g>
    )
}