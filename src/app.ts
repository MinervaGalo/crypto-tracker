import express from 'express';
import { apiKeyAuth } from './middleware/apiKeyAuth.js';
import cryptoRoutes from './routes/cryptoRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';

const app = express();

app.use(express.json());

// Проверка работоспособности сервера
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Crypto Tracker API is running'
  });
});

// Документация API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Авторизация для всех API-маршрутов
app.use('/api', apiKeyAuth);

// Маршруты для криптовалют
app.use('/api/cryptocurrencies', cryptoRoutes);
app.use('/api/prices', priceRoutes);

// Обработчик ошибок 
app.use(errorHandler);

export default app;
