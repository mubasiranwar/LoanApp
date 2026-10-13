require('./env');
const databaseConfigs = require('./database');

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET;

if (!databaseConfigs[nodeEnv]) {
    throw new Error(`No database configuration found for NODE_ENV="${nodeEnv}"`);
}

if (!jwtSecret) {
    throw new Error('JWT_SECRET must be set before starting the API');
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
    jwtSecret,

    database: databaseConfigs[nodeEnv]
};
