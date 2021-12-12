import { urlForProtocol } from "./helpers";

export const tokensBySymbol = async (searchString, signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query = `query Tokens($symbol: String, $uppercase: String) {
    tokens( where: { symbol_contains: $symbol, totalValueLocked_gt: 0 }, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
      symbol
      name
    }

  }`

  try {
    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {symbol: searchString.toUpperCase()},
      })
    });

    const data = await response.json();

    if (data && data.data && data.data.tokens) {
      return data.data.tokens;
    }
    else {
      return null;
    }

  } catch (error) {
  
    return {error: error};
  }

}