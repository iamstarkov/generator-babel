# generator-babel

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> [Yeoman][yo] generator to setup [Babel][babel] effortlessly (with plugins, if you want).  
> Works great as [cli](#usage) and [with other generators too](#composability).

By default, Babel doesn’t do anything! You need to configure it. So this package will create Babel’s configuration file `.babelrc` with default `es2015` preset and install required `babel-cli`, `babel-core` to devDependencies in your project.

After this package’s work is finished, you can access `babel-cli` and `babel-register` from your npm scripts. It’s useful for:
* **[transpilation][babel-cli]:** `babel index.js --out-file index.es5.js`
* **testing** via [hook][babel-register]: `mocha --require babel-register`, `tape test.js --require babel-register`, etc.

[yo]: http://yeoman.io/
[babel]: https://babeljs.io/
[babel-cli]: https://babeljs.io/docs/usage/cli/#babel
[babel-register]: https://babeljs.io/docs/setup/#babel_register
[babel-node]: https://babeljs.io/docs/usage/cli/#babel-node

## Install

    npm install --global yo generator-babel

## Usage

    # default es2015 preset
    yo babel

    # your favorite presets
    yo babel es2015 stage-0

    # with plugins with --plugins/-p
    yo babel -p add-module-exports
    yo babel -p transform-strict-mode,transform-object-assign

The entire range of [Babel presets][babel-presets] are allowed.

[babel-presets]: http://babeljs.io/docs/plugins/#presets

## Composability

> Composability is a way to combine smaller parts to make one large thing. Sort of [like Voltron®][voltron]  
> — [Yeoman docs](http://yeoman.io/authoring/composability.html)

Just plug in _babel_ into your generator and let it setup your `.babelrc` and install required `devDependencies` for you. Everybody wins.

### Install

    npm install --save generator-babel

#### Compose

`skip-install` is used because `babel` install babel deps for you
and you don’t need to test it in your own generator tests.

```js
this.composeWith('babel', { options: {
  'skip-install': this.options['skip-install']
}}, {
  local: require.resolve('generator-babel/generators/app')
});
```

Add any extra fields you need to `options.config` to extend the [default][defaults] configuration. The entire range of [Babel options][babel-options] are allowed.

```js
this.composeWith('babel', { options: {
  'skip-install': this.options['skip-install'],
  config: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-strict-mode', 'transform-object-assign'],
    sourceMaps: true
  }
}}, {
  local: require.resolve('generator-babel')
});
```

Required list of `presets` and `plugins` will be installed to `devDependencies` into your project with proper names: `es2015` will be `babel-preset-es2015` and `transform-strict-mode` will be `babel-plugin-transform-strict-mode`.

[babel-options]: http://babeljs.io/docs/usage/options/
[defaults]: https://github.com/iamstarkov/generator-babel/blob/master/generators/app/templates/_babelrc
[voltron]: http://25.media.tumblr.com/tumblr_m1zllfCJV21r8gq9go11_250.gif

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/generator-babel
[npm-image]: https://img.shields.io/npm/v/generator-babel.svg?style=flat

[travis-url]: https://travis-ci.org/iamstarkov/generator-babel
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-babel.svg?style=flat

[depstat-url]: https://david-dm.org/iamstarkov/generator-babel
[depstat-image]: https://david-dm.org/iamstarkov/generator-babel.svg?style=flat
