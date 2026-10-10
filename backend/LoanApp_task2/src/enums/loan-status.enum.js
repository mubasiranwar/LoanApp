const LOAN_STATUS = Object.freeze({
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
});

// ['PENDING', 'APPROVED', 'REJECTED'] - handy for ENUM columns and Joi .valid(...)
const LOAN_STATUS_VALUES = Object.freeze(Object.values(LOAN_STATUS));

module.exports = {
    LOAN_STATUS,
    LOAN_STATUS_VALUES
};
