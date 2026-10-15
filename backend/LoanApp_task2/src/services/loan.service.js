const { Loan, User } = require('../database/models');
const { LOAN_STATUS } = require('../enums/loan-status.enum');
const { USER_ROLE } = require('../enums/user-role.enum');
const NotFoundError = require('../errors/not-found.error');
const ConflictError = require('../errors/conflict.error');

// Input validation (required fields, positive numbers, UUIDs...) is done by the
// Joi schemas BEFORE a request gets here. This file only contains business rules.

const newestFirst = [['created_at', 'DESC']];

// Lets an admin see who submitted each loan.
const submittedBy = {
    model: User,
    as: 'user',
    attributes: ['id', 'username', 'email']
};

const isAdmin = (user) => user.role === USER_ROLE.ADMIN;

const loanNotFound = (id) => new NotFoundError(`Loan with ID ${id} was not found`);

// Business rule: once a loan is APPROVED or REJECTED the applicant can no longer change it.
const assertStillPending = (loan, action) => {
    if (loan.status !== LOAN_STATUS.PENDING) {
        throw new ConflictError(
            `A ${loan.status.toLowerCase()} loan application can no longer be ${action}`
        );
    }
};

class LoanService {
    // Admin: every loan.  Normal user: only their own.
    async getAllLoans(user, { page, limit }) {
        const where = isAdmin(user) ? undefined : { user_id: user.id };
        const options = {
            where,
            include: isAdmin(user) ? [submittedBy] : undefined,
            order: newestFirst,
            limit,
            offset: (page - 1) * limit
        };
        const [{ rows, count }, statusCounts] = await Promise.all([
            Loan.findAndCountAll(options),
            Loan.count({ where, group: ['status'] })
        ]);

        const summary = {
            total: count,
            pending: 0,
            approved: 0,
            rejected: 0
        };

        for (const { status, count: statusCount } of statusCounts) {
            summary[status.toLowerCase()] = Number(statusCount);
        }

        return {
            rows,
            count,
            page,
            limit,
            summary
        };
    }

    async createLoan({ applicant_name, amount, tenure_months, purpose }, userId) {
        return Loan.create({
            applicant_name,
            amount,
            tenure_months,
            purpose,
            status: LOAN_STATUS.PENDING, // always - the applicant cannot choose it
            user_id: userId
        });
    }

    async getLoanById(id, user) {
        const loan = isAdmin(user)
            ? await Loan.findByPk(id, { include: [submittedBy] })
            : await Loan.findOne({ where: { id, user_id: user.id } });

        if (!loan) {
            throw loanNotFound(id);
        }

        return loan;
    }

    // Only the owner can edit, and only while the loan is still PENDING.
    async updateLoan(id, loanData, userId) {
        const loan = await Loan.findOne({ where: { id, user_id: userId } });

        if (!loan) {
            throw loanNotFound(id);
        }

        assertStillPending(loan, 'edited');

        await loan.update(loanData);
        return loan;
    }

    // Only the owner can delete, and only while the loan is still PENDING.
    async deleteLoan(id, userId) {
        const loan = await Loan.findOne({ where: { id, user_id: userId } });

        if (!loan) {
            throw loanNotFound(id);
        }

        assertStillPending(loan, 'deleted');

        await loan.destroy();
        return loan;
    }

    // Admin-only; authorization is enforced by requireRole(ADMIN) on the route.
    // A decision is final: only a PENDING loan can be approved or rejected.
    async updateLoanStatus(id, status) {
        const loan = await Loan.findByPk(id);

        if (!loan) {
            throw loanNotFound(id);
        }

        if (loan.status !== LOAN_STATUS.PENDING) {
            throw new ConflictError(
                `This loan application has already been ${loan.status.toLowerCase()}`
            );
        }

        await loan.update({ status });
        return loan;
    }
}

module.exports = new LoanService();
