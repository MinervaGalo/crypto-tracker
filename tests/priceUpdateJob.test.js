import { jest } from '@jest/globals';

// Подменяем обновление цен, чтобы не обращаться к настоящему API
const updatePrices = jest.fn().mockResolvedValue(1);

jest.unstable_mockModule('../dist/services/priceService.js', () => ({
  updatePrices
}));

const {
  startPriceUpdateJob,
  stopPriceUpdateJob
} = await import('../dist/jobs/priceUpdateJob.js');

describe('Price update job tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    updatePrices.mockClear();
    updatePrices.mockResolvedValue(1);

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    stopPriceUpdateJob();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('Первое обновление запускается сразу', () => {
    startPriceUpdateJob();

    expect(updatePrices).toHaveBeenCalledTimes(1);
  });

  test('Цены обновляются каждую минуту', async () => {
    startPriceUpdateJob();

    await jest.advanceTimersByTimeAsync(60 * 1000);

    expect(updatePrices).toHaveBeenCalledTimes(2);
  });

  test('После остановки обновления прекращаются', async () => {
    startPriceUpdateJob();
    stopPriceUpdateJob();

    await jest.advanceTimersByTimeAsync(60 * 1000);

    expect(updatePrices).toHaveBeenCalledTimes(1);
  });

  test('Повторный запуск не создаёт дополнительную задачу', async () => {
    startPriceUpdateJob();
    startPriceUpdateJob();

    expect(updatePrices).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(60 * 1000);

    expect(updatePrices).toHaveBeenCalledTimes(2);
  });
});