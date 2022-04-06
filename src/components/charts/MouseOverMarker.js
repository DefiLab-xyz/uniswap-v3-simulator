import { useEffect, useState, useContext} from 'react'
import { ChartContext } from './ChartContainer';
import styles from '../../styles/modules/charts/MouseOverMarker.module.css'

// This is really ugly -- works, but needs refactor  //
export const MouseOverText = (props) => {

  if (props.text && props.text.length) {

    let text;

    if (props.mouseOverTextExtended) {
      text = props.text.map((t1, i1) => {
        return t1.map((t2, i2) => {
          return ( <text className={`${styles["mouse-over-text"]} mouse-over-text-${i1}-${i2}`}
            x={props.textPosition.x + (240 * i1)}
            y={props.textPosition.y + (17 * (i2 + 1))}
            textAnchor={props.textAnchor}
          >{t2}</text>);
        });
      });
    }
    else {
      text = props.text.map((d, i) => {
        return ( <text className={`${styles["mouse-over-text"]} mouse-over-text-${i}`}
          x={props.textPosition.x}
          y={props.textPosition.y + (17 * (i + 1))}
          textAnchor={props.textAnchor}
        >{d}</text>);
      });
    }

    return (
      <g className={styles["mouse-over-text-container"]}
        style={{display: props.visibility}}>{text}</g>
    )
  }

  return ( <g className="empty-mouseover-text"></g> );
 
}

export const MouseOverMarker = (props) => { 

  const [visibility, setVisibility] = useState('none');
  const [linePosition, setLinePosition] = useState({x1: 0, x2: 0, y1: 0, y2: 0});
  const [textPosition, setTextPosition] = useState({x: props.mouseOverMarkerPosX || 0, y: props.mouseOverMarkerPosY || 0});
  const [textAnchor, setTextAnchor] = useState("start");
  const chartContextData = useContext(ChartContext)

  const positionLine = (xEvent) => {
    setLinePosition({x1: xEvent, x2: xEvent, y1: 0, y2: props.height});
  }

  const positionText = (xEvent) => {

    const textAnchorMargin = props.width / 2 >  xEvent ? 10 : -10; 
    const textAnchor = props.width / 2 >  xEvent ? "start" : "end"; 
    const x = xEvent + textAnchorMargin;

    setTextPosition({x: x, y: props.mouseOverTextY || - 5 });
    setTextAnchor(textAnchor);

  }

  const mouseMove = (e) => {
    const xEvent = e.clientX - e.target.getBoundingClientRect().left;
    positionLine(xEvent);
    if (props.handleMouseOver && props.scale && props.scale.hasOwnProperty("x")) props.handleMouseOver(xEvent, props.scale, chartContextData);
    if (props.mouseOverMarkerPos !== "fixed") positionText(xEvent);
  }

  const mouseEnter = () => {
    setVisibility(null);
    if (props.handleHoverMouseIn)  props.handleHoverMouseIn();
  }

  const mouseLeave = () => {
    setVisibility('none');
    if (props.handleHoverMouseOut) props.handleHoverMouseOut();
  }

  useEffect(() => {
    if ( props.mouseOverMarkerPos === 'fixed') {
      const y = props.mouseOverTextExtended ? chartContextData.chartHeight + 100 : props.mouseOverMarkerPosY || 0
      setTextPosition({x: props.mouseOverMarkerPosX || 0, y: y});
    }
  }, [props.mouseOverMarkerPosY, props.mouseOverMarkerPosX, props.mouseOverMarkerPos])

  if (!props.mouseOverMarker) return (    
  <g className={`mouse-over-marker-empty ${props.className}`}></g>);

  return (
    <g className={`${styles["mouse-over-marker"]} ${props.className}`}>
      <line style={{display: visibility}} className={styles["mouse-over-marker-line"]} 
        x1={linePosition.x1} x2={linePosition.x2}
        y1={linePosition.y1} y2={linePosition.y2}>
      </line>
      <MouseOverText textPosition={textPosition} text={props.mouseOverText} 
        textAnchor={textAnchor} visibility={visibility} mouseOverTextExtended={props.mouseOverTextExtended}>
      </MouseOverText>
      <rect className={styles["mouse-over-container"]} x={0} y={0} 
        width={props.width || 0} height={props.height || 0 }
        style={{strokeWidth: 0, stroke: "none"}}
        onMouseMove={ (e) => mouseMove(e) } onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
      ></rect>
      {props.children}
  </g>
  )
}