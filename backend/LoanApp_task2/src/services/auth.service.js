const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const config = require('../config');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/user.model');

const BCRYPT_ROUNDS = 12;
const TOKEN_LIFETIME = '8h';

function publicUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };
}

function createToken(user) {
    if (!config.jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        {
            role: user.role
        },
        config.jwtSecret,
        {
            algorithm: 'HS256',
            subject: user.id,
            expiresIn: TOKEN_LIFETIME
        }
    );
}

function createAuthResponse(user) {
    return {
        token: createToken(user),
        user: publicUser(user)
    };
}

class AuthService {
    async signup({ username, email, password }) {
        if (Buffer.byteLength(password, 'utf8') > 72) {
            throw new BadRequestError('Password must be no more than 72 UTF-8 bytes');
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            throw new ConflictError('An account with this email already exists');
        }

        const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        try {
            const user = await User.create({
                username: username.trim(),
                email: normalizedEmail,
                password_hash,
                role: 'USER'
            });

            return createAuthResponse(user);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictError('An account with this email already exists');
            }
            throw error;
        }
    }

    async login({ email, password }) {
        if (Buffer.byteLength(password, 'utf8') > 72) {
            throw new UnauthorizedError('Email or password is incorrect');
        }

        const user = await User.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            throw new UnauthorizedError('Email or password is incorrect');
        }

        return createAuthResponse(user);
    }

    async getProfile(userId) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new UnauthorizedError('The account for this token no longer exists');
        }

        return publicUser(user);
    }
}

module.exports = new AuthService();
