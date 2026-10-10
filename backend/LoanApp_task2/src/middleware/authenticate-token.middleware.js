const jwt = require('jsonwebtoken');
const config = require('../config');
const UnauthorizedError = require('../errors/unauthorized.error');

function authenticateToken(req, res, next) {
    const authorization = req.get('authorization');
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
        return next(new UnauthorizedError('A valid Bearer token is required'));
    }

    if (!config.jwtSecret) {
        return next(new Error('JWT_SECRET is not configured'));
    }

    try {
        const claims = jwt.verify(match[1], config.jwtSecret, {
            algorithms: ['HS256']
        });

        if (
            typeof claims !== 'object' ||
            typeof claims.sub !== 'string' ||
            typeof claims.role !== 'string'
        ) {
            return next(new UnauthorizedError('The authentication token is invalid'));
        }

        req.user = {
            id: claims.sub,
            role: claims.role
        };

        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('The authentication token is invalid or expired'));
        }

        return next(error);
    }
}

module.exports = authenticateToken;
