const Web3 = require("web3");

export const checkBridgeTx = async (txHash) => {
  try {    
    const provider = new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/abe40e27642942799af9cab9e3baf7ba");
    const web3 = new Web3(provider);

    const chil_provider = new Web3.providers.HttpProvider("https://rpc-mainnet.maticvigil.com/v1/05477419a8830ed78f474377bd5b602fa7dffd32");
    const child_web3 = new Web3(chil_provider);

    const txDetails = await child_web3.eth.getTransaction(txHash);

    if (txDetails) {
      const block = await txDetails.blockNumber;
      const input = await txDetails.input;

      if (txDetails.input.includes('0x2e1a7d4d') ) {

        let results = await web3.eth.getPastLogs({
          fromBlock: (await web3.eth.getBlockNumber()) - 10000,
          toBlock: "latest",
          address: "0x86e4dc95c7fbdbf52e33d563bbdb00823894c287",
        });
    
        for (let result of results) {
          if (result.data) {
    
            let transaction = web3.eth.abi.decodeParameters(
              ["uint256", "uint256", "bytes32"],
              result.data
            );
            if (block <= transaction["1"]) {

              provider.disconnect();
              return 0;
            }
          }
        }
    

        provider.disconnect();
        return 1
      }
      else {
        provider.disconnect();
   
        return 2
      }
    }
    else {
      provider.disconnect();
   
      return 3
    }
      
  

  } catch (error) {
   
  
 
    console.error(error);
    return 3;
  }
 }


export const checkTX = (txHash) => {

  // Ethereum provider
const provider = new Web3.providers.WebsocketProvider(
  "wss://mainnet.infura.io/ws/v3/abe40e27642942799af9cab9e3baf7ba"
);

const web3 = new Web3(provider);

const chil_provider = new Web3.providers.HttpProvider(
  "https://rpc-mainnet.maticvigil.com"
);
const child_web3 = new Web3(chil_provider);

async function checkInclusion(txHash) {
  
  let txDetails = await child_web3.eth.getTransactionReceipt(txHash);
  const block = txDetails.blockNumber;

  return new Promise(async (resolve, reject) => {
    let results = await web3.eth.getPastLogs({
      fromBlock: (await web3.eth.getBlockNumber()) - 10000,
      toBlock: "latest",
      address: "0x2890ba17efe978480615e330ecb65333b880928e",
    });

    for (let result of results) {
      if (result.data) {
        let transaction = web3.eth.abi.decodeParameters(
          ["uint256", "uint256", "bytes32"],
          result.data
        );
        if (block <= transaction["1"]) {
          resolve(result);
        }
      }
    }
    resolve(false);
  
  });
}

  // transaction hash of the transaction on matic
  checkInclusion(txHash)
  .then((res) => {
 
    provider.disconnect();
    return res;
    
  })
  .catch((err) => {
    console.log(err);
    return null
  });
}





