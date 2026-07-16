import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

// when connected
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// error handling
pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(-1);
});

// helper query function
export default {
  query: (text, params) => pool.query(text, params),
  pool
};