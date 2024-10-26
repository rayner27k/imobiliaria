const request = require('supertest');
const app = require('../app');

describe('Test the root path', () => {
    test('It should respond with a 200 status code for the root path', async () => {
        const response = await request(app).get('/'); // Faz uma requisição GET para a raiz
        expect(response.statusCode).toBe(200); // Verifica se o código de status é 200
        expect(response.text).toContain('Desejo-lhe boas-vindas à API de Gestão de Fazendas!'); // Verifica o conteúdo da resposta
    });
});

describe('Test the /clientes route', () => {
    test('It should respond with a 200 status code', async () => {
        const response = await request(app).get('/clientes'); // Faz uma requisição GET para /clientes
        expect(response.statusCode).toBe(200); // Verifica se o código de status é 200
    });
});

describe('Test the /fazendas route', () => {
    test('It should respond with a 200 status code', async () => {
        const response = await request(app).get('/fazendas'); // Faz uma requisição GET para /fazendas
        expect(response.statusCode).toBe(200); // Verifica se o código de status é 200
    });
});

describe('Test the /transacoes route', () => {
    test('It should respond with a 200 status code', async () => {
        const response = await request(app).get('/transacoes'); // Faz uma requisição GET para /transacoes
        expect(response.statusCode).toBe(200); // Verifica se o código de status é 200
    });
});

describe('Test invalid routes', () => {
    test('It should respond with a 404 status code and custom error message for an invalid route', async () => {
        const response = await request(app).get('/rota-invalida'); // Faz uma requisição para uma rota inexistente
        expect(response.statusCode).toBe(404); // Verifica se o código de status é 404
        expect(response.text).toContain('Rota não encontrada, a URL solicitada não existe. Verifique o endereço e tente novamente.'); // Verifica a mensagem de erro personalizada
        expect(response.text).toContain('/api-docs'); // Verifica se o link para /api-docs está presente na resposta
    });
});
