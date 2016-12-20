var assert = require('assert');
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var pkg = require('../../package.json');

var distPath = path.resolve(
  path.join(
    __dirname,
    '../../dist/css'
  )
);

var build = function (done) {
  child.exec('npm run build', {}, done);
};

before(function (done) {
  this.timeout(15000);
  build(done);
});

describe('build output', function () {

  it('generates CSS at dist/css/nasawds.css', function () {
    var distFilename = path.join(distPath, 'nasawds.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

  it('generates minified CSS at dist/css/nasawds.min.css', function () {
    var distFilename = path.join(distPath, 'nasawds.min.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

});

describe('version output', function () {
  var versionString = '/*! nasawds v' + pkg.version + ' */';

  var checkVersion = function (filename, done) {
    fs.readFile(filename, function (error, buffer) {
      assert.ok(!error, error);
      var css = buffer.toString();
      assert.ok(
        css.indexOf(versionString) > -1,
        'CSS does not include version string: "' +
          css.substr(0, 24) + '"...'
      );
      done();
    });
  };

  it('includes the current version text in nasawds.css', function (done) {
    var distFilename = path.join(distPath, 'nasawds.css');
    checkVersion(distFilename, done);
  });

  it('includes the current version text in nasawds.min.css', function (done) {
    var distFilename = path.join(distPath, 'nasawds.min.css');
    checkVersion(distFilename, done);
  });

});
