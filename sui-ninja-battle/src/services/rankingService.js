const provider = require('../config/sui');
const PlayerRanking = require('../models/ranking');

class RankingService {
  constructor() {
    this.rankings = new Map();
  }

  async updateRanking(playerId, battleResult) {
    try {
      let playerRanking = this.rankings.get(playerId);
      if (!playerRanking) {
        playerRanking = new PlayerRanking(playerId, 0, 0, 0);
      }

      if (battleResult === 'win') {
        playerRanking.wins++;
        playerRanking.score += 10;
      } else if (battleResult === 'loss') {
        playerRanking.losses++;
        playerRanking.score = Math.max(0, playerRanking.score - 5);
      }

      this.rankings.set(playerId, playerRanking);

      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'ranking',
        function: 'update_ranking',
        typeArguments: [],
        arguments: [playerId, playerRanking.score, playerRanking.wins, playerRanking.losses],
        gasBudget: 10000,
      });

      return playerRanking;
    } catch (error) {
      console.error('Error updating ranking:', error);
      throw error;
    }
  }

  async getTopPlayers(limit = 10) {
    try {
      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      const result = await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'ranking',
        function: 'get_top_players',
        typeArguments: [],
        arguments: [limit],
        gasBudget: 10000,
      });

      return result.topPlayers.map(player => 
        new PlayerRanking(player.playerId, player.score, player.wins, player.losses)
      );
    } catch (error) {
      console.error('Error getting top players:', error);
      throw error;
    }
  }

  async getPlayerRanking(playerId) {
    return this.rankings.get(playerId) || null;
  }
}

module.exports = new RankingService();