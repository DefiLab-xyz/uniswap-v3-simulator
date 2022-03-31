import { scaleBand, scaleLinear } from "d3-scale";

const chartscale = (props) => {
  switch (props.scaleType) {
    case "linear":
      return scaleLinear()
        .range(props.range)
        .domain(props.domain);
    case "band":
      return scaleBand()
      .range(props.range)
      .domain(props.domain)
      .padding(props.barPadding || 0);
    default: return null;
  }
}

export default chartscale