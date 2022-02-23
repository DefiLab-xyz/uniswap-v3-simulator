import { urlForProtocol, requestBody } from "./helpers";

export const getPoolDayData = async (token, signal, protocol, dataParser) => {

  const query = `query PoolDayDatas($token: ID!) { 
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
    txCount


 }
   }`

  const url = urlForProtocol(protocol);

  try {
    const response = await fetch(url, requestBody({query: query, variables: {token: token}, signal: signal}));

    const data = await response.json();
    if (data && data.data && data.data.poolDayDatas) {
      if (dataParser) return dataParser(data.data.poolDayDatas);
      return data.data.poolDayDatas;
    }
    else {
      console.log("nothing returned")
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}
