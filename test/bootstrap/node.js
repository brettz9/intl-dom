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
