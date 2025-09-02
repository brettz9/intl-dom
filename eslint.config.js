import ashNazg from 'eslint-config-ash-nazg';
import babelEslintParser from '@babel/eslint-parser';

const {parser} = babelEslintParser;

export default [
  {
    name: 'intl-dom/ignores',
    ignores: [
      '.idea',
      'dist',
      'coverage',
      'test/browser/vendor/**/*.js',
      'test/browser/vendor/*.js',
      '!test/browser/vendor/fragmentHtml.js'
    ]
  },
  ...ashNazg(['sauron']),
  {
    name: 'intl-dom/settings',
    languageOptions: {
      parser, // import.meta.url
      parserOptions: {
        requireConfigFile: false
      }
    },
    settings: {
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
    }
  },
  ...ashNazg(['sauron', 'node']).map((cfg) => {
    return {
      files: ['test/bootstrap/node.js', 'node/**/*.js', 'test/node.js'],
      ...cfg
    };
  }),
  {
    files: ['test/*.js'],
    languageOptions: {
      globals: {
        setNavigatorLanguages: true
      }
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
  },
  {
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
      'sonarjs/no-internal-api-use': 0,

      // Disable until https://github.com/gajus/eslint-plugin-jsdoc/issues/211
      indent: 0
    }
  },
  {
    files: ['test/browser/index.html'],
    rules: {
      'import/unambiguous': 0,
      'sonarjs/no-internal-api-use': 0
    }
  },
  {
    rules: {
      // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/446
      'unicorn/regex-shorthand': 0,

      // Disable for now
      'eslint-comments/require-description': 0
    }
  }
];
