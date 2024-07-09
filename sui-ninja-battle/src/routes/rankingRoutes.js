const express = require('express');
const rankingController = require('../controllers/rankingController');

const router = express.Router();

router.post('/update', rankingController.updateRanking);
router.get('/top', rankingController.getTopPlayers);
router.get('/player/:playerId', rankingController.getPlayerRanking);

module.exports = router;