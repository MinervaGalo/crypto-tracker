import 'dotenv/config';
import { updatePrices } from './services/priceService.js';
import * as priceHistoryRepository from './repositories/priceHistoryRepository.js';
import * as cryptoRepository from './repositories/cryptoRepository.js';

async function testPriceUpdate() {
  try {
    const savedCount = await updatePrices();

    console.log(`Сохранено новых цен: ${savedCount}`);

    const cryptocurrencies = cryptoRepository.findAll();

    for (const crypto of cryptocurrencies) {
      const history = priceHistoryRepository.findByCryptocurrencyId(crypto.id);

      console.log(`${crypto.name}:`, history[0]);
    }
  } catch (error) {
    console.error('Price update error:', error);
  }
}

testPriceUpdate();
