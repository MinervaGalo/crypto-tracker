import { Request, Response } from 'express';
import * as priceHistoryRepository from '../repositories/priceHistoryRepository.js';
import * as cryptoRepository from '../repositories/cryptoRepository.js';

// Получить последние цены всех криптовалют
export function getLatestPrices(req: Request, res: Response) {
  const prices = priceHistoryRepository.findLatestPrices();

  res.status(200).json(prices);
}

// Получить историю цен криптовалюты
export function getPriceHistory(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid cryptocurrency ID' });
    return;
  }

  const cryptocurrency = cryptoRepository.findById(id);

  if (!cryptocurrency) {
    res.status(404).json({ error: 'Cryptocurrency not found' });
    return;
  }

  const history = priceHistoryRepository.findByCryptocurrencyId(id);

  res.status(200).json(history);
}