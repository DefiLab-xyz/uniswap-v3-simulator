export const perpStats = async (signal) => {
  // const url = 'https://4b3vdz2hdjho7gzuo4wl2jgsoe.appsync-api.ap-southeast-1.amazonaws.com/graphql';

  const url = 'https://yvolsu5cy5gbhmwz7mxdykf744.appsync-api.ap-southeast-1.amazonaws.com/graphql'

  // "query GetStatistics($ammAddress: String!) {\n  getStatistics(ammAddr: $ammAddress) {\n    volume24h\n    priceChangeRate24h\n    priceHigh24h\n    priceLow24h\n    __typename\n  }\n}\n"

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
          'X-Api-Key': 'da2-afbouqqkr5at5dqa6kjjm6v3ae', 
        },
        body: body
    });

    const data = await response.json();

    console.log(data);

  } catch (error) {
    console.log(error)
    return {error: error};
  }

}