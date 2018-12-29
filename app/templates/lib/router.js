/** @format */

'use strict';

const qs = require('querystring');
const url = require('url');
const fmw = require('find-my-way');
const processError = require('./error');

const router = options => {
  const newRouter = fmw(options);
  newRouter.configure = (...routes) => {
    routes.forEach(rt => newRouter.on(...rt));
    return (req, res) => newRouter.lookup(req, res);
  };
  return newRouter;
};

function enhancer(fn) {
  return async function(req, res, params, store) {
    req.params = params;
    if (!req.query) {
      req.query = qs.parse(url.parse(req.url).query);
    }
    let ret = null;
    try {
      ret = await fn(req, res, store);
    } catch (error) {
      return processError(res, error);
    }
    return ret;
  };
}

const allMethods = ['GET', 'PUT', 'DELETE', 'POST', 'HEAD', 'PATCH', 'OPTIONS'];

const get = (path, fn, store) => ['GET', path, enhancer(fn), store];
const put = (path, fn, store) => ['PUT', path, enhancer(fn), store];
const del = (path, fn, store) => ['DELETE', path, enhancer(fn), store];
const post = (path, fn, store) => ['POST', path, enhancer(fn), store];
const head = (path, fn, store) => ['HEAD', path, enhancer(fn), store];
const patch = (path, fn, store) => ['PATCH', path, enhancer(fn), store];
const options = (path, fn, store) => ['OPTIONS', path, enhancer(fn), store];
const all = (path, fn, store) => [allMethods, path, enhancer(fn), store];

module.exports = {
  router,
  all,
  get,
  put,
  del,
  post,
  head,
  patch,
  options,
};
