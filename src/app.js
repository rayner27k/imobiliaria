require('dotenv').config(); // Carrega variáveis de ambiente
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
const fazendaRoutes = require('./routes/fazendaRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');
const { connect } = require('./database/database');
const setupSwagger = require('../config/swagger');

const app = express(); 
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados
connect(); 

// Configuração do Swagger
setupSwagger(app); 

// Definindo as rotas
app.use('/clientes', clienteRoutes);
app.use('/fazendas', fazendaRoutes);
app.use('/transacoes', transacaoRoutes);

// Rota raiz '/'
app.get('/', (req, res) => {
    res.send(`
      <div style="text-align: center;">
        <h1>Desejo-lhe boas-vindas à API de Gestão de Fazendas!</h1>
        <p><em><strong>Acesse: <a href="/api-docs">/api-docs</a> para a documentação completa e mais informações.</strong></em></p>
      </div>
    `);
});

// Middleware para rotas não encontradas (404)
app.use((req, res, next) => {
    res.status(404).send((`
        <div style="text-align: center;">
          <h1>Rota não encontrada, a URL solicitada não existe. Verifique o endereço e tente novamente.</h1>
          <p><em><strong>Acesse: <a href="/api-docs">/api-docs</a> para a documentação completa e mais informações.</strong></em></p>
        </div>
      `));
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Exporta o app
module.exports = app; 
