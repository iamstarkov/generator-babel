module.exports = {
  stringify: function stringify(obj) { return JSON.stringify(obj, null, 2); },
  parse: JSON.parse.bind(JSON),
};
