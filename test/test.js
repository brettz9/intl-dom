import 'regenerator-runtime/runtime.js';
import {
  promiseChainForValues,
  defaultLocaleResolver,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  i18n
} from '../dist/index.esm.js';

describe('API', function () {
  it('Should export functions', function () {
    expect(promiseChainForValues).to.be.a('function');
    expect(defaultLocaleResolver).to.be.a('function');
    expect(getMessageForKeyByStyle).to.be.a('function');
    expect(getStringFromMessageAndDefaults).to.be.a('function');
    expect(getDOMForLocaleString).to.be.a('function');
    expect(findLocaleStrings).to.be.a('function');
    expect(i18n).to.be.a('function');
  });
});

/* eslint-disable promise/avoid-new */
describe('promiseChainForValues', function () {
  it('Should properly resolve without any rejections', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('a');
    expect(errbackCount, 'should short-circuit').to.equal(1);
  });
  it('Should properly accept rejection and continue', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        if (v === 'a') {
          reject(new Error('missing'));
        }
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('b');
    expect(errbackCount, 'should short-circuit').to.equal(2);
  });
  it(
    'Should properly accept multiple rejections and continue',
    async function () {
      let errbackCount = 0;
      const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
        errbackCount++;
        return new Promise(function (resolve, reject) {
          if (v === 'a' || v === 'b') {
            reject(new Error('missing'));
          }
          setTimeout(() => {
            resolve(v);
          }, 100);
        });
      });
      expect(val).to.equal('c');
      expect(errbackCount, 'should short-circuit').to.equal(3);
    }
  );
});
/* eslint-enable promise/avoid-new */

describe('defaultLocaleResolver', function () {
  it('Should resolve with no trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path';
    const path = defaultLocaleResolver(locale, localesBasePath);
    expect(path).to.equal(expected);
  });
  it('Should resolve with a trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path/';
    const path = defaultLocaleResolver(locale, localesBasePath);
    expect(path).to.equal(expected);
  });
});
