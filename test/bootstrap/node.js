import 'intl-pluralrules';
import 'intl-relative-time-format';
import 'intl-relative-time-format/locale-data/en-US.js';
import 'intl-list-format';
import 'intl-list-format/locale-data/en-US.js';

import chai from 'chai';
import chaiDOM from 'chai-dom';
import chaiAsPromised from 'chai-as-promised';

import {JSDOM} from 'jsdom';
import fileFetch from 'file-fetch';
import fragmentHtml from '../browser/vendor/fragmentHtml.js';

chai.use(chaiDOM);
chai.use(chaiAsPromised);
chai.use(fragmentHtml);

global.document = (new JSDOM()).window.document;
global.fetch = fileFetch;
global.setNavigatorLanguages = (languages) => {
  global.navigator = {
    languages
  };
};

setTimeout(() => {
  // Make path resolutions consistent in Node with HTML
  if (typeof process !== 'undefined') {
    // eslint-disable-next-line global-require
    process.chdir(require('path').resolve(__dirname, '../browser'));
  }
  // Delayed mocha beginning for sake of `process.chdir` which cannot
  //  be added earlier or it will hide tests themselves
  run();
});
