/* eslint-disable func-names,vars-on-top */

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
var sortedObject = require('sorted-object');

// splitAndTrimEach :: String -> [String]
var splitAndTrimEach = R.pipe(R.split(','), R.map(R.trim));

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);
    this.argument('presets', { type: Array, required: false,
      desc: 'Presets’ list: "yo babel es2015 es2016"\n',
    });
    this.option('plugins', { type: String, required: false, alias: 'p',
      desc: 'Plugins list: "yo babel -p add-module-exports"',
    });
  },
  writing: {
    app: function() {
      var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var done = this.async();

      var cli = {};

      if (this.presets) {
        cli.presets = this.presets;
      }

      var plugins = this.options.plugins;
      if (typeof plugins === 'boolean') {
        this.log('Maybe you forgot double dash: `-plugins` instead of `--plugins`');
      }
      if (plugins) {
        cli.plugins = (typeof plugins === 'string') ? splitAndTrimEach(plugins) : plugins;
      }

      var existing = this.fs.exists(this.destinationPath('.babelrc'))
            ? parse(this.fs.read(this.destinationPath('.babelrc')))
            : {};
      var defaults = { presets: ['es2015'] };

      var result = merge(existing, defaults, cli, this.options.config);
      this.fs.write(this.destinationPath('.babelrc'), (stringify(result) + '\n'));
      var deps = concat(
        ['babel-cli', 'babel-core'],
        (result.presets || []).map(prefixPresets),
        (result.plugins || []).map(prefixPlugins)
      );
      Promise.all(deps.map(latest))
        .then(function(versions) {
          var devDeps = R.zipObj(deps, versions.map(R.concat('^')));
          pkg.devDependencies = sortedObject(R.merge((pkg.devDependencies || {}), devDeps));
          this.fs.writeJSON(this.destinationPath('package.json'), pkg);
          done();
        }.bind(this))
        .catch(function () {
          this.log('Warning: one of [' + deps.join(', ') + '] dont exist');
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
