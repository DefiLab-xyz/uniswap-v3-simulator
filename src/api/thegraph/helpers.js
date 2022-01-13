export const urlForProtocol = (protocol) => {
  return protocol === 1 ? "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-optimism-dev" : 
    protocol === 2 ? "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal" :
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


