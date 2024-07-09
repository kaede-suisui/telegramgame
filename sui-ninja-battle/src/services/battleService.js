const provider = require('../config/sui');
const Battle = require('../models/battle');

class BattleService {
  constructor() {
    this.battles = new Map();
  }

  async createBattle(player1, player2, player1Weapon, player2Weapon) {
    try {
      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      const result = await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'battle',
        function: 'create_battle',
        typeArguments: [],
        arguments: [player1, player2, player1Weapon, player2Weapon],
        gasBudget: 10000,
      });

      const battleId = result.created[0].objectId;
      const battle = new Battle(battleId, player1, player2, player1Weapon, player2Weapon);
      this.battles.set(battleId, battle);
      return battle;
    } catch (error) {
      console.error('Error creating battle:', error);
      throw error;
    }
  }

  async getBattle(battleId) {
    return this.battles.get(battleId);
  }

  async makeMove(battleId, player, move) {
    try {
      const battle = this.battles.get(battleId);
      if (!battle) throw new Error('Battle not found');

      // この部分は実際のSUI SDKの呼び出しに置き換える必要があります
      const result = await provider.executeMoveCall({
        packageObjectId: 'YOUR_PACKAGE_ID',
        module: 'battle',
        function: 'make_move',
        typeArguments: [],
        arguments: [battleId, player, move],
        gasBudget: 10000,
      });

      // 結果を解析してバトルの状態を更新
      const roundResult = result.events[0];
      battle.addRound(roundResult.player1Move, roundResult.player2Move, roundResult.roundWinner);

      if (roundResult.battleEnded) {
        battle.setWinner(roundResult.battleWinner);
      }

      return battle;
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }
}

module.exports = new BattleService();