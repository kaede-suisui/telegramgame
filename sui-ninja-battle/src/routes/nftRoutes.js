const express = require('express');
const nftController = require('../controllers/nftController');

const router = express.Router();

router.post('/', nftController.createNFT);
router.get('/:owner', nftController.getNFTs);

module.exports = router;