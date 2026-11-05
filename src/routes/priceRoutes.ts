import { Router } from 'express';
import {
  getLatestPrices,
  getPriceHistory
} from '../controllers/priceController.js';

const router = Router();

// Получить последние цены
router.get('/', getLatestPrices);

// Получить историю цен по ID
router.get('/:id/history', getPriceHistory);

export default router;
