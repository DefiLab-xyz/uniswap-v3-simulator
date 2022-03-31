import { urlForProtocol, requestBody } from "./helpers";

export const getPoolHourData = async (pool, fromdate, signal, protocol) => {

  const query =  `query PoolHourDatas($pool: ID!, $fromdate: Int!) {
  poolHourDatas ( where:{ pool:$pool, periodStartUnix_gt:$fromdate close_gt: 0}, orderBy:periodStartUnix, orderDirection:desc, first:1000) {
    periodStartUnix
    liquidity
    high
    low
    pool {
      id
      totalValueLockedUSD
      totalValueLockedToken1
      totalValueLockedToken0
      token0
        {decimals}
      token1
        {decimals}
    }
    close
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    }
  }
  `

  const url = urlForProtocol(protocol);

  try {
    const response = await fetch(url, requestBody({query: query, variables: {pool: pool, fromdate: fromdate}, signal: signal}));
    const data = await response.json();

    if (data && data.data && data.data.poolHourDatas) {
     
      return data.data.poolHourDatas;
    }
    else {
      console.log("nothing returned from getPoolHourData")
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}