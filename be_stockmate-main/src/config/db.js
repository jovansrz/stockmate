import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'stockmate',
});

pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database (stockmate).');
    client.release();
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err.message);
  });

export default pool;
