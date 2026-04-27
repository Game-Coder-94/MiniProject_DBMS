const pool = require('../config/db');

(async () => {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pins'");
    console.log("Pins Columns:");
    console.log(res.rows);

    // Also check the board_contains_pins
    const r2 = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'board_contains_pins'");
    console.log("Board Pins Columns:");
    console.log(r2.rows);

    pool.end();
})();
