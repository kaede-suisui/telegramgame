const express = require('express');
const battleController = require('../controllers/battleController');

const router = express.Router();

router.post('/', battleController.createBattle);
router.get('/:battleId', battleController.getBattle);
router.post('/:battleId/move', battleController.makeMove);

module.exports = router;