// We avoid the main file (polyfill) for pluralrules as it does not detect
// full support for `minimumFractionDigits` and reverts on Node 10 to its
// default incomplete support;
// The imperfect Node implementation will wrongly gives "one"
//  instead of "other" (as it should) for
//  `new Intl.PluralRules('en-US', {minimumFractionDigits: 1}).select(1)`.
// import 'intl-pluralrules';
import {resolve as pathResolve} from 'path';

import PluralRules from 'intl-pluralrules/plural-rules.js';

import '@formatjs/intl-displaynames/polyfill.js';
import '@formatjs/intl-displaynames/locale-data/en.js';

import 'intl-relative-time-format';
import 'intl-relative-time-format/locale-data/en-US.js';
import 'intl-list-format';
import 'intl-list-format/locale-data/en-US.js';

// Testing
// eslint-disable-next-line no-shadow -- Not a test file here
import chai from 'chai';
import chaiDOM from 'chai-dom';
import chaiAsPromised from 'chai-as-promised';
// eslint-disable-next-line import/order -- Group chai plugins together
import fragmentHtml from '../browser/vendor/fragmentHtml.js';

import {JSDOM} from 'jsdom';
import fileFetch from 'file-fetch';
import jsonExtra from 'json-6';

import {setFetch, setDocument} from '../../src/shared.js';

global.jsonExtra = jsonExtra;

// Override to ensure we're testing with polyfill
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

global.document = doc;

global.setNavigatorLanguages = (languages) => {
  if (languages === false) {
    delete global.navigator;
    return;
  }
  global.navigator = {
    languages
  };
};

setTimeout(() => {
  // Make path resolutions consistent in Node with HTML
  if (typeof process !== 'undefined') {
    process.chdir(pathResolve(__dirname, '../browser'));
  }
  // Delayed mocha beginning for sake of `process.chdir` which cannot
  //  be added earlier or it will hide tests themselves
  run();
});
