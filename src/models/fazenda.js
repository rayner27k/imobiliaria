const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

class Fazenda extends Model {}

Fazenda.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    localizacao: {
        type: DataTypes.GEOMETRY('MultiPolygon', 4326),
        allowNull: false,
    },
    area: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Fazenda',
    tableName: 'fazendas',
    timestamps: false,
});

module.exports = Fazenda;
