const pool = require('./server/config/db');

async function checkTables() {
  try {
    const tableRes = await pool.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`);
    console.log("TABLES:", tableRes.rows);
    
    // Check what is in the user and pin tables
    for (let table of tableRes.rows) {
      const colRes = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table.tablename}';`);
      console.log(`\nTABLE ${table.tablename} COLUMNS:`, colRes.rows);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

checkTables();
