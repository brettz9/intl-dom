'use strict';

module.exports = {
  delay: true,
  exclude: 'test/*/**',
  reporter: 'mocha-multi-reporters',
  'reporter-option': [
    'configFile=mocha-multi-reporters.json'
  ],
  require: [
    'esm', 'chai/register-expect', 'test/bootstrap/node.js'
  ]
};
