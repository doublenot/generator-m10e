/** @format */

const { send } = require('micro');
const { statuses, statusesUrl } = require('./httpstatus');

module.exports = (res, error) => {
  const statusCode = error.statusCode || 500;
  return send(res, statusCode, {
    error: [
      {
        status: statusCode,
        title: `HTTP ${statusCode} ${statuses[statusCode]}`,
        detail: error.message,
        url: `${statusesUrl}${statusCode}`,
      },
    ],
  });
};
