import { useState } from "react";
import styles from '../styles/modules/ButtonList.module.css'

export const ToggleButtonsFlex = (props) => {

  const [selected, setSelected] = useState(0);

  const handleToggle = (d, i) => {
    setSelected(i);
    if (props.handleToggle) props.handleToggle(d);
  }

  const buttons = !props.buttons ? (<></>) :
  props.buttons.map((d, i) => {
    return ( 
    <button  style={d.style}
      onClick={() => handleToggle(d, i)} className={ selected === i ? styles["toggle-button-selected"] : styles["toggle-button"] }>
      {d.label}
    </button>
    );
  });  

  return (
    <div className={`${styles['toggle-buttons-flex-container']} ${props.className}`}>
      {buttons}
    </div>
  )
}