const sequelize = require('../index');
const User = require('./user.model');
const Loan = require('./loan.model');

User.hasMany(Loan, { foreignKey: 'user_id', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
    sequelize,
    User,
    Loan
};
