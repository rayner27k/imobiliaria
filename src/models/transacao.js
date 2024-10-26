const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/database'); // Importando corretamente

class Transacao extends Model {}

Transacao.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id',
        },
    },
    fazenda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fazendas',
            key: 'id',
        },
    },
    data_transacao: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL, // Mudando para DECIMAL para suportar valores monetários
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Transacao',
    tableName: 'transacoes',
    timestamps: false,
});

module.exports = Transacao;
