// Todo: Allow literal brackets (with or without substitutions
//   of the same name present)
// Todo: Make localization strategy customizable (e.g., not necessarily
//   getting on `message` property); provide two named options
// Todo: Separate out locale retrieval logic from parsing logic and export both!

/**
* @callback PromiseChainErrback
* @param {any} errBack
* @returns {Promise<any>|any}
*/

/**
 * The given array will have its items processed in series; if the supplied
 *  errback, when passed the current item, returns a Promise or value that
 *  resolves, that value will be used for the return result of this function
 *  and no other items in the array will continue to be processed; if it
 *  rejects, however, the next item will be processed.
 * Accept an array of values to pass to an errback which should return
 *  a promise (or final result value) which resolves to a result or which
 *  rejects so that the next item in the array can be checked in series.
 * @param {Array<any>} values Array of values
 * @param {PromiseChainErrback} errBack Accepts an item of the array as its
 *   single argument
 * @returns {Promise<any>} Either resolves to a value derived from an item in
 *  the array or rejects if all items reject
 * @example ```js
 promiseChainForValues(['a', 'b', 'c'], (val) => {
   return new Promise(function (resolve, reject) {
     if (val === 'a') {
       reject(new Error('missing'));
     }
     setTimeout(() => {
       resolve(val);
     }, 100);
   });
 });
 ```
 */
const promiseChainForValues = (values, errBack) => {
  return values.reduce(async (p, value) => {
    try {
      return await p; // We'd short-circuit here instead if we could
    } catch (err) {
      return errBack(value);
    }
  }, Promise.reject(
    new Error('Intentionally reject so as to begin checking chain')
  ));
};

/**
* @callback DefaultLocaleStringResolver
* @param {string} key
* @param {LocaleStringObject} strings
* @returns {string} The translation
*/

/**
* @callback SubstitutionCallback
* @param {string} arg Accepts the second portion of the `bracketRegex` of
*   `i18n`, i.e., the non-bracketed segments of text from the locale string
*   following a bracketed segment.
* @returns {string} The replacement text
*/

/**
* @typedef {PlainObject} LocaleStringSubObject
* @property {string} message The locale message with any formatting
*   place-holders
* @property {string} description A description to add translators
*/

/**
* @typedef {PlainObject<string, LocaleStringSubObject>} LocaleStringObject
*/

/**
 * @callback LocaleResolver
 * @param {string} locale BCP-47 language string
 * @param {string} localesBasePth (Trailing slash optional)
 * @returns {string} URL of the locale file to be fetched
*/

/**
* @typedef {Object<string, string|Element|SubstitutionCallback>}
*   SubstitutionObject
*/

/**
 * Checks a key (against an object of strings). Optionally
 *  accepts an object of substitutions which are used when finding text
 *  within curly brackets (pipe symbol not allowed in its keys); the
 *  substitutions may be DOM elements as well as strings and may be
 *  functions which return the same (being provided the text after the
 *  pipe within brackets as the single argument).) Optionally accepts a
 *  config object, with the optional key "dom" which if set to `true`
 *  optimizes when DOM elements are (known to be) present
 * @callback I18NCallback
 * @param {string} key Key to check against object of strings
 * @param {false|SubstitutionObject} [substitutions=false]
 * @param {PlainObject} [cfg={}]
 * @param {boolean} [cfg.dom=false]
*/

/**
 * @type {LocaleResolver}
 */
const DefaultLocaleResolver = (locale, localesBasePth) => {
  return `${localesBasePth.replace(/\/$/u, '')}/_locales/${locale}/messages.json`;
};

/**
 * @param {PlainObject} [cfg]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {DefaultLocaleStringResolver|false|LocaleStringObject} [cfg.defaults]
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=DefaultLocaleResolver]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */
export const i18n = async function i18n ({
  locales = navigator.languages,
  defaultLocales = ['en-US'],
  defaults,
  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  bracketRegex = /\{([^}]*?)(?:\|([^}]*))?\}/gu,
  forceNodeReturn = false,
  localesBasePath = '.',
  localeResolver = DefaultLocaleResolver
}) {
  const strings = await promiseChainForValues(
    [...locales, ...defaultLocales],
    async function getLocale (locale) {
      const url = localeResolver(locale, localesBasePath);
      try {
        return await (await fetch(url)).json();
      } catch (err) {
        if (!locale.includes('-')) {
          throw new Error('Locale not available');
        }
        // Try without hyphen
        return getLocale(locale.replace(/-.*$/u, ''));
      }
    }
  );
  return (key, substitutions, {dom} = {}) => {
    let returnsDOM = false;
    const str = (
      key in strings && strings[key] && 'message' in strings[key] &&
        // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
        typeof strings[key].message === 'string'
        ? strings[key].message
        : typeof defaults === 'function'
          ? defaults(key, strings)
          : defaults === false
            ? (() => {
              throw new Error(`Key not found: (${key})`);
            })()
            : defaults[key].message

    );
    if (!substitutions) {
      return forceNodeReturn ? document.createTextNode(str) : str;
    }
    // Give chance to avoid this block when known to contain DOM
    if (!dom) {
      // Run this block to optimize non-DOM substitutions
      const ret = str.replace(bracketRegex, (_, ky, arg) => {
        let substitution = substitutions[ky];
        if (typeof substitution === 'function') {
          substitution = substitution(arg);
        }
        returnsDOM = returnsDOM ||
          (substitution && substitution.nodeType === 1);
        return substitution;
      });
      if (!returnsDOM) {
        return ret;
      }
    }
    const nodes = [];
    let result;
    let previousIndex = 0;
    while ((result = bracketRegex.exec(str)) !== null) {
      const {lastIndex} = bracketRegex;
      const [bracketedKey, ky, arg] = result;
      let substitution = substitutions[ky];
      if (typeof substitution === 'function') {
        substitution = substitution(arg);
      }
      const startBracketPos = lastIndex - bracketedKey.length;
      if (startBracketPos > previousIndex) {
        nodes.push(str.slice(previousIndex, startBracketPos));
      }
      nodes.push(substitution);
      previousIndex = lastIndex;
    }
    if (previousIndex !== str.length) { // Get text at end
      nodes.push(str.slice(previousIndex));
    }

    const container = document.createDocumentFragment();

    // console.log('nodes', nodes);
    container.append(...nodes);
    return container;
  };
};
