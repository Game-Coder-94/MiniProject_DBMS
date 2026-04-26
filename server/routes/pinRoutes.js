// routes/pinRoutes.js
const express = require('express');
const router = express.Router();
const { getFeed, createPin, seedNasaData } = require('../controllers/pinController');
const { getNasaImages } = require('../controllers/nasaController');

router.get('/feed', getFeed);
router.get('/explore', getNasaImages)
router.post('/nasa-ingest', createPin);
router.post('/seed', seedNasaData);

module.exports = router;