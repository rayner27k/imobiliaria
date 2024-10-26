const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Carrega o arquivo .env
dotenv.config();

const isDocker = process.env.NODE_ENV === 'production';

// Seleciona as variáveis com base no ambiente
const dbName = isDocker ? process.env.DOCKER_DB_NAME : process.env.LOCAL_DB_NAME;
const dbUser = isDocker ? process.env.DOCKER_DB_USER : process.env.LOCAL_DB_USER;
const dbPassword = isDocker ? process.env.DOCKER_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD;
const dbHost = isDocker ? process.env.DOCKER_DB_HOST : process.env.LOCAL_DB_HOST;

console.log(`Ambiente: ${process.env.NODE_ENV}`);
console.log(`Host do Banco de Dados: ${process.env.DOCKER_DB_HOST}`);
console.log(`Nome do Banco: ${dbName}, Usuário: ${dbUser}`);

// Cria uma instância do Sequelize para conexão com o banco de dados
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  logging: false,
});

// Função para conectar ao banco de dados
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

module.exports = { sequelize, connect };
