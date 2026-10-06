const Loan = require('../models/loan.model');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

class LoanService {

    async getAllLoans(userId) {
        return await Loan.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
    }

    async createLoan(loanData, userId) {

        const {
            applicant_name,
            amount,
            tenure_months,
            purpose,
            status
        } = loanData;

        if (!applicant_name || !amount || !tenure_months || !purpose) {
            throw new BadRequestError(
                'Applicant name, amount, tenure and purpose are required'
            );
        }

        if (Number(amount) <= 0) {
            throw new BadRequestError(
                'Loan amount must be greater than zero'
            );
        }

        if (Number(tenure_months) <= 0) {
            throw new BadRequestError(
                'Tenure must be greater than zero'
            );
        }

        return await Loan.create({
            applicant_name,
            amount,
            tenure_months,
            purpose,
            status: status || 'PENDING',
            user_id: userId
        });
    }

    async getLoanById(id, userId) {

        const loan = await Loan.findOne({
            where: { id, user_id: userId }
        });

        if (!loan) {
            throw new NotFoundError(
                `Loan with ID ${id} was not found`
            );
        }

        return loan;
    }

    async updateLoan(id, loanData, userId) {

        const loan = await Loan.findOne({
            where: { id, user_id: userId }
        });

        if (!loan) {
            throw new NotFoundError(
                `Loan with ID ${id} was not found`
            );
        }

        await loan.update(loanData);

        return loan;
    }

    async deleteLoan(id, userId) {

        const loan = await Loan.findOne({
            where: { id, user_id: userId }
        });

        if (!loan) {
            throw new NotFoundError(
                `Loan with ID ${id} was not found`
            );
        }

        await loan.destroy();

        return loan;
    }
}

module.exports = new LoanService();