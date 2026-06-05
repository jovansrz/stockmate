import pool from './src/config/db.js';

async function run() {
  try {
    await pool.query(`ALTER TABLE userdata ADD COLUMN last_username_change TIMESTAMP DEFAULT NULL`);
    console.log('Column last_username_change added successfully.');
  } catch (err) {
    console.error('Error adding column:', err.message);
  } finally {
    process.exit(0);
  }
}
run();
