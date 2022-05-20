import React, { useState, useRef, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {fetchPoolData, selectPoolName, toggleBaseToken} from '../../store/pool'
import {selectAllProtocols, selectProtocolId, selectProtocolsByIds, setProtocol} from '../../store/protocol'
import { setDefaultInvestment } from '../../store/investment'
import styles from '../../styles/modules/PoolSearch.module.css'
import cat from '../../assets/cat.svg'
import {tokensBySymbol} from '../../api/thegraph/uniTokens'
import {top50PoolsByTvl, poolsByTokenId, poolsByTokenIds} from '../../api/thegraph/uniPools'
import {formatLargeNumber, parsePrice} from '../../helpers/numbers'

const SearchItemsStatsPerp = (props) => {

  const [stat, setStat] = useState( { lowerBaseApr: 0, lowerRewardApr: 0, upperBaseApr: 0, upperRewardApr: 0} );

  useEffect(() => {
    if (props.perpStatsData && props.perpStatsData.length) {
      const statTemp = props.perpStatsData.find( f => f.marketSymbol === `${props.item.token0.symbol}/${props.item.token1.symbol}`);
      if (statTemp) setStat(statTemp);
    }
  }, [props.item.token0.symbol, props.item.token1.symbol, props.perpStatsData]);

    const item = props.item;

      return (
        <Fragment>
          <div className={styles['search-item-symbol']} >{props.item.token0.symbol} / {item.token1.symbol}</div>&nbsp;
          <div className={styles['search-item-base-apr']}>{`${parsePrice(stat.lowerBaseApr, true)}% - ${parsePrice(stat.upperBaseApr, true)}%`}</div>&nbsp;
          <div className={styles['search-item-reward-usd']}>{`${parsePrice(stat.lowerRewardApr, true)}% - ${parsePrice(stat.upperRewardApr, true)}%`}</div>&nbsp;
        </Fragment>
      );
}

const SearchItemsStats = (props) => {

  const item = props.item;
      return (
        <Fragment>
          <div className={styles['search-item-symbol']} >{item.token0.symbol} / {item.token1.symbol}</div>&nbsp;
          <div><div className={styles['search-item-fee-tier']}>{`${(item.feeTier / 10000)}%`}</div></div>&nbsp;
          <div className={styles['search-item-tvl']}>{`$${formatLargeNumber(item.totalValueLockedUSD)}`}</div>&nbsp;
          <div className={styles['search-item-volume-usd']}>{`$${formatLargeNumber(item.poolDayData[0].volumeUSD)}`}</div>&nbsp;
          <div className={styles['search-item-fee-usd']}>{`$${formatLargeNumber(item.poolDayData[0].feesUSD)}`}</div>&nbsp;
        </Fragment>
      );
}


const SearchItemsStatsContainer = (props) => {

  const list = props.items.map((item) => 
    <li 
    className={styles['search-item']} 
    key={item.id} 
    onMouseDown={() => props.handleOnMouseDown(item)}>
    {
      props.baseTokenHidden ? <SearchItemsStatsPerp item={item} perpStatsData={props.perpStatsData}></SearchItemsStatsPerp> : <SearchItemsStats item={item}></SearchItemsStats>
    }
    </li>
  );

  return list
}



const SearchItems = (props) => {

  const dispatch = useDispatch();

  const handleOnMouseDown = (item) => {  
    if (props.baseTokenHidden) {
      dispatch(setDefaultInvestment(item.token1Price));
      dispatch(fetchPoolData({...item, toggleBase: true}));
    }
    else {
      dispatch(fetchPoolData(item));
      dispatch(setDefaultInvestment(item.token0Price));
    }
    if (props.onClick) props.onClick(item);
  }

  return (<ul className={`${styles['search-results']}`} style={{display: props.visibility}}>
    <SearchItemsStatsContainer items={props.items} handleOnMouseDown={handleOnMouseDown} baseTokenHidden={props.baseTokenHidden} perpStatsData={props.perpStatsData}></SearchItemsStatsContainer>
  </ul>);
}

const EmptySearchItems = (props) => {

  return (
    <div className={styles["search-items-empty"]} style={{display: props.visibility || "flex"}}>       
    <div className={styles["magic-cat-container"]}>
      <div className={styles["magic-cat"]}><img  src={cat} alt="cat" style={{ width: "150px", height: "150px", marginTop: "2px"}}></img></div>
    </div>
    <div>Sorry, we can't find any Pools <br></br> for that search.</div>
  </div>
  )
}

const LoadingSearchItems = (props) => {

  return (
  <div className={styles['load']} style={{display: props.visibility}}>
    <div className={styles['one']}></div>
    <div className={styles['two']}></div>
    <div className={styles['three']}></div>
  </div>);
}

const SearchLabels = (props) => {

  const [labelsDef, setLabelsDef] = useState([{name: "Pool", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-symbol'}, 
  {name: "Fee Tier", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-fee-tier'}, 
  {name: "TVL", sortable: true, sortClass: 'sort-icon-show', labelClass: 'search-label-tvl', field: "totalValueLockedUSD"},
  {name: "Volume 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-volume-usd', field: "volumeUSD"},
  {name: "Fees 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-fee-usd', field: "feesUSD"}]);
  
  const [labelsPerp, setLabelsPerp] = useState([{name: "Pool", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-symbol'}, 
  {name: "Base APR%", sortable: true, sortClass: 'sort-icon-show', labelClass: 'search-label-base-apr', field: "lowerBaseApr"},
  {name: "Reward APR%", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-reward-apr', field: "lowerRewardApr"}]);

  const [labels, setLabels] = useState([]);

  const handleLabelSort = (label) => {
    const perp = props.baseTokenHidden ? true : false;
    if (props.onClick) props.onClick(label, perp);

    labels.forEach(d => {
      if (d.sortable) {
        return d.name === label.name ? d.sortClass = 'sort-icon-show' : d.sortClass = 'sort-icon-hide';
      }
    });
  }

  useEffect(() => {
    setLabels(props.baseTokenHidden ? labelsPerp : labelsDef);
  }, [labelsDef, labelsPerp, props.baseTokenHidden])
  

  const searchLabels = labels.map(d => {
    return (
      <div key={d.name} className={`${styles["search-label"]} ${styles[d.labelClass]}`} onMouseDown={() => handleLabelSort(d)}>
        <span className={styles[d.sortClass]}>⬍&nbsp;</span><span>{d.name}</span>
      </div>
    )
  });

  return (
    <div className={styles['search-labels']} style={{display: props.visibility}}>{searchLabels}</div>
  )
}

const SearchResults = (props) => {

  const [searchResults, setSearchResults] = useState(null);
  const [searchResultsSort, setSearchResultsSort] = useState(true);
  const searchStringController = useRef(new AbortController());
  const protocolID = useSelector(selectProtocolId);

  const searchStringIsAnId = (searchString) => searchString.length && searchString.length === 42 && searchString.startsWith('0x');
  const searchStringIsValid = (searchString) => searchString.trim() && typeof(searchString) === 'string' && searchString.trim().length > 0;

  const handleTop50Pools = async (abortController, protocol) => {
    const top50Pools = await top50PoolsByTvl(abortController.signal, protocol);
    setSearchResultsSort(true);
    setSearchResults(top50Pools);
  }

  const searchForPool = async (abortController, searchString, protocol) => {
    
    if (searchStringIsAnId(searchString)) return await poolsByTokenId(searchString, abortController.signal, protocol); 

    const tokenPairs = await tokensBySymbol(searchString, abortController.signal, protocol);
    if (tokenPairs && tokenPairs.hasOwnProperty("error")) return null;
    return tokenPairs && tokenPairs.length && tokenPairs.length > 0 ? await poolsByTokenIds(tokenPairs.map(d => d.id), abortController.signal, protocolID) : "empty";
  }

  useEffect(() => {
    if (props.enrichedSearchData && searchResults !== 'empty' && props.searchString === "") {
      setSearchResults(props.enrichedSearchData)
    }
  }, [props.enrichedSearchData, props.searchString, searchResults]);


  useEffect(() => {

    setSearchResults(null);

    if (props.visibility !== 'none') {
      if (props.customSearch) {
          setSearchResults( props.customSearch(props.searchString));
      }
      else {
        searchStringController.current = new AbortController();

        if (searchStringIsValid(props.searchString)) { 
          searchForPool(searchStringController.current, props.searchString, protocolID).then(searchResults => {
            setSearchResults(searchResults);
          });
        } else if (props.searchString === "") {
          handleTop50Pools(searchStringController.current, protocolID);
        }
      }
    } 

    return () => searchStringController.current.abort();

  }, [props.searchString, protocolID]);

  
  const handleLabelClick = (label, perp) => {
    if (props.labelOnClick) props.labelOnClick();
    if (perp) {
      const sortBy = label.field;
      const tempResults = searchResults.sort((a, b) => {
        return parseFloat(a[sortBy]) > parseFloat(b[sortBy]) ? -1 : 1;
      });
      setSearchResultsSort(false);
      setSearchResults(tempResults);
    }
    else {
      const sortBy = label.field;
      const tempResults = searchResults.sort((a, b) => {
        return parseFloat(a["poolDayData"][0][sortBy]) > parseFloat(b["poolDayData"][0][sortBy]) ? -1 : 1;
      });
      setSearchResults(tempResults);
    }
  }

  if (searchResults === "empty") {
    return (<EmptySearchItems visibility={props.visibility} items={searchResults}></EmptySearchItems>);
  }
  if (searchResults !== 'empty' && searchResults && searchResults.length && searchResults.length > 0) {
    return (
      <React.Fragment>
        <SearchLabels visibility={props.visibility} onClick={handleLabelClick} baseTokenHidden={props.baseTokenHidden}></SearchLabels>
        <SearchItems baseTokenHidden={props.baseTokenHidden} visibility={props.visibility} items={searchResults} onClick={props.itemOnClick} perpStatsData={props.perpStatsData}></SearchItems>
      </React.Fragment>
    );
  }

  return (<LoadingSearchItems visibility={props.visibility}></LoadingSearchItems>);
  
}


const Protocol = (props) => {

  const dispatch = useDispatch();
  const protocolID = useSelector(selectProtocolId);
  const protocolsAll = useSelector(selectAllProtocols);
  const [protocolsSelected, setProtocolsSelected] = useState([]);

  const handleProtocolChange = (prot) => {
    if (props.handleProtocolChange) props.handleProtocolChange();
    dispatch(setProtocol(prot));
  }

  useEffect(() => {
    const protocols = props.protocols && props.protocols.length && props.protocols.length > 0 ? 
    selectProtocolsByIds(protocolsAll, props.protocols) : protocolsAll;
    setProtocolsSelected(protocols);
  }, [props.protocols, protocolsAll]);

  const protocols = protocolsSelected.map((prot) => {
    return ( 
      <button 
        title={prot.title}
        key={prot.id}
        className={protocolID === prot.id ? styles["protocol-selected"] : styles["protocol-not-selected"]}
        style={{display: props.visibility}}
        onMouseDown={() => handleProtocolChange(prot)}>
        <img src={prot.logo} alt={prot.title} className={styles['protocol']}></img>
      </button>
    )
  });

  return ( <div className={styles['protocol-container']}>{protocols}</div> );
  
}

const SearchInput = (props) => {

  const inputRef = useRef();
  const searchIcon = `${String.fromCharCode(8981)}`;
  const handleInput = (e) => { if (props.handleInput) { props.handleInput(e); } }

  // closes search box when user click outside of search input. Disabled when search label or protocol is clicked. 
  const handleBlur = (e) => {
    if (props.disableBlur) { inputRef.current.focus(); }
    if (props.handleBlur) { props.handleBlur(e); }
  }

  return(
    <div className={styles["search-input-container"]}>
      <input 
        className={`
          ${props.visibility === null ? styles['search-input-open'] : styles['search-input']}
          ${props.pageStyle['input']}
        `}
        ref={inputRef}
        value={props.inputValue} 
        onChange={handleInput} 
        onFocus={(e) => props.handleFocus(e)}
        onBlur={handleBlur}
        onKeyUp={(e) => props.handleKeyUp(e)}
        style={{fontSize: 14}}
      >     
      </input>       
      <span className={styles['search-icon']}>{searchIcon}</span>
      {props.children}
    </div>
  )

}

const SearchDescription = (props) => {
  return (
    <div className={styles.description}
     style={{display: props.visibility, ...props.style}}>
      Search by token, contract address, or pool address
    </div>
  )
}

// Search for Uniswap V3 Pools by ID or token symbol.
const PoolSearch = (props) => {

  const [inputValue, setInputValue] = useState(useSelector(selectPoolName));
  const selected = useSelector(selectPoolName);
  const [visibility, setVisibility] = useState('none');
  const [disableBlur, setDisableBlur] = useState(false);

  const handleInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleDisableBlur = ()  => setDisableBlur(true);

  const toggleVisibility = (e) => { 
    if (e.type !== 'focus' && !disableBlur) {
      setVisibility('none');
      setInputValue(selected);
    }
    else {
      setVisibility(null);
      setInputValue("")
    }
    setDisableBlur(false);
  }


  useEffect(() => {
    setInputValue(selected);
  }, [selected])

  const handlePoolSelected = (item) => {
    if (props.handlePoolSelected) props.handlePoolSelected(item);
    setInputValue(item.token0.symbol + " / " + item.token1.symbol);
    setVisibility('none');
  }

  return (
    <Fragment>
      <div className={styles["container"]} style={props.containerStyle}>
      <div className={styles["label"]} style={props.labelStyle}>{ props.label || 'Pool'}</div> 
    </div>
    <div className= {visibility === 'none' ? styles["results-container-hidden"] : styles['results-container']}>
        <SearchDescription visibility={visibility}           
          pageStyle={props.pageStyle}
          page={props.page}></SearchDescription>
        <SearchInput 
          pageStyle={props.pageStyle}
          page={props.page}
          inputValue={inputValue} 
          handleInput={handleInput} 
          handleKeyUp={handleInput}
          handleFocus={toggleVisibility} 
          handleBlur={toggleVisibility} 
          visibility={visibility} 
          disableBlur={disableBlur}>
          <Protocol 
          pageStyle={props.pageStyle}
          page={props.page}
          handleProtocolChange={handleDisableBlur} visibility={visibility} protocols={props.protocols}></Protocol>
        </SearchInput>
        <SearchResults
          pageStyle={props.pageStyle}
          enrichedSearchData={props.enrichedSearchData}
          page={props.page}
          customSearch={props.customSearch} 
          searchString={inputValue} 
          visibility={visibility} 
          baseTokenHidden={props.baseTokenHidden}
          labelOnClick={handleDisableBlur}
          itemOnClick={handlePoolSelected}
          perpStatsData={props.perpStatsData}>
        </SearchResults>
      </div>
    </Fragment>
   
  );
}

export default PoolSearch