const rankingService = require('../services/rankingService');

exports.updateRanking = async (req, res) => {
  try {
    const { playerId, battleResult } = req.body;
    const updatedRanking = await rankingService.updateRanking(playerId, battleResult);
    res.status(200).json(updatedRanking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ranking' });
  }
};

exports.getTopPlayers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topPlayers = await rankingService.getTopPlayers(limit);
    res.status(200).json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top players' });
  }
};

exports.getPlayerRanking = async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerRanking = await rankingService.getPlayerRanking(playerId);
    if (!playerRanking) {
      return res.status(404).json({ error: 'Player ranking not found' });
    }
    res.status(200).json(playerRanking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get player ranking' });
  }
};