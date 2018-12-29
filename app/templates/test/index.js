/** @format */

'use strict';

const listen = require('test-listen');
const micro = require('micro');
const test = require('ava');
const got = require('got');

require('async-to-gen/register')({ includes: /index\.js$/ });
const app = require('../app'); // eslint-disable-line import/order

let service = null;
let url = null;
test.before(async () => {
  service = micro(app);
  url = await listen(service);
});

// Test the healthcheck
test('check the heathcheck', async t => {
  const res = await got('/hc', {
    baseUrl: url,
    json: true,
    headers: { 'content-type': 'application/json' },
  });

  t.deepEqual(res.body, {
    alive: true,
  });
});

// Test the not found route
test('check the 404 not found', async t => {
  try {
    await got('/notfound', {
      baseUrl: url,
      json: true,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    t.is(error.statusCode, 404);
  }
});
