const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const { USER_ROLE, USER_ROLE_VALUES } = require('../../enums/user-role.enum');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(...USER_ROLE_VALUES),
            allowNull: false,
            defaultValue: USER_ROLE.USER
        }
    },
    {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

module.exports = User;
