'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-overrides'],
  parser: '@babel/eslint-parser', // import.meta.url
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: false,
    es6: true
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    },
    polyfills: [
      'Array.isArray',
      'console',
      'Error',
      'fetch',
      'Intl',
      'JSON',
      'navigator',
      'Object.defineProperty',
      'Object.entries',
      'Object.keys',
      'performance.now',
      'Promise',
      'Promise.reject'
    ]
  },
  overrides: [{
    files: ['test/bootstrap/node.js'],
    extends: ['ash-nazg/sauron-node-overrides']

  }, {
    extends: [
      'plugin:mocha/recommended',
      'plugin:mocha-cleanup/recommended-no-limits',
      'plugin:@fintechstudios/chai-as-promised/recommended',
      'plugin:chai-expect-keywords/recommended',
      'plugin:chai-expect/recommended',
      'plugin:chai-friendly/recommended'
    ],
    files: ['test/*.js'],
    globals: {
      expect: true,
      setNavigatorLanguages: true
    },
    env: {
      mocha: true
    },
    rules: {
      // Good to allow `this`, but not wholly necessary
      'mocha/no-mocha-arrows': 0,

      // Good for expansion
      'mocha/no-hooks-for-single-case': 0,
      'chai-expect-keywords/no-unsupported-keywords': [
        'error', {
          allowChaiDOM: true,
          allowChaiAsPromised: true,
          allowKeywords: [
            // Filed https://github.com/nathanboktae/chai-dom/issues/41
            //  for this to be supported in `chai-dom` (and then would want as
            //  part of proposed `eslint-plugin-chai-expect-keywords` option
            //  mentioned above)
            'fragmentHtml'
          ]
        }
      ]
    }
  }, {
    files: ['**/*.md/*.js'],
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
      indent: 0
    }
  }, {
    files: ['.eslintrc.cjs', '.mocharc.js'],
    extends: ['ash-nazg/sauron-script-overrides'],
    rules: {
      'import/no-commonjs': 0
    }
  },
  {
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
    'unicorn/regex-shorthand': 0,

    // Disable for now
    'eslint-comments/require-description': 0
  }
};
