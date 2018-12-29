/** @format */

'use strict';

// const url = require('url');
// const connection = require('./connection');
const log = require('./log');

// Access the logLine function
const { logLine } = log;

const check = async () => {
  if (process.env.NODE_ENV === 'production') {
    logLine({ env: process.env }, 'Environment variables.', 'DEBUG');
  }

  // // Check the connections
  // try {
  //   const testUrl = url.parse(process.env.TEST_URL_CONNECTION);
  //   const timeout = 2000;
  //   const port = parseInt(testUrl.port || '80', 10);
  //   const host = testUrl.hostname;
  //   logLine(
  //     { port, host, timeout },
  //     'Checking connection to "TEST_URL_CONNECTION"',
  //     'DEBUG'
  //   );
  //   await connection(host, port, timeout);
  // } catch (error) {
  //   logLine(
  //     {},
  //     `Connection to "TEST_URL_CONNECTION" failed: ${error.message}`,
  //     'CRITICAL',
  //     error.stack.toString()
  //   );
  //   console.log('');
  //   // eslint-disable-next-line unicorn/no-process-exit
  //   process.exit(1);
  // }
};

module.exports = check;
