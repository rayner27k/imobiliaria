const { Sequelize } = require('sequelize');

// Cria uma instância do Sequelize para conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, // Host do banco de dados
  dialect: 'postgres', // Tipo de banco de dados
  logging: false, // Desativa logs de consultas SQL
});

// Função para conectar ao banco de dados
const connect = async () => {
  try {
    await sequelize.authenticate(); // Tenta autenticar a conexão
    console.log('Conexão com o banco de dados estabelecida com sucesso.'); // Sucesso
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error); // Erro de conexão
  }
};

module.exports = { sequelize, connect }; // Exporta a instância e a função de conexão
