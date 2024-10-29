const Fazenda = require('../models/fazenda');
const Joi = require('joi');
const { sequelize } = require('../database/database');

// Validação usando Joi para o modelo Fazenda
const fazendaSchema = Joi.object({
    nome: Joi.string().required(),
    localizacao: Joi.string().required(),
    area: Joi.number().required(),
});

// Cria uma nova fazenda com validação
exports.createFazenda = async (req, res) => {
    const { error } = fazendaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { nome, localizacao, area } = req.body;

    try {
        const geometry = sequelize.fn('ST_GeomFromText', localizacao, 4326);
        const fazenda = await Fazenda.create({
            nome,
            localizacao: geometry,
            area,
        });
        res.status(201).json(fazenda);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar fazenda: ' + error.message });
    }
};

// Obtém todas as fazendas com paginação
exports.getAllFazendas = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const fazendas = await Fazenda.findAll({
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });
        res.json(fazendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter fazendas: ' + error.message });
    }
};

// Obtém uma única fazenda pelo ID
exports.getFazendaById = async (req, res) => {
    try {
        const fazenda = await Fazenda.findByPk(req.params.id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' });
        }
        res.json(fazenda);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter fazenda: ' + error.message });
    }
};

// Atualiza uma fazenda existente com validação
exports.updateFazenda = async (req, res) => {
    const { error } = fazendaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const fazenda = await Fazenda.findByPk(req.params.id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' });
        }

        const localizacao = sequelize.fn('ST_GeomFromText', req.body.localizacao, 4326);
        await fazenda.update({
            nome: req.body.nome,
            localizacao,
            area: req.body.area,
        });

        res.json({ ...fazenda.get(), localizacao: req.body.localizacao, area: req.body.area });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar fazenda: ' + error.message });
        }
    }
};

// Deleta uma fazenda existente
exports.deleteFazenda = async (req, res) => {
    try {
        const fazenda = await Fazenda.findByPk(req.params.id);
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' });
        }
        await fazenda.destroy();
        res.status(204).end();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'Erro ao deletar fazenda: não se pode deletar uma fazenda que esteja envolvida em uma transação.' });
        } else {
            res.status(500).json({ error: 'Erro ao deletar fazenda: ' + error.message });
        }
    }
};
