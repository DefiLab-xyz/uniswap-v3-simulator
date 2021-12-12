import protocol from "../../store/protocol";
import { minTvl, urlForProtocol } from "./helpers";

export const PoolCurrentPrices = async (signal, protocol, pool) => {
  const url = urlForProtocol(protocol);

  console.log(pool)

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

    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {pool: pool}
      })
    });
    
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

export const top50PoolsByTvl = async (signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query = `
  query { pools (first:50, where: {totalValueLockedUSD_gt: ${minTvl(protocol)}} , orderBy:totalValueLockedETH, orderDirection:desc) 
    {
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
        feesUSD
      }
    }
  }
  
  `
  try {

    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
      })
    });
    
    const data = await response.json();

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

  const query =  `query Pools($id: ID!) {

   id: pools(where: { id: $id } orderBy:totalValueLockedETH, orderDirection:desc ) {
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
        feesUSD
      }
    }
    
  }
`

  try {

    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {id: id},
      })
    });

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

export const poolsByTokenId = async (token, signal, protocol) => {

  const url = urlForProtocol(protocol);

  const query =  `query Pools($token: ID!) {

    pools(where: { token1: $token, totalValueLockedUSD_gt: ${minTvl(protocol)}} orderBy:totalValueLockedETH, orderDirection:desc ) {
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
        feesUSD
      }
    }

    pools(where: { token0: $token, totalValueLockedUSD_gt: ${minTvl(protocol)}}, orderBy:totalValueLockedETH, orderDirection:desc ) {
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
      poolDayData(orderBy: date, orderDirection:desc, first:1)
      {
        date
        volumeUSD
        feesUSD
      }

    }

   id: pools(where: { id: $token } orderBy:totalValueLockedETH, orderDirection:desc ) {
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
        feesUSD
      }
    }
    
  }
`

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

    token1: pools( where: { token1_in: $tokens, totalValueLockedUSD_gt: ${minTvl(protocol)}}, orderBy:totalValueLockedETH, orderDirection:desc ) {
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
      poolDayData(orderBy: date, orderDirection:desc, first:1)
      {
        date
        volumeUSD
        feesUSD
      }

    }

    token2: pools( where: { token0_in: $tokens, totalValueLockedUSD_gt: ${minTvl(protocol)}} orderBy:totalValueLockedETH, orderDirection:desc ) {
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
        feesUSD
      }
    }
    
  }
`

  try {

    const response = await fetch(url, {
      method:'POST',
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {tokens: tokens},
      })
    });

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