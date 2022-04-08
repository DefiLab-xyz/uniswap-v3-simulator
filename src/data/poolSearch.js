const poolSearchData = () => {
  return {
    labels: [{name: "Pool", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-symbol'}, 
      {name: "Fee Tier", sortable: false, sortClass: 'sort-icon-disabled', labelClass: 'search-label-fee-tier'}, 
      {name: "TVL", sortable: true, sortClass: 'sort-icon-show', labelClass: 'search-label-tvl', field: "totalValueLockedUSD"},
      {name: "Volume 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-volume-usd', field: "volumeUSD"},
      {name: "Fees 24h", sortable: true, sortClass: 'sort-icon-hide', labelClass: 'search-label-fee-usd', field: "feesUSD"}]
    }
}

export default poolSearchData