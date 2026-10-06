const AppError = require('./AppError');
const HTTP_STATUS = require('../enums/httpStatus');

class ConflictError extends AppError {
    constructor(message = 'A record with these details already exists') {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

module.exports = ConflictError;
