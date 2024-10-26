const request = require('supertest');
const express = require('express');
const fazendaController = require('../controllers/fazendaController');
const Fazenda = require('../models/fazenda');

const app = express();
app.use(express.json());

app.post('/fazendas', fazendaController.createFazenda);
app.get('/fazendas', fazendaController.getAllFazendas);
app.put('/fazendas/:id', fazendaController.updateFazenda);
app.delete('/fazendas/:id', fazendaController.deleteFazenda);

// Mock do modelo Fazenda para simular o comportamento sem acessar o banco de dados
jest.mock('../models/fazenda');

describe('Fazenda Controller', () => {
    describe('createFazenda', () => {
        it('should create a new fazenda', async () => {
            const newFazenda = { nome: 'Fazenda Teste', localizacao: 'POINT(1 1)', area: 100 };
            Fazenda.create.mockResolvedValue(newFazenda); // Mock do método create

            const response = await request(app) // Faz a requisição POST para criar uma nova fazenda
                .post('/fazendas')
                .send(newFazenda);

            expect(response.status).toBe(201); // Verifica se o status da resposta é 201
            expect(response.body).toEqual(newFazenda); // Verifica se o corpo da resposta é igual ao esperado
        });

        it('should return 400 if validation fails', async () => {
            const invalidFazenda = { nome: '', localizacao: 'POINT(1 1)', area: 100 }; // nome vazio

            const response = await request(app)
                .post('/fazendas')
                .send(invalidFazenda);

            expect(response.status).toBe(400); // Verifica se o status da resposta é 400
            expect(response.body.error).toBeDefined(); // Verifica se a mensagem de erro está definida
        });

        it('should return 500 if there is a server error', async () => {
            const newFazenda = { nome: 'Fazenda Teste', localizacao: 'POINT(1 1)', area: 100 };
            Fazenda.create.mockRejectedValue(new Error('Server error')); // Simula um erro ao criar

            const response = await request(app)
                .post('/fazendas')
                .send(newFazenda);

            expect(response.status).toBe(500); // Verifica se o status da resposta é 500
            expect(response.body.error).toBe('Erro ao criar fazenda: Server error'); // Verifica a mensagem de erro
        });
    });

    describe('getAllFazendas', () => {
        it('should get all fazendas with pagination', async () => {
            const fazendas = [{ nome: 'Fazenda 1', localizacao: 'POINT(1 1)', area: 100 }];
            Fazenda.findAll.mockResolvedValue(fazendas); // Mock do método findAll

            const response = await request(app).get('/fazendas?page=1&limit=10');

            expect(response.status).toBe(200); // Verifica se o status da resposta é 200
            expect(response.body).toEqual(fazendas); // Verifica se o corpo da resposta é igual ao esperado
        });

        it('should return 500 if there is a server error', async () => {
            Fazenda.findAll.mockRejectedValue(new Error('Server error')); // Simula um erro ao obter

            const response = await request(app).get('/fazendas?page=1&limit=10');

            expect(response.status).toBe(500); // Verifica se o status da resposta é 500
            expect(response.body.error).toBe('Erro ao obter fazendas: Server error'); // Verifica a mensagem de erro
        });
    });

    describe('updateFazenda', () => {
        it('should update an existing fazenda', async () => {
            const updatedFazenda = { nome: 'Fazenda Atualizada', localizacao: 'POINT(1 1)', area: 200 };
            const fazenda = { 
                update: jest.fn().mockResolvedValue(updatedFazenda), // Mock do método update
                get: jest.fn().mockReturnValue(updatedFazenda) // Retorna a fazenda atualizada
            };
            Fazenda.findByPk.mockResolvedValue(fazenda); // Mock do método findByPk
    
            const response = await request(app)
                .put('/fazendas/1')
                .send(updatedFazenda);
    
            expect(response.status).toBe(200); // Verifica se o status da resposta é 200
            expect(response.body).toEqual(updatedFazenda); // Verifica se o corpo da resposta é igual ao esperado
        });

        it('should return 400 if validation fails', async () => {
            const invalidFazenda = { nome: '', localizacao: 'POINT(1 1)', area: 200 }; // nome vazio

            const response = await request(app)
                .put('/fazendas/1')
                .send(invalidFazenda);

            expect(response.status).toBe(400); // Verifica se o status da resposta é 400
            expect(response.body.error).toBeDefined(); // Verifica se a mensagem de erro está definida
        });

        it('should return 404 if fazenda is not found', async () => {
            Fazenda.findByPk.mockResolvedValue(null); // Simula que a fazenda não foi encontrada

            const response = await request(app)
                .put('/fazendas/1')
                .send({ nome: 'Fazenda Atualizada', localizacao: 'POINT(1 1)', area: 200 });

            expect(response.status).toBe(404); // Verifica se o status da resposta é 404
            expect(response.body.error).toBe('Fazenda não encontrada'); // Verifica a mensagem de erro
        });

        it('should return 500 if there is a server error', async () => {
            Fazenda.findByPk.mockRejectedValue(new Error('Server error')); // Simula um erro ao buscar a fazenda

            const response = await request(app)
                .put('/fazendas/1')
                .send({ nome: 'Fazenda Atualizada', localizacao: 'POINT(1 1)', area: 200 });

            expect(response.status).toBe(500); // Verifica se o status da resposta é 500
            expect(response.body.error).toBe('Erro ao atualizar fazenda: Server error'); // Verifica a mensagem de erro
        });
    });

    describe('deleteFazenda', () => {
        it('should delete an existing fazenda', async () => {
            const fazenda = { destroy: jest.fn().mockResolvedValue() }; // Mock do método destroy
            Fazenda.findByPk.mockResolvedValue(fazenda); // Mock do método findByPk

            const response = await request(app).delete('/fazendas/1');

            expect(response.status).toBe(204); // Verifica se o status da resposta é 204 (sem conteúdo)
        });

        it('should return 404 if fazenda is not found', async () => {
            Fazenda.findByPk.mockResolvedValue(null); // Simula que a fazenda não foi encontrada

            const response = await request(app).delete('/fazendas/1');

            expect(response.status).toBe(404); // Verifica se o status da resposta é 404
            expect(response.body.error).toBe('Fazenda não encontrada'); // Verifica a mensagem de erro
        });

        it('should return 500 if there is a server error', async () => {
            Fazenda.findByPk.mockRejectedValue(new Error('Server error')); // Simula um erro ao buscar a fazenda

            const response = await request(app).delete('/fazendas/1');

            expect(response.status).toBe(500); // Verifica se o status da resposta é 500
            expect(response.body.error).toBe('Erro ao deletar fazenda: Server error'); // Verifica a mensagem de erro
        });
    });
});
