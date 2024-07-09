const battleService = require('../services/battleService');

exports.createBattle = async (req, res) => {
  try {
    const { player1, player2, player1Weapon, player2Weapon } = req.body;
    const battle = await battleService.createBattle(player1, player2, player1Weapon, player2Weapon);
    res.status(201).json(battle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create battle' });
  }
};

exports.getBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    const battle = await battleService.getBattle(battleId);
    if (!battle) {
      return res.status(404).json({ error: 'Battle not found' });
    }
    res.status(200).json(battle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get battle' });
  }
};

exports.makeMove = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { player, move } = req.body;
    const updatedBattle = await battleService.makeMove(battleId, player, move);
    res.status(200).json(updatedBattle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to make move' });
  }
};