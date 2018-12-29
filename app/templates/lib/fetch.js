/** @format */

'use strict';

const fetch = require('node-fetch');
const log = require('./log');

// Access the logLine function
const { logLine } = log;

module.exports = async (method, url, headers = {}, body = {}) => {
  try {
    logLine({ headers, body }, `Fetch Data: ${method} ${url}`, 'Debug');
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const json = await response.json();
    logLine(
      { headers: response.headers.raw(), body: json, status: response.status },
      `Response Data From: ${method} ${url}`,
      'Debug'
    );
    if (response.status !== 200) {
      const asyncError = new Error(
        `HTTP ${response.status} ${response.statusText}`
      );
      asyncError.statusCode = response.status;
      asyncError.json = json;
      throw asyncError;
    }
    return json;
  } catch (error) {
    logLine({}, `${error}`, 'Error', error.stack.toString());
    throw error;
  }
};
