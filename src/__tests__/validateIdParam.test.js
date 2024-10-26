const request = require('supertest');
const express = require('express');
const validateIdParam = require('../middlewares/validateIdParam');

const app = express();
// Define uma rota que utiliza o middleware de validação
app.use('/:id', validateIdParam, (req, res) => res.status(200).send('Valid ID'));

describe('validateIdParam Middleware', () => {
    it('should return 400 if id is not an integer', async () => {
        const response = await request(app).get('/abc'); // Tenta acessar uma rota com um ID inválido
        expect(response.status).toBe(400); // Verifica se o status da resposta é 400
        expect(response.body).toEqual({ error: 'ID deve ser um número inteiro' }); // Verifica a mensagem de erro
    });

    it('should return 400 if id is a float', async () => {
        const response = await request(app).get('/123.45'); // Tenta acessar uma rota com um ID float
        expect(response.status).toBe(400); // Verifica se o status da resposta é 400
        expect(response.body).toEqual({ error: 'ID deve ser um número inteiro' }); // Verifica a mensagem de erro
    });

    it('should call next if id is an integer', async () => {
        const response = await request(app).get('/123'); // Tenta acessar uma rota com um ID válido
        expect(response.status).toBe(200); // Verifica se o status da resposta é 200
        expect(response.text).toBe('Valid ID'); // Verifica se a resposta contém o texto esperado
    });
});
