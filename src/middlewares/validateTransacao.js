const Cliente = require('../models/cliente');
const Fazenda = require('../models/fazenda');
const Transacao = require('../models/transacao');
const Joi = require('joi');

// Validação usando Joi para o formato da transação
const transacaoSchema = Joi.object({
    cliente_id: Joi.number().integer().required(), // ID do cliente
    fazenda_id: Joi.number().integer().required(), // ID da fazenda
    data_transacao: Joi.date().required(), // Data da transação
    valor: Joi.number().positive().required(), // Valor da transação
});

const validateTransacao = async (req, res, next) => {
    // Validação de formato dos dados com Joi
    const { error } = transacaoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    try {
        const { cliente_id, fazenda_id } = req.body;

        // Verifica se o cliente existe
        const cliente = await Cliente.findByPk(cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' }); // Retorna erro se não encontrado
        }

        // Verifica se a fazenda existe
        const fazenda = await Fazenda.findByPk(fazenda_id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' }); // Retorna erro se não encontrada
        }

        // Verifica se a fazenda já foi vendida
        const transacaoExistente = await Transacao.findOne({ where: { fazenda_id } });
        if (transacaoExistente) {
            return res.status(400).json({ error: 'Esta fazenda já foi vendida' }); // Retorna erro se já vendida
        }

        next(); // Prossegue para o próximo middleware
    } catch (error) {
        res.status(500).json({ error: 'Erro no middleware de validação da transação: ' + error.message }); // Retorna erro interno
    }
};

module.exports = validateTransacao;
