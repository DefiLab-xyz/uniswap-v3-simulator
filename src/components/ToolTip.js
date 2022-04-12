import styles from '../styles/modules/Tooltip.module.css'

const ToolTip = (props) => {

  return (
    <div className={`${styles.container}`} style={props.containerStyle}>
      <button className={styles.button} style={props.buttonStyle} onClick={props.onClick} onBlur={props.onBlur}>
        {props.children}
      </button>
      <div className={`${props.classNameText} ${styles.text} ${props.className}`} style={props.textStyle}>
        {props.text}
      </div>
    </div>
  )
}

export default ToolTip