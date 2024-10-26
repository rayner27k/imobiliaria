const request = require('supertest');
const express = require('express');
const validateTransacao = require('../middlewares/validateTransacao');
const Cliente = require('../models/cliente');
const Fazenda = require('../models/fazenda');
const Transacao = require('../models/transacao');
// Mocks para simular os modelos de dados
jest.mock('../models/cliente');
jest.mock('../models/fazenda');
jest.mock('../models/transacao');

const app = express();
app.use(express.json());
app.post('/transacao', validateTransacao, (req, res) => {
    res.status(200).send('Transação válida');
});

describe('validateTransacao Middleware', () => { // Testa o middleware
    it('should return 400 if the request body is invalid', async () => {
        const response = await request(app)
            .post('/transacao') // Faz uma requisição POST para a rota /transacao
            .send({ cliente_id: 'invalid', fazenda_id: 1, data_transacao: 'invalid-date', valor: -100 }); // Envia dados inválidos

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });

    it('should return 404 if the cliente does not exist', async () => { // Testa se o cliente existe
        Cliente.findByPk.mockResolvedValue(null); // Mock para simular cliente não encontrado

        const response = await request(app) 
            .post('/transacao') 
            .send({ cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-10', valor: 100 }); 

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Cliente não encontrado'); 
    });

    it('should return 404 if the fazenda does not exist', async () => { // Testa se a fazenda existe
        Cliente.findByPk.mockResolvedValue({ id: 1 }); // Mock para simular cliente encontrado
        Fazenda.findByPk.mockResolvedValue(null); // Mock para simular fazenda não encontrada

        const response = await request(app)
            .post('/transacao')
            .send({ cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-10', valor: 100 });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Fazenda não encontrada');
    });

    it('should return 400 if the fazenda has already been sold', async () => { // Testa se a fazenda já foi vendida
        Cliente.findByPk.mockResolvedValue({ id: 1 }); // Mock para simular cliente encontrado
        Fazenda.findByPk.mockResolvedValue({ id: 1 }); // Mock para simular fazenda encontrada
        Transacao.findOne.mockResolvedValue({ id: 1 }); // Mock para simular fazenda vendida

        const response = await request(app)
            .post('/transacao')
            .send({ cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-10', valor: 100 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Esta fazenda já foi vendida');
    });

    it('should call next if the request is valid', async () => { // Testa se a transação é válida
        Cliente.findByPk.mockResolvedValue({ id: 1 }); // Mock para simular cliente encontrado
        Fazenda.findByPk.mockResolvedValue({ id: 1 }); // Mock para simular fazenda encontrada
        Transacao.findOne.mockResolvedValue(null); // Mock para simular fazenda não vendida

        const response = await request(app)
            .post('/transacao')
            .send({ cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-10', valor: 100 });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Transação válida');
    });

    it('should return 500 if there is an internal server error', async () => { // Testa se há um erro interno
        Cliente.findByPk.mockRejectedValue(new Error('Internal Server Error')); // Simula um erro interno

        const response = await request(app)
            .post('/transacao')
            .send({ cliente_id: 1, fazenda_id: 1, data_transacao: '2023-10-10', valor: 100 });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Erro no middleware de validação da transação: Internal Server Error');
    });
});