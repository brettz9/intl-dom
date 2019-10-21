// Todo: Allow literal brackets (with or without substitutions
//   of the same name present)

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
* @callback SubstitutionCallback
* @param {string} arg Accepts the second portion of the `bracketRegex` of
*   `i18n`, i.e., the non-bracketed segments of text from the locale string
*   following a bracketed segment.
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
 * @param {string} locale BCP-47 language string
 * @param {string} localesBasePth (Trailing slash optional)
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
export const defaultLocaleResolver = (locale, localesBasePth) => {
  return `${localesBasePth.replace(/\/$/u, '')}/_locales/${locale}/messages.json`;
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
}) => {
  // eslint-disable-next-line no-return-await
  return await promiseChainForValues(
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
};

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
}) => {
  // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
  const str = typeof message === 'string'
    ? message
    : (defaults === false
      ? (() => {
        throw new Error(`Key value not found for key: (${key})`);
      })()
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
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @returns {string|DocumentFragment}
 */
export const getDOMForLocaleString = ({
  string,
  substitutions,
  dom,
  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  bracketRegex = /\{([^}]*?)(?:\|([^}]*))?\}/gu,
  forceNodeReturn = false
}) => {
  if (!substitutions) {
    return forceNodeReturn ? document.createTextNode(string) : string;
  }
  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    let returnsDOM = false;
    // Run this block to optimize non-DOM substitutions
    const ret = string.replace(bracketRegex, (_, ky, arg) => {
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
  while ((result = bracketRegex.exec(string)) !== null) {
    const {lastIndex} = bracketRegex;
    const [bracketedKey, ky, arg] = result;
    let substitution = substitutions[ky];
    if (typeof substitution === 'function') {
      substitution = substitution(arg);
    }
    const startBracketPos = lastIndex - bracketedKey.length;
    if (startBracketPos > previousIndex) {
      nodes.push(string.slice(previousIndex, startBracketPos));
    }
    nodes.push(substitution);
    previousIndex = lastIndex;
  }
  if (previousIndex !== string.length) { // Get text at end
    nodes.push(string.slice(previousIndex));
  }

  const container = document.createDocumentFragment();

  // console.log('nodes', nodes);
  container.append(...nodes);
  return container;
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @param {boolean} [cfg.forceNodeReturn=false]
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
  bracketRegex,
  forceNodeReturn
}) {
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
      forceNodeReturn,
      dom,
      bracketRegex
    });
  };
};
