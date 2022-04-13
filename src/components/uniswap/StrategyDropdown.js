import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectStrategies } from "../../store/strategies"
import buttonStyles from '../../styles/modules/ButtonList.module.css'

import { ButtonListToggle } from "../ButtonList"

const DropdownSelect = (props) => {

  const strategies = useSelector(selectStrategies);
  const [buttonList, setButtonList] = useState();
  const [selected, setSelected] = useState(strategies.find( d => d.id === "hodl5050"));
  const [visibility, setVisibility] = useState("hidden");

  useEffect(() => {
    if (strategies && props.selectedStrategy) {
      const buttonListTemp = strategies.filter(d => {
        return d.id !== props.selectedStrategy.id && d.id !== selected.id
      });
      setButtonList(buttonListTemp);
    }
  }, [strategies, selected, props.selectedStrategy]);

  useEffect(() => {
    handleSelected({id: "hodl5050"});
  }, [props.selectedStrategy])

  useEffect(() => {
    console.log(props.pageStyle)
  }, [props.pageStyle])


  const handleSelected = (selected) => {
    const selectedTemp = strategies.find( d => d.id === selected.id );
    setSelected(selectedTemp);
    if (props.handleSelected) props.handleSelected(selectedTemp);
  }

  const handleBlur = () => {
    setVisibility("hidden");
  }

  const toggleVisibility = () => {
    setVisibility(visibility === "hidden" ? null : "hidden");
  }
//${props.pageStyle["button"]} ${props.pageStyle["selected"]}
    return (
      <Fragment>
        <button className={`${buttonStyles["button-list-grid"]} ${props.pageStyle["button"]} ${props.pageStyle["selected"]}`} style={{color: props.page === 'perpetual' ? "black" : selected.style.color, textAlign: 'bottom'}}
        onClick={toggleVisibility} onBlur={handleBlur}>{selected.name}</button>
        <ButtonListToggle page={props.page} pageStyle={props.pageStyle} style={{visibility: visibility}} buttons={buttonList} labelKey="name" handleSelected={handleSelected} classNameButton={props.pageStyle["button"]} type="grid"></ButtonListToggle>
      </Fragment>
 
    )
  
}

const StrategyDropdown = (props) => {

  const [selectVisible, setSelectVisible] = useState("hidden");

   return (
     <Fragment>
      <div className={props.className}>
        <span style={{color: props.selectedStrategy ? props.selectedStrategy.color : "black"}}>{props.selectedStrategy && props.selectedStrategy.name ? props.selectedStrategy.name : ""}</span>
        <span> &nbsp; vs</span> 
      </div>
      <DropdownSelect page={props.page} pageStyle={props.pageStyle} visibility={selectVisible} selectedStrategy={props.selectedStrategy} handleSelected={props.handleSelected}></DropdownSelect>
     </Fragment>
   
   )
}

export default StrategyDropdown