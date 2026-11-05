import axios from 'axios';

const CMC_API_URL =
  'https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest';

export async function getLatestQuotes(cmcIds: number[]) {
  const apiKey = process.env.CMC_API_KEY;

  // Проверяем наличие ключа CoinMarketCap
  if (!apiKey) {
    throw new Error('CoinMarketCap API key is missing');
  }

  try {
    // Отправляем запрос к CoinMarketCap
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

  } catch (error) {
    // Обрабатываем ошибки ответа от CoinMarketCap
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          throw new Error('Invalid CoinMarketCap API key');
        }

        if (status === 429) {
          throw new Error('CoinMarketCap rate limit exceeded');
        }

        throw new Error(`CoinMarketCap API error: ${status}`);
      }

      // Запрос отправлен, но ответа не получено
      if (error.code === 'ECONNABORTED') {
        throw new Error('CoinMarketCap request timed out');
      }

      throw new Error('CoinMarketCap is unavailable');
    }

    throw error;
  }
}