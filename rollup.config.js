import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

// We don't need this so long as we are hard-coding the
//  `node_modules` path for the sake of the browser, but keeping
//  in event we can use import paths later
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * @external RollupConfig
 * @type {object}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {object} [config]
 * @param {boolean} [config.minifying]
 * @param {string} [config.format]
 * @returns {RollupConfig}
 */
function getRollupObject ({minifying, format = 'umd'} = {}) {
  const nonMinified = {
    input: 'src/index.js',
    output: {
      format,
      sourcemap: minifying,
      file: `dist/index.${format}${minifying ? '.min' : ''}.js`,
      name: 'IntlDom'
    },
    plugins: [
      babel({
        babelHelpers: 'bundled'
      }),
      nodeResolve()
    ]
  };
  if (minifying) {
    nonMinified.plugins.push(terser());
  }
  return nonMinified;
}

export default [
  getRollupObject({minifying: true, format: 'umd'}),
  getRollupObject({minifying: false, format: 'umd'}),
  getRollupObject({minifying: true, format: 'esm'}),
  getRollupObject({minifying: false, format: 'esm'}),
  {
    input: './node_modules/chai-dom/chai-dom.js',
    output: {
      format: 'esm',
      file: './test/browser/vendor/chai-dom/chai-dom.js'
    },
    plugins: [
      commonjs()
    ]
  },
  {
    input: './node_modules/check-error/index.js',
    output: {
      format: 'esm',
      file: './test/browser/vendor/check-error/index.js'
    },
    plugins: [
      commonjs()
    ]
  }
];
