export const perpStats = async (signal) => {

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