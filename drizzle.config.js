import { drizzle } from 'drizzle-orm/node-postgres'; // Keep this if you are using node-postgres directly
import { sql } from 'drizzle-orm';
import pkg from 'pg';
const { Pool } = pkg;

import * as schema from './shared/schema.js'; // adjust if needed
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

console.log('Database connection established');

// Test the database connection with a simple query
(async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('Database connection test query successful.');
  } catch (error) {
    console.error('Database connection test query failed:', error);
  }
})();

export { db, pool };
