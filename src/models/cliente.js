const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

class Cliente extends Model {}

Cliente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: false,
});

module.exports = Cliente;
