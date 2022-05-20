import { urlForProtocol, requestBody } from "./helpers";

export const liquidityByPoolId = async (pool, signal, protocol) => {

  const query =  `query Ticks($pool: ID!) {
      ticks (first: 1000, where:{ pool:$pool }, orderBy: tickIdx) {
          liquidityGross
          liquidityNet
          price0
          price1
          tickIdx
          pool {
            tick
            token0Price
            token1Price
            token0 {
              decimals
              symbol
            }
            token1 {
              decimals
              symbol
            }
          }
      }
  }`
  
    const url = urlForProtocol(protocol);
  
    try {
      const response = await fetch(url, requestBody({query: query, variables: {pool: pool}, signal: signal}));
      const data = await response.json();
  
      if (data && data.data && data.data.ticks) {
        return data.data.ticks;
      }
      else {
        return null;
      }
  
    } catch (error) {
      return {error: error};
    }
  
  }