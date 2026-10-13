'use strict';

const { randomUUID } = require('crypto');
const { LOAN_STATUS } = require('../../enums/loan-status.enum');
const { USER_ROLE } = require('../../enums/user-role.enum');

module.exports = {
    async up(queryInterface) {
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (!email) {
            throw new Error('ADMIN_EMAIL must be configured before seeding loans');
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
                'Seed the configured admin account before seeding sample loans'
            );
        }

        await queryInterface.bulkInsert('loans', [
            {
                id: randomUUID(),
                user_id: admin.id,
                applicant_name: 'Ahmed Khan',
                amount: 750000.00,
                tenure_months: 36,
                purpose: 'Small business expansion',
                status: LOAN_STATUS.APPROVED,
                created_at: new Date('2026-01-15'),
                updated_at: new Date('2026-01-15')
            },

            {
                id: randomUUID(),
                user_id: admin.id,
                applicant_name: 'Fatima Ali',
                amount: 350000.00,
                tenure_months: 24,
                purpose: 'Education expenses',
                status: LOAN_STATUS.PENDING,
                created_at: new Date('2026-02-20'),
                updated_at: new Date('2026-02-20')
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('loans', null, {});
    }
};