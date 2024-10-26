const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configurações do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Fazendas, Clientes e Transações',
      version: '1.0.0',
      description: 'API para gerenciar fazendas, clientes e transações',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL base da API
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Caminho corrigido
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
