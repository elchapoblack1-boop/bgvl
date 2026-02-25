/**
 * Universal Database Layer
 * - Railway: uses SQLite (DB_PATH env var, persistent volume)
 * - Render:  uses PostgreSQL (DATABASE_URL env var, free Render Postgres)
 * Auto-detects which one to use. Zero config needed.
 */

import path from 'path'
import fs from 'fs'

export const IS_POSTGRES = !!process.env.DATABASE_URL

// ─────────────────────────────────────────────
// SQLITE (Railway)
// ─────────────────────────────────────────────
let _sqlite: any = null

function getSQLite() {
  if (_sqlite) return _sqlite
  const Database = require('better-sqlite3')
  const dbPath = process.env.DB_PATH || './data/bgv.db'
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  _sqlite = new Database(dbPath)
  _sqlite.pragma('journal_mode = WAL')
  _sqlite.pragma('foreign_keys = ON')
  setupSQLite(_sqlite)
  console.log('[DB] SQLite ready at:', dbPath)
  return _sqlite
}

function setupSQLite(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New',
      buyer_name TEXT, whatsapp TEXT, email TEXT, company TEXT, product_name TEXT,
      quantity TEXT, contract_quantity TEXT, destination TEXT, payment_term TEXT,
      shipment_term TEXT, incoterms TEXT, price TEXT, purity TEXT, moisture TEXT,
      odor_taste TEXT, appearance TEXT, oil_content TEXT, packaging_size TEXT,
      delivery_schedule TEXT, notes TEXT, buyer_city TEXT, buyer_country TEXT,
      buyer_ip TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
      subject TEXT, message TEXT NOT NULL, is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS translations (
      lang TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (lang, key)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    INSERT OR IGNORE INTO settings (key, value) VALUES
      ('notify_email','ballonholdingsltd@gmail.com'),
      ('default_lang','en'),
      ('site_name','Ballon Global Ventures Limited');
  `)
  // safe migrations
  try { db.exec(`ALTER TABLE orders ADD COLUMN buyer_city TEXT`) } catch {}
  try { db.exec(`ALTER TABLE orders ADD COLUMN buyer_country TEXT`) } catch {}
  try { db.exec(`ALTER TABLE orders ADD COLUMN buyer_ip TEXT`) } catch {}
}

// ─────────────────────────────────────────────
// POSTGRESQL (Render)
// ─────────────────────────────────────────────
let _pgPool: any = null
let _pgReady = false

async function getPG() {
  if (_pgPool && _pgReady) return _pgPool
  const { Pool } = require('pg')
  _pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  })
  await setupPostgres(_pgPool)
  _pgReady = true
  console.log('[DB] PostgreSQL ready')
  return _pgPool
}

async function setupPostgres(pool: any) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New',
      buyer_name TEXT, whatsapp TEXT, email TEXT, company TEXT, product_name TEXT,
      quantity TEXT, contract_quantity TEXT, destination TEXT, payment_term TEXT,
      shipment_term TEXT, incoterms TEXT, price TEXT, purity TEXT, moisture TEXT,
      odor_taste TEXT, appearance TEXT, oil_content TEXT, packaging_size TEXT,
      delivery_schedule TEXT, notes TEXT, buyer_city TEXT, buyer_country TEXT,
      buyer_ip TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
      subject TEXT, message TEXT NOT NULL, is_read INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS translations (
      lang TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(), PRIMARY KEY (lang, key)
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    INSERT INTO settings (key, value) VALUES
      ('notify_email','ballonholdingsltd@gmail.com'),
      ('default_lang','en'),
      ('site_name','Ballon Global Ventures Limited')
    ON CONFLICT (key) DO NOTHING;
  `)
}

// ─────────────────────────────────────────────
// UNIVERSAL ASYNC QUERY FUNCTIONS
// All API routes call these — same API for both DBs
// ─────────────────────────────────────────────

/** Run a SELECT — returns array of rows */
export async function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  if (IS_POSTGRES) {
    const pg = await getPG()
    const pgSql = toPg(sql)
    const res = await pg.query(pgSql, params)
    return res.rows
  }
  return getSQLite().prepare(sql).all(...params)
}

/** Run a SELECT — returns first row or null */
export async function dbGet(sql: string, params: any[] = []): Promise<any | null> {
  const rows = await dbAll(sql, params)
  return rows[0] ?? null
}

/** Run INSERT / UPDATE / DELETE */
export async function dbRun(sql: string, params: any[] = []): Promise<void> {
  if (IS_POSTGRES) {
    const pg = await getPG()
    const pgSql = toPgWrite(sql)
    await pg.query(pgSql, params)
  } else {
    getSQLite().prepare(sql).run(...params)
  }
}

/** Run multiple writes in a transaction */
export async function dbTransaction(ops: { sql: string; params: any[] }[]): Promise<void> {
  if (IS_POSTGRES) {
    const pg = await getPG()
    const client = await pg.connect()
    try {
      await client.query('BEGIN')
      for (const op of ops) await client.query(toPgWrite(op.sql), op.params)
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  } else {
    const db = getSQLite()
    const run = db.transaction(() => {
      for (const op of ops) db.prepare(op.sql).run(...op.params)
    })
    run()
  }
}

// ─────────────────────────────────────────────
// SQL DIALECT CONVERTER  SQLite → PostgreSQL
// ─────────────────────────────────────────────
function toPg(sql: string): string {
  // Replace ? placeholders with $1 $2 $3...
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

function toPgWrite(sql: string): string {
  let converted = toPg(sql)
  // INSERT OR IGNORE → INSERT ... ON CONFLICT DO NOTHING
  converted = converted.replace(
    /INSERT OR IGNORE INTO (\w+)/gi,
    'INSERT INTO $1'
  )
  if (converted.match(/INSERT OR IGNORE/i)) {
    converted += ' ON CONFLICT DO NOTHING'
  }
  // INSERT OR REPLACE INTO translations
  if (sql.match(/INSERT OR REPLACE INTO translations/i)) {
    let i = 0
    converted = sql.replace(/\?/g, () => `$${++i}`)
    converted = converted.replace(
      /INSERT OR REPLACE INTO translations \(lang, key, value, updated_at\) VALUES \(\$1,\$2,\$3,CURRENT_TIMESTAMP\)/i,
      `INSERT INTO translations (lang, key, value, updated_at) VALUES ($1,$2,$3,NOW()) ON CONFLICT (lang,key) DO UPDATE SET value=$3, updated_at=NOW()`
    )
  }
  // INSERT OR REPLACE INTO settings
  if (sql.match(/INSERT OR REPLACE INTO settings/i)) {
    let i = 0
    converted = sql.replace(/\?/g, () => `$${++i}`)
    converted = converted.replace(
      /INSERT OR REPLACE INTO settings \(key, value, updated_at\) VALUES \(\$1,\$2,CURRENT_TIMESTAMP\)/i,
      `INSERT INTO settings (key, value, updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`
    )
  }
  // CURRENT_TIMESTAMP → NOW()
  converted = converted.replace(/CURRENT_TIMESTAMP/g, 'NOW()')
  return converted
}

// ─────────────────────────────────────────────
// LEGACY: keep getDB() so layout.tsx still works
// ─────────────────────────────────────────────
export function getDB() {
  if (IS_POSTGRES) return null
  return getSQLite()
}
