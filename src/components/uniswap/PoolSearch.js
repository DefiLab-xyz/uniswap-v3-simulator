import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {fetchPoolData} from '../../store/pool'
import {selectAllProtocols, selectProtocolId, setProtocol} from '../../store/protocol'
import { setDefaultInvestment } from '../../store/investment'
import styles from '../../styles/modules/PoolSearch.module.css'
import cat from '../../assets/cat.svg'
import {tokensBySymbol} from '../../api/thegraph/uniTokens'
import {top50PoolsByTvl, poolsByTokenId, poolsByTokenIds} from '../../api/thegraph/uniPools'
import {formatLargeNumber} from '../../helpers/numbers'

const SearchItems = (props) => {

  const dispatch = useDispatch();

  const handleOnMouseDown = (item) => {
    dispatch(fetchPoolData(item));
    dispatch(setDefaultInvestment(item.token0Price));
    if (props.onClick) props.onClick(item);
  }

  const list = props.items.map((item) => 
    <li 
    className={styles['search-item']} 
    key={item.id} 
    onMouseDown={() => handleOnMouseDown(item)}>
        <div className={styles['search-item-symbol']} >{item.token0.symbol} / {item.token1.symbol}</div>&nbsp;
        <div><div className={styles['search-item-fee-tier']}>{`${(item.feeTier / 10000)}%`}</div></div>&nbsp;
        <div className={styles['search-item-tvl']}>{`$${formatLargeNumber(item.totalValueLockedUSD)}`}</div>&nbsp;
        <div className={styles['search-item-volume-usd']}>{`$${formatLargeNumber(item.poolDayData[0].volumeUSD)}`}</div>&nbsp;
        <div className={styles['search-item-fee-usd']}>{`$${formatLargeNumber(item.poolDayData[0].feesUSD)}`}</div>&nbsp;
    </li>
  );

  return (<ul className={`${styles['search-results']}`} style={{display: props.visibility}}>{list}</ul>);
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

  const [labels, setLabels] = useState([{name: "Pool", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-symbol'}, 
  {name: "Fee Tier", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-fee-tier'}, 
  {name: "TVL", sortable: true, sortClass: 'sort-icon-show', labelClass: 'search-label-tvl', field: "totalValueLockedUSD"},
  {name: "Volume 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-volume-usd', field: "volumeUSD"},
  {name: "Fees 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-fee-usd', field: "feesUSD"}]);

  const handleLabelSort = (label) => {
    if (props.onClick) props.onClick(label);

    labels.forEach(d => {
      if (d.sortable) {
        return d.name === label.name ? d.sortClass = 'sort-icon-show' : d.sortClass = 'sort-icon-hide';
      }
    });
  }

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
  const searchStringController = useRef(new AbortController());
  const protocolID = useSelector(selectProtocolId);

  const searchStringIsAnId = (searchString) => searchString.length && searchString.length === 42 && searchString.startsWith('0x');
  const searchStringIsValid = (searchString) => searchString.trim() && typeof(searchString) === 'string' && searchString.trim().length > 0;

  const handleTop50Pools = async (abortController, protocol) => {
    const top50Pools = await top50PoolsByTvl(abortController.signal, protocol);
    setSearchResults(top50Pools);
  }

  const searchForPool = async (abortController, searchString, protocol) => {
    if (searchStringIsAnId(searchString)) return await poolsByTokenId(searchString, abortController.signal, protocol); 

    const tokenPairs = await tokensBySymbol(searchString, abortController.signal, protocol);
    if (tokenPairs && tokenPairs.hasOwnProperty("error")) return null;

    return tokenPairs && tokenPairs.length && tokenPairs.length > 0 ? await poolsByTokenIds(tokenPairs.map(d => d.id), abortController.signal, props.protocol) : "empty";
  }

  useEffect(() => {
    setSearchResults(null);  

    if (props.visibility !== 'none') {
      searchStringController.current = new AbortController();

      if (searchStringIsValid(props.searchString)) { 
        searchForPool(searchStringController.current, props.searchString, protocolID).then(searchResults => {
          setSearchResults(searchResults);
        });
      } else if (props.searchString === "") {
        handleTop50Pools(searchStringController.current, protocolID);
      }

    } 

    return () => searchStringController.current.abort();

  }, [props.searchString, protocolID]);

  

  const handleLabelClick = (label) => {
    if (props.labelOnClick) props.labelOnClick();
    const sortBy = label.field;
    const tempResults = searchResults.sort((a, b) => {
      return parseFloat(a["poolDayData"][0][sortBy]) > parseFloat(b["poolDayData"][0][sortBy]) ? -1 : 1;
    });
    setSearchResults(tempResults);
  }

  if (searchResults === "empty") {
    return (<EmptySearchItems visibility={props.visibility} items={searchResults}></EmptySearchItems>);
  }
  if (searchResults !== 'empty' && searchResults && searchResults.length && searchResults.length > 0) {
    return (
      <React.Fragment>
        <SearchLabels visibility={props.visibility} onClick={handleLabelClick}></SearchLabels>
        <SearchItems visibility={props.visibility} items={searchResults} onClick={props.itemOnClick}></SearchItems>
      </React.Fragment>
    );
  }

  return (<LoadingSearchItems visibility={props.visibility}></LoadingSearchItems>);
  
}


const Protocol = (props) => {

  const dispatch = useDispatch();
  const protocolID = useSelector(selectProtocolId);

  const handleProtocolChange = (prot) => {
    if (props.handleProtocolChange) props.handleProtocolChange();
    dispatch(setProtocol(prot));
  }

  const protocols = useSelector(selectAllProtocols).map((prot) => {
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
        className={props.visibility === null ? styles['search-input-open'] : styles['search-input']}
        ref={inputRef}
        value={props.inputValue} 
        onChange={handleInput} 
        onFocus={(e) => props.handleFocus(e)}
        onBlur={handleBlur}
        onKeyUp={(e) => props.handleKeyUp(e)}
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

  const [inputValue, setInputValue] = useState("USDC / WETH");
  const [selected, setSelected] = useState("USDC / WETH");
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

  const handlePoolSelected = (item) => {
    if (props.handlePoolSelected) props.handlePoolSelected(item);
    setSelected(item.token0.symbol + " / " + item.token1.symbol);
    setInputValue(item.token0.symbol + " / " + item.token1.symbol);
    setVisibility('none');
  }

  return (
    <div className={styles["container"]} style={props.containerStyle}>
      <div className={styles["label"]} style={props.labelStyle}>{ props.label || 'Pool'}</div> 
      <div className= {visibility === 'none' ? styles["results-container-hidden"] : styles['results-container']}>
        <SearchDescription visibility={visibility}></SearchDescription>
        <SearchInput 
          inputValue={inputValue} 
          handleInput={handleInput} 
          handleKeyUp={handleInput}
          handleFocus={toggleVisibility} 
          handleBlur={toggleVisibility} 
          visibility={visibility} 
          disableBlur={disableBlur}>
          <Protocol handleProtocolChange={handleDisableBlur} visibility={visibility}></Protocol>
        </SearchInput>
        <SearchResults 
          searchString={inputValue} 
          visibility={visibility} 
          labelOnClick={handleDisableBlur}
          itemOnClick={handlePoolSelected}>
        </SearchResults>
      </div>
    </div>
  );
}

export default PoolSearch