import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const schemaPath = path.join(__dirname, 'config', 'schema.sql');

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('Running migration...');

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    await client.query(schemaSql);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Error running migration:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();