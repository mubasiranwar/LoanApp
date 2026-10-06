const loanService = require('../services/loan.service');
const HTTP_STATUS = require('../enums/httpStatus');

const getAllLoans = async (req, res, next) => {
    try {
        const loans = await loanService.getAllLoans(req.user.id);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: loans
        });
    } catch (error) {
        next(error);
    }
};

const createLoan = async (req, res, next) => {
    try {
        const loan = await loanService.createLoan(req.body, req.user.id);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'Loan application created successfully',
            data: loan
        });
    } catch (error) {
        next(error);
    }
};

const getLoanById = async (req, res, next) => {
    try {
        const loan = await loanService.getLoanById(
            req.params.id,
            req.user.id
        );

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: loan
        });
    } catch (error) {
        next(error);
    }
};

const updateLoan = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};

const deleteLoan = async (req, res, next) => {
    try {
        await loanService.deleteLoan(req.params.id, req.user.id);

        return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllLoans,
    createLoan,
    getLoanById,
    updateLoan,
    deleteLoan
};