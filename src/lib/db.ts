import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the DATABASE_URL environment variable
// Works with any Postgres-compatible database (Railway, Neon, Supabase, etc.)
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return neon(databaseUrl);
}

// Type-safe query helper
export async function query<T = Record<string, unknown>>(
  sql: TemplateStringsArray,
  ...params: unknown[]
): Promise<T[]> {
  const db = getDb();
  return db(sql, ...params) as Promise<T[]>;
}

// Check if database is configured
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
