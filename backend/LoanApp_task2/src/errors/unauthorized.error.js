const AppError = require('./app.error');
const HTTP_STATUS = require('../enums/http-status.enum');

class UnauthorizedError extends AppError {
    constructor(message = 'Authentication is required') {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

module.exports = UnauthorizedError;
