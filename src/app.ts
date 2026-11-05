import express from 'express';
import { apiKeyAuth } from './middleware/apiKeyAuth.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import priceRoutes from './routes/priceRoutes.js';

const app = express();

app.use(express.json());

// Проверка работоспособности сервера
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Crypto Tracker API is running'
  });
});

app.use('/api', apiKeyAuth);

// Маршруты для криптовалют
app.use('/api/cryptocurrencies', cryptoRoutes);
app.use('/api/prices', priceRoutes);

export default app;
