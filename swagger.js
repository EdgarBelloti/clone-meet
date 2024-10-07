// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definição das opções do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Reunião',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de reuniões',
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL do servidor
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos das rotas
};

// Criação da especificação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
