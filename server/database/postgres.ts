import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';

const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

export const DEFAULT_NEON_DATABASE_URL =
  'postgresql://neondb_owner:npg_yJUsc1ZQD9Bn@ep-divine-shadow-ayr9hpxh-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || DEFAULT_NEON_DATABASE_URL;
}

export function getPostgresPool(): pg.Pool {
  if (!poolInstance) {
    const connStr = getDatabaseUrl();
    poolInstance = new Pool({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    poolInstance.on('error', (err) => {
      console.error('[Neon Postgres Pool Unexpected Error]:', err);
    });
  }
  return poolInstance;
}

export async function initializePostgresSchema(pool: pg.Pool): Promise<void> {
  const schemaPath = path.join(process.cwd(), 'neon_schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    console.log('[Neon DB] Initializing PostgreSQL database tables and indexes...');
    await client.query(sql);
    console.log('[Neon DB] PostgreSQL schema successfully synchronized!');
  } finally {
    client.release();
  }
}
