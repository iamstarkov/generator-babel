/* eslint-env mocha */
/* eslint-disable func-names */

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('babel-init:app', function() {
  var generator = function() {
    return helpers.run(path.join(__dirname, '../generators/app'));
  };

  it('creates files', function(done) {
    generator().on('end', function() {
      assert.file('.babelrc');
      done();
    });
  });

  it('uses presets from options.config', function(done) {
    generator().withOptions({ config: { presets: ['es2016'] }}).on('end', function() {
      assert.fileContent('.babelrc', /es2016/);
      done();
    });
  });

  it('uses plugins from options.config', function(done) {
    generator().withOptions({ config: { plugins: ['transform-strict-mode', 'transform-object-assign'] }}).on('end', function() {
      assert.fileContent('.babelrc', /transform-strict-mode/);
      assert.fileContent('.babelrc', /transform-object-assign/);
      done();
    });
  });

  it('uses any other option from options.config', function(done) {
    generator().withOptions({ config: { sourceMaps: true }}).on('end', function() {
      assert.fileContent('.babelrc', /"sourceMaps": true/);
      done();
    });
  });

  it('uses presets from arguments', function(done) {
    generator().withArguments(['es2015', 'stage-0']).on('end', function() {
      assert.fileContent('.babelrc', /es2015/);
      assert.fileContent('.babelrc', /stage-0/);
      done();
    });
  });
});
