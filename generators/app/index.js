var yeoman = require('yeoman-generator');

var merge = Object.assign.bind(Object, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
var concat = function concat(arr1, arr2) { return [].concat(arr1, arr2); };
var prefixPresets = function prefixPresets(name) { return 'babel-preset-' + name; };
var endline = function endline(str) { return str + '\n'; };

module.exports = yeoman.generators.Base.extend({
  constructor: function constructor() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('presets', { type: Array, required: false,
      desc: endline('Presets’ list: "yo babel-init es2015 es2016"'),
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
        result.presets.map(prefixPresets)
      );
      this.fs.write(
        this.destinationPath('.babelrc'),
        endline(stringify(result))
      );
    },
  },
  install: function install() {
    this.runInstall('npm', this.devDepsToInstall, { 'save-dev': true });
  },
});
