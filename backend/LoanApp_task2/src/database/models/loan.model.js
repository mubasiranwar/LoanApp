const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const { LOAN_STATUS, LOAN_STATUS_VALUES } = require('../../enums/loan-status.enum');

const Loan = sequelize.define(
    'Loan',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },

        applicant_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        tenure_months: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        purpose: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(...LOAN_STATUS_VALUES),
            allowNull: false,
            defaultValue: LOAN_STATUS.PENDING
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        tableName: 'loans',

        timestamps: true,

        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

module.exports = Loan;
