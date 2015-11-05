# generator-babel-init

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> [Yeoman][yo] generator to setup [Babel][babel] effortlessly.  
> Works great as [cli](#usage) and [with other generators too](#composability).

By default, Babel doesn’t do anything! You need to configure it. So this package will create Babel’s configuration file `.babelrc` with default `es2015` preset and install required `babel-cli`, `babel-core` to devDependencies in your project.

After this package’s work is finished, you can access `babel-cli` and `babel-core` from your npm scripts.  
**Transpilation:** `babel-cli` will let you use `babel` for your code [transpilation][babel-cli]:  
`"transpile": "babel index.js > index.es5.js"`  
**Testing with `require` hook (e.g. mocha):** `babel-core` lets you use [`require` hook][babel-require] to run your tests:  
`"test": "mocha --require babel-core/register"`  
**Testing with `babel-node` (e.g. tape):**  `babel-cli` lets you use `babel-node` to run your tests][babel-node]:  
`"test": "babel-node test | tap-spec"`

[yo]: http://yeoman.io/
[babel]: https://babeljs.io/
[babel-cli]: https://babeljs.io/docs/usage/cli/#babel
[babel-require]: https://babeljs.io/docs/setup/#babel_register
[babel-node]: https://babeljs.io/docs/usage/cli/#babel-node

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/generator-babel
[npm-image]: https://img.shields.io/npm/v/generator-babel-init.svg?style=flat

[travis-url]: https://travis-ci.org/iamstarkov/generator-babel
[travis-image]: https://img.shields.io/travis/iamstarkov/generator-babel-init.svg?style=flat

[depstat-url]: https://david-dm.org/iamstarkov/generator-babel
[depstat-image]: https://david-dm.org/iamstarkov/generator-babel-init.svg?style=flat
