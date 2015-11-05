# generator-babel-init

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> [Yeoman][yo] generator to setup [Babel][babel] effortlessly.  
> Works great as [cli](#usage) and [with other generators too](#composability).

By default, Babel doesn’t do anything! You need to configure it. So this package will create Babel’s configuration file `.babelrc` with default `es2015` preset and install required `babel-cli`, `babel-core` to devDependencies in your project.

After this package’s work is finished, you can access `babel-cli` and `babel-core` from your npm scripts. It’s useful for **[transpilation][babel-cli]** (`babel index.js > index.es5.js`) and **testing** (via [hook][babel-require]: `mocha --require babel-core/register` or [babel-node repl][babel-node]: `babel-node test | tap-spec`).

[yo]: http://yeoman.io/
[babel]: https://babeljs.io/
[babel-cli]: https://babeljs.io/docs/usage/cli/#babel
[babel-require]: https://babeljs.io/docs/setup/#babel_register
[babel-node]: https://babeljs.io/docs/usage/cli/#babel-node

## Install

    npm install --global yo generator-babel-init

## Usage

    # default es2015 preset
    yo babel-init

    # your favorite presets
    yo babel-init es2015 stage-0

The entire range of [Babel presets][babel-presets] are allowed.

[babel-presets]: http://babeljs.io/docs/plugins/#presets

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/generator-babel-init
[npm-image]: https://img.shields.io/npm/v/generator-babel-init.svg?style=flat

[travis-url]: https://travis-ci.org/iamstarkov/generator-babel-init
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-babel-init.svg?style=flat

[depstat-url]: https://david-dm.org/iamstarkov/generator-babel-init
[depstat-image]: https://david-dm.org/iamstarkov/generator-babel-init.svg?style=flat
