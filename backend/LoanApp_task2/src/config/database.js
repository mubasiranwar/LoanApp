// The single source of truth for the database connection.
// - The app reads it through src/config/index.js  -> src/database/index.js
// - sequelize-cli reads this file directly (see .sequelizerc)
require('./env');

const connection = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions: process.env.NODE_ENV === 'production'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    logging: false
};

// sequelize-cli expects one entry per environment.
module.exports = {
    development: connection,
    test: connection,
    production: connection
};
