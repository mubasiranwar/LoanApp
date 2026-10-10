const NotFoundError = require('../errors/not-found.error');

// Registered after all routes: anything that reaches it matched no route.
const notFoundMiddleware = (req, res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} was not found`));
};

module.exports = notFoundMiddleware;
