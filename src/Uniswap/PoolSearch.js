import optimism from '../Icons/optimism-logo.svg'
import ethereum from '../Icons/eth-logo.svg'
import arbitrum from '../Icons/arbitrum-logo.png'
import { useState, useRef, useEffect } from 'react'

const getTop50Pools = (protocol) => {
  return "Hi There"
}

const searchIsValid = (val) => {
  const search = val.trim();
  return search && typeof(search) === 'string' && search.length > 0
}

const SearchResults = (props) => {

  const [searchResults, setSearchResults] = useState();

  // Contains a list of the top 50 pools by TVL for the selected protocol. 
  // Used for SearchResults on initial load and when input is blank.
  const [top50Pools, setTop50Pools] = useState();

  // get list of top50 pools on initial load
  useEffect(() => {
    const abortController = new AbortController();
    setTop50Pools(getTop50Pools(abortController));
    return () => { abortController.abort() };
  }, []);

  return (<div>

  </div>)

}

const SearchLabels = (props) => {

}

const Protocol = (props) => {

}

const SearchInput = (props) => {

  const inputRef = useRef();
  const searchIcon = `${String.fromCharCode(8981)}`;
  const [inputValue, setInputValue] = useState("USDC / WETH");

  const handleInput = (e) => {  setInputValue(e.target.value) };

  const handleFocus = (e) => {
    if (props.onFocus) { props.onFocus(e); }
  }

  const handleBlur = (e) => {
    if (props.onBlur) { props.onBlur(e); }
    if (props.selected) { setInputValue(props.selected);}
  }

  const handleKeyUp = (e) => {
    if (props.handleKeyUp) { props.handleKeyUp(e); }
  }
  
  return(
    <div>
      <input 
        className="pool-search-input"
        ref={inputRef}
        value={inputValue} 
        onChange={handleInput} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
      >     
      </input>       
      <span class="pool-search-icon">{searchIcon}</span>
    </div>
  )

}

const SearchMessage = (props) => {
  return (
    <div className="pool-search-message" 
    style={{display: props.visibility, ...props.style}}>
      Search by token, contract address, or pool address
    </div>
  )
}

// Search for Uniswap V3 Pools by ID or token symbol. 
// Events: 
// - Selected Pool: updates SelectedPool object - passed to props.handlePoolSelected
// - Toggle Protocol : updates protocol object - passed to props.handleProtocolChange

const PoolSearch = (props) => {

  const styles = style().PoolSearch;

  const [searchString, setSearchString] = useState(null);
  const handleSearchString = (str) => {
    setSearchString(str);
  }

  // If visibility = none, search input and label are visible. If null, also search results panel is visibile. 
  // (none and null are applied to element's css visibility attribute)
  const [visibility, setVisibility] = useState('none');
  const toggleVisibility = (e) => {
    setVisibility(e.type === 'focus' ? null : 'none');
  }

  // 0 = Ethereum | 1 = optimism | 2 = arbitrum
  const [protocol, setProtocol] = useState(0);
  const handleProtocolChange = (prot) => {
    if (props.handleProtocolChange) { props.handleProtocolChange(prot)}
    setProtocol(prot)
  }
 
  return (
    <div className={props.className || "pool-search-container"} style={{...styles.container, ...props.style.container}}>
      <div className="pool-search-label" style={{...styles.label, ...props.style.label}}>
          {props.label || 'Pool'}
      </div> 
      <div className= {visibility === 'none' ? "search-container-hidden" : "search-container-visible"} 
           style={visibility === 'none' ? styles.searchContainer.hidden : styles.searchContainer.visible}>
        <SearchMessage visibility={visibility} style={styles.message}></SearchMessage>
        <SearchInput onFocus={toggleVisibility} onBlur={toggleVisibility}></SearchInput>
        <SearchResults searchString={searchString}></SearchResults>
      </div>
    </div>
  )
}

const style = () => {
  return {
    PoolSearch: {
      container: {
        zIndex: 99999, 
        position:"inherit"
      },
      label: {

      },
      searchContainer: {
        visible: {

        },
        hidden: {

        }
      },
      message: {
        fontSize:"10px", 
        fontStyle: "italic", 
        marginLeft: "25px", 
        marginTop:"15px"
      }
    }
  }
}

export default PoolSearch