/* eslint-env node */
module.exports = {
  extends: ['ash-nazg/sauron'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  settings: {
    polyfills: [
      'Error',
      'fetch',
      'Promise',
      'Promise.reject'
    ]
  },
  overrides: [{
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

      // Disable until https://github.com/gajus/eslint-plugin-jsdoc/issues/211
      'indent': 0
    }
  }],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
  }
};
