// The only place in the project where .env is loaded.
// Every other config file requires this one first, so it runs exactly once
// (Node caches modules) - for the API *and* for sequelize-cli.
require('dotenv').config();
