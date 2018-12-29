/** @format */

'use strict';

const fs = require('fs');
const path = require('path');
const { send } = require('micro');
const log = require('./log');

// Access the logLine function
const { logLine } = log;

const mime = {
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const favicon = (faviconFilename, faviconPattern) => {
  const filename = path.resolve(faviconFilename);
  let pattern = faviconPattern || /\/favicon\.(png|ico)$/;
  return fn => (req, res) => {
    if (pattern.test(req.url)) {
      logLine(
        { headers: req.headers, query: req.query },
        `> ${req.method} ${req.url}`,
        'Debug'
      );
      const ext = path.extname(filename);
      res.setHeader('Content-Type', mime[ext]);
      // Send the response to start streaming
      return send(res, 200, fs.createReadStream(filename));
    } else {
      return fn(req, res);
    }
  };
};

module.exports = favicon;
