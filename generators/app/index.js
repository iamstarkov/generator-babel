var yeoman = require('yeoman-generator');
var objectAssign = require('object-assign');

var merge = objectAssign.bind(null, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
var concat = function concat(arr1, arr2, arr3) { return [].concat(arr1, arr2, arr3); };
var prefixPresets = function prefixPresets(name) { return 'babel-preset-' + name; };
var prefixPlugins = function prefixPlugins(name) { return 'babel-plugin-' + name; };
var endline = function endline(str) { return str + '\n'; };

module.exports = yeoman.generators.Base.extend({
  constructor: function constructor() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('presets', { type: Array, required: false,
      desc: endline('Presets’ list: "yo babel es2015 es2016"'),
    });
  },
  writing: {
    app: function app() {
      var optional = this.presets
        ? { presets: this.presets }
        : (this.options.config || {});
      var existing = this.fs.exists(this.destinationPath('.babelrc'))
            ? parse(this.fs.read(this.destinationPath('.babelrc')))
            : {};
      var defaults = parse(this.fs.read(this.templatePath('_babelrc')));
      var result = merge(existing, defaults, optional);
      this.devDepsToInstall = concat(
        ['babel-cli', 'babel-core'],
        (result.presets || []).map(prefixPresets),
        (result.plugins || []).map(prefixPlugins)
      );
      this.fs.write(
        this.destinationPath('.babelrc'),
        endline(stringify(result))
      );
    },
  },
  conflicts: function conflicts() {
    // it’s not "install" because generated project can use "prepublish" script
    // and then babel should already exists in the generated project
    var skipInstall = this.options['skip-install'];
    var needInstall = !skipInstall;
    if (needInstall) {
      this.npmInstall(this.devDepsToInstall, { 'save-dev': true });
    }
  },
});
