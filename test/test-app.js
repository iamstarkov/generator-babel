/* eslint-env mocha */
/* eslint-disable func-names, no-extra-bind */

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };

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
  generator().withOptions({ config: { presets: ['es2015', 'stage-0'] }}).on('end', function() {
    assert.fileContent('.babelrc', /es2015/);
    assert.fileContent('.babelrc', /stage-0/);
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

it('add presets and plugins with proper prefixes', function(done) {
  var pkg = {
    name: 'name',
    description: 'desc',
    repository: 'iamstarkov/generator-babel',
    license: 'MIT',
  };
  generator()
    .withOptions({ config: {
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-strict-mode', 'transform-object-assign'],
      sourceMaps: true,
    }})
    .on('ready', function(gen) {
      gen.fs.write(gen.destinationPath('package.json'), stringify(pkg));
    }.bind(this))
    .on('end', function() {
      assert.file('package.json');
      assert.fileContent('package.json', /babel-preset-stage-0/);
      assert.fileContent('package.json', /babel-preset-stage-0/);
      assert.fileContent('package.json', /babel-plugin-transform-strict-mode/);
      assert.fileContent('package.json', /babel-plugin-transform-object-assign/);
      done();
    });
});
