const AppError = require('./AppError');
const HTTP_STATUS = require('../enums/httpStatus');

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

module.exports = NotFoundError;