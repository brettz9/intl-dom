import {expect} from 'chai';
import {
  defaultLocaleResolver
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('defaultLocaleResolver', function () {
  it('should throw upon a non-string `localesBasePath`', function () {
    expect(() => {
      const nonStringLocale = null;
      defaultLocaleResolver(
        '/ok/base/path',
        // @ts-expect-error Testing bad argument
        nonStringLocale
      );
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `locale`.'
    );
  });
  it('should throw upon a non-string `locale`', function () {
    expect(() => {
      const nonStringBasePath = null;
      const okLocale = 'en';
      defaultLocaleResolver(
        // @ts-expect-error Testing bad argument
        nonStringBasePath,
        okLocale
      );
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `localesBasePath`.'
    );
  });
  it('should throw upon a `locale` with reserved characters', function () {
    [
      '.',
      '/',
      '\\',
      'some.in.middle',
      'path/inside',
      String.raw`or\backslashes`
    ].forEach((localeWithBadCharacters) => {
      expect(() => {
        const okBasePath = '/base/path';
        defaultLocaleResolver(okBasePath, localeWithBadCharacters);
      }).to.throw(
        TypeError,
        'Locales cannot use file-reserved characters, `.`, `/` or `\\`'
      );
    });
  });
  it('should resolve with no trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path';
    const path = defaultLocaleResolver(localesBasePath, locale);
    expect(path).to.equal(expected);
  });
  it('should resolve with a trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path/';
    const path = defaultLocaleResolver(localesBasePath, locale);
    expect(path).to.equal(expected);
  });
});
