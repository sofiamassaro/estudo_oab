import { Pool } from "pg";

// Reaproveita o pool entre hot-reloads em desenvolvimento.
const globalForPg = globalThis;

const host = process.env.DB_HOST || "localhost";
const local = host === "localhost" || host === "127.0.0.1";

// DATABASE_URL (Neon, Supabase, Vercel Postgres) tem prioridade sobre as
// variaveis separadas usadas no desenvolvimento local.
const pool =
  globalForPg._pgPool ||
  new Pool(
    process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host,
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          // Banco local nao usa SSL; provedores na nuvem exigem.
          ssl: local ? false : { rejectUnauthorized: false },
        }
  );

if (process.env.NODE_ENV !== "production") globalForPg._pgPool = pool;

export default pool;