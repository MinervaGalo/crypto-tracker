import axios from 'axios';

const CMC_API_URL =
  'https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest';

export async function getLatestQuotes(cmcIds: number[]) {
  const apiKey = process.env.CMC_API_KEY;

  if (!apiKey) {
    throw new Error('CoinMarketCap API key is missing');
  }

  const response = await axios.get(CMC_API_URL, {
    headers: {
      'X-CMC_PRO_API_KEY': apiKey
    },
    params: {
      id: cmcIds.join(','),
      convert: 'USD'
    },
    timeout: 10000
  });

  return response.data;
}
