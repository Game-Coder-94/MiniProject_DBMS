const pool = require('../config/db');
const fs = require('fs');
async function check() {
  try {
    const tableRes = await pool.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    const colRes = await pool.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public'");

    const output = {
      tables: tableRes.rows,
      columns: colRes.rows
    };
    fs.writeFileSync('schema.json', JSON.stringify(output, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
