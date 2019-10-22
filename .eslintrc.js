/* eslint-env node */
module.exports = {
  extends: ['ash-nazg/sauron'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'chai-expect',
    'chai-friendly'
  ],
  env: {
    browser: true,
    es6: true
  },
  settings: {
    polyfills: [
      'Array.isArray',
      'console',
      'Error',
      'fetch',
      'JSON',
      'Object.defineProperty',
      'Object.keys',
      'Promise',
      'Promise.reject'
    ]
  },
  overrides: [{
    files: ['test/**'],
    globals: {
      expect: true,
      setNavigatorLanguages: true
    },
    env: {
      mocha: true
    },
    rules: {
      "no-unused-expressions": 0,
      "chai-friendly/no-unused-expressions": 2,
      "chai-expect/missing-assertion": 2,
      "chai-expect/terminating-properties": 1
    }
  }, {
    files: ['**/*.md'],
    rules: {
      'eol-last': ['off'],
      'no-console': ['off'],
      'no-undef': ['off'],
      'no-unused-vars': ['off'],
      'padded-blocks': ['off'],
      'import/unambiguous': ['off'],
      'import/no-unresolved': ['off'],
      'node/no-missing-import': ['off'],

      'promise/avoid-new': 0,
      'import/no-commonjs': 0,

      // Disable until https://github.com/gajus/eslint-plugin-jsdoc/issues/211
      'indent': 0
    }
  }, {
    files: ['test/browser/index.html'],
    rules: {
      'import/unambiguous': 0
    }
  }],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
  }
};
