import { useSelector } from "react-redux";
import { selectBaseToken, selectLoading, selectQuoteToken } from "../../store/pool";
import styles from '../../styles/modules/BacktestIndicators.module.css'

const displayField = (supressFields, fieldName) => {
  return !supressFields || (supressFields && supressFields.length && !supressFields.includes(fieldName));
}

const fields = (baseToken, quoteToken) => {

  return [{key: 'feeroi', label: "Fee ROI %"}, 
  {key: 'apr', label: "APR %"}, 
  {key: 'assetval', label: "Asset Value"}, 
  {key: 'total', label: "Total Return"}, 
  {key: 'token0Fee', label: `${baseToken} collected`}, 
  {key: 'token1Fee', label: `${quoteToken} collected`}, 
  {key: 'feeUSD', label: "Total Fee in USD"}, 
  {key: 'activeliquidity', label: "% Time in Range"}, 
  {key: 'confidence', label: "BackTest Confidence"}] 
}

const TableRows = (props) => {
  const rows = props.data.map(d => {

    return (
      <tr style={{fontSize: 14, padding: 5}}>
         <td className={styles[`td-${props.page}`]} style={{paddingBottom: 5, paddingTop: 5, color: d.color, fontWeight: 400}}><div className={styles[`td-text-${props.page}`]}>{d.name}</div></td>
         {
            props.fields.map(tF => {
              if (displayField(props.supressFields, tF.key)) {
                return <td className={styles[`td-${props.page}`]}><div className={styles[`td-text-${props.page}`]}>{d.data[tF.key]}</div></td>
              }
            })
          }
      </tr>
    )
  });

  return (rows);
}

const BacktestIndicators = (props) => {

  const thStyle = {fontWeight: 400, paddingBottom: 10, paddingTop: 10, paddingLeft: 5, paddingRight: 5}
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const loading = useSelector(selectLoading);
  const tableFields = fields(baseToken.symbol, quoteToken.symbol);

  if (props.loading|| loading) {
    return (<div className="backtest-indicators-data-loading"></div>)
  }

  if (props.data && props.data.length && props.data[0] && props.data[0].hasOwnProperty('data')) {
    return (
      <div className={`${props.className} ${styles[`container-${props.page}`]}`}
        style={{display: "flex", marginTop: 15}}> 
        <table>
          <tr>
            <th></th>
            {
              tableFields.map(tF => {
                if (displayField(props.supressFields, tF.key)) {
                  return <th style={thStyle}>{tF.label}</th>
                }
              })
            }
          </tr>
          <TableRows page={props.page} data={props.data} fields={tableFields} supressFields={props.supressFields}></TableRows>
        </table>
      </div>
    )
  }
  else {
    return <></>
  }

  
}

export default BacktestIndicators