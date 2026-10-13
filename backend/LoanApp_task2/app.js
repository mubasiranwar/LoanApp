const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const helmet = require('helmet');
const routes = require('./src/routes');
const notFoundMiddleware = require('./src/middleware/not-found.middleware');
const errorMiddleware = require('./src/middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({
    // An array of allowed origins (FRONTEND_URL may be a comma-separated list).
    origin: config.frontendUrls,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Loan Application API is running'
    });
});

app.use('/api', routes);

// Order matters: unknown routes -> 404 handler -> error handler (always last).
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
