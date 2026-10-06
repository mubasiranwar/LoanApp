const HTTP_STATUS = require('../enums/httpStatus');
const authService = require('../services/auth.service');

const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: result
        });
    } catch (error) {
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: result
        });
    } catch (error) {
        return next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: user
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    signup,
    login,
    getProfile
};
