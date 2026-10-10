
'use strict';

// .env is already loaded by sequelize-cli through src/config/database.js

const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const { USER_ROLE } = require('../../enums/user-role.enum');

const BCRYPT_ROUNDS = 12;

module.exports = {
    async up(queryInterface) {
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !email || !password) {
            throw new Error(
                'ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured'
            );
        }

        if (Buffer.byteLength(password, 'utf8') > 72) {
            throw new Error('Admin password must not exceed 72 UTF-8 bytes');
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [existingUsers] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = :email LIMIT 1`,
            {
                replacements: { email: normalizedEmail }
            }
        );

        if (existingUsers.length > 0) {
            throw new Error(
                'An account with ADMIN_EMAIL already exists. Verify its role before continuing.'
            );
        }

        const password_hash = await bcrypt.hash(
            password,
            BCRYPT_ROUNDS
        );

        await queryInterface.bulkInsert('users', [{
            id: randomUUID(),
            username: username.trim(),
            email: normalizedEmail,
            password_hash,
            role: USER_ROLE.ADMIN,
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },

    async down(queryInterface) {
        const email = process.env.ADMIN_EMAIL;

        if (!email) {
            throw new Error('ADMIN_EMAIL is required to undo the admin seeder');
        }

        await queryInterface.bulkDelete('users', {
            email: email.trim().toLowerCase(),
            role: USER_ROLE.ADMIN
        });
    }
};