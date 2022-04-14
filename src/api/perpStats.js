import { setDefaultInvestment } from "../store/investment";

export const perpMarketStats = async (signal) => {

  const url = 'https://yvolsu5cy5gbhmwz7mxdykf744.appsync-api.ap-southeast-1.amazonaws.com/graphql'
  var body = JSON.stringify({
   "operationName": "ListMarketAprs",
   "variables": {limit: 100, nextToken: ""},
   "query": "query ListMarketAprs($limit: Int!, $nextToken: String!) {\n  listMarketAprs(limit: $limit, nextToken: $nextToken) {\n    nextToken\n    items {\n      baseSymbol\n      quoteSymbol\n      marketSymbol\n      lowerBaseApr\n      upperBaseApr\n      lowerRewardApr\n      upperRewardApr\n      __typename\n    }\n    __typename\n  }\n}\n"
  });

  try {
    const response = await fetch(url, 
    {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.REACT_APP_PERP_STATS, 
        },
        body: body
    });

    const data = await response.json();
    if (data && data.data && data.data.listMarketAprs && data.data.listMarketAprs.items) {
      return data.data.listMarketAprs.items;
    }
    else {
      return null;
    }
    

  } catch (error) {
    console.log(error)
    return {error: error};
  }

}

export const perpStats = async (ammAddr) => {

  const url = 'https://4b3vdz2hdjho7gzuo4wl2jgsoe.appsync-api.ap-southeast-1.amazonaws.com/graphql'

  var body = JSON.stringify({
   "operationName": "GetStatistics",
   "variables": { ammAddress: ammAddr },
   "query": "query GetStatistics($ammAddress: String!) {\n  getStatistics(ammAddr: $ammAddress) {\n    volume24h\n    priceChangeRate24h\n    priceHigh24h\n    priceLow24h\n    __typename\n  }\n}\n"
  });

  try {
    const response = await fetch(url, 
    {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.REACT_APP_PERP_STATSTOKEN, 
        },
        body: body
    });

    const data = await response.json();
    if (data && data.data && data.data.getStatistics && data.data.getStatistics) {
      return data.data.getStatistics;
    }
    else {
      return null;
    }
    

  } catch (error) {
    console.log(error)
    return {error: error};
  }

}

export const perpAddresses = async () => {

  const url = "https://metadata.perp.exchange/v2/optimism.json";

  try {
    const response = await fetch(url, 
    {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if (data && data.contracts ) {
      const addresses = Object.values(data.contracts).map( aD => {
        return { address: aD.address, address_lower: aD.address.toLowerCase()}
      })
      return addresses;
    }
    else {
      return null;
    }
    

  } catch (error) {
    console.log(error)
    return {error: error};
  }


}