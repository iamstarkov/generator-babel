/* eslint-disable func-names */

var yeoman = require('yeoman-generator');
var objectAssign = require('object-assign');

var merge = objectAssign.bind(null, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
var concat = function concat(arr1, arr2, arr3) { return [].concat(arr1, arr2, arr3); };
var prefixPresets = function prefixPresets(name) { return 'babel-preset-' + name; };
var prefixPlugins = function prefixPlugins(name) { return 'babel-plugin-' + name; };
var Promise = require('pinkie-promise');
var latest = require('latest-version');
var R = require('ramda');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('presets', { type: Array, required: false,
      desc: 'Presets’ list: "yo babel es2015 es2016"\n',
    });
  },
  writing: {
    app: function() {
      var done = this.async();
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

      var optional = this.presets
        ? { presets: this.presets }
        : (this.options.config || {});
      var existing = this.fs.exists(this.destinationPath('.babelrc'))
            ? parse(this.fs.read(this.destinationPath('.babelrc')))
            : {};
      var defaults = parse(this.fs.read(this.templatePath('_babelrc')));
      var result = merge(existing, defaults, optional);
      var deps = concat(
        ['babel-cli', 'babel-core'],
        (result.presets || []).map(prefixPresets),
        (result.plugins || []).map(prefixPlugins)
      );
      this.fs.write(
        this.destinationPath('.babelrc'),
        (stringify(result) + '\n')
      );
      Promise.all(deps.map(latest)).then(function(versions) {
        var devDeps = R.zipObj(deps, versions.map(R.concat('^')));
        pkg.devDependencies = R.merge((pkg.devDependencies || {}), devDeps);
        this.fs.writeJSON('package.json', pkg);
        done();
      }.bind(this));
    },
  },
  install: function() {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  },
});
