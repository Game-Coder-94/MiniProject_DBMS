const pool = require('../config/db');

const getUserBoards = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const result = await pool.query('SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching boards:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createBoard = async (req, res) => {
    const userId = req.user.user_id;
    const { title, description, is_private } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Board title is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO boards (user_id, title, description, is_private, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [userId, title, description || '', is_private || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating board:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const savePinToBoard = async (req, res) => {
    const { board_id, pin_id } = req.body;
    if (!board_id || !pin_id) {
        return res.status(400).json({ error: 'Board ID and Pin ID are required' });
    }

    // Verify the user actually owns this board before granting inserts
    try {
        const boardCheck = await pool.query('SELECT user_id FROM boards WHERE board_id = $1', [board_id]);
        if (boardCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Board not found' });
        }
        if (boardCheck.rows[0].user_id !== req.user.user_id) {
            return res.status(403).json({ error: 'Unauthorized to save to this board' });
        }

        // Check if map already exists or add new mapping
        await pool.query(
            'INSERT INTO board_contains_pins (board_id, pin_id, added_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
            [board_id, pin_id]
        );
        res.status(200).json({ message: 'Pin successfully anchored to board!' });
    } catch (err) {
        console.error('Error saving pin to board:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBoardPins = async (req, res) => {
    const { boardId } = req.params;
    try {
        // Enforce ownership Check (optional but good idea if boards are private)
        const boardCheck = await pool.query('SELECT user_id, is_private FROM boards WHERE board_id = $1', [boardId]);
        if (boardCheck.rows.length > 0) {
            if (boardCheck.rows[0].is_private && boardCheck.rows[0].user_id !== req.user.user_id) {
               return res.status(403).json({ error: 'Unauthorized access to a private board.'});
            }
        } else {
            return res.status(404).json({ error: 'Board not found' });
        }

        const result = await pool.query(
            `SELECT p.*, bcp.added_at 
             FROM pins p 
             JOIN board_contains_pins bcp ON p.pin_id = bcp.pin_id 
             WHERE bcp.board_id = $1 
             ORDER BY bcp.added_at DESC`,
            [boardId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching board pins:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveExploreToBoard = async (req, res) => {
    const { board_id, image_url, title, description } = req.body;
    const userId = req.user.user_id;

    if (!board_id || !image_url || !title) {
        return res.status(400).json({ error: 'Board ID, Image URL, and Title are required' });
    }

    try {
        // 1. Verify board ownership
        const boardCheck = await pool.query('SELECT user_id FROM boards WHERE board_id = $1', [board_id]);
        if (boardCheck.rows.length === 0) return res.status(404).json({ error: 'Board not found' });
        if (boardCheck.rows[0].user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

        // 2. Call the NASA import procedure
        await pool.query(
            'CALL add_nasa_pin($1, $2, $3, $4, $5, $6, $7, $8)',
            [userId, null, image_url, description || '', title, 'NASA', null, null]
        );

        // 3. Retrieve the generated pin_id
        const pinCheck = await pool.query(
            'SELECT pin_id FROM pins WHERE user_id = $1 AND image_url = $2 ORDER BY created_at DESC LIMIT 1',
            [userId, image_url]
        );
        
        if (pinCheck.rows.length === 0) {
            return res.status(500).json({ error: 'Pin generation failed' });
        }
        
        const pin_id = pinCheck.rows[0].pin_id;

        // 4. Anchor to the board
        await pool.query(
            'INSERT INTO board_contains_pins (board_id, pin_id, added_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
            [board_id, pin_id]
        );

        res.status(200).json({ message: 'Saved NASA image to board successfully!' });
    } catch (err) {
        console.error('Error saving explore image to board:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getUserBoards, createBoard, savePinToBoard, getBoardPins, saveExploreToBoard };
