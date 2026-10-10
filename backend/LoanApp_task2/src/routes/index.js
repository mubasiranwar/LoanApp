const express = require('express');
const authRoutes = require('./auth.route');
const loanRoutes = require('./loan.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);

module.exports = router;