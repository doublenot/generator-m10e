/** @format */

'use strict';

const qs = require('querystring');
const url = require('url');

const querystring = fn => (req, res) => {
  if (!req.query) {
    req.query = qs.parse(url.parse(req.url).query);
  }
  return fn(req, res);
};

module.exports = querystring;
