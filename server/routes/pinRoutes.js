// routes/pinRoutes.js
const express = require('express');
const router = express.Router();
const { getFeed, createPin, seedNasaData } = require('../controllers/pinController');

router.get('/feed', getFeed);
router.post('/nasa-ingest', createPin);
router.post('/seed', seedNasaData);

module.exports = router;