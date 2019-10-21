/**
* @callback PromiseChainErrback
* @param {any} errBack
* @returns {Promise<any>|any}
*/

/**
 * The given array will have its items processed in series; if the supplied
 *  `errBack` (which is guaranteed to run at least once), when passed the
 *  current item, returns a `Promise` or value that resolves, that value will
 *  be used for the return result of this function and no other items in
 *  the array will continue to be processed; if it rejects, however, the
 *  next item will be processed with `errBack`.
 * Accept an array of values to pass to an errback which should return
 *  a promise (or final result value) which resolves to a result or which
 *  rejects so that the next item in the array can be checked in series.
 * @param {Array<any>} values Array of values
 * @param {PromiseChainErrback} errBack Accepts an item of the array as its
 *   single argument
 * @returns {Promise<any>} Either resolves to a value derived from an item in
 *  the array or rejects if all items reject
 * @example
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
 */
export const promiseChainForValues = (values, errBack) => {
  if (!Array.isArray(values)) {
    throw new TypeError(
      'The `values` argument to `promiseChainForValues` must be an array.'
    );
  }
  if (typeof errBack !== 'function') {
    throw new TypeError(
      'The `errBack` argument to `promiseChainForValues` must be a function.'
    );
  }
  return (async () => {
    let ret;
    let p = Promise.reject(
      new Error('Intentionally reject so as to begin checking chain')
    );
    while (true) {
      const value = values.shift();
      try {
        // eslint-disable-next-line no-await-in-loop
        ret = await p;
        break;
      } catch (err) {
        p = errBack(value);
      }
    }
    return ret;
  })();
};

/**
* @callback SubstitutionCallback
* @param {string} arg Accepts the third portion of the `bracketRegex` of
*   `i18n`, i.e., to allow the locale to supply arguments back to the
*   calling script.
* @returns {string} The replacement text
*/

/**
* @typedef {Object<string, string>} PlainLocaleStringObject
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
 * @param {string} localesBasePth (Trailing slash optional)
 * @param {string} locale BCP-47 language string
 * @returns {string} URL of the locale file to be fetched
*/

/**
* @typedef {PlainObject<string, string|Element|SubstitutionCallback>}
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
 * @returns {string|DocumentFragment}
*/

/**
 * @type {LocaleResolver}
 */
export const defaultLocaleResolver = (localesBasePath, locale) => {
  if (typeof localesBasePath !== 'string') {
    throw new TypeError(
      '`defaultLocaleResolver` expects a string `localesBasePath`.'
    );
  }
  if (typeof locale !== 'string') {
    throw new TypeError(
      '`defaultLocaleResolver` expects a string `locale`.'
    );
  }
  return `${localesBasePath.replace(/\/$/u, '')}/_locales/${locale}/messages.json`;
};

/**
* @callback MessageStyleCallback
* @param {LocaleStringObject|PlainLocaleStringObject|PlainObject} obj The exact
*   format depends on the `cfg.defaults` of `i18n`
* @param {string} key
* @returns {false|string} If `false`, will resort to default
*/

/**
 * @param {PlainObject} [cfg]
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @returns {MessageStyleCallback}
 */
