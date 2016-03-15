/* eslint-env mocha */
/* eslint-disable func-names, no-extra-bind */

var R = require('ramda');
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var depsObject = require('deps-object');
var mapPrefixPreset = require('./generators/app/map-babel').mapPrefixPreset;
var mapPrefixPlugin = require('./generators/app/map-babel').mapPrefixPlugin;

var generator = function() {
  return helpers.run(path.join(__dirname, './generators/app'));
};

it('creates files', function(done) {
  generator().on('end', function() {
    assert.file('.babelrc');
    done();
  });
});

it('uses presets from options.config', function(done) {
  var config = { presets: ['es2015', 'stage-0'] };
  generator().withOptions({ config: config }).on('end', function() {
    assert.jsonFileContent('.babelrc', config);
    done();
  });
});

it('uses presets from arguments', function(done) {
  var presets = ['es2015', 'stage-0'];
  generator().withArguments(presets).on('end', function() {
    assert.jsonFileContent('.babelrc', { presets: presets });
    done();
  });
});

it('uses plugins from options.config', function(done) {
  var plugins = ['transform-strict-mode', 'transform-object-assign'];
  generator().withOptions({ config: { plugins: plugins }}).on('end', function() {
    assert.jsonFileContent('.babelrc', { plugins: plugins });
    done();
  });
});

it('uses plugins from options.plugins', function(done) {
  var plugins = ['transform-strict-mode', 'transform-object-assign'];
  generator().withOptions({ plugins: ['transform-strict-mode', 'transform-object-assign'] }).on('end', function() {
    assert.jsonFileContent('.babelrc', { plugins: plugins });
    done();
  });
});

it('uses any other option from options.config', function(done) {
  var config = { sourceMaps: true };
  generator().withOptions({ config: config }).on('end', function() {
    assert.jsonFileContent('.babelrc', config);
    done();
  });
});

it('add presets and plugins with proper prefixes', function(done) {
  var presets = ['es2015', 'stage-0'];
  var plugins = ['transform-strict-mode', 'transform-object-assign'];
  var deps = R.concat(mapPrefixPreset(presets), mapPrefixPlugin(plugins));
  depsObject(deps).then(function(devDeps) {
    generator()
      .withOptions({ config: {
        presets: presets,
        plugins: plugins,
        sourceMaps: true,
      }})
      .on('end', function() {
        assert.jsonFileContent('package.json', { devDependencies: devDeps });
        done();
      });
  });
});

it('not adding es2015 if config.presets are specified', function(done) {
  var config = { presets: ['es2016'] };
  generator().withOptions({ config: config }).on('end', function() {
    assert.noFileContent('.babelrc', /es2015/);
    done();
  });
});
