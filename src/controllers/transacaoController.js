const Transacao = require('../models/transacao');
const Cliente = require('../models/cliente');
const Fazenda = require('../models/fazenda');
const Joi = require('joi');

// Validação usando Joi para o modelo Transacao
const transacaoSchema = Joi.object({
    cliente_id: Joi.number().integer().required(),
    fazenda_id: Joi.number().integer().required(),
    data_transacao: Joi.date().required(),
    valor: Joi.number().positive().required(),
});

// Cria uma nova transação com validação e verificações adicionais
exports.createTransacao = async (req, res) => {
    const { error } = transacaoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const cliente = await Cliente.findByPk(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const fazenda = await Fazenda.findByPk(req.body.fazenda_id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' });
        }

        const transacaoExistente = await Transacao.findOne({ where: { fazenda_id: req.body.fazenda_id } });
        if (transacaoExistente) {
            return res.status(400).json({ error: 'Esta fazenda já foi vendida' });
        }

        const transacao = await Transacao.create(req.body);
        res.status(201).json(transacao);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Erro ao criar transação: ' + error.message });
    }
};

// Obtém todas as transações com paginação
exports.getAllTransacoes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const transacoes = await Transacao.findAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });
        res.json(transacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter transações: ' + error.message });
    }
};

// Obtém uma transação específica pelo ID
exports.getTransacaoById = async (req, res) => {
    try {
        const transacao = await Transacao.findByPk(req.params.id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        res.json(transacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transação: ' + error.message });
    }
};

// Atualiza uma transação existente com validação e verificações adicionais
exports.updateTransacao = async (req, res) => {
    const { error } = transacaoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const transacao = await Transacao.findByPk(req.params.id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }

        const cliente = await Cliente.findByPk(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const fazenda = await Fazenda.findByPk(req.body.fazenda_id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' });
        }

        await transacao.update(req.body);
        res.json(transacao);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar transação: ' + error.message });
        }
    }
};

// Deleta uma transação existente
exports.deleteTransacao = async (req, res) => {
    try {
        const transacao = await Transacao.findByPk(req.params.id);
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        await transacao.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar transação: ' + error.message });
    }
};
