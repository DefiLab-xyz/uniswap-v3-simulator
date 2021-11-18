import styles from '../styles/Tooltip.module.css'

const ToolTip = (props) => {

  return (
    <div className={styles.container} style={props.containerStyle}>
      <button className={styles.button} style={props.buttonStyle} onClick={props.onClick} onBlur={props.onBlur}>
        {props.children}
      </button>
      <div className={styles.text} style={props.textStyle}>
        {props.text}
      </div>
    </div>
  )
}

export default ToolTip