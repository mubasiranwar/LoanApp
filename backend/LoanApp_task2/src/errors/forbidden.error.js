
const AppError = require('./app.error');
const HTTP_STATUS = require('../enums/http-status.enum');

class ForbiddenError extends AppError {
    constructor(
        message = 'You do not have permission to perform this action'
    ) {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

module.exports = ForbiddenError;