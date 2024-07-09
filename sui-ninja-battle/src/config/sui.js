const { JsonRpcProvider, devnetConnection, testnetConnection, mainnetConnection } = require('@mysten/sui.js');

const getConnection = (network) => {
  switch (network) {
    case 'devnet':
      return devnetConnection;
    case 'testnet':
      return testnetConnection;
    case 'mainnet':
      return mainnetConnection;
    default:
      throw new Error('Invalid network specified');
  }
};

const provider = new JsonRpcProvider(getConnection(process.env.SUI_NETWORK));

module.exports = provider;