const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const transacaoController = require('../controllers/transacaoController');
const Transacao = require('../models/transacao');
const Cliente = require('../models/cliente');
const Fazenda = require('../models/fazenda');

// Mock os modelos
jest.mock('../models/transacao');
jest.mock('../models/cliente');
jest.mock('../models/fazenda');

const app = express();
app.use(bodyParser.json());
// Define as rotas que utilizam o controlador de transações
app.post('/transacao', transacaoController.createTransacao);
app.get('/transacao', transacaoController.getAllTransacoes);
app.get('/transacao/:id', transacaoController.getTransacaoById);
app.put('/transacao/:id', transacaoController.updateTransacao);
app.delete('/transacao/:id', transacaoController.deleteTransacao);

describe('Transacao Controller', () => {
    describe('createTransacao', () => {
        it('should create a new transaction', async () => {
            // Mock das dependências necessárias
            Cliente.findByPk.mockResolvedValue({ id: 1 });
            Fazenda.findByPk.mockResolvedValue({ id: 1 });
            Transacao.findOne.mockResolvedValue(null);
            Transacao.create.mockResolvedValue({ id: 1, cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-01', valor: 1000 });
        
            const res = await request(app)
                .post('/transacao')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 1000
                });
        
            expect(res.statusCode).toEqual(201); // Verifica se o status da resposta é 201
            expect(res.body).toHaveProperty('id'); // Verifica se o corpo da resposta contém a propriedade 'id'
        });        

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .post('/transacao')
                .send({
                    cliente_id: 'invalid', // ID inválido
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 1000
                });

            expect(res.statusCode).toEqual(400); // Verifica se o status da resposta é 400
            expect(res.body).toHaveProperty('error'); // Verifica se a mensagem de erro está presente
        });

        it('should return 404 if cliente not found', async () => {
            Cliente.findByPk.mockResolvedValue(null); // Simula que o cliente não foi encontrado

            const res = await request(app)
                .post('/transacao')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 1000
                });

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });

        it('should return 404 if fazenda not found', async () => {
            Cliente.findByPk.mockResolvedValue({ id: 1 }); // Simula que o cliente foi encontrado
            Fazenda.findByPk.mockResolvedValue(null); // Simula que a fazenda não foi encontrada

            const res = await request(app)
                .post('/transacao')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 1000
                });

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });

        it('should return 400 if fazenda already sold', async () => {
            Cliente.findByPk.mockResolvedValue({ id: 1 }); // Simula que o cliente foi encontrado
            Fazenda.findByPk.mockResolvedValue({ id: 1 }); // Simula que a fazenda foi encontrada
            Transacao.findOne.mockResolvedValue({ id: 1 }); // Simula que já existe uma transação para a fazenda

            const res = await request(app)
                .post('/transacao')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 1000
                });

            expect(res.statusCode).toEqual(400); // Verifica se o status da resposta é 400
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });
    });

    describe('getAllTransacoes', () => {
        it('should get all transactions with pagination', async () => {
            Transacao.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]); // Mock de duas transações

            const res = await request(app).get('/transacao?page=1&limit=2');

            expect(res.statusCode).toEqual(200); // Verifica se o status da resposta é 200
            expect(res.body).toHaveLength(2); // Verifica se o corpo da resposta contém duas transações
        });

        it('should return 500 if there is a server error', async () => {
            Transacao.findAll.mockRejectedValue(new Error('Server error')); // Simula um erro no banco de dados

            const res = await request(app).get('/transacao?page=1&limit=2');

            expect(res.statusCode).toEqual(500); // Verifica se o status da resposta é 500
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });
    });

    describe('getTransacaoById', () => {
        it('should return a transaction by ID', async () => {
            const transacao = { id: 1, cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-01', valor: 1000 };
            Transacao.findByPk.mockResolvedValue(transacao); // Mock para simular transação encontrada

            const res = await request(app).get('/transacao/1');

            expect(res.statusCode).toEqual(200); // Verifica se o status é 200
            expect(res.body).toEqual(transacao); // Verifica se a resposta contém a transação correta
        });

        it('should return 404 if transaction not found', async () => {
            Transacao.findByPk.mockResolvedValue(null); // Simula transação não encontrada

            const res = await request(app).get('/transacao/1');

            expect(res.statusCode).toEqual(404); // Verifica se o status é 404
            expect(res.body).toHaveProperty('error'); // Verifica se a resposta contém a mensagem de erro
            expect(res.body.error).toBe('Transação não encontrada'); // Verifica a mensagem de erro específica
        });
    });

    describe('updateTransacao', () => {
        it('should update an existing transaction', async () => {
            Transacao.findByPk.mockResolvedValue({ id: 1, update: jest.fn() }); // Mock de uma transação existente
            Cliente.findByPk.mockResolvedValue({ id: 1 }); // Mock de um cliente existente
            Fazenda.findByPk.mockResolvedValue({ id: 1 }); // Mock de uma fazenda existente

            const res = await request(app)
                .put('/transacao/1')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 2000 // Atualiza o valor
                });

            expect(res.statusCode).toEqual(200); // Verifica se o status da resposta é 200
            expect(res.body).toHaveProperty('id'); // Verifica se o corpo da resposta contém a propriedade 'id'
        });

        it('should return 400 if validation fails', async () => {
            const res = await request(app)
                .put('/transacao/1')
                .send({
                    cliente_id: 'invalid', // ID inválido
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 2000
                });

            expect(res.statusCode).toEqual(400); // Verifica se o status da resposta é 400
            expect(res.body).toHaveProperty('error'); // Verifica se a mensagem de erro está presente
        });

        it('should return 404 if transaction not found', async () => {
            Transacao.findByPk.mockResolvedValue(null); // Simula que a transação não foi encontrada

            const res = await request(app)
                .put('/transacao/1')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 2000
                });

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });

        it('should return 404 if cliente not found', async () => {
            Transacao.findByPk.mockResolvedValue({ id: 1, update: jest.fn() }); // Mock de uma transação existente
            Cliente.findByPk.mockResolvedValue(null); // Simula que o cliente não foi encontrado

            const res = await request(app)
                .put('/transacao/1')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 2000
                });

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });

        it('should return 404 if fazenda not found', async () => {
            Transacao.findByPk.mockResolvedValue({ id: 1, update: jest.fn() }); // Mock de uma transação existente
            Cliente.findByPk.mockResolvedValue({ id: 1 }); // Simula que o cliente foi encontrado
            Fazenda.findByPk.mockResolvedValue(null); // Simula que a fazenda não foi encontrada

            const res = await request(app)
                .put('/transacao/1')
                .send({
                    cliente_id: 1,
                    fazenda_id: 1,
                    data_transacao: '2023-10-01',
                    valor: 2000
                });

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });
    });

    describe('deleteTransacao', () => {
        it('should delete an existing transaction', async () => {
            Transacao.findByPk.mockResolvedValue({ id: 1, destroy: jest.fn() }); // Mock de uma transação existente

            const res = await request(app).delete('/transacao/1');

            expect(res.statusCode).toEqual(204); // Verifica se o status da resposta é 204
        });

        it('should return 404 if transaction not found', async () => {
            Transacao.findByPk.mockResolvedValue(null); // Simula que a transação não foi encontrada

            const res = await request(app).delete('/transacao/1');

            expect(res.statusCode).toEqual(404); // Verifica se o status da resposta é 404
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });

        it('should return 500 if there is a server error', async () => {
            Transacao.findByPk.mockRejectedValue(new Error('Server error')); // Simula um erro no banco de dados

            const res = await request(app).delete('/transacao/1');

            expect(res.statusCode).toEqual(500); // Verifica se o status da resposta é 500
            expect(res.body).toHaveProperty('error'); // Verifica a mensagem de erro
        });
    });
});
