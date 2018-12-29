/** @format */

'use strict';

import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import test from 'ava';

const generator = path.join(__dirname, '../app');

test.serial('generates expected files', async t => {
  await helpers
    .run(generator)
    .withPrompts({
      appName: 'test',
      username: 'test',
      cli: false,
    })
    .toPromise();

  try {
    assert.file([
      'lib/check.js',
      'lib/connection.js',
      'lib/error.js',
      'lib/favicon.js',
      'lib/fetch.js',
      'lib/httpstatus.js',
      'lib/log.js',
      'lib/querystring.js',
      'lib/router.js',
      'routes/healthcheck.js',
      'routes/notfound.js',
      'bin/server',
      'bin/postinstall',
      '.editorconfig',
      '.gitignore',
      '.prettierignore',
      '.prettierrc',
      'favicon.ico',
      '.travis.yml',
      'app.js',
      'package.json',
      'test/index.js',
      'LICENSE',
      'README.md',
    ]);
    t.pass();
  } catch (error) {
    t.fail(`${error}`);
  }
});
