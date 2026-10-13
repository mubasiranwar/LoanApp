const sequelize = require('../src/database');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
}

testConnection();
