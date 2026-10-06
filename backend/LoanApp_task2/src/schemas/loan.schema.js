const Joi = require('joi');

const createLoanSchema = Joi.object({
    applicant_name: Joi.string()
        .max(100)
        .required(),

    amount: Joi.number()
        .positive()
        .required(),

    tenure_months: Joi.number()
        .integer()
        .positive()
        .required(),

    purpose: Joi.string()
        .max(255)
        .required(),

    status: Joi.string()
        .valid('PENDING', 'APPROVED', 'REJECTED')
        .optional()
});

const updateLoanSchema = Joi.object({
    applicant_name: Joi.string()
        .max(100),

    amount: Joi.number()
        .positive(),

    tenure_months: Joi.number()
        .integer()
        .positive(),

    purpose: Joi.string()
        .max(255),

    status: Joi.string()
        .valid('PENDING', 'APPROVED', 'REJECTED')
}).min(1);

module.exports = {
    createLoanSchema,
    updateLoanSchema
};