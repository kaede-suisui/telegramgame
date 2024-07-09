const provider = require('../config/sui');
const NFT = require('../models/nft');

class NFTService {
  async createNFT(owner, type, rarity) {
    try {
      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      const result = await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'nft',
        function: 'create_nft',
        typeArguments: [],
        arguments: [owner, type, rarity],
        gasBudget: 10000,
      });

      // 結果からNFTオブジェクトを作成
      const nftData = result.created[0];
      return new NFT(nftData.objectId, nftData.name, type, rarity, nftData.power);
    } catch (error) {
      console.error('Error creating NFT:', error);
      throw error;
    }
  }

  async getNFTs(owner) {
    try {
      const objects = await provider.getObjectsOwnedByAddress(owner);
      return objects
        .filter(obj => obj.type === 'YOUR_NFT_TYPE')
        .map(obj => new NFT(obj.objectId, obj.name, obj.type, obj.rarity, obj.power));
    } catch (error) {
      console.error('Error getting NFTs:', error);
      throw error;
    }
  }
}

module.exports = new NFTService();