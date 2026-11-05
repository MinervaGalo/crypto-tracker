import db from '../database/database.js';

export interface PriceHistory {
  id: number;
  cryptocurrency_id: number;
  price: number;
  timestamp: string;
}

// Сохранить цену
export function savePrice(
  cryptocurrencyId: number,
  price: number,
  timestamp: string
): void {
  db.prepare(`
    INSERT INTO price_history (
      cryptocurrency_id,
      price,
      timestamp
    )
    VALUES (?, ?, ?)
  `).run(cryptocurrencyId, price, timestamp);
}

// Получить историю цен
export function findByCryptocurrencyId(
  cryptocurrencyId: number
): PriceHistory[] {
  return db.prepare(`
    SELECT *
    FROM price_history
    WHERE cryptocurrency_id = ?
    ORDER BY timestamp DESC
  `).all(cryptocurrencyId) as PriceHistory[];
}

export interface CurrentPrice {
  cryptocurrency_id: number;
  cmc_id: number;
  symbol: string;
  name: string;
  price: number | null;
  timestamp: string | null;
}

// Получить последние цены всех криптовалют
export function findLatestPrices(): CurrentPrice[] {
  return db.prepare(`
    SELECT
      c.id AS cryptocurrency_id,
      c.cmc_id,
      c.symbol,
      c.name,
      ph.price,
      ph.timestamp
    FROM cryptocurrencies c
    LEFT JOIN price_history ph
      ON ph.id = (
        SELECT id
        FROM price_history
        WHERE cryptocurrency_id = c.id
        ORDER BY timestamp DESC, id DESC
        LIMIT 1
      )
    ORDER BY c.name
  `).all() as CurrentPrice[];
}