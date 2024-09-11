// We avoid the main file (polyfill) for pluralrules as it does not detect
// full support for `minimumFractionDigits` and reverts on Node 10 to its
// default incomplete support;
// The imperfect Node implementation will wrongly gives "one"
//  instead of "other" (as it should) for
//  `new Intl.PluralRules('en-US', {minimumFractionDigits: 1}).select(1)`.
// import 'intl-pluralrules';
import {resolve as pathResolve, dirname} from 'path';
import {fileURLToPath} from 'url';

import PluralRules from 'intl-pluralrules/plural-rules';

import '@formatjs/intl-displaynames/polyfill.js';
import '@formatjs/intl-displaynames/locale-data/en.js';

import 'intl-relative-time-format';
import 'intl-relative-time-format/locale-data/en-US.js';
import 'intl-list-format';
import 'intl-list-format/locale-data/en-US.js';

// Testing
import * as chai from 'chai';
import chaiDOM from 'chai-dom';
import chaiAsPromised from 'chai-as-promised';
// // eslint-disable-next-line import/order -- Group chai plugins together
import fragmentHtml from '../browser/vendor/fragmentHtml/fragmentHtml.js';

import {JSDOM} from 'jsdom';
import fileFetch from 'file-fetch';

// @ts-expect-error Need to add types for json-6
import jsonExtra from 'json-6';

import {setFetch, setDocument} from '../../src/shared.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// @ts-expect-error Need to add types for json-6
global.jsonExtra = jsonExtra;

// Override to ensure we're testing with polyfill
// @ts-expect-error Needed for testing
Intl.PluralRules = PluralRules;

chai.use(chaiDOM);
chai.use(chaiAsPromised);
chai.use(fragmentHtml);

const {document: doc} = (new JSDOM()).window;
// We don't technically need to call `setDocument` as we are setting
//   a global `document` below for tests that need to use `document`, but
//   adding it here to suggest normal Node usage
setDocument(doc);
setFetch(fileFetch);

globalThis.document = doc;

/**
 * @param {false|string[]} languages
 * @returns {void}
 */
globalThis.setNavigatorLanguages = (languages) => {
  if (languages === false) {
    // eslint-disable-next-line @stylistic/max-len -- Long
    /* eslint-disable n/no-unsupported-features/node-builtins -- Polyfill for testing */
    // @ts-expect-error Needed for testing
    delete globalThis.navigator;
    return;
  }
  // @ts-expect-error Just for testing
  globalThis.navigator = {
    languages
  };
  // eslint-disable-next-line @stylistic/max-len -- Long
  /* eslint-enable n/no-unsupported-features/node-builtins -- Polyfill for testing */
};

setTimeout(() => {
  // Make path resolutions consistent in Node with HTML
  if (typeof process !== 'undefined') {
    process.chdir(pathResolve(__dirname, '../browser'));
  }
  // Delayed mocha beginning for sake of `process.chdir` which cannot
  //  be added earlier or it will hide tests themselves
  run();
}, 1000);
