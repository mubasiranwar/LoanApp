const ForbiddenError = require('../errors/forbidden.error');

// Usage: requireRole(USER_ROLE.ADMIN)   or   requireRole(USER_ROLE.USER, USER_ROLE.ADMIN)
// Must run AFTER authenticateToken, because it relies on req.user.
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError());
        }

        return next();
    };
};

module.exports = requireRole;
