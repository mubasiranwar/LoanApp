const express = require('express');

const {
    getAllLoans,
    createLoan,
    getLoanById,
    updateLoan,
    deleteLoan,
    updateLoanStatus
} = require('../controllers/loan.controller');

const validateRequest = require('../middleware/validate-request.middleware');
const authenticateToken = require('../middleware/authenticate-token.middleware');
const requireRole = require('../middleware/require-role.middleware');
const { USER_ROLE } = require('../enums/user-role.enum');

const {
    createLoanSchema,
    updateLoanSchema,
    updateLoanStatusSchema,
    loanListQuerySchema,
    loanIdParamSchema
} = require('../schemas/loan.schema');

const router = express.Router();

// Every loan route needs a logged-in user.
router.use(authenticateToken);

const validateLoanId = validateRequest(loanIdParamSchema, 'params');

router.get('/', validateRequest(loanListQuerySchema, 'query'), getAllLoans);

// Applicants create loans. Admins review them, so they cannot create one
// (otherwise an admin could approve their own application).
router.post(
    '/',
    requireRole(USER_ROLE.USER),
    validateRequest(createLoanSchema),
    createLoan
);

// Admin only: approve or reject.
router.patch(
    '/:id/status',
    requireRole(USER_ROLE.ADMIN),
    validateLoanId,
    validateRequest(updateLoanStatusSchema),
    updateLoanStatus
);

router.get('/:id', validateLoanId, getLoanById);

router.put(
    '/:id',
    validateLoanId,
    validateRequest(updateLoanSchema),
    updateLoan
);

router.delete('/:id', validateLoanId, deleteLoan);

module.exports = router;
