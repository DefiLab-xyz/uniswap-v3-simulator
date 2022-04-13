import { useDispatch, useSelector } from 'react-redux'
import {selectStrategies, toggleSelectedStrategy, selectStrategiesByIds} from '../store/strategies'


const StrategyPicker = (props) => {

  const strategiesAll = useSelector(selectStrategies);
  const selectedStrategies = props.strategies ? selectStrategiesByIds(strategiesAll, props.strategies) : strategiesAll; 
  const dispatch = useDispatch();

  const toggleStrategySelect = (strategy) => {
    dispatch(toggleSelectedStrategy(strategy));
  }
 
  const list = selectedStrategies.slice(0).reverse().map( d => {
    return (
      <button  
        onClick={() => toggleStrategySelect(d.id)}
        className={d.selected ? `${props.pageStyle['button']} ${props.pageStyle['selected']}` : `${props.pageStyle['button']}` }
        style={{ width: '95%', color: props.page === "perpetual" ? "black" : d.style.color, justifyContent: "center", height: "22px", borderRadius: "1", paddingLeft: "5%", paddingRight: "5%", fontSize: "12px", fontWeight: 400, marginBottom: "7px"}}>
        <span style={{width: "10px", height: "10px", backgroundColor: d.color, borderRadius: "50%"}}></span><span>&nbsp;&nbsp;&nbsp;
          {props.page === 'perpetual' ? d.name.replace('V3 ','') : d.name}</span>
    </button>
    );
  });

  return (
    <div style={{paddingTop: 15, paddingLeft: "5%", display: "grid", alignItems: "center"}}>{list}</div>);
}

export default StrategyPicker