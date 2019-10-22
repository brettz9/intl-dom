import chai from 'chai';
import chaiDOM from 'chai-dom';
import chaiAsPromised from 'chai-as-promised';

import {JSDOM} from 'jsdom';
import fileFetch from 'file-fetch';

chai.use(chaiDOM);
chai.use(chaiAsPromised);

global.document = (new JSDOM()).window.document;
global.fetch = fileFetch;
global.setNavigatorLanguages = (languages) => {
  global.navigator = {
    languages
  };
};
