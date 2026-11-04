import db from './database.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cmc_id INTEGER NOT NULL UNIQUE,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    last_updated TEXT
  );

  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cryptocurrency_id INTEGER NOT NULL,
    price REAL NOT NULL,
    timestamp TEXT NOT NULL,

    FOREIGN KEY (cryptocurrency_id)
      REFERENCES cryptocurrencies(id)
      ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_price_history_crypto_timestamp
  ON price_history (cryptocurrency_id, timestamp);
`);

console.log('Database tables created successfully');
