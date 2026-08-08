import {expect} from 'chai';
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
  it(
    'should keep SwitchFormatter#getMatch stable with array intermediates',
    function () {
      const switchFormatter = new SwitchFormatter(
        /** @type {import('../src/defaultLocaleResolver.js').Switches} */ (
          /** @type {unknown} */ ({
            a: ['one', 'message']
          })
        ),
        {
          substitutions: {}
        }
      );

      expect(switchFormatter.getMatch('a.b')).to.deep.equal([
        'one', 'message'
      ]);
    }
  );

  it('should export utility classes', function () {
    setJSONExtra(
      /** @type {{jsonExtra: unknown}} */ (
        /** @type {unknown} */ (globalThis)
      ).jsonExtra
    );

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

  it('should throw with bad `processRegex` arguments', function () {
    expect(() => {
      processRegex(/test/v, 'string', {
        onMatch (/* ..._args */) {
          //
        }
      });
    }).to.throw(
      'You must have `extra` or `betweenMatches` and `afterMatch` arguments.'
    );

    expect(() => {
      processRegex(/test/v, 'string', {
        betweenMatches (/* _str */) {
          //
        },
        onMatch (/* ...args */) {
          //
        }
      });
    }).to.throw(
      'You must have `extra` or `betweenMatches` and `afterMatch` arguments.'
    );
  });
});
