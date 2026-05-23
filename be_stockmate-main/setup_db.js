import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function setup() {
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres123';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  // 1. Connect to default 'postgres' database to create 'stockmate'
  const initClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres', // default system database
  });

  try {
    await initClient.connect();
    console.log('Successfully connected to local PostgreSQL server.');

    // Check if database already exists
    const checkDb = await initClient.query("SELECT 1 FROM pg_database WHERE datname='stockmate'");
    if (checkDb.rowCount === 0) {
      console.log("Creating database 'stockmate'...");
      // CREATE DATABASE cannot run inside a transaction block, so we execute it directly
      await initClient.query("CREATE DATABASE stockmate");
      console.log("Database 'stockmate' created successfully!");
    } else {
      console.log("Database 'stockmate' already exists. Proceeding to schema setup...");
    }
  } catch (err) {
    console.error('Failed to create database:', err.message);
    console.log('\nMake sure PostgreSQL is installed and currently running on port 5432.');
    process.exit(1);
  } finally {
    await initClient.end();
  }

  // 2. Connect to the newly created 'stockmate' database to run schema.sql
  const mainClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'stockmate',
  });

  try {
    await mainClient.connect();
    console.log("Connected to 'stockmate' database.");

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running SQL Schema to create tables and seed mock data...');
    await mainClient.query(schemaSql);
    console.log('Setup Complete! All tables and seed data created successfully.');
  } catch (err) {
    console.error('Failed to configure database schema:', err.message);
    process.exit(1);
  } finally {
    await mainClient.end();
  }
}

setup();
