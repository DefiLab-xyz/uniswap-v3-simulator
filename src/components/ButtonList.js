import { useState, useEffect } from "react";
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
      onClick={() => handleToggle(d, i)} className={ selected === i ? `${styles["toggle-button-selected"]}` : `${styles["toggle-button"]}` }>
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

export const ButtonListToggle = (props) => {

  const [selected, setSelected] = useState(0);

  const handleSelected = (d, i) => {
    setSelected(i);
    if (props.handleSelected) props.handleSelected(d);
  }

  const buttons = !props.buttons ? (<></>) :
  props.buttons.map((d, i) => {
    return ( 
      <button  style={d.style}
        onMouseDown={() => handleSelected(d, i)} className={ selected === i ? `${styles[`button-list-${props.type}`]} ${props.classNameButton}` : `${styles[`button-list-${props.type}`]} ${props.classNameButton}` }>
        { props.labelKey ? d[props.labelKey] : d.label || ""}
      </button>
    );
  });  

  return (
    <div className={`${styles[`button-list-${props.type}-container`]} ${props.className}`} style={props.style}>
      {buttons}
    </div>
  )
}

export const ButtonList = (props) => {

  const [buttons, setButtons] = useState(props.buttons || []);

  const handleSelected = (d, i) => {
    const tempButtons = [...buttons];
    tempButtons[i].selected = !tempButtons[i].selected;
    setButtons([...tempButtons])
    if (props.handleSelected) props.handleSelected(tempButtons[i]);
  }

  useEffect(() => {
    setButtons(props.buttons)
  }, [props.buttons])
  
  return (
    <div className={`${styles[`button-list-${props.type}-container`]} ${props.className}`} style={props.style}>
      {
         buttons && buttons.length ? buttons.map((d, i) => {
          return ( 
            <button style={d.style}
              onMouseDown={() => handleSelected(d, i)} className={ d.selected ? `${styles[`button-list-${props.type}-selected`]} ${props.classNameButton}` : `${styles[`button-list-${props.type}`]} ${props.classNameButton}` }>
              { props.labelKey ? d[props.labelKey] : d.label || ""}
            </button>
         )}) : <></>
        }
    </div>
  )
}