import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH || './data/bgv.db'
const dbDir = path.dirname(DB_PATH)

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

let db: Database.Database

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('agricultural','petroleum')),
      status TEXT NOT NULL DEFAULT 'New' CHECK(status IN ('New','Reviewed','Completed')),
      buyer_name TEXT,
      whatsapp TEXT,
      email TEXT,
      company TEXT,
      product_name TEXT,
      quantity TEXT,
      contract_quantity TEXT,
      destination TEXT,
      payment_term TEXT,
      shipment_term TEXT,
      incoterms TEXT,
      price TEXT,
      purity TEXT,
      moisture TEXT,
      odor_taste TEXT,
      appearance TEXT,
      oil_content TEXT,
      packaging_size TEXT,
      delivery_schedule TEXT,
      notes TEXT,
      buyer_city TEXT,
      buyer_country TEXT,
      buyer_ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS translations (
      lang TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (lang, key)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO settings (key, value) VALUES
      ('notify_email', 'ballonholdingsltd@gmail.com'),
      ('default_lang', 'en'),
      ('site_name', 'Ballon Global Ventures Limited');
  `)
}

// Run this once to add location columns if upgrading existing DB
export function migrateDB(db: any) {
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN buyer_city TEXT`)
  } catch {}
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN buyer_country TEXT`)
  } catch {}
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN buyer_ip TEXT`)
  } catch {}
}
