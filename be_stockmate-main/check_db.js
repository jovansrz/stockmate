import pool from './src/config/db.js';

async function run() {
  try {
    const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'userdata'`);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
