import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectStrategies } from "../../store/strategies"
import buttonStyles from '../../styles/modules/ButtonList.module.css'

import { ButtonListToggle } from "../ButtonList"

const DropdownSelect = (props) => {

  const strategies = useSelector(selectStrategies);
  const [buttonList, setButtonList] = useState();
  const [selected, setSelected] = useState( strategies.find( d => props.page === 'perpetual' ?  d.id === "hodl2" :  d.id === "hodl5050") );
  const [visibility, setVisibility] = useState("hidden");

  useEffect(() => {
    if (strategies && props.selectedStrategy) {
      const buttonListTemp = strategies.filter(d => {
        return props.page === 'perpetual' ? d.id !== props.selectedStrategy.id && d.id !== selected.id && d.id !== "v2" : d.id !== props.selectedStrategy.id && d.id !== selected.id && d.id !== "v2"
      });
      setButtonList(buttonListTemp);
    }
  }, [strategies, selected, props.selectedStrategy, props.page]);

  const handleSelected = (selected) => {
    const selectedTemp = strategies.find( d => d.id === selected.id );
    setSelected(selectedTemp);
    if (props.handleSelected) props.handleSelected(selectedTemp);
  }


  useEffect(() => {
    handleSelected({id: props.page === 'perpetual' ? "hodl2" :  "hodl5050"});
  }, [props.page, props.selectedStrategy])


  const handleBlur = () => {
    setVisibility("hidden");
  }

  const toggleVisibility = () => {
    setVisibility(visibility === "hidden" ? null : "hidden");
  }
//${props.pageStyle["button"]} ${props.pageStyle["selected"]}
    return (
      <Fragment>
        <button className={`${buttonStyles["button-list-grid"]} ${props.pageStyle["button"]}`} style={{color: props.page === 'perpetual' ? "black" : selected.style.color, textAlign: 'bottom', border: props.page === 'perpetual' ? "1px solid " + selected.style.color : "", backgroundColor: null}}
        onClick={toggleVisibility} onBlur={handleBlur}>{selected.name}</button>
        <ButtonListToggle page={props.page} pageStyle={props.pageStyle} style={{visibility: visibility}} buttons={buttonList} labelKey="name" handleSelected={handleSelected} classNameButton={props.pageStyle["button"]} type="grid" noSelected={true}></ButtonListToggle>
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