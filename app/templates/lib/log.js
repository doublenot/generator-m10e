/** @format */

'use strict';

// Packages
const { json, send } = require('micro');
const processError = require('./error');

let debug = () => {};
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  debug = require('debug')('m10e');
}

// Mapping for Log Severity
/*
  Debug
  Info
  Warning
  Error
  Critical
*/

const logLine = (
  data = {},
  message = '--Message--',
  severity = 'Debug',
  stackTrace
) => {
  const logMsg = {
    message,
    data,
    severity,
    timestamp: new Date().toISOString(),
  };
  if (stackTrace) {
    // eslint-disable-next-line camelcase
    logMsg.stack_trace =
      process.env.NODE_ENV === 'development'
        ? stackTrace.split('\n')
        : stackTrace;
  }

  if (process.env.NODE_ENV === 'development') {
    debug('%o', logMsg);
  } else {
    const logStr = JSON.stringify(logMsg);
    if (process.env.NODE_ENV === 'test') {
      return logStr;
    }
    console.log(logStr);
  }
};

const logRequest = async ({ req, limit }) => {
  logLine(
    { headers: req.headers, query: req.query },
    `> ${req.method} ${req.url}`,
    'Debug'
  );

  if (
    req.headers['content-length'] > 0 &&
    req.headers['content-type'].indexOf('application/json') === 0
  ) {
    try {
      await json(req, { limit });
    } catch (error) {
      logLine(
        {},
        `JSON body could not be parsed: ${error.message}`,
        'Error',
        error.stack.toString()
      );
    }
  }
};

const statusCodeSeverity = statusCode => {
  if (statusCode >= 500) {
    return 'Critical';
  }

  if (statusCode >= 400 && statusCode < 500) {
    return 'Warning';
  }

  if (statusCode >= 300 && statusCode < 400) {
    return 'Info';
  }

  if (statusCode >= 200 && statusCode < 300) {
    return 'Debug';
  }

  return statusCode;
};

const logResponse = ({ res, end, chunk }) => {
  const severity = statusCodeSeverity(res.statusCode);
  let stackTrace = '';
  let message = '';

  if (res.microErr) {
    stackTrace = res.microErr.stack.toString();
    message = ` ${res.microErr.message}`;
    logLine(
      { headers: res.getHeaders() },
      `< ${res.statusCode} [+${end}]${message}`,
      severity,
      stackTrace
    );
    return;
  }

  let body = chunk;
  const headers = res.getHeaders();
  if (
    headers['content-type'] &&
    headers['content-type'].indexOf('json') !== -1
  ) {
    try {
      body = JSON.parse(chunk);
    } catch (error) {
      let errorMessage = error.message;
      stackTrace = error.stack.toString();
      if (typeof chunk === 'string') {
        stackTrace = '';
        errorMessage = `${chunk.substr(0, 100)}${
          chunk.length > 100 ? '...' : ''
        }`;
      }
      logLine(
        { headers: res.getHeaders() },
        errorMessage,
        severity,
        stackTrace
      );
    }
  }

  // Log the response
  logLine(
    { headers, body },
    `< ${res.statusCode} [+${end}]${message}`,
    severity,
    stackTrace
  );
};

const initLog = async (req, res, limit) => {
  const start = new Date();
  const { end } = res;

  await logRequest({ req, limit });

  res.end = (chunk, encoding, callback) => {
    res.end = end;
    const endTime = new Date();
    const delta = endTime - start;
    const requestTime =
      delta < 10000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`;

    logResponse({
      res,
      start,
      end: requestTime,
      chunk,
    });

    return res.end(chunk, encoding, callback);
  };
};

const log = (fn, limit = '1mb') => async (req, res) => {
  await initLog(req, res, limit);

  try {
    return await fn(req, res);
  } catch (error) {
    res.microErr = error;
    return processError(res, error);
  }
};

// Export logLine
log.logLine = logLine;
module.exports = log;
