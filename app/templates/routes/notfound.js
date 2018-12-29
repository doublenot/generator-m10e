/** @format */

const processError = require('../lib/error');

module.exports = (req, res) => {
  const notFoundError = new Error(`API endpoint not found: ${req.url}`);
  notFoundError.statusCode = 404;
  return processError(res, notFoundError);
};
