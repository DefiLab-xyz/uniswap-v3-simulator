import styles from '../styles/modules/RangeSlider.module.css'

const RangeSlider = (props) => {

  const handleInputChange = (e) => {
   if (props.handleInputChange)  props.handleInputChange(e.target.value);
  }

  return (
    <div className={`${styles['range-slider-container']} ${props.className}`}>
      <input type="range" min={props.min || 10} max={props.max || 10} 
        className={`${styles['range-slider-input']}`} step={props.step || 0.1} value={props.value} onInput={handleInputChange}>
      </input>
    </div>
  
  )
}

export default RangeSlider