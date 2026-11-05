import * as cryptoRepository from '../repositories/cryptoRepository.js';
import * as priceHistoryRepository from '../repositories/priceHistoryRepository.js';
import { getLatestQuotes } from './coinMarketCapService.js';

// Получить цены и сохранить их в базу данных
export async function updatePrices(): Promise<number> {
  const cryptocurrencies = cryptoRepository.findAll();

  if (cryptocurrencies.length === 0) {
    return 0;
  }

  const cmcIds = cryptocurrencies.map(crypto => crypto.cmc_id);
  const result = await getLatestQuotes(cmcIds);
  
  let savedCount = 0;

  for (const crypto of result.data) {
    const localCrypto = cryptocurrencies.find(
      item => item.cmc_id === crypto.id
    );

    if (!localCrypto) {
      continue;
    }

    const usdQuote = crypto.quote[0];

    priceHistoryRepository.savePrice(
      localCrypto.id,
      usdQuote.price,
      usdQuote.last_updated
    );

    savedCount++;
  }

  return savedCount;
}
