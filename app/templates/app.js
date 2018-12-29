/** @format */

const path = require('path');
const compose = require('micro-compose');
const { router, get, all } = require('./lib/router');
const checkConnections = require('./lib/check');
const querystring = require('./lib/querystring');
const favicon = require('./lib/favicon');
const log = require('./lib/log');
const hc = require('./routes/healthcheck');
const notfound = require('./routes/notfound');

// Access the logLine function
const { logLine } = log;

// Check the connections
checkConnections();

const routes = [
  // Endpoint for healthcheck
  get('/hc', hc),
  // Endpoint for not found
  all('/*', notfound),
];

// Construct the router
const appRouter = router();
const configuredRoutes = appRouter.configure(...routes);

// Log the routes
logLine({ NODE_ENV: process.env.NODE_ENV }, `Routes registered`, 'Info');
if (process.env.NODE_ENV === 'development') {
  console.log('\nAPI Routes:\n', appRouter.prettyPrint());
}

const middleware = [querystring, favicon(path.join(__dirname, 'favicon.ico'))];
module.exports = compose(...middleware)(log(configuredRoutes, '1mb'));
