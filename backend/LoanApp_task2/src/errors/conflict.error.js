const AppError = require('./app.error');
const HTTP_STATUS = require('../enums/http-status.enum');

class ConflictError extends AppError {
    constructor(message = 'A record with these details already exists') {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

module.exports = ConflictError;
