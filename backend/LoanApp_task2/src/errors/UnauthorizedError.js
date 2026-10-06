const AppError = require('./AppError');
const HTTP_STATUS = require('../enums/httpStatus');

class UnauthorizedError extends AppError {
    constructor(message = 'Authentication is required') {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

module.exports = UnauthorizedError;
