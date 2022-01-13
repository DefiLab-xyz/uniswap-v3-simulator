const AverageLine = (props) => {
  

  if (props.avgLine) { 

    if (props.data && props.data.length && props.scale && props.domain && props.domain.x) {

      const len = props.data.length;
      const avg = props.data.reduce((sum, d) => sum + parseFloat(d.y), 0) / len;

      const x1 = props.scale.x(props.domain.x[0]);
      const x2 = props.scale.x(props.domain.x[(props.domain.x.length -1)]);
      const y = props.scale.y(avg);
    
        return (
          <g>
            <path d={`M ${x1} ${y}, ${x2 + 5} ${y}`} strokeWidth="1px" stroke="rgb(175, 129, 228)" strokeDasharray="2 2"></path>
            <text x={x2 + 8} y={y} fontSize="7px" stroke="none" fill="rgb(175, 129, 228)" alignmentBaseline="middle">AVG</text>
            </g>
          

        )
    }

     
  
  }

  return (
    <></>
  )

  
}

export default AverageLine