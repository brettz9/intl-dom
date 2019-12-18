import {setExpectedData} from './utils/utils.js';
import {
  findLocaleStrings,
  defaultLocaleMatcher
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('findLocaleStrings', function () {
  beforeEach(function () {
    setNavigatorLanguages([]);
    // Ensure not modified
    setExpectedData.call(this);
  });

  it(
    'should return locale object and no arguments',
    async function () {
      setNavigatorLanguages(['en-US']);
      const {strings, locale} = await findLocaleStrings();
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object with no `locales` and empty `defaultLocales`)',
    async function () {
      setNavigatorLanguages(['en-US']);
      const {strings, locale} = await findLocaleStrings({
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object with no `locales` and empty `defaultLocales`',
    async function () {
      setNavigatorLanguages(['zh-Hans']);
      const {strings, locale} = await findLocaleStrings({
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedZhHans);
      expect(locale).to.equal('zh-Hans');
    }
  );

  it(
    'should return locale object with explicit `locales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-US']
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object when finding locale without hyphen',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['pt-BR']
      });
      expect(strings).to.deep.equal(this.expectedPt);
      expect(locale).to.equal('pt');
    }
  );

  it(
    'should return locale object when needing to revert to secondary ' +
    'item in `locales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['zz', 'en-US', 'zh-Hans'],
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object when needing to revert to `defaultLocales`' +
    'and `navigator` is missing',
    async function () {
      setNavigatorLanguages(false);
      const {strings, locale} = await findLocaleStrings({
        defaultLocales: ['en-US']
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object when needing to revert to `defaultLocales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['zz'],
        defaultLocales: ['en-US']
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it('should reject with bad JSON locale and no fallbacks', function () {
    return expect(findLocaleStrings({
      locales: ['xy'],
      defaultLocales: []
    })).to.be.rejectedWith(Error, 'No matching locale found!');
  });

  it(
    'should reject with bad locale argument and no fallbacks',
    function () {
      return expect(findLocaleStrings({
        locales: [null],
        defaultLocales: []
      })).to.be.rejectedWith(Error, 'No matching locale found!');
    }
  );

  it(
    'should return locale object when using custom `localeResolver`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localeResolver (localesBasePath, lcle) {
          return `../${lcle}/messages.json`;
        }
      });
      expect(strings).to.deep.equal(this.expectedEnUSTestDirectory);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should reject with custom `localeResolver` not returning a string',
    function () {
      return expect(findLocaleStrings({
        locales: ['en-US'],
        localeResolver (localesBasePath, locale) {
          return false;
        }
      })).to.be.rejectedWith(Error, 'No matching locale found!');
    }
  );

  it(
    'should return locale object when using custom `localesBasePath`',
    async function () {
      let {strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localesBasePath: '../'
      });
      expect(strings).to.deep.equal(this.expectedEnUSLocalesTestDirectory);
      expect(locale).to.equal('en-US');

      ({strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localesBasePath: '..'
      }));
      expect(strings).to.deep.equal(this.expectedEnUSLocalesTestDirectory);
      expect(locale).to.equal('en-US');
    }
  );
  it(
    'should return locale object when using default `localeMatcher`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-ZZ'],
        localeMatcher (lcle) {
          if (lcle === 'en-ZZ') {
            return 'en-GB';
          }
          throw new Error('Locale not available');
        }
      });
      expect(strings).to.deep.equal(this.expectedEnGB);
      expect(locale).to.equal('en-GB');
    }
  );
  it('should throw when given bad `localeMatcher`', function () {
    expect(
      findLocaleStrings({
        locales: ['en-US'],
        localeMatcher: 'nonexistingCustomMatcherName'
      })
    ).to.be.rejectedWith(
      TypeError,
      '`localeMatcher` must be "lookup" or a function!'
    );
  });
});

describe('defaultLocaleMatcher', function () {
  it(
    'should strip the final hyphen content when a hyphen is present',
    () => {
      const result = defaultLocaleMatcher('en-US');
      expect(result).to.equal('en');
    }
  );
  it(
    'should strip only final hyphen content when multiple hyphens are present',
    () => {
      const result = defaultLocaleMatcher('zh-Hant-HK');
      expect(result).to.equal('zh-Hant');
    }
  );
  it('should throw when no hyphen is present', function () {
    expect(() => {
      defaultLocaleMatcher('en');
    }).to.throw(Error, 'Locale not available');
  });
});
