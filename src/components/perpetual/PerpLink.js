import styles from '../../styles/modules/PerpLink.module.css'
import { useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectBaseToken, selectPriceBase, selectQuoteToken } from '../../store/pool';
import { selectSelectedEditableStrategyRanges } from '../../store/strategyRanges';
import { selectTokenRatios } from '../../store/tokenRatios';
import investment, { selectInvestment } from '../../store/investment';
import { round } from '../../helpers/numbers';

const PerpVals = (props) => {

  const strategyRanges = useSelector(selectSelectedEditableStrategyRanges);
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);
  const priceBase = useSelector(selectPriceBase);
  const tokenRatios = useSelector(selectTokenRatios);
  const investment = useSelector(selectInvestment);

  return (
    <div className={styles["perp-vals-container"]}>
      <div className={styles["perp-vals-instructions"]}>
        <p>Provide liquidity for {quoteToken.symbol}/{baseToken.symbol} on Perpetual Protocol:</p>
          1. Go to Pool on <span className={styles['perp-url']}>
          <a href={props.perpUrl} target="_blank" rel="noreferrer" className="perp-dot-com-url">Perp.com</a></span><br></br><br></br>
          2. Click <b>Connect wallet</b> if your wallet isn't connected already <br></br>
          3. Click <b>Add Liquidity</b> button<br></br>
          4. Choose the <b>Advanced</b> tab<br></br>
          5. Use the following values for your chosen Strategy:<br></br><br></br>
          {strategyRanges && strategyRanges.length ? strategyRanges.map( s => {

            const tokenRatio = tokenRatios.find(t => s.id === t.id );
            const baseratio = tokenRatio ? tokenRatio['token0'] : 1;

            return (
              <Fragment>
                  <b>{s.name}</b><br></br>
                <div className={styles["perp-vals-minmax"]}>
                  <div><div>Min</div><div>{s.inputs.min.value} USD</div></div>
                  <div><div>Max</div><div>{s.inputs.max.value} USD</div></div>
                  <div><div>USD Token Allocation</div><div>{round((investment * s.leverage) * (baseratio / 100), 4)}</div></div>
                </div>
              </Fragment>
            )
          }) : <></>
        }
        <p className={styles["perp-vals-fyi"]}> 
        <b>**</b> USD Token Allocation = Investment <b>*</b> leverage <b>*</b> Token Ratio%<br></br>
        {/* <b>***</b> The Total Cost displayed on the provide liquidity modal on perp.com should roughly equal {investment * s.leverage} (Leveraged vUSD) */}
        </p>
    </div>
    </div>
  )       
        
}

const PerpLink = (props) => {

  const quoteToken = useSelector(selectQuoteToken);

  const [modalVisible, setModalVisible] = useState(false);
  const [perpUrl, setPerpUrl] = useState()

  const handleModalToggle = (clicked) => {
    // if (clicked && !modalVisible === true) window.open(perpUrl, "_blank");

    setModalVisible(!modalVisible);
  }

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (quoteToken && quoteToken.symbol) {
      const url = `https://app.perp.com/pools/${quoteToken.symbol.slice(1)}:USD?code=defi-lab`;
      setPerpUrl(url)
    }
  }, [quoteToken]);


  return (
    <Fragment>
      <div style={{ display: modalVisible === true ? null : 'none'}} className={styles['perp-link-info']}>
        <div className={styles['perp-link-info-close']} onClick={closeModal}><b>X</b></div>
        <PerpVals perpUrl={perpUrl}></PerpVals>
      </div>
      <div className={styles['perp-link-container']}>
        <button onClick={() => handleModalToggle(true)}>Provide Liquidity</button>
      </div>
  </Fragment>)
}

export default PerpLink