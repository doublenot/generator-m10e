/** @format */

const { send } = require('micro');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  return send(res, 200, 'Ok');
};
