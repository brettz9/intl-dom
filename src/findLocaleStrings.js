/* globals intlDomLocale -- Allow global setting */

import {defaultLocaleResolver} from './defaultLocaleResolver.js';
import {promiseChainForValues} from './promiseChainForValues.js';
import {getFetch} from './shared.js';

export {setFetch, getFetch} from './shared.js';

/**
 * Takes a locale and returns a new locale to check.
 * @callback LocaleMatcher
 * @param {string} locale The failed locale
 * @throws {Error} If there are no further hyphens left to check
 * @returns {string|Promise<string>} The new locale to check
*/

/**
 * @type {LocaleMatcher}
 */
export const defaultLocaleMatcher = (locale) => {
  if (!locale.includes('-')) {
    throw new Error('Locale not available');
  }
  // Try without hyphen, i.e., the "lookup" algorithm:
  // See https://tools.ietf.org/html/rfc4647#section-3.4 and
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
  return locale.replace(/-[^-]*$/u, '');
};

/**
 * @param {object} cfg
 * @param {string} cfg.locale
 * @param {string[]} cfg.locales
 * @param {LocaleMatcher} [cfg.localeMatcher]
 * @returns {string|false}
 */
export const getMatchingLocale = ({
  locale, locales, localeMatcher = defaultLocaleMatcher
}) => {
  try {
    while (!locales.includes(locale)) {
      // Catch as `defaultLocaleMatcher` will throw if no hyphen found
      locale = localeMatcher(locale);
    }
  } catch (err) {
    return false;
  }
  return locale;
};

/**
 * @typedef {object} LocaleObjectInfo
 * @property {import('./getMessageForKeyByStyle.js').
 *   LocaleObject} strings The successfully retrieved locale strings
 * @property {string} locale The successfully resolved locale
 */

/**
 * @typedef {{
 *   locales?: string[],
 *   defaultLocales?: string[],
 *   localesBasePath?: string,
 *   localeResolver?: import('./defaultLocaleResolver.js').LocaleResolver,
 *   localeMatcher?: "lookup"|LocaleMatcher
 * }} LocaleStringArgs
 */

/**
 * `locales` - BCP-47 language strings. Defaults to `navigator.languages`.
 * `defaultLocales` - Defaults to ["en-US"].
 * `localesBasePath` - Defaults to `.`.
 * `localeResolver` - Defaults to `defaultLocaleResolver`.
 * @typedef {(
 *   cfg?: LocaleStringArgs
 * ) => Promise<LocaleObjectInfo>} LocaleStringFinder
 */

/**
 *
 * @type {LocaleStringFinder}
 */
export const findLocaleStrings = ({
  locales,
  defaultLocales,
  localeResolver,
  localesBasePath,
  localeMatcher
} = {}) => {
  return /** @type {Promise<LocaleObjectInfo>} */ (_findLocale({
    locales, defaultLocales, localeResolver, localesBasePath, localeMatcher
  }));
};

/**
 * Resolves to the successfully resolved locale.
 * `locales` - BCP-47 language strings. Defaults to `navigator.languages`.
 * `defaultLocales` - Defaults to ["en-US"].
 * `localesBasePath` - Defaults to `.`.
 * `localeResolver` - Defaults to `defaultLocaleResolver`.
 * `localeMatcher`.
 * @typedef {(cfg?: LocaleStringArgs) => Promise<string>} LocaleFinder
 */

/**
 *
 * @type {LocaleFinder}
 */
export const findLocale = ({
  locales,
  defaultLocales,
  localeResolver,
  localesBasePath,
  localeMatcher
} = {}) => {
  return /** @type {Promise<string>} */ (_findLocale({
    locales, defaultLocales, localeResolver, localesBasePath, localeMatcher,
    headOnly: true
  }));
};

/**
 * @type {(
 *   cfg: LocaleStringArgs & {
 *     headOnly?: boolean
 *   }
 * ) => Promise<string|LocaleObjectInfo>} Also has a `headOnly` boolean
 *  property to determine whether to make a simple HEAD and resolve to
 *  the locale rather than locale and contents
 */
const _findLocale = async ({
  locales = typeof intlDomLocale !== 'undefined'
    ? [intlDomLocale]
    : typeof navigator === 'undefined' ? [] : navigator.languages,
  defaultLocales = ['en-US'],
  localeResolver = defaultLocaleResolver,
  localesBasePath = '.',
  localeMatcher = 'lookup',
  headOnly = false
}) => {
  /**
   * @callback getLocale
   * @throws {SyntaxError|TypeError|Error}
   * @param {string} locale
   * @returns {Promise<LocaleObjectInfo|string>}
   */
  async function getLocale (locale) {
    if (typeof locale !== 'string') {
      throw new TypeError('Non-string locale type');
    }
    const url = localeResolver(localesBasePath, locale);
    if (typeof url !== 'string') {
      throw new TypeError(
        '`localeResolver` expected to resolve to (URL) string.'
      );
    }
    try {
      const _fetch = /** @type {import('./shared.js').Fetch} */ (getFetch());
      const resp = await (headOnly
        ? _fetch(url, {
          method: 'HEAD'
        })
        : _fetch(url)
      );

      if (resp.status === 404) {
        // Don't allow browser (tested in Firefox) to continue
        //  and give `SyntaxError` with missing file or we won't be
        //  able to try without the hyphen
        throw new Error('Trying again');
      }
      if (headOnly) {
        return locale;
      }
      const strings = await (resp.json());
      return {
        locale,
        strings
      };
    } catch (err) {
      if (/** @type {Error} */ (err).name === 'SyntaxError') {
        throw err;
      }
      const newLocale = await /** @type {LocaleMatcher} */ (
        localeMatcher
      )(locale);
      return getLocale(newLocale);
    }
  }
  if (localeMatcher === 'lookup') {
    localeMatcher = defaultLocaleMatcher;
  } else if (typeof localeMatcher !== 'function') {
    throw new TypeError('`localeMatcher` must be "lookup" or a function!');
  }
  return await promiseChainForValues(
    [...locales, ...defaultLocales],
    getLocale,
    'No matching locale found for ' + [...locales, ...defaultLocales].join(', ')
  );
};
