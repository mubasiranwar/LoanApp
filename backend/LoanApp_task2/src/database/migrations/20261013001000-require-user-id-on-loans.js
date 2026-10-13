'use strict';

const { USER_ROLE } = require('../../enums/user-role.enum');

module.exports = {
    async up(queryInterface, Sequelize) {
        const [unassignedLoans] = await queryInterface.sequelize.query(
            'SELECT id FROM loans WHERE user_id IS NULL LIMIT 1'
        );

        if (unassignedLoans.length > 0) {
            const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
            if (!email) {
                throw new Error(
                    'ADMIN_EMAIL must be configured to associate existing unassigned loans before making user_id required'
                );
            }

            const [admins] = await queryInterface.sequelize.query(
                'SELECT id FROM users WHERE email = :email AND role = :role LIMIT 1',
                {
                    replacements: { email, role: USER_ROLE.ADMIN }
                }
            );
            const admin = admins[0];
            if (!admin) {
                throw new Error(
                    'The configured admin account must exist to associate existing unassigned loans'
                );
            }

            await queryInterface.sequelize.query(
                'UPDATE loans SET user_id = :userId WHERE user_id IS NULL',
                {
                    replacements: { userId: admin.id }
                }
            );
        }

        await queryInterface.changeColumn('loans', 'user_id', {
            type: Sequelize.UUID,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('loans', 'user_id', {
            type: Sequelize.UUID,
            allowNull: true
        });
    }
};
