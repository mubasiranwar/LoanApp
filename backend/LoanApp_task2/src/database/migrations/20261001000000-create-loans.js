'use strict';

const { LOAN_STATUS, LOAN_STATUS_VALUES } = require('../../enums/loan-status.enum');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('loans', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },

            applicant_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            amount: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },

            tenure_months: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            purpose: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM(...LOAN_STATUS_VALUES),
                allowNull: false,
                defaultValue: LOAN_STATUS.PENDING
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('loans');

        // PostgreSQL keeps ENUM types after dropping the table
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_loans_status";'
        );
    }
};