import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { DDL } from "./ddl";

/**
 * Lazy database access.
 * Nothing connects at import time, so `next build` never fails when
 * DATABASE_URL is missing (e.g. on Netlify before you add the variable).
 */
type Db = NodePgDatabase<typeof schema>;

const g = globalThis as typeof globalThis & {
  __velytoPool?: Pool;
  __velytoDb?: Db;
  __velytoReady?: Promise<void>;
};

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!g.__velytoPool) {
    g.__velytoPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 8_000,
    });
    g.__velytoPool.on("error", () => {});
  }
  return g.__velytoPool;
}

/** Returns a Drizzle client, creating tables on first use (idempotent). */
export async function getDb(): Promise<Db> {
  const pool = getPool();
  if (!g.__velytoDb) g.__velytoDb = drizzle(pool, { schema });
  if (!g.__velytoReady) {
    g.__velytoReady = pool
      .query(DDL)
      .then(() => undefined)
      .catch((err) => {
        g.__velytoReady = undefined;
        throw err;
      });
  }
  await g.__velytoReady;
  return g.__velytoDb;
}

export { schema };
