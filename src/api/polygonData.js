export const checkpointData = async (txHash) => {
  try {    

   const response = await fetch("https://polygon-gs-p437phonma-uc.a.run.app/last_block");
   const data = await response.json();

   if(data) {
     return (data);
   }

  } catch (error) {
    console.error(error);
    return null;
  }
 }

export const getEthGas = async () => {
  try {
    
    const response = await fetch('https://ethgasstation.info/api/ethgasAPI.json');
    const data = await response.json();

    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
 }


export const getMaticGas = async () => {
  try {
    const response = await fetch('https://gasstation-mainnet.matic.network');
    const data = await response.json();
    if (data) {
      return data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
 }

export const getMarketDataSpot = async (signal) => {

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=matic-network,ethereum', { signal: signal });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getMaticMarketData = async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=90");
    const data = await response.json();
    if (data) {
  
      return data;
    }
  } catch (error) {

    return null;
  }
 }

 export const getMaticMarketDataEth = async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=eth&days=90");
    const data = await response.json();
    if (data) {
  
      return data;
    }
  } catch (error) {

    return null;
  }
 }

 export const getTokensLockedData = async (signal) => {

  try {
    const response = await fetch("https://api.llama.fi/charts/polygon", { signal: signal });
    const data = await response.json();
    if (data) {

      return data;
    }
  } catch (error) {
   
    return null;
  }
 }

 export const getGraphETHData = async () => {

  const query = 

  `
    query {
      pools(where:{id_in:["0x290a6a7460b308ee3f19023d2d00de604bcf5b42","0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"]})
      {
        id
        token0Price
        
      }    
    }
    `

  try {
    const response = await fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query,
        variables: {address: ["0x290a6a7460b308ee3f19023d2d00de604bcf5b42", "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"]},
      })
    });

    const data = await response.json();

    if (data && data.data && data.data.pools) {

      return { maticEth: data.data.pools[0].token0Price, ethUSD: data.data.pools[1].token0Price, maticUSD:data.data.pools[1].token0Price / data.data.pools[0].token0Price};
    }

  } catch (error) {
    console.log(error);
    return {maticEth: 0, ethUSD: 0, maticUSD: 0};
  }
 }

 export const getGraphHistoricalPrices = async (signal) => {

  const query = 

  `
    query {
      pairDayDatas(first:90, orderBy:date,orderDirection:desc,where:{pairAddress:"0x819f3450da6f110ba6ea52195b3beafa246062de"})
        {
          reserve0
          reserve1
          reserveUSD
          date
        }
      }      
      
    `

  try {
    const response = await fetch("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: query
      }),
      signal: signal 
    });

    const data = await response.json();

    if (data && data.data && data.data.pairDayDatas) {

      return data.data.pairDayDatas.map(d => {
        return {date: d.date, maticEth: d.reserve1 / d.reserve0, maticUSD: d.reserveUSD / 2 / d.reserve0}
      })
      
    }

  } catch (error) {
    console.log(error);
    return {maticEth: 0, ethUSD: 0, maticUSD: 0};
  }
 }