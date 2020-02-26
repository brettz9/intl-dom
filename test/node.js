import {dirname} from 'path';
import nodeFetch from 'node-fetch';
import findMatchingLocaleServer from '../node/findMatchingLocaleServer.js';

describe('Server', function () {
  describe('Default JSON matcher', function () {
    it('should give the locale if matching only', async function () {
      findMatchingLocaleServer({
        port: 3008,
        basePath: dirname(import.meta.url) + '/browser'
      });
      const result = await nodeFetch('http://localhost:3008', {
        headers: {
          'accept-language': 'en-US'
        }
      });
      const lang = await result.text();
      expect(lang).to.equal('"en-US"');
    });
  });
  describe('Custom matcher', function () {
    before(() => {
      findMatchingLocaleServer({
        basePath: dirname(import.meta.url) + '/browser',
        wrap (locale) {
          return `window.intlDomLocale = ${JSON.stringify(locale)};`;
        }
      });
    });
    it('should give an empty string if no matching locales', async function () {
      const lang = await (await nodeFetch('http://localhost:3005')).text();
      expect(lang).to.equal('window.intlDomLocale = "";');
    });
    it('should give the locale if matching only', async function () {
      const result = await nodeFetch('http://localhost:3005', {
        headers: {
          'accept-language': 'en-US'
        }
      });
      const lang = await result.text();
      expect(lang).to.equal('window.intlDomLocale = "en-US";');
    });
    it('should give the locale if matching first', async function () {
      const result = await nodeFetch('http://localhost:3005', {
        headers: {
          'accept-language': 'en-US;fr'
        }
      });
      const lang = await result.text();
      expect(lang).to.equal('window.intlDomLocale = "en-US";');
    });
    it('should give the locale if matching second', async function () {
      const result = await nodeFetch('http://localhost:3005', {
        headers: {
          'accept-language': 'zz,fr'
        }
      });
      const lang = await result.text();
      expect(lang).to.equal('window.intlDomLocale = "fr";');
    });
    it('should give the locale if matching without hyphen', async function () {
      const result = await nodeFetch('http://localhost:3005', {
        headers: {
          'accept-language': 'zh-Hans-CN'
        }
      });
      const lang = await result.text();
      expect(lang).to.equal('window.intlDomLocale = "zh-Hans";');
    });
  });
});
