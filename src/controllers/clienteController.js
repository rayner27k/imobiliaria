const Cliente = require('../models/cliente');
const Joi = require('joi');

// Validação usando Joi para o formato do cliente
const clienteSchema = Joi.object({
    nome: Joi.string().required(), // Nome do cliente é obrigatório
    email: Joi.string().email().required(), // Email do cliente é obrigatório e deve ser válido
    telefone: Joi.string().optional(), // Telefone é opcional
});

// Cria um novo cliente com validação
exports.createCliente = async (req, res) => {
    const { error } = clienteSchema.validate(req.body); // Valida os dados do cliente
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }
    try {
        const cliente = await Cliente.create(req.body); // Cria o cliente no banco de dados
        res.status(201).json(cliente); // Retorna o cliente criado
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente: ' + error.message }); // Erro ao criar cliente
    }
};

// Obtém todos os clientes com paginação
exports.getAllClientes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Padrões para paginação
    try {
        const clientes = await Cliente.findAll({
            limit: parseInt(limit), // Limita a quantidade de clientes retornados
            offset: (page - 1) * limit, // Calcula o offset para a página
        });
        res.json(clientes); // Retorna a lista de clientes
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter clientes: ' + error.message }); // Erro ao obter clientes
    }
};

// Atualiza um cliente existente com validação
exports.updateCliente = async (req, res) => {
    const { error } = clienteSchema.validate(req.body); // Valida os dados do cliente
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    try {
        const cliente = await Cliente.findByPk(req.params.id); // Busca o cliente pelo ID
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro se não encontrado
        }
        const updatedCliente = await cliente.update(req.body); // Atualiza o cliente
        res.json(updatedCliente); // Retorna o cliente atualizado
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message }); // Erro de validação
        } else {
            res.status(500).json({ error: 'Erro ao atualizar cliente: ' + error.message }); // Erro ao atualizar cliente
        }
    }
};

// Deleta um cliente existente
exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id); // Busca o cliente pelo ID
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro se não encontrado
        }
        await cliente.destroy(); // Deleta o cliente
        res.status(204).end(); // Retorna resposta 204 (sem conteúdo)
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'Erro ao deletar cliente: não se pode deletar um cliente que esteja envolvido em uma transação.' }); // Erro de chave estrangeira
        } else {
            res.status(500).json({ error: 'Erro ao deletar cliente: ' + error.message }); // Erro ao deletar cliente
        }
    }
};
