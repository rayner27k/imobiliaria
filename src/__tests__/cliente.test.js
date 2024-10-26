const request = require('supertest');
const express = require('express');
const clienteController = require('../controllers/clienteController');
const Cliente = require('../models/cliente');

// Cria uma instância do Express
const app = express();
app.use(express.json());
app.post('/clientes', clienteController.createCliente);
app.get('/clientes', clienteController.getAllClientes);
app.put('/clientes/:id', clienteController.updateCliente);
app.delete('/clientes/:id', clienteController.deleteCliente);

jest.mock('../models/cliente'); // Mock do modelo Cliente

describe('Cliente Controller', () => {
    // Testes para o método createCliente
    describe('createCliente', () => {
        it('deve criar um novo cliente e retornar status 201', async () => {
            const newCliente = { nome: 'John Doe', email: 'john@example.com', telefone: '123456789' };
            Cliente.create.mockResolvedValue(newCliente); // Mock para simular a criação de um cliente

            const response = await request(app)
                .post('/clientes')
                .send(newCliente); // Faz uma requisição POST para criar um cliente

            expect(response.status).toBe(201); // Verifica se o status é 201
            expect(response.body).toEqual(newCliente); // Verifica se o corpo da resposta é igual ao cliente criado
        });

        it('deve retornar 400 se a validação falhar', async () => {
            const invalidCliente = { email: 'john@example.com' }; // Cliente inválido

            const response = await request(app)
                .post('/clientes')
                .send(invalidCliente); // Faz uma requisição POST com cliente inválido

            expect(response.status).toBe(400); // Verifica se o status é 400
            expect(response.body.error).toBeDefined(); // Verifica se a mensagem de erro está definida
        });

        it('deve retornar 500 se houver um erro no servidor', async () => {
            const newCliente = { nome: 'John Doe', email: 'john@example.com' };
            Cliente.create.mockRejectedValue(new Error('Server error')); // Simula um erro no servidor

            const response = await request(app)
                .post('/clientes')
                .send(newCliente);

            expect(response.status).toBe(500); // Verifica se o status é 500
            expect(response.body.error).toBe('Erro ao criar cliente: Server error'); // Verifica a mensagem de erro
        });
    });

    // Testes para o método getAllClientes
    describe('getAllClientes', () => {
        it('deve retornar todos os clientes com paginação', async () => {
            const clientes = [{ nome: 'John Doe', email: 'john@example.com', telefone: '123456789' }];
            Cliente.findAll.mockResolvedValue(clientes); // Mock para simular a busca de clientes

            const response = await request(app).get('/clientes?page=1&limit=10'); // Faz uma requisição GET para obter clientes

            expect(response.status).toBe(200); // Verifica se o status é 200
            expect(response.body).toEqual(clientes); // Verifica se o corpo da resposta é igual à lista de clientes
        });

        it('deve retornar 500 se houver um erro no servidor', async () => {
            Cliente.findAll.mockRejectedValue(new Error('Server error')); // Simula um erro no servidor

            const response = await request(app).get('/clientes?page=1&limit=10');

            expect(response.status).toBe(500); // Verifica se o status é 500
            expect(response.body.error).toBe('Erro ao obter clientes: Server error'); // Verifica a mensagem de erro
        });
    });

    // Testes para o método updateCliente
    describe('updateCliente', () => {
        it('deve atualizar um cliente existente e retornar status 200', async () => {
            const updatedCliente = { nome: 'John Doe', email: 'john@example.com', telefone: '123456789' };
    
            // Mock da instância Cliente e seu método update
            const mockCliente = {
                update: jest.fn().mockResolvedValue(updatedCliente), // Simula a atualização
            };
            
            // Mock do findByPk para retornar o cliente mockado
            Cliente.findByPk.mockResolvedValue(mockCliente);
    
            const response = await request(app)
                .put('/clientes/1') // Faz uma requisição PUT para atualizar o cliente
                .send(updatedCliente);
    
            expect(response.status).toBe(200); // Verifica se o status é 200
            expect(response.body).toEqual(updatedCliente); // Verifica se o corpo da resposta é igual ao cliente atualizado
            expect(mockCliente.update).toHaveBeenCalledWith(updatedCliente); // Verifica se update foi chamado com os argumentos corretos
        });

        it('deve retornar 400 se a validação falhar', async () => {
            const invalidCliente = { email: 'john@example.com' }; // Cliente inválido

            const response = await request(app)
                .put('/clientes/1') // Faz uma requisição PUT para atualizar o cliente
                .send(invalidCliente);

            expect(response.status).toBe(400); // Verifica se o status é 400
            expect(response.body.error).toBeDefined(); // Verifica se a mensagem de erro está definida
        });

        it('deve retornar 404 se o cliente não for encontrado', async () => {
            Cliente.findByPk.mockResolvedValue(null); // Simula que o cliente não foi encontrado

            const response = await request(app)
                .put('/clientes/1') // Faz uma requisição PUT
                .send({ nome: 'John Doe', email: 'john@example.com' });

            expect(response.status).toBe(404); // Verifica se o status é 404
            expect(response.body.error).toBe('Cliente não encontrado'); // Verifica a mensagem de erro
        });

        it('deve retornar 500 se houver um erro no servidor', async () => {
            Cliente.findByPk.mockRejectedValue(new Error('Server error')); // Simula um erro no servidor

            const response = await request(app)
                .put('/clientes/1') // Faz uma requisição PUT
                .send({ nome: 'John Doe', email: 'john@example.com' });

            expect(response.status).toBe(500); // Verifica se o status é 500
            expect(response.body.error).toBe('Erro ao atualizar cliente: Server error'); // Verifica a mensagem de erro
        });
    });

    // Testes para o método deleteCliente
    describe('deleteCliente', () => {
        it('deve deletar um cliente existente e retornar status 204', async () => {
            Cliente.findByPk.mockResolvedValue({
                destroy: jest.fn().mockResolvedValue(), // Simula a destruição do cliente
            });

            const response = await request(app).delete('/clientes/1'); // Faz uma requisição DELETE

            expect(response.status).toBe(204); // Verifica se o status é 204
        });

        it('deve retornar 404 se o cliente não for encontrado', async () => {
            Cliente.findByPk.mockResolvedValue(null); // Simula que o cliente não foi encontrado

            const response = await request(app).delete('/clientes/1'); // Faz uma requisição DELETE

            expect(response.status).toBe(404); // Verifica se o status é 404
            expect(response.body.error).toBe('Cliente não encontrado'); // Verifica a mensagem de erro
        });

        it('deve retornar 500 se houver um erro no servidor', async () => {
            Cliente.findByPk.mockRejectedValue(new Error('Server error')); // Simula um erro no servidor

            const response = await request(app).delete('/clientes/1'); // Faz uma requisição DELETE

            expect(response.status).toBe(500); // Verifica se o status é 500
            expect(response.body.error).toBe('Erro ao deletar cliente: Server error'); // Verifica a mensagem de erro
        });
    });
});
