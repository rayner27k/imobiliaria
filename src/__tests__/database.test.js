const { Sequelize } = require('sequelize');
require('dotenv').config();
const { sequelize, connect } = require('../database/database');

describe('Database Connection', () => {
    // Teste para verificar se a conexão ao banco de dados é bem-sucedida
    it('Deve conectar ao banco de dados com sucesso', async () => {
        await expect(connect()).resolves.not.toThrow(); // Verifica que a conexão não deve lançar erro
    });

    // Teste para garantir que a conexão com o banco de dados esteja autenticada
    it('A conexão com o banco de dados deve estar autenticada', async () => {
        await connect(); // Tenta conectar ao banco
        expect(sequelize.authenticate).toBeDefined(); // Verifica se o método authenticate está definido
        expect(sequelize.config.database).toEqual(process.env.DB_NAME); // Verifica se o nome do banco de dados está correto
    });

    // Teste para verificar se a conexão falha com credenciais inválidas
    it('Deve lançar um erro se as credenciais do banco de dados estiverem incorretas', async () => {
        // Cria uma nova instância do Sequelize com credenciais inválidas
        const invalidSequelize = new Sequelize('invalid_db', 'invalid_user', 'invalid_password', {
            host: process.env.DB_HOST, // Usa o host definido nas variáveis de ambiente
            dialect: 'postgres', // Define o dialeto como postgres
            logging: false, // Desabilita logs
        });

        // Função para tentar autenticar usando credenciais inválidas
        const invalidConnect = async () => {
            try {
                await invalidSequelize.authenticate(); // Tenta autenticar
            } catch (error) {
                throw new Error('Não foi possível conectar ao banco de dados'); // Lança erro se a autenticação falhar
            }
        };

        // Verifica se a função de conexão inválida lança o erro esperado
        await expect(invalidConnect()).rejects.toThrow('Não foi possível conectar ao banco de dados');
    });

    afterAll(async () => {
        await sequelize.close(); // Fecha a conexão após todos os testes
    });
});
