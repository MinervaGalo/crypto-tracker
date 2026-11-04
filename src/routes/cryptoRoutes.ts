import { Router } from 'express';
import * as cryptoRepository from '../repositories/cryptoRepository.js';

const router = Router();

// Получить все криптовалюты
router.get('/', (req, res) => {
  const cryptocurrencies = cryptoRepository.findAll();
  res.status(200).json(cryptocurrencies);
});

// Получить криптовалюту по ID
router.get('/:id', (req, res) => {
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

  res.status(200).json(cryptocurrency);
});

// Добавить криптовалюту
router.post('/', (req, res) => {
  const { cmcId, symbol, name } = req.body;

  if (
    !Number.isInteger(cmcId) ||
    cmcId <= 0 ||
    typeof symbol !== 'string' ||
    !symbol.trim() ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    res.status(400).json({ error: 'Invalid cryptocurrency data' });
    return;
  }

  try {
    const id = cryptoRepository.create(cmcId, symbol.trim().toUpperCase(), name.trim());
    res.status(201).json({ id, message: 'Cryptocurrency created' });
  } catch {
    res.status(409).json({ error: 'Cryptocurrency already exists or data conflicts' });
  }
});

// Обновить данные криптовалюты
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { symbol, name } = req.body;

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof symbol !== 'string' ||
    !symbol.trim() ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    res.status(400).json({ error: 'Invalid cryptocurrency data' });
    return;
  }

  const updated = cryptoRepository.update(
    id,
    symbol.trim().toUpperCase(),
    name.trim()
  );

  if (!updated) {
    res.status(404).json({ error: 'Cryptocurrency not found' });
    return;
  }

  res.status(200).json({ message: 'Cryptocurrency updated' });
});

// Удалить криптовалюту
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid cryptocurrency ID' });
    return;
  }

  const deleted = cryptoRepository.remove(id);

  if (!deleted) {
    res.status(404).json({ error: 'Cryptocurrency not found' });
    return;
  }

  res.status(200).json({ message: 'Cryptocurrency deleted' });
});

export default router;
