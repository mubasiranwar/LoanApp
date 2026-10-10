const HTTP_STATUS = require('../enums/http-status.enum');
const authService = require('../services/auth.service');
const asyncHandler = require('../middleware/async-handler.middleware');

const signup = asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);

    return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: result
    });
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
    });
});

const getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user
    });
});

module.exports = {
    signup,
    login,
    getProfile
};
