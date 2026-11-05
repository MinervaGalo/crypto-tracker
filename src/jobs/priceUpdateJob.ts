import { updatePrices } from '../services/priceService.js';

const UPDATE_INTERVAL = 60 * 1000; // 1 минута

let timer: ReturnType<typeof setInterval> | undefined;

export function startPriceUpdateJob(): void {
  if (timer) {
    return;
  }

  console.log('Price update job started');

  // Первое обновление сразу после запуска
  updatePrices()
    .then(count => console.log(`Updated prices: ${count}`))
    .catch(error => console.error('Price update failed:', error));

  // Последующие обновления каждую минуту
  timer = setInterval(() => {
    updatePrices()
      .then(count => console.log(`Updated prices: ${count}`))
      .catch(error => console.error('Price update failed:', error));
  }, UPDATE_INTERVAL);
}

export function stopPriceUpdateJob(): void {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
    console.log('Price update job stopped');
  }
}