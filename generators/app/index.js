/* eslint-disable func-names,vars-on-top */

var yeoman = require('yeoman-generator');
var R = require('ramda');
var splitKeywords = require('split-keywords');
var sortedObject = require('sorted-object');
var depsObject = require('deps-object');
var mapPrefixPreset = require('./map-babel').mapPrefixPreset;
var mapPrefixPlugin = require('./map-babel').mapPrefixPlugin;
var stringify = require('./json-fp').stringify;
var parse = require('./json-fp').parse;

// concatAll :: [Array] -> Array
var concatAll = R.reduce(R.concat, []);

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
      var cli = {};

      if (this.presets) {
        cli.presets = this.presets;
      }

      var plugins = this.options.plugins;
      if (typeof plugins === 'boolean') {
        this.log('Maybe you forgot double dash: `-plugins` instead of `--plugins`');
      }

      if (plugins) {
        cli.plugins = (typeof plugins === 'string') ? splitKeywords(plugins) : plugins;
      }

      var existing = this.fs.exists(this.destinationPath('.babelrc'))
            ? parse(this.fs.read(this.destinationPath('.babelrc')))
            : {};
      var defaults = { presets: ['es2015'] };

      var result = R.mergeAll([existing, defaults, cli, (this.options.config || {})]);
      this.fs.write(this.destinationPath('.babelrc'), (stringify(result) + '\n'));
      var deps = concatAll([
        'babel-cli', 'babel-register',
        mapPrefixPreset(result.presets || []),
        mapPrefixPlugin(result.plugins || []),
      ]);
      return depsObject(deps)
        .then(function(devDeps) {
          pkg.devDependencies = sortedObject(R.merge((pkg.devDependencies || {}), devDeps));
          this.fs.writeJSON(this.destinationPath('package.json'), pkg);
        }.bind(this))
        .catch(function(err) {
          throw err;
        });
    },
  },
  install: function() {
    if (!this.options['skip-install']) {
      this.npmInstall();
    }
  },
});
