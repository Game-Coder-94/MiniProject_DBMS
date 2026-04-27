// controllers/pinController.js
const pool = require('../config/db');
const { seedSpaceData } = require('../services/nasaService');

// Fetch the AstroPin Feed
const getFeed = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM v_main_feed ORDER BY pin_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    console.log("Error : ", err);
    res.status(500).send('Server Error');
  }
};

// Handle Manual Pin Ingestion
const createPin = async (req, res) => {
  const { user_id, mission_id, img_url, desc, obj_name, obj_type, mass, dist } = req.body;

  try {
    await pool.query(
      'CALL add_nasa_pin($1, $2, $3, $4, $5, $6, $7, $8)',
      [user_id, mission_id, img_url, desc, obj_name, obj_type, mass, dist]
    );
    res.status(201).send('NASA Pin Created Successfully');
  } catch (err) {
    console.error(err.message);
    console.log("Error : ", err);
    res.status(400).json({ error: err.message });
  }
};

// Trigger NASA API Seeding
const seedNasaData = async (req, res) => {
  const { query } = req.body;

  try {
    await seedSpaceData(query);
    res.status(200).send(`Successfully seeded database with '${query}' data.`);
  } catch (err) {
    console.error(err.message);
    console.log("Error : ", err);
    res.status(500).send('Failed to seed NASA data');
  }
};

module.exports = { getFeed, createPin, seedNasaData };