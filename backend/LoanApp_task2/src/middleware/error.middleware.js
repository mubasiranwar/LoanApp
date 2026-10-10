const HTTP_STATUS = require('../enums/http-status.enum');
const AppError = require('../errors/app.error');
const BadRequestError = require('../errors/bad-request.error');

// Errors thrown by express.json() (body-parser) are not AppErrors. Translate the
// ones caused by the client into proper 4xx JSON responses instead of a 500.
const normalizeError = (err) => {
    if (err instanceof AppError) return err;

    if (err.type === 'entity.parse.failed') {
        return new BadRequestError('Request body contains malformed JSON');
    }

    if (err.type === 'entity.too.large') {
        return new AppError('Request body is too large', 413);
    }

    return err;
};

// The 4-argument signature is what tells Express this is an error handler.
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
    const error = normalizeError(err);
    const isOperationalError = error instanceof AppError;

    const statusCode = isOperationalError
        ? error.statusCode
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    // Only unexpected errors are interesting in the logs.
    if (!isOperationalError) {
        console.error(err);
    }

    return res.status(statusCode).json({
        success: false,
        message: isOperationalError ? error.message : 'Internal server error'
    });
};

module.exports = errorMiddleware;
