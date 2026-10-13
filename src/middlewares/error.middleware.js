const logger = require('../utils/logger');

function notFoundHandler(req, res, next) {
  if (req.accepts('html')) {
    return res.status(404).send('<h2>404 - Page Not Found</h2><p><a href="/">Return to Central Portal</a></p>');
  }
  res.status(404).json({ success: false, message: 'Resource not found.' });
}

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
