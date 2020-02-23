/* eslint-env node */
module.exports = {
  extends: ['ash-nazg/sauron'],
  parser: 'babel-eslint', // import.meta.url
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
      'Array.isArray',
      'console',
      'Error',
      'fetch',
      'Intl',
      'JSON',
      'Object.defineProperty',
      'Object.entries',
      'Object.keys',
      'performance.now',
      'Promise',
      'Promise.reject'
    ]
  },
  overrides: [{
    extends: [
      'plugin:chai-expect/recommended',
      'plugin:chai-friendly/recommended'
    ],
    plugins: [
      '@fintechstudios/eslint-plugin-chai-as-promised'
    ],
    files: ['test/**'],
    globals: {
      expect: true,
      setNavigatorLanguages: true
    },
    env: {
      mocha: true
    },
    rules: {
      '@fintechstudios/chai-as-promised/no-unhandled-promises': 2
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
      'unicorn/no-unsafe-regex': 0,
      'prefer-named-capture-group': 0,

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
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/446
    'unicorn/regex-shorthand': 0
  }
};
