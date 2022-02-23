import { minTvl, urlForProtocol, requestBody } from "./helpers";

export const PoolCurrentPrices = async (signal, protocol, pool) => {
  const url = urlForProtocol(protocol);

  const query = `
  query Pools($pool: ID!) { pools (first:1, where: {id: $pool}) 
    {
      token0Price
      token1Price  
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
  `
  try {
    const response = await fetch(url, requestBody({query: query, variables: {pool: pool}, signal: signal}));
    const data = await response.json();

    if (data && data.data && data.data.pools) {
      return data.data.pools[0];
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}

const poolQueryFields = `{
  id
  feeTier
  totalValueLockedUSD
  totalValueLockedETH
  token0Price
  token1Price  
  token0 {
    id
    symbol
    name
    decimals
  }
  token1 {
    id
    symbol
    name
    decimals
  }
  poolDayData(orderBy: date, orderDirection:desc,first:1)
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

export const top50PoolsByTvl = async (signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query = `
  query { pools (first:50, where: {totalValueLockedUSD_gt: ${minTvl(protocol)}} , orderBy:totalValueLockedETH, orderDirection:desc) 
      ${poolQueryFields}
  }`
  
  try {

    const response = await fetch(url, requestBody({query: query, signal: signal}));
    const data = await response.json();
    // console.log(data)
    if (data && data.data && data.data.pools) {
      return data.data.pools;
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }
 }

 export const poolById = async (id, signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query =  `query Pools($id: ID!) { id: pools(where: { id: $id } orderBy:totalValueLockedETH, orderDirection:desc) 
   ${poolQueryFields}
  }`

  try {

    const response = await fetch(url, requestBody({query: query, variables: {id: id}, signal: signal}));
    const data = await response.json();

    if (data && data.data) {
      const pools = data.data;
 
      if (pools.id && pools.id.length && pools.id.length === 1) {
        return pools.id[0]
      }
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}

export const poolByIds = async (ids, signal, protocol) => {

  const url = urlForProtocol(protocol);
  const query =  `query Pools($ids: [Bytes]!) { id: pools(where: { id_in: $ids } orderBy:totalValueLockedETH, orderDirection:desc) 
   ${poolQueryFields}
  }`

  try {

    const response = await fetch(url, requestBody({query: query, variables: {ids: ids}, signal: signal}));
    const data = await response.json();

    if (data && data.data && data.data.id) {
        return data.data.id
  
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}

export const poolsByTokenId = async (token, signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query =  `query Pools($token: ID!) {
    pools(where: { token1: $token, totalValueLockedUSD_gt: ${minTvl(protocol)}} orderBy:totalValueLockedETH, orderDirection:desc ) 
    ${poolQueryFields}
    pools(where: { token0: $token, totalValueLockedUSD_gt: ${minTvl(protocol)}}, orderBy:totalValueLockedETH, orderDirection:desc ) 
    ${poolQueryFields}
    id: pools(where: { id: $token } orderBy:totalValueLockedETH, orderDirection:desc ) ${poolQueryFields}
  }`

  try {

    const response = await fetch(url, requestBody({query: query, variables: {token: token}, signal: signal}));
    const data = await response.json();

    if (data && data.data) {
      const pools = data.data;
 
      if (pools.id && pools.id.length && pools.id.length === 1) {
        return pools.id;
      }
      else if (pools.pools) {
        return pools.pools;
      }
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}

export const poolsByTokenIds = async (tokens, signal, protocol) => {

  const url = urlForProtocol(protocol);
  const query =  `query Pools($tokens: [Bytes]!) {
    token1: pools( where: { token1_in: $tokens, totalValueLockedUSD_gt: ${minTvl(protocol)}}, orderBy:totalValueLockedETH, orderDirection:desc ) 
    ${poolQueryFields}
    token2: pools( where: { token0_in: $tokens, totalValueLockedUSD_gt: ${minTvl(protocol)}} orderBy:totalValueLockedETH, orderDirection:desc ) 
    ${poolQueryFields}
  }`

  try {

    const response = await fetch(url, requestBody({query: query, variables: {tokens: tokens}, signal: signal}));
    const data = await response.json();

    if (data && data.data && (data.data.token1 || data.data.token2)) {

      if (data.data.token1 && data.data.token2) {

        const d = data.data.token1.concat(data.data.token2).sort( (a, b) => {          
          return parseFloat(a.totalValueLockedETH) > parseFloat(b.totalValueLockedETH) ? -1 : 1;
        });

        const removeDupes = d.filter((el, i) => {
          return d.findIndex(f => f.id === el.id) === i
        });

        return removeDupes;
      }
      else if (data.data.token1) {
        return data.data.token1;
      }
      else if (data.data.token2) {
        return data.data.token2;
      }
      
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}