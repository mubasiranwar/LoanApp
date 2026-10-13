const express = require('express');
const { rateLimit } = require('express-rate-limit');
const {
    getProfile,
    login,
    signup
} = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/authenticate-token.middleware');
const validateRequest = require('../middleware/validate-request.middleware');
const {
    loginSchema,
    signupSchema
} = require('../schemas/auth.schema');

const router = express.Router();

const authRateLimit = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
    }
});

router.post('/signup', authRateLimit(), validateRequest(signupSchema), signup);
router.post('/login', authRateLimit(), validateRequest(loginSchema), login);
router.get('/me', authenticateToken, getProfile);

module.exports = router;
