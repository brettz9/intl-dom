import http from 'http';
import fileFetch from 'file-fetch';
import {findLocale} from '../src/findLocaleStrings.js';
import {setFetch} from '../src/shared.js';

export {setFetch, getFetch} from '../src/shared.js';

setFetch(fileFetch);

/**
 * @typedef {number} Integer
 */

/**
 * @param {object} cfg
 * @param {string} cfg.basePath
 * @param {Integer} [cfg.port]
 * @param {(value: any) => string} [cfg.wrap]
 * @returns {http.Server<
 *   typeof http.IncomingMessage, typeof http.ServerResponse
 * >}
 */
function findMatchingLocaleServer ({basePath, wrap, port = 3005}) {
  const wrapResult = wrap || JSON.stringify;
  return http.createServer(async (req, res) => {
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
