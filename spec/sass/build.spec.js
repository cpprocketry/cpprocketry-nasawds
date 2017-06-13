'use strict';
const assert = require('assert');
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');

const distPath = path.resolve(
  path.join(
    __dirname,
    '../../dist/css'
  )
);

const build = function (done) {
  return new Promise((resolve, reject) => {
    child.spawn(
        './node_modules/.bin/gulp',
        [ 'sass' ],
        { stdio: 'ignore' }
      )
      .on('error', reject)
      .on('exit', code => resolve());
  });
};

before(function () {
  this.timeout(20000);
  return build();
});

describe('build output', function () {

  it('generates CSS at dist/css/nasawds.css', function () {
    const distFilename = path.join(distPath, 'nasawds.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

  it('generates minified CSS at dist/css/nasawds.min.css', function () {
    const distFilename = path.join(distPath, 'nasawds.min.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

});

describe('version output', function () {
  var versionString = '/*! nasawds v' + pkg.version + ' */';

  const checkVersion = (filename, done) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (error, buffer) => {
        if (error) {
          return reject(error);
        }

        const css = buffer.toString();
        assert.ok(
          css.indexOf(versionString) > -1,
          'CSS does not include version string: "' +
            css.substr(0, 24) + '"...'
        );
        resolve();
      });
    });
  };

  it('includes the current version text in nasawds.css', function () {
    const distFilename = path.join(distPath, 'nasawds.css');
    return checkVersion(distFilename);
  });

  it('includes the current version text in nasawds.min.css', function () {
    const distFilename = path.join(distPath, 'nasawds.min.css');
    return checkVersion(distFilename);
  });

});
