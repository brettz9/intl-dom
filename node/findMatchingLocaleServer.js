import http from 'http';
import fileFetch from 'file-fetch';
import {findLocale} from '../src/findLocaleStrings.js';

global.fetch = fileFetch;

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.basePath
 * @param {Integer} [cfg.port=3005]
 * @param {Integer} [cfg.wrap]
 * @returns {void}
 */
function findMatchingLocaleServer ({basePath, wrap, port = 3005}) {
  const wrapResult = wrap || JSON.stringify;
  http.createServer(async (req, res) => {
    const acceptLanguage = req.headers['accept-language'];
    if (!acceptLanguage) {
      res.end(wrapResult(''));
      return;
    }
    const languages = acceptLanguage.split(';')[0].split(',');
    const language = await findLocale({
      localesBasePath: basePath,
      locales: languages
    });
    res.write(wrapResult(language));
    res.end();
  }).listen(port);
}

export default findMatchingLocaleServer;
