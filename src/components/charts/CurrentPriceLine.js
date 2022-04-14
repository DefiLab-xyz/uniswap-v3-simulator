import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { selectCurrentPrice } from "../../store/pool"
import { selectInvestment } from "../../store/investment";
import styles from '../../styles/modules/charts/CurrentPriceLine.module.css'
import { setProtocol } from "../../store/protocol";

const CurrentPriceLine = (props) => {

  const currentPrice = useSelector(selectCurrentPrice);
  const [price, setPrice] = useState();
  const investment = useSelector(selectInvestment)
  const [lineCoords, setLineCoords] = useState({x1: 0, x2: 0, y1: 0, y2: 0, cy: 0})

  useEffect(() => {
    if (props.scale && props.domain) {
      const x = props.scale.x(price);
      const y1 = props.scale.y(props.domain.y[1]);
      const y2 = props.scale.y(props.domain.y[0]);
      const cy = props.scale.y(investment);

      setLineCoords({x1: x, x2: x, y1: y1, y2: y2, cy: cy})
    }
  }, [props.scale, props.domain, price, investment]);

  useEffect(() => {
    if (props.price) {
      setPrice(props.price)
    }
    else {
      setPrice(currentPrice)
    }
  }, [currentPrice, props.price])

  if (props.currentPriceLine) {
    return (
      <g className={styles["current-price-line"]}>
        <line x1={lineCoords.x1} x2={lineCoords.x2}
          y1={lineCoords.y1} y2={lineCoords.y2}>
        </line>
        <circle cx={lineCoords.x1} cy={lineCoords.cy} className={styles["current-price-circle"]} r={2}></circle>
      </g>
    )
  }
  else {
    return <></>
  }
  
}

export default CurrentPriceLine