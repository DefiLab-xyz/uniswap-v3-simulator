import { urlForProtocol } from "./helpers";

export const getPoolDayData = async (token, signal, protocol) => {

  const query = `query PoolDayDatas($token: ID!){ 
  poolDayDatas (first:90, orderBy:date, orderDirection:desc, where:{pool:$token}) 
  {
    date
    volumeUSD
    tvlUSD
    feesUSD
    liquidity
    high
    low
    volumeToken0
    volumeToken1
    close
    open


 }
   }`

  const url = urlForProtocol(protocol);

  try {
    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {token: token},
      })
    });

    const data = await response.json();
    if (data && data.data && data.data.poolDayDatas) {
      return data.data.poolDayDatas;
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}
