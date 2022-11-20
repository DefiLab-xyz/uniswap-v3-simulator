export const urlForProtocol = (protocol) => {
  return protocol === 1 ? "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis" : 
    protocol === 2 ? "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal" :
    protocol === 3 ? "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon" :
    protocol === 4 ? "https://api.thegraph.com/subgraphs/name/perpetual-protocol/perpetual-v2-optimism" :
    protocol === 5 ? "https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo" :
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
}

export const minTvl = (protocol) => {
  return protocol === 0 ? 10000 : 1;
}

export const requestBody = (request) => {
  
  if(!request.query) return;

  const body = {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: request.query,
        variables: request.variables || {}
      })
  }

  if (request.signal) body.signal = request.signal;
  return body;

}


