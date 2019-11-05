import {
  defaultLocaleResolver
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('defaultLocaleResolver', function () {
  it('should throw upon a non-string `localesBasePath`', function () {
    expect(() => {
      const nonStringLocale = null;
      defaultLocaleResolver('/ok/base/path', nonStringLocale);
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `locale`.'
    );
  });
  it('should throw upon a non-string `locale`', function () {
    expect(() => {
      const nonStringBasePath = null;
      const okLocale = 'en';
      defaultLocaleResolver(nonStringBasePath, okLocale);
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `localesBasePath`.'
    );
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
