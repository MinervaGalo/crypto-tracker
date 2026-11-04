import db from '../database/database.js';

export interface Cryptocurrency {
  id: number;
  cmc_id: number;
  symbol: string;
  name: string;
  last_updated: string | null;
}

// Получить все отслеживаемые криптовалюты
export function findAll(): Cryptocurrency[] {
  return db.prepare(`
    SELECT * FROM cryptocurrencies
    ORDER BY name
  `).all() as Cryptocurrency[];
}

// Найти криптовалюту по внутреннему ID
export function findById(id: number): Cryptocurrency | undefined {
  return db.prepare(`
    SELECT * FROM cryptocurrencies
    WHERE id = ?
  `).get(id) as Cryptocurrency | undefined;
}

// Добавить криптовалюту
export function create(
  cmcId: number,
  symbol: string,
  name: string
): number {
  const result = db.prepare(`
    INSERT INTO cryptocurrencies (cmc_id, symbol, name)
    VALUES (?, ?, ?)
  `).run(cmcId, symbol, name);

  return Number(result.lastInsertRowid);
}

export function remove(id: number): boolean {
  const result = db.prepare(`
    DELETE FROM cryptocurrencies
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
 
export function update(
  id: number,
  symbol: string,
  name: string
): boolean {
  const result = db.prepare(`
    UPDATE cryptocurrencies
    SET symbol = ?, name = ?
    WHERE id = ?
  `).run(symbol, name, id);

  return result.changes > 0;
}