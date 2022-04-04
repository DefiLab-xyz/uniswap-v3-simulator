import { useState, useRef } from 'react'
import toggle1 from '../assets/toggle1.svg'
import toggle2 from '../assets/toggle2.svg'
import refresh from '../assets/refresh.svg'
import styles from '../styles/modules/Button.module.css'
import { ReactComponent as  Plus } from '../assets/plus.svg'
import { ReactComponent as  Minus } from '../assets/minus.svg'

export const ToggleButton = (props) => {
  const [toggle, setToggle] = useState(0);
  const [toggleImg, setToggleImg] = useState(toggle1);

  const handleClick = () => {
    if (props.onClick)  props.onClick();

    if (toggle === 0) {
      setToggleImg(toggle2);
      setToggle(1)
    } else {
      setToggleImg(toggle1);
      setToggle(0)
    }
  }

  return (<span> 
    <button className={styles["toggle-button"]} onClick={handleClick}>
      <img src={toggleImg} alt={props.alt} className={styles["toggle-img"]}></img>
    </button>
  </span>);

}

export const RefreshButton = (props) => {
  
  const handleClick = () => {
    if (props.onClick)  props.onClick();
  }

  return (<span> 
    <button className={`${styles["round"]} ${styles["refresh-button"]}`} onClick={handleClick}>
      <img src={refresh} alt={props.alt} className={styles["refresh-img"]}></img>
    </button>
  </span>);

}

export const CrementButton = (props) => {

  const icon = props.type === "decrement" ? <Minus className={styles["crement-img"]}></Minus> : <Plus className={styles["crement-img"]}></Plus>;
  const crement = props.type === "decrement" ? -1 : 1;
  const holding= useRef(false);
  let buttonLongPress;

  const handleOnMouseDown = () => {
    holding.current = true;
    handleButtonHold();
  }

  const handleOnMouseUp = () => {
    holding.current = false;
  }

  const handleButtonHold = () => {
 
    if (holding.current === true) {
      if (props.onCrement) props.onCrement(crement);
      buttonLongPress = setTimeout(handleButtonHold, 100);
    } 
    else {
      clearTimeout(buttonLongPress);
    }
  }

  return (
    <button className={`${styles["round"]} ${styles["crement-button"]}`}
    onMouseDown={() => handleOnMouseDown()}
    onMouseUp={() => handleOnMouseUp()}>{icon}</button>
  )
}
