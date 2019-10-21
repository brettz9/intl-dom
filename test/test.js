import 'regenerator-runtime/runtime.js';
import {
  promiseChainForValues,
  defaultLocaleResolver,
  findLocaleStrings,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  i18n
} from '../dist/index.esm.js';

describe('API', function () {
  it('Should export functions', function () {
    expect(promiseChainForValues).to.be.a('function');
    expect(defaultLocaleResolver).to.be.a('function');
    expect(findLocaleStrings).to.be.a('function');
    expect(getMessageForKeyByStyle).to.be.a('function');
    expect(getStringFromMessageAndDefaults).to.be.a('function');
    expect(getDOMForLocaleString).to.be.a('function');
    expect(i18n).to.be.a('function');
  });
});
