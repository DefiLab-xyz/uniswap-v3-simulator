import styles from '../../styles/modules/Loader.module.css'

const Loader = (props) => {

  const visibility = props.loading === true ? null : "hidden"

  return (
    <g style={{visibility: visibility }}>
    <circle className={styles["inner"]} cx={props.cx} cy={props.cy} r="23.5" stroke="rgba(175,129,228, 0.2)" stroke-width="2" fill="none" />
    <circle className={styles["outer"]}  cx={props.cx} cy={props.cy} r="48.5" stroke="rgba(175,129,228, 0.2)" stroke-width="2" fill="none" />
    </g>
  )
  
}

export default Loader