import express from 'express';

const app = express();

app.use(express.json());

app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Crypto Tracker API is running'
  });
});

export default app;