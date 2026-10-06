const express = require('express');

const {
    getAllLoans,
    createLoan,
    getLoanById,
    updateLoan,
    deleteLoan
} = require('../controllers/loan.controller');

const validateRequest = require('../middleware/validate-request.middleware');
const authenticateToken = require('../middleware/authenticate-token.middleware');

const {
    createLoanSchema,
    updateLoanSchema
} = require('../schemas/loan.schema');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllLoans);

router.post(
    '/',
    validateRequest(createLoanSchema),
    createLoan
);

router.get('/:id', getLoanById);

router.put(
    '/:id',
    validateRequest(updateLoanSchema),
    updateLoan
);

router.delete('/:id', deleteLoan);

module.exports = router;