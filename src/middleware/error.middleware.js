const ApiResponse = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json(ApiResponse.error(message, null, statusCode));
}

function notFoundHandler(req, res) {
  res.status(404).json(ApiResponse.error(`Route ${req.method} ${req.originalUrl} not found`, null, 404));
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
