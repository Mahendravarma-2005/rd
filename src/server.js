const app = require('./app');
const config = require('./config/environment');
const { initDB } = require('./config/db');
const logger = require('./utils/logger');

// Initialize database connection & table bootstrapping
initDB().catch(err => {
  logger.warn('Initial database connection failed. Server will retry in background: ' + err.message);
});

// Start unified server
const server = app.listen(config.PORT, () => {
  logger.info('========================================================');
  logger.info(` VFSTR Central R&D Server Active on Port: ${config.PORT}`);
  logger.info(` Central Landing Portal:   http://localhost:${config.PORT}/`);
});

module.exports = { app, server };
