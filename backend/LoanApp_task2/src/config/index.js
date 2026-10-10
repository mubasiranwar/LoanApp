require('./env');
const databaseConfigs = require('./database');

const nodeEnv = process.env.NODE_ENV || 'development';

if (!databaseConfigs[nodeEnv]) {
    throw new Error(`No database configuration found for NODE_ENV="${nodeEnv}"`);
}

// "http://localhost:3000, http://localhost:3002" -> ['http://localhost:3000', 'http://localhost:3002']
const parseList = (value, fallback) => {
    const items = (value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return items.length > 0 ? items : fallback;
};

module.exports = {
    nodeEnv,
    port: process.env.PORT || 5000,
    frontendUrls: parseList(process.env.FRONTEND_URL, ['http://localhost:3000']),
    jwtSecret: process.env.JWT_SECRET,

    database: databaseConfigs[nodeEnv]
};
