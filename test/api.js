import {
  Formatter, LocalFormatter, RegularFormatter, SwitchFormatter,
  unescapeBackslashes, parseJSONExtra, setJSONExtra, processRegex,
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
  it('should export utility classes', function () {
    setJSONExtra(globalThis.jsonExtra);

    expect(Formatter).to.be.a('function');
    expect(LocalFormatter).to.be.a('function');
    expect(RegularFormatter).to.be.a('function');
    expect(SwitchFormatter).to.be.a('function');
  });

  it('should export functions', function () {
    expect(unescapeBackslashes).to.be.a('function');
    expect(parseJSONExtra).to.be.a('function');
    expect(processRegex).to.be.a('function');

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
