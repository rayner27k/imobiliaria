const Transacao = require('../models/transacao');
const Cliente = require('../models/cliente');
const Fazenda = require('../models/fazenda');
const Joi = require('joi');

// Validação usando Joi para o modelo Transacao
const transacaoSchema = Joi.object({
    cliente_id: Joi.number().integer().required(), // ID do cliente é obrigatório
    fazenda_id: Joi.number().integer().required(), // ID da fazenda é obrigatório
    data_transacao: Joi.date().required(), // Data da transação é obrigatória
    valor: Joi.number().positive().required(), // Valor da transação é positivo e obrigatório
});

// Cria uma nova transação com validação e verificações adicionais
exports.createTransacao = async (req, res) => {
    const { error } = transacaoSchema.validate(req.body); // Valida os dados da transação
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    try {
        // Verifica se o cliente existe
        const cliente = await Cliente.findByPk(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro se não encontrado
        }

        // Verifica se a fazenda existe
        const fazenda = await Fazenda.findByPk(req.body.fazenda_id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' }); // Retorna erro se não encontrado
        }

        // Verifica se a fazenda já foi vendida
        const transacaoExistente = await Transacao.findOne({ where: { fazenda_id: req.body.fazenda_id } });
        if (transacaoExistente) {
            return res.status(400).json({ error: 'Esta fazenda já foi vendida' }); // Retorna erro se a fazenda já foi vendida
        }

        const transacao = await Transacao.create(req.body); // Cria a transação
        res.status(201).json(transacao); // Retorna a transação criada
    } catch (error) {
        console.error('Error creating transaction:', error); // Loga o erro para depuração
        res.status(500).json({ error: 'Erro ao criar transação: ' + error.message }); // Erro ao criar transação
    }
};

// Obtém todas as transações com paginação
exports.getAllTransacoes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Padrões para paginação
    try {
        const transacoes = await Transacao.findAll({
            limit: parseInt(limit), // Limita a quantidade de transações retornadas
            offset: (page - 1) * limit, // Calcula o offset para a página
        });
        res.json(transacoes); // Retorna a lista de transações
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter transações: ' + error.message }); // Erro ao obter transações
    }
};

// Atualiza uma transação existente com validação e verificações adicionais
exports.updateTransacao = async (req, res) => {
    const { error } = transacaoSchema.validate(req.body); // Valida os dados da transação
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    try {
        const transacao = await Transacao.findByPk(req.params.id); // Busca a transação pelo ID
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' }); // Retorna erro se não encontrado
        }

        // Verifica se o cliente existe
        const cliente = await Cliente.findByPk(req.body.cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro se não encontrado
        }

        // Verifica se a fazenda existe
        const fazenda = await Fazenda.findByPk(req.body.fazenda_id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' }); // Retorna erro se não encontrado
        }

        await transacao.update(req.body); // Atualiza a transação
        res.json(transacao); // Retorna a transação atualizada
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message }); // Erro de validação
        } else {
            res.status(500).json({ error: 'Erro ao atualizar transação: ' + error.message }); // Erro ao atualizar transação
        }
    }
};

// Deleta uma transação existente
exports.deleteTransacao = async (req, res) => {
    try {
        const transacao = await Transacao.findByPk(req.params.id); // Busca a transação pelo ID
        if (!transacao) {
            return res.status(404).json({ error: 'Transação não encontrada' }); // Retorna erro se não encontrado
        }
        await transacao.destroy(); // Deleta a transação
        res.status(204).end(); // Retorna resposta 204 (sem conteúdo)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar transação: ' + error.message }); // Erro ao deletar transação
    }
};
