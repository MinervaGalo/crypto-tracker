import path from 'node:path';
import request from 'supertest';

process.env.DB_PATH = path.join(process.cwd(), 'crypto-tracker-test.db');
process.env.API_ACCESS_KEY = 'test-api-key';

await import('../dist/database/init.js');

const { default: app } = await import('../dist/app.js');
const { default: db } = await import('../dist/database/database.js');

beforeEach(() => {
  db.exec(`
    DELETE FROM price_history;
    DELETE FROM cryptocurrencies;
  `);
});

afterAll(() => {
  db.close();
});

describe('API tests', () => {


  test('GET /status — проверка работы сервера', async () => {
    const response = await request(app).get('/status');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('Запрос без ключа должен возвращать 401', async () => {
    const response = await request(app).get('/api/cryptocurrencies');

    expect(response.status).toBe(401);
  });

  test('Запрос с неправильным ключом должен возвращать 401', async () => {
    const response = await request(app)
      .get('/api/cryptocurrencies')
      .set('Authorization', 'Bearer wrong-key');

    expect(response.status).toBe(401);
  });

  test('Запрос с правильным ключом должен возвращать 200', async () => {
    const response = await request(app)
      .get('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
    test('POST /api/cryptocurrencies — добавление криптовалюты', async () => {
    const response = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    expect(response.status).toBe(201);
  });

  test('POST /api/cryptocurrencies — ошибка при пустых данных', async () => {
    const response = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({});

    expect(response.status).toBe(400);
  });

  test('POST /api/cryptocurrencies — ошибка при дубликате', async () => {
    const crypto = {
      cmcId: 1,
      symbol: 'BTC',
      name: 'Bitcoin'
    };

    await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send(crypto);

    const response = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send(crypto);

    expect(response.status).toBe(409);
  });

  test('GET /api/cryptocurrencies — получение списка', async () => {
    await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    const response = await request(app)
      .get('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].symbol).toBe('BTC');
  });

    test('GET /api/cryptocurrencies/:id — получение криптовалюты', async () => {
    const created = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    const id = created.body.id;

    const response = await request(app)
      .get(`/api/cryptocurrencies/${id}`)
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);
    expect(response.body.symbol).toBe('BTC');
  });

  test('GET /api/cryptocurrencies/:id — несуществующая криптовалюта', async () => {
    const response = await request(app)
      .get('/api/cryptocurrencies/999')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(404);
  });

  test('GET /api/cryptocurrencies/:id — некорректный ID', async () => {
    const response = await request(app)
      .get('/api/cryptocurrencies/abc')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(400);
  });

    test('PUT /api/cryptocurrencies/:id — изменение криптовалюты', async () => {
    const created = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/api/cryptocurrencies/${id}`)
      .set('Authorization', 'Bearer test-api-key')
      .send({
        symbol: 'BTC',
        name: 'Bitcoin Updated'
      });

    expect(response.status).toBe(200);

    const updated = await request(app)
        .get(`/api/cryptocurrencies/${id}`)
        .set('Authorization', 'Bearer test-api-key');

    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Bitcoin Updated');
  });

  test('PUT /api/cryptocurrencies/:id — несуществующая криптовалюта', async () => {
    const response = await request(app)
      .put('/api/cryptocurrencies/999')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    expect(response.status).toBe(404);
  });

  test('PUT /api/cryptocurrencies/:id — некорректные данные', async () => {
    const response = await request(app)
      .put('/api/cryptocurrencies/1')
      .set('Authorization', 'Bearer test-api-key')
      .send({});

    expect(response.status).toBe(400);
  });

    test('DELETE /api/cryptocurrencies/:id — удаление криптовалюты', async () => {
    const created = await request(app)
      .post('/api/cryptocurrencies')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
      });

    const id = created.body.id;

    const response = await request(app)
      .delete(`/api/cryptocurrencies/${id}`)
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);

    const check = await request(app)
      .get(`/api/cryptocurrencies/${id}`)
      .set('Authorization', 'Bearer test-api-key');

    expect(check.status).toBe(404);
  });

  test('DELETE /api/cryptocurrencies/:id — несуществующая криптовалюта', async () => {
    const response = await request(app)
      .delete('/api/cryptocurrencies/999')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(404);
  });

  test('DELETE /api/cryptocurrencies/:id — некорректный ID', async () => {
    const response = await request(app)
      .delete('/api/cryptocurrencies/abc')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(400);
  });

  test('GET /api/prices — получение списка текущих цен', async () => {
    const response = await request(app)
      .get('/api/prices')
      .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });


  test('GET /api/prices/:id/history — получение истории цен', async () => {
    const created = await request(app)
        .post('/api/cryptocurrencies')
        .set('Authorization', 'Bearer test-api-key')
        .send({
        cmcId: 1,
        symbol: 'BTC',
        name: 'Bitcoin'
        });

    const id = created.body.id;

    db.prepare(`
        INSERT INTO price_history (cryptocurrency_id, price, timestamp)
        VALUES (?, ?, ?)
    `).run(id, 50000, '2026-11-06T12:00:00.000Z');

    const response = await request(app)
        .get(`/api/prices/${id}/history`)
        .set('Authorization', 'Bearer test-api-key');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].price).toBe(50000);
    });

    test('GET /api/prices/:id/history — несуществующая криптовалюта', async () => {
        const response = await request(app)
            .get('/api/prices/999/history')
            .set('Authorization', 'Bearer test-api-key');

        expect(response.status).toBe(404);
        });

        test('GET /api/prices/:id/history — некорректный ID', async () => {
        const response = await request(app)
            .get('/api/prices/abc/history')
            .set('Authorization', 'Bearer test-api-key');

        expect(response.status).toBe(400);
    });

  


});