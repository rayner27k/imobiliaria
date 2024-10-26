const Fazenda = require('../models/fazenda');
const Joi = require('joi');
const { sequelize } = require('../database/database');

// Validação usando Joi para o modelo Fazenda
const fazendaSchema = Joi.object({
    nome: Joi.string().required(), // Nome da fazenda é obrigatório
    localizacao: Joi.string().required(), // Localização é obrigatória, pode precisar de formato específico para GEOMETRY
    area: Joi.number().required(), // Área da fazenda é obrigatória
});

// Cria uma nova fazenda com validação
exports.createFazenda = async (req, res) => {
    const { error } = fazendaSchema.validate(req.body); // Valida os dados da fazenda
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    const { nome, localizacao, area } = req.body;

    try {
        // Converte a localização para geometria usando a função do Sequelize
        const geometry = sequelize.fn('ST_GeomFromText', localizacao, 4326);
        
        const fazenda = await Fazenda.create({
            nome,
            localizacao: geometry, // Armazena a geometria
            area,
        });
        res.status(201).json(fazenda); // Retorna a fazenda criada
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar fazenda: ' + error.message }); // Erro ao criar fazenda
    }
};

// Obtém todas as fazendas com paginação
exports.getAllFazendas = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Padrões para paginação
    try {
        const fazendas = await Fazenda.findAll({
            limit: parseInt(limit), // Limita a quantidade de fazendas retornadas
            offset: (page - 1) * limit, // Calcula o offset para a página
        });
        res.json(fazendas); // Retorna a lista de fazendas
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter fazendas: ' + error.message }); // Erro ao obter fazendas
    }
};

// Atualiza uma fazenda existente com validação
exports.updateFazenda = async (req, res) => {
    const { error } = fazendaSchema.validate(req.body); // Valida os dados da fazenda
    if (error) {
        return res.status(400).json({ error: error.details[0].message }); // Retorna erro de validação
    }

    try {
        const fazenda = await Fazenda.findByPk(req.params.id); // Busca a fazenda pelo ID
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' }); // Retorna erro se não encontrado
        }

        // Constrói a geometria usando Sequelize
        const localizacao = sequelize.fn('ST_GeomFromText', req.body.localizacao, 4326);

        // Atualiza a fazenda
        await fazenda.update({
            nome: req.body.nome,
            localizacao,
            area: req.body.area
        });

        res.json({ ...fazenda.get(), localizacao: req.body.localizacao, area: req.body.area }); // Retorna a fazenda atualizada
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: 'Erro de validação: ' + error.message }); // Erro de validação
        } else {
            res.status(500).json({ error: 'Erro ao atualizar fazenda: ' + error.message }); // Erro ao atualizar fazenda
        }
    }
};

// Deleta uma fazenda existente
exports.deleteFazenda = async (req, res) => {
    try {
        const fazenda = await Fazenda.findByPk(req.params.id); // Busca a fazenda pelo ID
        if (!fazenda) {
            return res.status(404).json({ error: 'Fazenda não encontrada' }); // Retorna erro se não encontrado
        }
        await fazenda.destroy(); // Deleta a fazenda
        res.status(204).end(); // Retorna resposta 204 (sem conteúdo)
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'Erro ao deletar fazenda: não se pode deletar uma fazenda que esteja envolvida em uma transação.' }); // Erro de chave estrangeira
        } else {
            res.status(500).json({ error: 'Erro ao deletar fazenda: ' + error.message }); // Erro ao deletar fazenda
        }
    }
};