export const getMessageForKeyByStyle = ({
  messageStyle = 'rich'
} = {}) => {
  return typeof messageStyle === 'function'
    ? messageStyle
    : (messageStyle === 'rich'
      ? (obj, key) => {
        if (key in obj && obj[key] && 'message' in obj[key] &&
          // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
          typeof obj[key].message === 'string'
        ) {
          return obj[key].message;
        }
        return false;
      }
      : (messageStyle === 'plain'
        ? (obj, key) => {
          if (key in obj && obj[key] && typeof obj[key] === 'string') {
            return obj[key];
          }
          return false;
        }
        : (() => {
          throw new TypeError(`Unknown \`messageStyle\` ${messageStyle}`);
        })()
      )
    );
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {string} [cfg.message]
 * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings
 * @returns {string}
 */
export const getStringFromMessageAndDefaults = ({
  /* eslint-enable max-len */
  message,
  defaults,
  messageStyle,
  messageForKey = getMessageForKeyByStyle({messageStyle}),
  key
} = {}) => {
  if (typeof key !== 'string') {
    throw new TypeError(
      'An options object with a `key` string is expected on ' +
      '`getStringFromMessageAndDefaults`'
    );
  }
  // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
  const str = typeof message === 'string'
    ? message
    : (defaults === false
      ? false
      : (defaults && typeof defaults === 'object'
        ? messageForKey(defaults, key)
        : (() => {
          throw new TypeError(
            `Default locale strings must resolve to \`false\` or an object!`
          );
        })()
      )
    );
  if (str === false) {
    throw new Error(`Key value not found for key: (${key})`);
  }
  return str;
};

/**
 *
 * @param {PlainObject} cfg
 * @param {string} cfg.string
 * @param {false|SubstitutionObject} [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @returns {string|DocumentFragment}
 */
export const getDOMForLocaleString = ({
  string,
  substitutions = false,
  dom = false,
  forceNodeReturn = false,
  throwOnMissingSuppliedFormatters = true,
  throwOnExtraSuppliedFormatters = true,
  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  bracketRegex = /(\\*)\{([^}]*?)(?:\|([^}]*))?\}/gu
} = {}) => {
  if (typeof string !== 'string') {
    throw new TypeError(
      'An options object with a `string` property set to a string must ' +
      'be provided for `getDOMForLocaleString`.'
    );
  }
  const stringOrTextNode = (str) => {
    return forceNodeReturn ? document.createTextNode(str) : str;
  };

  const usedKeys = [];
  const checkExtraSuppliedFormatters = () => {
    if (throwOnExtraSuppliedFormatters) {
      Object.keys(substitutions).forEach((key) => {
        if (!usedKeys.includes(key)) {
          throw new Error(`Extra formatting key: ${key}`);
        }
      });
    }
  };
  const checkMissingSuppliedFormatters = (ky) => {
    if (throwOnMissingSuppliedFormatters && !(ky in substitutions)) {
      throw new Error(`Missing formatting key: ${ky}`);
    }
  };

  if (!substitutions && !throwOnMissingSuppliedFormatters) {
    return stringOrTextNode(string);
  }
  if (!substitutions) {
    substitutions = {};
  }
  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    let returnsDOM = false;
    // Run this block to optimize non-DOM substitutions
    const ret = string.replace(bracketRegex, (_, esc, ky, arg) => {
      if (esc.length % 2) {
        // Ignore odd sequences of escape sequences
        return _;
      }
      checkMissingSuppliedFormatters(ky);
      let substitution = substitutions[ky];
      if (typeof substitution === 'function') {
        substitution = substitution(arg);
      }
      returnsDOM = returnsDOM ||
        (substitution && substitution.nodeType === 1);
      usedKeys.push(ky);
      return esc + substitution;
    });
    checkExtraSuppliedFormatters();
    if (!returnsDOM) {
      return stringOrTextNode(ret);
    }
    usedKeys.length = 0;
  }
  const nodes = [];
  let result;
  let previousIndex = 0;
  while ((result = bracketRegex.exec(string)) !== null) {
    const [, esc, ky, arg] = result;

    const {lastIndex} = bracketRegex;
    if (esc % 2) {
      // Ignore odd sequences of escape sequences
      continue;
    }
    const startBracketPos = lastIndex - ky.length - 2;
    if (startBracketPos > previousIndex) {
      nodes.push(string.slice(previousIndex, startBracketPos));
    }
    if (esc.length) {
      nodes.push(esc);
    }

    checkMissingSuppliedFormatters(ky);
    let substitution = substitutions[ky];
    if (typeof substitution === 'function') {
      substitution = substitution(arg);
    }
    nodes.push(substitution);

    previousIndex = lastIndex;
    usedKeys.push(ky);
  }
  if (previousIndex !== string.length) { // Get text at end
    nodes.push(string.slice(previousIndex));
  }

  checkExtraSuppliedFormatters();

  const container = document.createDocumentFragment();

  // console.log('nodes', nodes);
  container.append(...nodes);
  return container;
};

/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @returns {Promise<LocaleStringObject|PlainLocaleStringObject|PlainObject>}
 */
export const findLocaleStrings = async ({
  locales = navigator.languages,
  defaultLocales = ['en-US'],
  localeResolver = defaultLocaleResolver,
  localesBasePath = '.'
} = {}) => {
  // eslint-disable-next-line no-return-await
  return await promiseChainForValues(
    [...locales, ...defaultLocales],
    async function getLocale (locale) {
      const url = localeResolver(localesBasePath, locale);
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
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */
export const i18n = async function i18n ({
  /* eslint-enable max-len */
  locales,
  defaultLocales,
  localesBasePath,
  localeResolver,
  defaults,
  messageStyle,
  forceNodeReturn,
  throwOnMissingSuppliedFormatters,
  throwOnExtraSuppliedFormatters,
  bracketRegex
} = {}) {
  const strings = await findLocaleStrings({
    locales, defaultLocales, localeResolver, localesBasePath
  });
  if (!strings || typeof strings !== 'object') {
    throw new TypeError(`Locale strings must be an object!`);
  }
  const messageForKey = getMessageForKeyByStyle({messageStyle});
  return (key, substitutions, {dom} = {}) => {
    const message = messageForKey(strings, key);
    const string = getStringFromMessageAndDefaults({
      message,
      defaults,
      messageForKey,
      key
    });

    return getDOMForLocaleString({
      string,
      substitutions,
      dom,
      forceNodeReturn,
      throwOnMissingSuppliedFormatters,
      throwOnExtraSuppliedFormatters,
      bracketRegex
    });
  };
};
