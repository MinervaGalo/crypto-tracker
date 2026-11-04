import 'dotenv/config';
import { getLatestQuotes } from './services/coinMarketCapService.js';

async function testCoinMarketCap() {
  try {
    const result = await getLatestQuotes([1, 1027]);

    for (const crypto of result.data) {
      const usdQuote = crypto.quote[0];

      console.log({
        name: crypto.name,
        symbol: crypto.symbol,
        price: usdQuote.price,
        lastUpdated: usdQuote.last_updated
      });
    }
  } catch (error) {
    console.error('CoinMarketCap API error:', error);
  }
}

testCoinMarketCap();
