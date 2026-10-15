const loanService = require('../services/loan.service');
const HTTP_STATUS = require('../enums/http-status.enum');
const asyncHandler = require('../middleware/async-handler.middleware');

const getAllLoans = asyncHandler(async (req, res) => {
    const result = await loanService.getAllLoans(req.user, req.validatedQuery);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.rows,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.count,
            totalPages: Math.ceil(result.count / result.limit)
        },
        summary: result.summary
    });
});

const createLoan = asyncHandler(async (req, res) => {
    const loan = await loanService.createLoan(req.body, req.user.id);

    return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Loan application created successfully',
        data: loan
    });
});

const getLoanById = asyncHandler(async (req, res) => {
    const loan = await loanService.getLoanById(req.params.id, req.user);

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: loan
    });
});

const updateLoan = asyncHandler(async (req, res) => {
    const loan = await loanService.updateLoan(
        req.params.id,
        req.body,
        req.user.id
    );

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Loan application updated successfully',
        data: loan
    });
});

const deleteLoan = asyncHandler(async (req, res) => {
    await loanService.deleteLoan(req.params.id, req.user.id);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
});

const updateLoanStatus = asyncHandler(async (req, res) => {
    const loan = await loanService.updateLoanStatus(
        req.params.id,
        req.body.status
    );

    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Loan status updated successfully',
        data: loan
    });
});

module.exports = {
    getAllLoans,
    createLoan,
    getLoanById,
    updateLoan,
    deleteLoan,
    updateLoanStatus
};
