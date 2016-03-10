var R = require('ramda');

module.exports = {
  mapPrefixPreset: R.map(R.concat('babel-preset-')),
  mapPrefixPlugin: R.map(R.concat('babel-plugin-')),
};
