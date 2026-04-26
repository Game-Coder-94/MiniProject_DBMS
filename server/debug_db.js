const pool = require('./config/db');

async function debug() {
  try {
    const res = await pool.query(`SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'users'`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
debug();
