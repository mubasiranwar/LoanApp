const { Sequelize } = require('sequelize');
const config = require('../config');

// config.database already has username/password/database/host/port/dialect/logging
const sequelize = new Sequelize(config.database);

module.exports = sequelize;
