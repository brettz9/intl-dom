'use strict';

module.exports = {
  delay: true,
  exclude: 'test/*/**',
  reporter: 'mocha-multi-reporters',
  'reporter-option': [
    'configFile=mocha-multi-reporters.json'
  ],
  require: [
    'chai/register-expect.js', 'test/bootstrap/node.js'
  ]
};
