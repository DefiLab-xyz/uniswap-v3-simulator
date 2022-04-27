import { TextFilter } from './SVGFilters'


export const TextAlignedRight = (props) => {

  return (
    <svg className={props.className} width={props.width} height={props.height} fill={props.fill}>
    {props.children}
    <text text-anchor="end" alignment-baseline="middle" x={props.x} y={props.y} filter="url(#text-filter-purple)" >{props.text}</text>
    </svg>
  )
}

export const TextAlignedLeft = (props) => {

  const filterID = props.filterId ? props.filterId : "url(#text-filter-purple)"
  const fontWeight = props.fontWeight ? props.fontWeight : 400

  return (
    <svg className={props.className} width={props.width} height={props.height} fill={props.fill} fontWeight={fontWeight}>
    {props.children}
    <text text-anchor="start" alignment-baseline="middle" filter={filterID} x={props.x} y={props.y}>{props.text}</text>
    </svg>
  )
}

export const TextAlignedCenter = (props) => {

  const filterID = props.filterId ? props.filterId : "url(#text-filter-purple)"
  const fontWeight = props.fontWeight ? props.fontWeight : 400
  
  return (
    <svg className={props.className} width={props.width} height={props.height} fill={props.fill} fontWeight={fontWeight}>
    {props.children}
    <text text-anchor="middle" alignment-baseline="middle" filter={filterID} x={props.x} y={props.y}>{props.text}</text>
    </svg>
  )
}

export const TextAlignedCenterNoFilter = (props) => {

  const filterID = props.filterId ? props.filterId : "gasHeadingText"

  return (
    <svg font-size={props.fontSize} className={props.className} width={props.width} height={props.height} fill={props.fill}>
    {props.children}
    <text text-anchor="middle" alignment-baseline="middle" x={props.x} y={props.y} fontWeight="500">{props.text}</text>
    </svg>
  )
}

