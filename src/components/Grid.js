const Grid = (props) => {

const styles = genStyles(props);


  return (
      <div style={styles.gridContainer} className={props.className}>
        {props.children}
      </div>
  )
  
  }

const genStyles = (props) => {

  const columns = props.columns || 12;
  const rows = props.rows || 12;
  const gap = props.gridGap || 0;
  const cellAR = props.cellAspectRatio || 1;
  const gridWidth = props.minWidth ? Math.max(props.gridWidth, props.minWidth) : props.gridWidth || '500px';
  const cellWidth = (gridWidth / columns) - gap;
  const cellHeight = cellWidth * cellAR;

  return {
    gridContainer: {
      display: "grid",
      width: gridWidth,
      height: "auto",
      gridGap: gap,
      gridTemplateColumns: `repeat(${columns}, ${cellWidth}px)`,
      gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
      ...props.gridStyle
    }
  };
}

export default Grid