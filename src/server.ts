import 'dotenv/config';
import './database/init.js';
import app from './app.js';
import {
  startPriceUpdateJob,
  stopPriceUpdateJob
} from './jobs/priceUpdateJob.js';
import db from './database/database.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startPriceUpdateJob();
});

function shutdown() {
  console.log('Shutting down server...');

  stopPriceUpdateJob();

  server.close(() => {
    db.close();
    console.log('Server stopped');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);