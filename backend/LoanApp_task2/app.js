const express = require('express');
const cors = require('cors');
const config = require('./src/config');
const routes = require('./src/routes');
const errorMiddleware = require('./src/middleware/error.middleware');

const app = express();

if (!config.jwtSecret) {
    throw new Error('JWT_SECRET must be set before starting the API');
}

app.use(cors({
    origin: config.frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Loan Application API is running'
    });
});

// Error middleware must come after routes
app.use(errorMiddleware);

app.listen(config.port, () => {
    console.log(
        `Server running on http://localhost:${config.port}`
    );
});