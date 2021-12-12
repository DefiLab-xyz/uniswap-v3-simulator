export const urlForProtocol = (protocol) => {
  return protocol === 1 ? "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-optimism-dev" : 
    protocol === 2 ? "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal" :
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
}

export const minTvl = (protocol) => {
  return protocol === 0 ? 10000 : 1;
}


