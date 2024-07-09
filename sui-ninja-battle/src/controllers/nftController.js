const nftService = require('../services/nftService');

exports.createNFT = async (req, res) => {
  try {
    const { owner, type, rarity } = req.body;
    const nft = await nftService.createNFT(owner, type, rarity);
    res.status(201).json(nft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NFT' });
  }
};

exports.getNFTs = async (req, res) => {
  try {
    const { owner } = req.params;
    const nfts = await nftService.getNFTs(owner);
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get NFTs' });
  }
};