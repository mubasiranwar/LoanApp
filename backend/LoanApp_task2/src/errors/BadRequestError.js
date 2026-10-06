const AppError = require('./AppError');
const HTTP_STATUS = require('../enums/httpStatus');

class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

module.exports = BadRequestError;