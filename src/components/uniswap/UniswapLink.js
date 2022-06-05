import styles from '../../styles/modules/UniswapLink.module.css'
import { useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux';
import {selectBaseToken, selectPool, selectQuoteToken} from '../../store/pool';
import { selectSelectedEditableStrategyRanges } from '../../store/strategyRanges';

import { selectProtocol } from '../../store/protocol';

const UniswapLink = (props) => {

  const pool = useSelector(selectPool);
  const strategyRanges = useSelector(selectSelectedEditableStrategyRanges);
  const protocol = useSelector(selectProtocol);
  const [uniUrl, setUniUrl] = useState();
  const baseToken = useSelector(selectBaseToken);
  const quoteToken = useSelector(selectQuoteToken);

  useEffect(() => {
    if (pool && pool.token0) {

      // https://app.uniswap.org/#/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/500?chain=polygon&minPrice=1713&maxPrice=1775.8

      // console.log(pool)
      // console.log(strategyRanges)
      // console.log(protocol)
      const t0 = quoteToken.tokenId;
      const t1 = baseToken.tokenId;
      const feeTier = pool.feeTier
      const prot = protocol.chain;
      const min = strategyRanges[0].inputs.min.value;
      const max = strategyRanges[0].inputs.max.value;

      const url = 'https://app.uniswap.org/#/add/' + t0 + '/' + t1 + '/' + feeTier + '?chain=' + prot + '&minPrice=' + min + '&maxPrice=' + max;
      // console.log(url)
      //0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/500?chain=polygon&minPrice=1713&maxPrice=1775.8`;
      setUniUrl(url)
    }
  }, [pool, protocol, strategyRanges, baseToken, quoteToken.id]);


  return (
    <Fragment>
      <div className={styles['uniswap-link-container']}>
        <button onClick={() =>  window.open(uniUrl)}>Provide Liquidity</button>
      </div>
  </Fragment>)
}

//https://app.uniswap.org/#/add/0x6b175474e89094c44da98b954eedeac495271d0f/0x6b175474e89094c44da98b954eedeac495271d0f/100?chain=mainnet&minPrice=0.999603&maxPrice=1.0004

export default UniswapLink