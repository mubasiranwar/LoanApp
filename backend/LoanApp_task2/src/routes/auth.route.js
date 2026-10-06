const express = require('express');
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

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', authenticateToken, getProfile);

module.exports = router;
