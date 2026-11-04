import express from 'express';
import cryptoRoutes from './routes/cryptoRoutes.js';

const app = express();

app.use(express.json());

// Проверка работоспособности сервера
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Crypto Tracker API is running'
  });
});

// Маршруты для криптовалют
app.use('/api/cryptocurrencies', cryptoRoutes);

export default app;
