import {setExpectedData} from './utils/utils.js';
import {
  i18n
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('i18n', function () {
  beforeEach(function () {
    setNavigatorLanguages([]);
    setExpectedData.call(this);
  });
  it('should return a function with empty arguments', async function () {
    const _ = await i18n();
    expect(_).to.be.a('function');
  });
  it('should return a function with empty object argument', async function () {
    const _ = await i18n({});
    expect(_).to.be.a('function');
  });
  it(
    'should return function that can find strings with implicit `locales`',
    async function () {
      const _ = await i18n();
      const string = _('abc');
      expect(string).to.deep.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it(
    'should return function that can find strings with explicit `locales`',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('abc');
      expect(string).to.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it('should reject with non-object JSON', function () {
    return expect(
      i18n({
        locales: ['xx']
      })
    ).to.be.rejectedWith(TypeError, 'Locale strings must be an object!');
  });
  it(
    'should return function that can return string when needing to ' +
    'revert to `defaultLocales`',
    async function () {
      const _ = await i18n({
        locales: ['zz'],
        defaultLocales: ['en-US']
      });
      const string = _('abc');
      expect(string).to.deep.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it(
    'should return function that can return string when using ' +
    'custom `localesBasePath`',
    async function () {
      let _ = await i18n({
        locales: ['en-US'],
        localesBasePath: '../'
      });
      let string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSLocalesTestDirectory.body.abc.message
      );

      _ = await i18n({
        locales: ['en-US'],
        localesBasePath: '..'
      });
      string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSLocalesTestDirectory.body.abc.message
      );
    }
  );
  it(
    'should return function that can return string when using ' +
    'custom `localeResolver`',
    async function () {
      const _ = await i18n({
        locales: ['en-US'],
        localeResolver (localesBasePath, locale) {
          return `../${locale}/messages.json`;
        }
      });
      const string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSTestDirectory.body.abc.message
      );
    }
  );
  it(
    'should return function that can return string processed in plain style',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that can return a string message with a string' +
    'key indicating a string on the `messageStyle` `messageForKey`',
    async function () {
      let _ = await i18n({
        defaults: {
          myKey: {
            message: 'myKeyValue'
          }
        },
        messageStyle: 'rich'
      });
      let string = _('myKey');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);

      _ = await i18n({
        defaults: {
          myKey: 'myKeyValue'
        },
        messageStyle: 'plain'
      });
      string = _('myKey');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that can return a string message with a string' +
    'key indicating `"richNested"` on the `messageStyle` `messageForKey`',
    async function () {
      const _ = await i18n({
        locales: ['ja'],
        messageStyle: 'richNested'
      });
      let string = _('key.that.is.nested');
      expect(string).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested.message
      );

      string = _('key.that.lessNested');
      expect(string).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested.message
      );
      expect(() => {
        _('key.that');
      }).to.throw(Error, 'Key value not found for key: (key.that)');
      expect(() => {
        _('key.that.is.nested.too.deep');
      }).to.throw(
        Error,
        'Key value not found for key: (key.that.is.nested.too.deep)'
      );
      expect(() => {
        _('a.nested.missingKey');
      }).to.throw(Error, 'Key value not found for key: (a.nested.missingKey)');
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'defaults object present',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain',
        defaults: {
          myKey: 'somethingElse'
        }
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );
  it(
    'should return a function that returns a string message ' +
    'despite defaults false',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain',
        defaults: false
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    ' (with `dom`)',
    async function () {
      const _ = await i18n({
        dom: true
      });
      const node = _('abc');
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    '(with `forceNodeReturn`)',
    async function () {
      const _ = await i18n({
        forceNodeReturn: true,
        throwOnMissingSuppliedFormatters: false
      });
      const node = _('abc');
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function which does not throw with missing ' +
    'supplied formatters and `throwOnMissingSuppliedFormatters` disabled',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true,
        throwOnMissingSuppliedFormatters: false,
        substitutions: {
        }
      });
      let node;
      expect(() => {
        node = _('key');
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
    }
  );

  it(
    'should return function which does not throw with extra supplied ' +
    'formatters and `throwOnExtraSuppliedFormatters` disabled and should ' +
    'return the formatted string node',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true,
        throwOnExtraSuppliedFormatters: false
      });
      const node = _('key', {
        msg: 'message',
        anExtraOne: 'why am I here?'
      });
      expect(node).to.have.text('A message');
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'an empty options object present',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', {});
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'defaults object present (on options object)',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', null, {
        defaults: {
          myKey: 'somethingElse'
        }
      });
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );
  it(
    'should return a function that returns a string message ' +
    'despite defaults false (on options object)',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', null, {
        defaults: false
      });
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that accepts a substitution object to apply ' +
    'by default to all callback calls (ignoring arguments)',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        substitutions: {
          substitution1: 'sub1 that will be overridden',
          substitution2: 'sub2'
        }
      });
      const string = _('key', {
        substitution1: 'sub1'
      });
      expect(string).to.equal('sub2 sub1');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` function to ' +
    'apply to all callback calls',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions ({value, arg, key}) {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }
      });
      const string = _('key', {
        substitution1: 'sub1',
        substitution2: 'sub2'
      });
      expect(string).to.equal('SUB2 sub1');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` function to ' +
    'apply to all callback calls (for DOM)',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions ({value, arg, key}) {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }
      });
      const frag = _('key', {
        substitution1: document.createElement('br'),
        substitution2: 'sub2'
      });
      expect(frag).to.have.fragmentHtml('SUB2 <br>');
    }
  );

  it(
    'should return a function which does not perform `NumberFormat` ' +
    'processing when passing number and `allSubstitutions` is `null`',
    async function () {
      const _ = await i18n({
        locales: ['en-US'],
        allSubstitutions: null
      });
      const string = _('apples', {
        appleCount: 123456.4567
      });
      expect(string).to.equal('123456.4567 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('apples', {
        appleCount: 123456.4567
      });
      expect(string).to.equal('123,456.457 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateKey', {
        now: 'now',
        todayDate: new Date(Date.UTC(2000, 11, 28, 3, 4, 5))
      });
      expect(string).to.equal('It is now 12/28/2000');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing with options overridden by ' +
    'locale argument (with options)',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('dateWithArgAndOptionsKey', {
        now: 'now',
        todayDate: {
          date: [new Date(Date.UTC(2000, 11, 28, 3, 4, 5)), {
            year: '2-digit'
          }]
        }
      });
      expect(string).to.equal('It is now December 28, 2000');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing being overridden by options ' +
    'in the locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateWithArgAndOptionsKey', {
        now: 'now',
        todayDate: {
          date: [new Date(Date.UTC(2000, 11, 28, 3, 4, 5)), {
            year: '2-digit'
          }]
        }
      });
      expect(string).to.equal('It is now December 28, 2000');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing with options overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('dateWithArgKey', {
        now: 'now',
        todayDate: {
          date: [new Date(Date.UTC(2000, 11, 28, 3, 4, 5)), {
            year: '2-digit'
          }]
        }
      });
      expect(string).to.equal('It is now 12/28/2000');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing being overridden by options ' +
    'in the locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateWithArgKey', {
        now: 'now',
        todayDate: {
          date: [new Date(Date.UTC(2000, 11, 28, 3, 4, 5)), {
            year: '2-digit'
          }]
        }
      });
      expect(string).to.equal('It is now 12/28/2000');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing (with fragment return)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const b = document.createElement('b');
      b.textContent = 'now';
      const frag = _('dateKey', {
        now: b,
        todayDate: new Date(Date.UTC(2000, 11, 28, 3, 4, 5))
      });
      expect(frag).to.have.fragmentHtml('It is <b>now</b> 12/28/2000');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (inheriting formatter options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('apples', {
        appleCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options overridden within ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('oranges', {
        oranges: 'oranges',
        orangeCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('oranges', {
        oranges: 'oranges',
        orangeCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument (returning fragment)',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const i = document.createElement('i');
      i.textContent = 'oranges';
      const frag = _('oranges', {
        oranges: i,
        orangeCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(frag).to.have.fragmentHtml('123,456.5 <i>oranges</i>');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options overridden within ' +
    'locale argument (without extra arguments)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('beets', {
        beetCount: {
          number: [123456.4567, {maximumFractionDigits: 5}]
        }
      });
      // Only 3 as `maximumFractionDigits` defaults to 3
      expect(string).to.equal('123,456.457 beets');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument (without extra arguments)',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('beets', {
        beetCount: {
          number: [123456.4567, {maximumFractionDigits: 5}]
        }
      });
      // Only 3 as `maximumFractionDigits` defaults to 3
      expect(string).to.equal('123,456.457 beets');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument (without extra arguments), directly using number',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('beets', {
        beetCount: 123456.4567
      });
      // Only 3 as `maximumFractionDigits` defaults to 3
      expect(string).to.equal('123,456.457 beets');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('oranges', {
        oranges: 'oranges',
        orangeCount: {
          number: 123456.4567
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) overridden by ' +
    'locale argument, directly using number',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('oranges', {
        oranges: 'oranges',
        orangeCount: 123456.4567
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) with options ' +
    'not overridden by argument of a non-number type',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dragonFruit', {
        fruitCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 dragon fruit');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) with options ' +
    'not overridden by argument of a non-number type (with extra args)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('pineapples', {
        fruitCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 pineapples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing (inheriting formatter options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateKey', {
        now: 'now',
        todayDate: {
          date: [
            new Date(Date.UTC(2000, 11, 28, 3, 4, 5)),
            {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', timeZone: 'America/Los_Angeles'
            }
          ]
        }
      });
      expect(string).to.equal('It is now 12/27/2000, 7 PM');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing (inheriting formatter options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('relativeKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 mo. ago');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing with options overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('relativeWithArgKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 months ago');
    }
  );

  it(
    'should return a function with default `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing with options overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('relativeWithArgKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 months ago');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing with options overridden by ' +
    'locale argument (with options)',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('relativeWithArgAndOptionsKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 months ago');
    }
  );

  it(
    'should return a function with default `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing with options overridden by ' +
    'locale argument (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('relativeWithArgAndOptionsKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 months ago');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `ListFormat` processing (inheriting formatter options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('listKey', {
        listItems: {
          list: [
            [
              'a', 'z', 'ä', 'a'
            ],
            {
              type: 'disjunction'
            },
            {
              sensitivity: 'base'
            }
          ]
        }
      });
      expect(string).to.equal('The list is: a, ä, a, or z');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `ListFormat` processing with options overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('listWithArgKey', {
        listItems: {
          list: [
            [
              'a', 'z', 'ä', 'a'
            ],
            {
              type: 'disjunction'
            },
            {
              sensitivity: 'base'
            }
          ]
        }
      });
      expect(string).to.equal('The list is: a, a, ä, and z');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `ListFormat` processing with options overridden by ' +
    'locale argument (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('listWithArgAndOptionsKey', {
        listItems: {
          list: [
            [
              'a', 'z', 'ä', 'a'
            ],
            {
              type: 'disjunction'
            },
            {
              sensitivity: 'base'
            }
          ]
        }
      });
      expect(string).to.equal('The list is: a, ä, a, and z');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `ListFormat` processing with options overridden by ' +
    'locale argument (with collator and list options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('listWithArgAndMultipleOptionsKey', {
        listItems: {
          list: [
            [
              'a', 'z', 'ä', 'a'
            ],
            {
              type: 'disjunction'
            },
            {
              sensitivity: 'base'
            }
          ]
        }
      });
      expect(string).to.equal('The list is: a, a, ä, and z');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` array of ' +
    'functions to apply to all callback calls',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions: [({value, arg, key}) => {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }, ({value, arg, key}) => {
          return arg === 'UPPER'
            ? '<strong>' + value.toUpperCase() + '</strong>'
            : value;
        }]
      });
      const string = _('key', {
        substitution1: 'sub1',
        substitution2: 'sub2'
      });
      expect(string).to.equal('<strong>SUB2</strong> sub1');
    }
  );

  it(
    'should return a function that returns a string text node ' +
    ' (with `dom` on options object)',
    async function () {
      let _ = await i18n();
      let node = _('abc', null, {
        dom: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);

      _ = await i18n({});
      node = _('abc', null, {
        dom: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    '(with `forceNodeReturn` on options object)',
    async function () {
      const _ = await i18n({
        throwOnMissingSuppliedFormatters: false
      });
      const node = _('abc', null, {
        forceNodeReturn: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function which does not throw with missing ' +
    'supplied formatters and `throwOnMissingSuppliedFormatters` disabled ' +
    '(on options object)',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true
      });
      let node;
      expect(() => {
        node = _('key', {}, {
          throwOnMissingSuppliedFormatters: false
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');

      expect(() => {
        node = _('key', null, {
          throwOnMissingSuppliedFormatters: false
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
    }
  );

  it(
    'should return function which does not throw with extra supplied ' +
    'formatters and `throwOnExtraSuppliedFormatters` disabled (on options ' +
    'object) and should return the formatted string',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true
      });
      const node = _('key', {
        msg: 'message',
        anExtraOne: 'why am I here?'
      }, {
        throwOnExtraSuppliedFormatters: false
      });
      expect(node).to.have.text('A message');
    }
  );

  it(
    'should function that can return string with default substitutions',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key');
      expect(string).to.equal('A message');
    }
  );

  it(
    'should return function that can return string with default and ' +
    'overriding substitutions',
    async function () {
      const _ = await i18n({
        locales: ['de'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key', {
        simp: 'simple'
      });
      expect(string).to.equal('A simple message');
    }
  );

  it(
    'should return function that can return string with default and ' +
    'overriding substitutions',
    async function () {
      const _ = await i18n({
        locales: ['de'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key', {
        simp: 'simple'
      });
      expect(string).to.equal('A simple message');
    }
  );

  it(
    'should return function that can return a string based on ' +
    'resolving of a local variable',
    async function () {
      const _ = await i18n();
      const string = _('localUsingKey');
      expect(string).to.equal('Here is a local value');
    }
  );

  it(
    'should return function that can return a fragment based on ' +
    'resolving of a local variable',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('localUsingKey');
      expect(frag).to.have.fragmentHtml('Here is a local value');
    }
  );

  it(
    'should return function that will throw based on ' +
    'reference to non-existent local variable',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('badLocalUsingKey');
      }).to.throw(
        Error,
        'Key value not found for local key: (aLocalVarNonexistent)'
      );
    }
  );

  it(
    'should return function that will throw based on ' +
    'reference to non-existent local variable',
    async function () {
      const _ = await i18n();
      const string = _('formatterGivingLocalAppearingKey', {
        resolved: '{-executive-pronoun}'
      });
      expect(string).to.equal(
        'Here is {-executive-pronoun}'
      );
    }
  );

  it(
    'should return function that will throw based on ' +
    'reference to non-existent local variable (with `dom` `true`)',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('badLocalUsingKey');
      }).to.throw(
        Error,
        'Key value not found for local key: (aLocalVarNonexistent)'
      );
    }
  );

  it(
    'should return function that can return a string based on ' +
    'resolving of a local nested variable',
    async function () {
      const _ = await i18n();
      const string = _('nestedUsingKey');
      expect(string).to.equal('There is a local value here too');
    }
  );

  it(
    'should return function that can return a fragment based on ' +
    'resolving of a local nested variable',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('nestedUsingKey');
      expect(frag).to.have.fragmentHtml('There is a local value here too');
    }
  );

  it(
    'should return function that can return a string based on ' +
    'resolving of a nested local variable\'s local variable and local ' +
    'parameterized variable',
    async function () {
      const _ = await i18n();
      const string = _('nestedWithParameterizedUsingKey', {
        subst: 'substitution'
      });
      expect(string).to.equal(
        'There is a local value here too; cold and dreary day; substitution'
      );
    }
  );

  it(
    'should return function that can return a fragment based on ' +
    'resolving of a nested local variable\'s local variable and local ' +
    'parameterized variable',
    async function () {
      const _ = await i18n();
      const b = document.createElement('b');
      b.textContent = 'substitution';
      const frag = _('nestedWithParameterizedUsingKey', {
        subst: b
      });
      expect(frag).to.have.fragmentHtml(
        'There is a local value here too; cold and dreary ' +
        'day; <b>substitution</b>'
      );
    }
  );

  it(
    'should return function that can return a string based on ' +
    'resolving of a local parameterized variable',
    async function () {
      const _ = await i18n();
      const string = _('parameterizedLocalUsingKey', {
        subst: 'substitution'
      });
      expect(string).to.equal(
        'A warm and sunny day; substitution; with a substitution'
      );
    }
  );

  it(
    'should return function that can return a string based on ' +
    'resolving of a local parameterized variable, ignoring supplied ' +
    'formatter of the same name',
    async function () {
      const _ = await i18n();
      const string = _('parameterizedLocalUsingKey', {
        subst: 'substitution',
        adjective1: 'cold'
      });
      expect(string).to.equal(
        'A warm and sunny day; substitution; with a substitution'
      );
    }
  );

  it(
    'should return function that can return a fragment based on ' +
    'resolving of a local parameterized variable',
    async function () {
      const _ = await i18n();
      const b = document.createElement('b');
      b.textContent = 'substitution';
      const frag = _('parameterizedLocalUsingKey', {
        subst: b
      });
      expect(frag).to.have.fragmentHtml(
        'A warm and sunny day; <b>substitution</b>; with a <b>substitution</b>'
      );
    }
  );

  it(
    'should return function that throws on extra formatter ' +
    'supplied to local parameterized variable',
    async function () {
      const _ = await i18n({
        throwOnExtraSuppliedFormatters: true
      });
      expect(() => {
        _('parameterizedLocalWithExtraUsingKey', {
          subst: 'substitution'
        });
      }).to.throw(Error, 'Extra formatting key: extra3');
    }
  );

  it(
    'should return function that throws on extra formatter ' +
    'supplied to local parameterized variable (with DOM substitution)',
    async function () {
      const _ = await i18n({
        dom: true,
        throwOnExtraSuppliedFormatters: true
      });
      const b = document.createElement('b');
      b.textContent = 'substitution';
      expect(() => {
        _('parameterizedLocalWithExtraUsingKey', {
          subst: b
        });
      }).to.throw(Error, 'Extra formatting key: extra3');
    }
  );

  it(
    'should return function that can return a string that escapes ' +
    'a local variable',
    async function () {
      const _ = await i18n();
      const string = _('usingLocalKeyWithEscape', {
        escaped: 'escaped'
      });
      expect(string).to.equal(
        'Here is an escaped expression {-aLocalVar} \\\\{-aLocalVar} ' +
          '\\a local value here too'
      );
    }
  );

  it(
    'should return function that can return a fragment that escapes ' +
    'a local variable',
    async function () {
      const _ = await i18n();
      const b = document.createElement('b');
      b.textContent = 'escaped';
      const frag = _('usingLocalKeyWithEscape', {
        escaped: b
      });
      expect(frag).to.have.fragmentHtml(
        'Here is an <b>escaped</b> expression {-aLocalVar} \\\\{-aLocalVar} ' +
          '\\a local value here too'
      );
    }
  );

  it(
    'should return function that throws upon recursive local variables',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('recursiveUsingKey');
      }).to.throw(
        TypeError,
        'Too much recursion in local variables.'
      );
    }
  );

  it(
    'should return function that throws upon recursive local variables (with ' +
    '`dom` `true`',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('recursiveUsingKey');
      }).to.throw(
        TypeError,
        'Too much recursion in local variables.'
      );
    }
  );

  it(
    'should return function that throws upon indirectly recursive ' +
    'local variables',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('indirectlyRecursiveUsingKey');
      }).to.throw(
        TypeError,
        'Too much recursion in local variables.'
      );
    }
  );

  it(
    'should return function that throws upon indirectly recursive ' +
    'local variables (with `dom` `true`)',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('indirectlyRecursiveUsingKey');
      }).to.throw(
        TypeError,
        'Too much recursion in local variables.'
      );
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingSwitch', {
        bananas: 1
      });
      expect(string).to.equal('You have one banana');
      string = _('keyUsingSwitch', {
        bananas: 3
      });
      expect(string).to.equal('You have 3 bananas');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with string values',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingSwitch', {
        bananas: 'one'
      });
      expect(string).to.equal('You have one banana');
      string = _('keyUsingSwitch', {
        bananas: 'other'
      });
      expect(string).to.equal('You have other bananas');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with string value default',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitch', {
        bananas: 'nonexistentValue'
      });
      expect(string).to.equal('You have nonexistentValue bananas');
    }
  );

  it(
    'should return function that throws when using key referencing a ' +
    'switch without a default',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('keyUsingSwitchWithoutDefault', {
          'switch-without-default': 'c'
        });
      }).to.throw(
        Error,
        'No defaults found for switch switch-without-default'
      );
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a plural switch',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingLocalWithSwitch', {
        bananas: 1
      });
      expect(string).to.equal('You have one banana; how much did they cost?');
      string = _('keyUsingLocalWithSwitch', {
        bananas: 3
      });
      expect(string).to.equal('You have 3 bananas; how much did they cost?');
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('keyReferencingNonexistentSwitch', {
          bananas: 1,
          nonexistentSwitch: 'abc'
        });
      }).to.throw(Error, 'Missing formatting key: ~nonexistentSwitch');
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch (without presence of formatter)',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('keyReferencingNonexistentSwitch', {
          bananas: 1
        });
      }).to.throw(Error, 'Missing formatting key: ~nonexistentSwitch');
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch (without any formatters)',
    async function () {
      const _ = await i18n({
        throwOnMissingSuppliedFormatters: false
      });
      const string = _('keyReferencingNonexistentSwitch');
      expect(string).to.equal(
        "This switch doesn't exist: {~nonexistentSwitch}"
      );
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'number switch with arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingSwitchAndArguments', {
        score: 0
      });
      expect(string).to.equal('You finished with zero points');
      string = _('keyUsingSwitchAndArguments', {
        score: 1
      });
      expect(string).to.equal('You finished with 1.0 points');
      string = _('keyUsingSwitchAndArguments', {
        score: 3.5
      });
      expect(string).to.equal('You finished with 3.5 points');
      string = _('keyUsingSwitchAndArguments', {
        score: 3.73
      });
      expect(string).to.equal('You finished with 3.73 points');
      string = _('keyUsingSwitchAndArguments', {
        score: 4
      });
      expect(string).to.equal('You finished with 4.0 points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'number switch with no arguments but with default arguments',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitchNoCastingAndArguments', {
        scoreNoCasting: {
          number: [0, {
            minimumFractionDigits: 1
          }]
        }
      });
      expect(string).to.equal('You finished with zero points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'number switch with no arguments but with default arguments',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitchNoCastingAndArguments', {
        scoreNoCasting: {
          number: [0, {
            minimumFractionDigits: 5
          }]
        }
      });
      expect(string).to.equal('You finished with 0.00000 points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'number switch with arguments and default arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingSwitchAndArguments', {
        score: {
          number: [0, {
            // Overridden
            minimumFractionDigits: 3
          }]
        }
      });
      expect(string).to.equal('You finished with zero points');
      string = _('keyUsingSwitchAndArguments', {
        score: {
          number: [1]
        }
      });
      expect(string).to.equal('You finished with 1.0 points');
      string = _('keyUsingSwitchAndArguments', {
        score: {
          number: [3.5]
        }
      });
      expect(string).to.equal('You finished with 3.5 points');
      string = _('keyUsingSwitchAndArguments', {
        score: {
          number: [3.73]
        }
      });
      expect(string).to.equal('You finished with 3.73 points');
      string = _('keyUsingSwitchAndArguments', {
        score: {
          number: [4]
        }
      });
      expect(string).to.equal('You finished with 4.0 points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'non-number switch with arguments and default arguments',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitchAndArguments', {
        score: {
          relative: [0, 'second']
        }
      });
      expect(string).to.equal('You finished with in 0 seconds points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a number switch with arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingLocalWithSwitchAndArguments', {
        score: 0
      });
      expect(string).to.equal('You finished with zero points; good job!');
      string = _('keyUsingLocalWithSwitchAndArguments', {
        score: 1
      });
      expect(string).to.equal('You finished with 1.0 points; good job!');
      string = _('keyUsingLocalWithSwitchAndArguments', {
        score: 3.5
      });
      expect(string).to.equal('You finished with 3.5 points; good job!');
      string = _('keyUsingLocalWithSwitchAndArguments', {
        score: 3.73
      });
      expect(string).to.equal('You finished with 3.73 points; good job!');
      string = _('keyUsingLocalWithSwitchAndArguments', {
        score: 4
      });
      expect(string).to.equal('You finished with 4.0 points; good job!');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingOrdinalSwitch', {
        rank: 1
      });
      expect(string).to.equal('You got 1st.');
      string = _('keyUsingOrdinalSwitch', {
        rank: 2
      });
      expect(string).to.equal('You got 2nd.');
      string = _('keyUsingOrdinalSwitch', {
        rank: 3
      });
      expect(string).to.equal('You got 3rd.');
      string = _('keyUsingOrdinalSwitch', {
        rank: 17
      });
      expect(string).to.equal('You got 17th.');
    }
  );

  it(
    'should return function that throws when processing a plural ' +
    'switch with arguments that has a default argument of a different type',
    async function () {
      const _ = await i18n();
      expect(() => {
        _('keyUsingOrdinalSwitch', {
          rank: {
            number: [1]
          }
        });
      }).to.throw(
        TypeError,
        'Expecting type "plural"; instead found "number".'
      );
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with no arguments but with default argument',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitchNoCasting', {
        points: {
          plural: [1, {
            minimumFractionDigits: 1
          }]
        }
      });
      expect(string).to.equal('You finished with 1.0 points');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with no arguments and no default argument',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingSwitchNoCasting', {
        points: {
          plural: [1]
        }
      });
      expect(string).to.equal('You finished with one point');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'plural switch with no arguments and no default arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingOrdinalSwitch', {
        rank: {
          plural: [1]
        }
      });
      expect(string).to.equal('You got 1st.');
      string = _('keyUsingOrdinalSwitch', {
        rank: {
          plural: [2]
        }
      });
      expect(string).to.equal('You got 2nd.');
      string = _('keyUsingOrdinalSwitch', {
        rank: {
          plural: [3]
        }
      });
      expect(string).to.equal('You got 3rd.');
      string = _('keyUsingOrdinalSwitch', {
        rank: {
          plural: [17]
        }
      });
      expect(string).to.equal('You got 17th.');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a plural switch with arguments',
    async function () {
      const _ = await i18n();
      let string = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 1
      });
      expect(string).to.equal('You got 1st. Not bad!');
      string = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 2
      });
      expect(string).to.equal('You got 2nd. Not bad!');
      string = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 3
      });
      expect(string).to.equal('You got 3rd. Not bad!');
      string = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 17
      });
      expect(string).to.equal('You got 17th. Not bad!');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'string switch',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingStringSwitch');
      expect(string).to.equal('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a string switch',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingLocalStringSwitch');
      expect(string).to.equal('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'string switch with an explicit default',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingStringSwitchWithExplicitDefault');
      expect(string).to.equal('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a string switch with an explicit default',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingLocalStringSwitchWithExplicitDefault');
      expect(string).to.equal('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'string switch with an argument',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingStringSwitchWithArgument');
      expect(string).to.equal('This pronoun is accusative: him');
    }
  );

  it(
    'should return function that can return a string that processes a ' +
    'local with a string switch with an argument',
    async function () {
      const _ = await i18n();
      const string = _('keyUsingLocalStringSwitchWithArgument');
      expect(string).to.equal('This pronoun is accusative: him');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'plural switch',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingSwitch', {
        bananas: 1
      });
      expect(frag).to.have.fragmentHtml('You have one banana');
      frag = _('keyUsingSwitch', {
        bananas: 3
      });
      expect(frag).to.have.fragmentHtml('You have 3 bananas');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'plural switch with string values',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingSwitch', {
        bananas: 'one'
      });
      expect(frag).to.have.fragmentHtml('You have one banana');
      frag = _('keyUsingSwitch', {
        bananas: 'other'
      });
      expect(frag).to.have.fragmentHtml('You have other bananas');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'plural switch with string value default',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingSwitch', {
        bananas: 'nonexistentValue'
      });
      expect(frag).to.have.fragmentHtml('You have nonexistentValue bananas');
    }
  );

  it(
    'should return function that throws when using key referencing a ' +
    'switch without a default',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('keyUsingSwitchWithoutDefault', {
          'switch-without-default': 'c'
        });
      }).to.throw(
        Error,
        'No defaults found for switch switch-without-default'
      );
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a plural switch',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingLocalWithSwitch', {
        bananas: 1
      });
      expect(frag).to.have.fragmentHtml(
        'You have one banana; how much did they cost?'
      );
      frag = _('keyUsingLocalWithSwitch', {
        bananas: 3
      });
      expect(frag).to.have.fragmentHtml(
        'You have 3 bananas; how much did they cost?'
      );
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('keyReferencingNonexistentSwitch', {
          bananas: 1,
          nonexistentSwitch: 'abc'
        });
      }).to.throw(Error, 'Missing formatting key: ~nonexistentSwitch');
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch (without presence of formatter)',
    async function () {
      const _ = await i18n({dom: true});
      expect(() => {
        _('keyReferencingNonexistentSwitch', {
          bananas: 1
        });
      }).to.throw(Error, 'Missing formatting key: ~nonexistentSwitch');
    }
  );

  it(
    'should return function that throws when accessing key referencing a ' +
    'non-existent plural switch (without any formatters)',
    async function () {
      const _ = await i18n({
        dom: true,
        throwOnMissingSuppliedFormatters: false
      });
      const frag = _('keyReferencingNonexistentSwitch');
      expect(frag).to.have.fragmentHtml(
        "This switch doesn't exist: {~nonexistentSwitch}"
      );
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'number switch with arguments',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingSwitchAndArguments', {
        score: 0
      });
      expect(frag).to.have.fragmentHtml('You finished with zero points');
      frag = _('keyUsingSwitchAndArguments', {
        score: 1
      });
      expect(frag).to.have.fragmentHtml('You finished with 1.0 points');
      frag = _('keyUsingSwitchAndArguments', {
        score: 3.5
      });
      expect(frag).to.have.fragmentHtml('You finished with 3.5 points');
      frag = _('keyUsingSwitchAndArguments', {
        score: 3.73
      });
      expect(frag).to.have.fragmentHtml('You finished with 3.73 points');
      frag = _('keyUsingSwitchAndArguments', {
        score: 4
      });
      expect(frag).to.have.fragmentHtml('You finished with 4.0 points');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a number switch with arguments',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingLocalWithSwitchAndArguments', {
        score: 0
      });
      expect(frag).to.have.fragmentHtml(
        'You finished with zero points; good job!'
      );
      frag = _('keyUsingLocalWithSwitchAndArguments', {
        score: 1
      });
      expect(frag).to.have.fragmentHtml(
        'You finished with 1.0 points; good job!'
      );
      frag = _('keyUsingLocalWithSwitchAndArguments', {
        score: 3.5
      });
      expect(frag).to.have.fragmentHtml(
        'You finished with 3.5 points; good job!'
      );
      frag = _('keyUsingLocalWithSwitchAndArguments', {
        score: 3.73
      });
      expect(frag).to.have.fragmentHtml(
        'You finished with 3.73 points; good job!'
      );
      frag = _('keyUsingLocalWithSwitchAndArguments', {
        score: 4
      });
      expect(frag).to.have.fragmentHtml(
        'You finished with 4.0 points; good job!'
      );
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'plural switch with arguments',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingOrdinalSwitch', {
        rank: 1
      });
      expect(frag).to.have.fragmentHtml('You got 1st.');
      frag = _('keyUsingOrdinalSwitch', {
        rank: 2
      });
      expect(frag).to.have.fragmentHtml('You got 2nd.');
      frag = _('keyUsingOrdinalSwitch', {
        rank: 3
      });
      expect(frag).to.have.fragmentHtml('You got 3rd.');
      frag = _('keyUsingOrdinalSwitch', {
        rank: 17
      });
      expect(frag).to.have.fragmentHtml('You got 17th.');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a plural switch with arguments',
    async function () {
      const _ = await i18n({dom: true});
      let frag = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 1
      });
      expect(frag).to.have.fragmentHtml('You got 1st. Not bad!');
      frag = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 2
      });
      expect(frag).to.have.fragmentHtml('You got 2nd. Not bad!');
      frag = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 3
      });
      expect(frag).to.have.fragmentHtml('You got 3rd. Not bad!');
      frag = _('keyUsingLocalWithOrdinalSwitch', {
        rank: 17
      });
      expect(frag).to.have.fragmentHtml('You got 17th. Not bad!');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'string switch',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingStringSwitch');
      expect(frag).to.have.fragmentHtml('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a string switch',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingLocalStringSwitch');
      expect(frag).to.have.fragmentHtml('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'string switch with an explicit default',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingStringSwitchWithExplicitDefault');
      expect(frag).to.have.fragmentHtml('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a string switch with an explicit default',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingLocalStringSwitchWithExplicitDefault');
      expect(frag).to.have.fragmentHtml('This pronoun is nominative: he');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'string switch with an argument',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingStringSwitchWithArgument');
      expect(frag).to.have.fragmentHtml('This pronoun is accusative: him');
    }
  );

  it(
    'should return function that can return a fragment that processes a ' +
    'local with a string switch with an argument',
    async function () {
      const _ = await i18n({dom: true});
      const frag = _('keyUsingLocalStringSwitchWithArgument');
      expect(frag).to.have.fragmentHtml('This pronoun is accusative: him');
    }
  );
});
