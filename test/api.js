import {
  promiseChainForValues,
  defaultLocaleResolver,
  defaultAllSubstitutions,
  defaultInsertNodes,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  i18n
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('API', function () {
  it('should export functions', function () {
    expect(promiseChainForValues).to.be.a('function');
    expect(defaultLocaleResolver).to.be.a('function');
    expect(defaultAllSubstitutions).to.be.a('function');
    expect(defaultInsertNodes).to.be.a('function');
    expect(getMessageForKeyByStyle).to.be.a('function');
    expect(getStringFromMessageAndDefaults).to.be.a('function');
    expect(getDOMForLocaleString).to.be.a('function');
    expect(findLocaleStrings).to.be.a('function');
    expect(i18n).to.be.a('function');
  });
});
