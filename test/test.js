import test from 'ava';
import R from 'ramda';
import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import depsObject from 'deps-object';
import { mapPrefixPreset, mapPrefixPlugin } from '../generators/app/map-babel';

const generator = () => helpers.run(path.join(__dirname, '../generators/app'));
const assertBabel = config => () => assert.jsonFileContent('.babelrc', config);

test('create files', () =>
  generator().on('end', () => assert.file('.babelrc')));

test('uses presets from options.config', () => {
  const config = { presets: ['es2015', 'stage-0'] };
  generator().withOptions({ config }).on('end', assertBabel(config));
});

test('uses presets from arguments', () => {
  const presets = ['es2015', 'stage-0'];
  generator().withArguments(presets).on('end', assertBabel({ presets }));
});

test('uses plugins from options.config', () => {
  const plugins = ['transform-strict-mode', 'transform-object-assign'];
  generator().withOptions({ config: { plugins } }).on('end', assertBabel({ plugins }));
});

test('uses plugins from options.plugins', () => {
  const plugins = ['transform-strict-mode', 'transform-object-assign'];
  generator().withOptions({ plugins }).on('end', assertBabel({ plugins }));
});

test('uses any other option from options.config', () => {
  const config = { sourceMaps: true };
  generator().withOptions({ config }).on('end', assertBabel(config));
});

test('add presets and plugins with proper prefixes', () => {
  const presets = ['es2015', 'stage-0'];
  const plugins = ['transform-strict-mode', 'transform-object-assign'];
  const deps = R.concat(mapPrefixPreset(presets), mapPrefixPlugin(plugins));
  depsObject(deps).then(devDependencies => {
    generator().withOptions({ config: { presets, plugins, sourceMaps: true } })
      .on('end', () => assert.jsonFileContent('package.json', { devDependencies }));
  });
});

test('not adding es2015 if config.presets are specified', () => {
  const config = { presets: ['es2016'] };
  generator().withOptions({ config })
    .on('end', () => assert.noFileContent('.babelrc', /es2015/));
});
