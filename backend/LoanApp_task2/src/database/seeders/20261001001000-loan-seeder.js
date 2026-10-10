'use strict';

const { randomUUID } = require('crypto');
const { LOAN_STATUS } = require('../../enums/loan-status.enum');

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('loans', [
            {
                id: randomUUID(),
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