// Описание API для Swagger
const swaggerDocument = {
  openapi: '3.0.0',

  info: {
    title: 'Crypto Tracker API',
    version: '1.0.0',
    description: 'API для отслеживания цен криптовалют'
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Локальный сервер'
    }
  ],

  // Авторизация по API-ключу
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API Key'
      }
    }
  },

  // Для всех API-маршрутов требуется авторизация
  security: [
    {
      BearerAuth: []
    }
  ],

  paths: {
    '/status': {
      get: {
        summary: 'Проверка работы сервера',
        security: [],
        responses: {
          '200': {
            description: 'Сервер работает'
          }
        }
      }
    },

    '/api/cryptocurrencies': {
      get: {
        summary: 'Получить список криптовалют',
        responses: {
          '200': {
            description: 'Список криптовалют'
          },
          '401': {
            description: 'Ошибка авторизации'
          }
        }
      },

      post: {
        summary: 'Добавить криптовалюту',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cmcId', 'symbol', 'name'],
                properties: {
                  cmcId: { type: 'integer', example: 1 },
                  symbol: { type: 'string', example: 'BTC' },
                  name: { type: 'string', example: 'Bitcoin' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Криптовалюта добавлена' },
          '400': { description: 'Некорректные данные' },
          '409': { description: 'Криптовалюта уже существует' },
          '401': { description: 'Ошибка авторизации' }
        }
      }
    },

    '/api/cryptocurrencies/{id}': {
      get: {
        summary: 'Получить криптовалюту по ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Информация о криптовалюте' },
          '400': { description: 'Некорректный ID' },
          '404': { description: 'Криптовалюта не найдена' }
        }
      },

      put: {
        summary: 'Изменить данные криптовалюты',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['symbol', 'name'],
                properties: {
                  symbol: { type: 'string', example: 'BTC' },
                  name: { type: 'string', example: 'Bitcoin' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Данные обновлены' },
          '400': { description: 'Некорректные данные или ID' },
          '404': { description: 'Криптовалюта не найдена' },
          '409': { description: 'Криптовалюта с таким символом уже существует' }
        }
      },

      delete: {
        summary: 'Удалить криптовалюту',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'Криптовалюта удалена' },
          '400': { description: 'Некорректный ID' },
          '404': { description: 'Криптовалюта не найдена' }
        }
      }
    },

    '/api/prices': {
      get: {
        summary: 'Получить последние цены криптовалют',
        responses: {
          '200': { description: 'Список последних цен' },
          '401': { description: 'Ошибка авторизации' }
        }
      }
    },

    '/api/prices/{id}/history': {
      get: {
        summary: 'Получить историю цен криптовалюты',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': { description: 'История цен' },
          '400': { description: 'Некорректный ID' },
          '404': { description: 'Криптовалюта не найдена' }
        }
      }
    }
  }
};

export default swaggerDocument;