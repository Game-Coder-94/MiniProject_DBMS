const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getUserBoards, createBoard, savePinToBoard, getBoardPins, saveExploreToBoard } = require('../controllers/boardController');

// All board endpoints mandate authentication
router.use(verifyToken);

router.get('/', getUserBoards);
router.post('/', createBoard);
router.post('/save', savePinToBoard);
router.post('/save-explore', saveExploreToBoard);
router.get('/:boardId/pins', getBoardPins);

module.exports = router;
