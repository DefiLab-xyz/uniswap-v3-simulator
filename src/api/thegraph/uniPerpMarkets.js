import { urlForProtocol, requestBody } from "./helpers";


export const perpMarkets = async (signal) => {
  const url = urlForProtocol(4);

  const query = `
  query {
       markets {
         pool
         id
       }
     }
  `
  try {
    const response = await fetch(url, requestBody({query: query, signal: signal}));
    const data = await response.json();

    if (data && data.data && data.data.markets ) {
      return data.data.markets;
    }
    else {
      return null;
    }

  } catch (error) {
    return {error: error};
  }

}
