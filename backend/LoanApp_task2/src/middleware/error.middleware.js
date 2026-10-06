const HTTP_STATUS = require('../enums/httpStatus');
const AppError = require('../errors/AppError');

const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    const isOperationalError = err instanceof AppError;
    const statusCode = isOperationalError
        ? err.statusCode
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message: isOperationalError
            ? err.message
            : 'Internal server error'
    });
};

module.exports = errorMiddleware;