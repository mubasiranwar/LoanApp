const app = require('./app');
const config = require('./src/config');
const sequelize = require('./src/database');

async function startServer() {
    await sequelize.authenticate();
    return app.listen(config.port, '0.0.0.0', () => {
        console.log(`Server running on port ${config.port}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Unable to start the API:', error);
        process.exitCode = 1;
    });
}

module.exports = startServer;
