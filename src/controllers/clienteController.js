const Cliente = require('../models/cliente');
const Joi = require('joi');

// Validação usando Joi para o formato do cliente
const clienteSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    telefone: Joi.string().optional(),
});

// Cria um novo cliente com validação
exports.createCliente = async (req, res) => {
    const { error } = clienteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar cliente: ' + error.message });
    }
};

// Obtém todos os clientes com paginação
exports.getAllClientes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const clientes = await Cliente.findAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter clientes: ' + error.message });
    }
};

// Obtém um cliente específico pelo ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;
    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID inválido: deve ser um número inteiro' });
    }

    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente: ' + error.message });
    }
};

// Atualiza um cliente existente com validação
exports.updateCliente = async (req, res) => {
    const { error } = clienteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        const updatedCliente = await cliente.update(req.body);
        res.json(updatedCliente);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar cliente: ' + error.message });
        }
    }
};

// Deleta um cliente existente
exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        await cliente.destroy();
        res.status(204).end();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'Erro ao deletar cliente: não se pode deletar um cliente que esteja envolvido em uma transação.' });
        } else {
            res.status(500).json({ error: 'Erro ao deletar cliente: ' + error.message });
        }
    }
};
