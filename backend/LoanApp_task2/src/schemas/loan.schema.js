const Joi = require('joi');
const { LOAN_STATUS } = require('../enums/loan-status.enum');

// NOTE: `status` is intentionally NOT part of the create/update schemas.
// Applicants can never choose it. New loans are always PENDING and only an
// admin can change the status (see updateLoanStatusSchema).
const createLoanSchema = Joi.object({
    applicant_name: Joi.string().trim().max(100).required(),
    amount: Joi.number().positive().required(),
    tenure_months: Joi.number().integer().positive().required(),
    purpose: Joi.string().trim().max(255).required()
});

const updateLoanSchema = Joi.object({
    applicant_name: Joi.string().trim().max(100),
    amount: Joi.number().positive(),
    tenure_months: Joi.number().integer().positive().max(360), // 30 years max
    purpose: Joi.string().trim().max(255)
}).min(1);

// Admin decision: approve or reject (a loan cannot be "decided" back to PENDING).
const updateLoanStatusSchema = Joi.object({
    status: Joi.string()
        .valid(LOAN_STATUS.APPROVED, LOAN_STATUS.REJECTED)
        .required()
});

const loanListQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

// Validates :id in the URL before it can reach PostgreSQL.
const loanIdParamSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
        'string.guid': 'Loan ID must be a valid UUID'
    })
});

module.exports = {
    createLoanSchema,
    updateLoanSchema,
    updateLoanStatusSchema,
    loanListQuerySchema,
    loanIdParamSchema
};
