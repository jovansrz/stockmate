import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function reset() {
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres123';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  const client = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'stockmate',
  });

  try {
    await client.connect();
    console.log("Connected to 'stockmate' database.");
    
    console.log('Truncating userdata table...');
    await client.query('TRUNCATE userdata RESTART IDENTITY CASCADE;');
    
    // Re-insert seeded test user
    await client.query("INSERT INTO userdata (name, username, password, totalXp, saldo_virtual) VALUES ('Test User', 'testuser', 'password123', 0, 10000000);");
    console.log('Reseeded default test user.');
    console.log('Database reset complete!');
  } catch (err) {
    console.error('Error resetting database:', err.message);
  } finally {
    await client.end();
  }
}

reset();
