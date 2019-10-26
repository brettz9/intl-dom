// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';
import jsonExtra from '../node_modules/json-6/dist/index.mjs';

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
 * @param {string} [errorMessage="Reached end of values array."]
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
export const promiseChainForValues = (
  values, errBack, errorMessage = 'Reached end of values array.'
) => {
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
    let breaking;
    while (true) {
      const value = values.shift();
      try {
        // eslint-disable-next-line no-await-in-loop
        ret = await p;
        break;
      } catch (err) {
        if (breaking) {
          throw new Error(errorMessage);
        }
        // We allow one more try
        if (!values.length) {
          breaking = true;
        }
        // // eslint-disable-next-line no-await-in-loop
        p = errBack(value);
      }
    }
    return ret;
  })();
};

/**
* @callback SubstitutionCallback
* @param {PlainObject} cfg
* @param {string} cfg.arg By default, accepts the third portion of the
*   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
*   supply arguments back to the calling script.
* @param {string} cfg.key The substitution key
* @returns {string|Element} The replacement text or element
*/

/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * @typedef {GenericArray} ValueArray
 * @property {string|Node|number|Date} 0 The main value
 * @property {PlainObject} [1] The options related to the main value
 * @property {PlainObject} [2] Any additional options
*/

/**
* @typedef {PlainObject} RelativeTimeInfo
* @param {ValueArray} relative
*/

/**
* @typedef {PlainObject} ListInfo
* @param {ValueArray} list
*/

/**
* @typedef {PlainObject} NumberInfo
* @param {ValueArray} number
*/

/**
* @typedef {PlainObject} DateInfo
* @param {ValueArray} date
*/

/* eslint-disable max-len */
/**
* @callback AllSubstitutionCallback
* @param {PlainObject} cfg
* @param {string|Node|number|Date|RelativeTimeInfo|ListInfo|NumberInfo|DateInfo} cfg.value Contains
*   the value returned by the individual substitution
* @param {string} cfg.arg See `cfg.arg` of {@link SubstitutionCallback}.
* @param {string} cfg.key The substitution key
* @returns {string|Element} The replacement text or element
*/
/* eslint-enable max-len */

/**
* @typedef {Object<string, string>} PlainLocaleStringBodyObject
*/

/**
* @typedef {PlainObject} SwitchCaseInfo
* @property {boolean} [default=false] Whether this conditional is the default
*/

/**
* @typedef {GenericArray} SwitchCase
* @property {string} 0 The type
* @property {string} 1 The message
* @property {SwitchCaseInfo} [2] Info about the switch case
*/

/**
* @typedef {PlainObject<string, SwitchCase>} Switch
*/

/**
* @typedef {PlainObject<{string, Switch}>} Switches
*/

/**
* @typedef {PlainObject} LocaleStringSubObject
* @property {string} [message] The locale message with any formatting
*   place-holders; defaults to use of any single conditional
* @property {string} [description] A description to add translators
* @property {Switches} [switches] Conditionals
*/

/**
* @typedef {PlainObject<string, LocaleStringSubObject>} LocaleStringBodyObject
*/

/**
 * @callback LocaleResolver
 * @param {string} localesBasePath (Trailing slash optional)
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
 * @type {AllSubstitutionCallback}
 */
export const defaultAllSubstitutions = ({value, arg, key, locale}) => {
  // Strings or DOM Nodes
  if (
    typeof value === 'string' || (value && typeof value === 'object' &&
    'nodeType' in value)
  ) {
    return value;
  }

  let opts, extraOpts;
  if (value && typeof value === 'object') {
    const singleKey = Object.keys(value)[0];
    if (['number', 'date', 'relative', 'list'].includes(singleKey)) {
      if (Array.isArray(value[singleKey])) {
        [value, opts, extraOpts] = value[singleKey];
      } else {
        value = value[singleKey];
      }

      // Todo: Call `applyArgs` for `relative` and `list` options
      //  so user can call themselves or customize defaults?
      // RelativeTimeFormat
      if (singleKey === 'relative') {
        return new Intl.RelativeTimeFormat(
          locale, extraOpts
        ).format(value, opts);
      }

      // ListFormat (with Collator)
      if (singleKey === 'list') {
        value.sort(new Intl.Collator(locale, extraOpts).compare);
        return new Intl.ListFormat(locale, opts).format(value);
      }
      // Let `number` and `date` types drop through so their options
      //  can be applied
    }
  }

  const applyArgs = (type) => {
    if (typeof arg === 'string') {
      const extraArgDividerPos = arg.indexOf('|');
      let userType, extraArgs;
      if (extraArgDividerPos === -1) {
        userType = arg;
        if (userType === type) {
          opts = {};
        }
      } else {
        userType = arg.slice(0, extraArgDividerPos);
        if (userType === type) {
          extraArgs = arg.slice(extraArgDividerPos + 1);
          // Todo: Allow escaping and restoring of pipe symbol
          opts = {...opts, ...jsonExtra.parse(
            // Doesn't actually currently allow explicit brackets,
            //  but in case we change our regex to allow inner brackets
            '{' + extraArgs.replace(/^\{/u, '').replace(/\}$/u, '') + '}'
          )};
        }
      }
    }
    return opts;
  };

  // Numbers
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, applyArgs('NUMBER')).format(value);
  }

  // Dates
  if (
    value && typeof value === 'object' &&
    typeof value.getTime === 'function'
  ) {
    return new Intl.DateTimeFormat(locale, applyArgs('DATETIME')).format(value);
  }

  throw new TypeError('Unknown formatter');
};

/**
* @typedef {LocaleBody} LocalObject
*/

/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 * @typedef {PlainObject} LocaleHead
 * @property {LocalObject} locals
*/

/**
* @typedef {LocaleStringBodyObject|PlainLocaleStringBodyObject|PlainObject}
* LocaleBody
*/

/**
* @typedef {PlainObject} LocaleObject
* @property {LocaleHead} [head]
* @property {LocaleBody} body
*/

/**
* @typedef {PlainObject} MessageStyleCallbackResult
* @property {string} value Regardless of message style, will contain the
*   string result
* @property {LocaleStringSubObject} [info] Full info on the localized item
*   (for rich message styles only)
*/

/**
* @callback MessageStyleCallback
* @param {LocaleObject} obj The exact
*   format depends on the `cfg.defaults` of `i18n`
* @param {string} key
* @returns {false|MessageStyleCallbackResult} If `false`, will resort to default
*/

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg]
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='richNested']
 * @returns {MessageStyleCallback}
 */
export const getMessageForKeyByStyle = ({
  /* eslint-enable max-len */
  messageStyle = 'richNested'
} = {}) => {
  return typeof messageStyle === 'function'
    ? messageStyle
    : (messageStyle === 'richNested'
      ? (mainObj, key) => {
        const obj = mainObj && typeof mainObj === 'object' && mainObj.body;
        const keys = key.split('.');

        let ret = false;
        let currObj = obj;
        keys.some((ky, i, kys) => {
          if (!currObj || typeof currObj !== 'object') {
            return true;
          }
          if (
            // If specified key is too deep, we should fail
            i === kys.length - 1 &&
            ky in currObj && currObj[ky] && typeof currObj[ky] === 'object' &&
            'message' in currObj[ky] &&
            // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
            typeof currObj[ky].message === 'string'
          ) {
            ret = {
              value: currObj[ky].message,
              info: currObj[ky]
            };
          }
          currObj = currObj[ky];

          return false;
        });
        return ret;
      }
      : (messageStyle === 'rich'
        ? (mainObj, key) => {
          const obj = mainObj && typeof mainObj === 'object' && mainObj.body;
          if (
            obj && typeof obj === 'object' &&
            key in obj && obj[key] && typeof obj[key] === 'object' &&
            'message' in obj[key] &&
            // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
            typeof obj[key].message === 'string'
          ) {
            return {
              value: obj[key].message,
              info: obj[key]
            };
          }
          return false;
        }
        : (messageStyle === 'plain'
          ? (mainObj, key) => {
            const obj = mainObj && typeof mainObj === 'object' && mainObj.body;
            if (
              obj && typeof obj === 'object' &&
              key in obj && obj[key] && typeof obj[key] === 'string'
            ) {
              return {
                value: obj[key]
              };
            }
            return false;
          }
          : (() => {
            throw new TypeError(`Unknown \`messageStyle\` ${messageStyle}`);
          })())
      )
    );
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {string} [cfg.message] If present, this string will be the return value.
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='richNested']
 * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings; used to find a default if no string `message` is provided.
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
  let str;
  if (typeof message === 'string') {
    str = message;
  } else if (
    defaults === false || defaults === undefined || defaults === null
  ) {
    str = false;
  } else if (defaults && typeof defaults === 'object') {
    str = messageForKey({body: defaults}, key);
    if (str) {
      str = str.value;
    }
  } else {
    throw new TypeError(
      `Default locale strings must resolve to \`false\`, ` +
      `nullish, or an object!`
    );
  }
  if (str === false) {
    throw new Error(`Key value not found for key: (${key})`);
  }
  return str;
};

/* eslint-disable max-len */
/**
 * @callback InsertNodesCallback
 * @param {PlainObject} cfg
 * @param {string} cfg.string The localized string
 * @param {boolean} [cfg.dom] If substitutions known to contain DOM, can be set
 *   to `true` to optimize
 * @param {string[]} [cfg.usedKeys=[]] Array for tracking which keys have been used
 * @param {SubstitutionObject} cfg.substitutions The formatting substitutions object
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions] The
 *   callback or array composed thereof for applying to each substitution.
 * @param {string} locale The successfully resolved locale
 * @param {MissingSuppliedFormattersCallback} [cfg.missingSuppliedFormatters] Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * @param {CheckExtraSuppliedFormattersCallback} [cfg.checkExtraSuppliedFormatters] No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @returns {string|Array<Node|string>}
 */

/**
 * @type {InsertNodesCallback}
 */
export const defaultInsertNodes = ({
  /* eslint-enable max-len */
  string, dom, usedKeys, substitutions, allSubstitutions, locale,
  missingSuppliedFormatters,
  checkExtraSuppliedFormatters
}) => {
  /*
  1. Support additional arguments
    1. Conditionals/Plurals (specific to each format, but should operate
        with the same inputs/outputs); test
    2. Builtin functions (number and date)
  2. Other syntaxes
    1. process `switch` blocks
    2. Local variables (within text or functions/formatting args); test
  */

  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  const formattingRegex = /(\\*)\{((?:[^}]|\\\})*?)(?:(\|)([^}]*))?\}/gu;
  if (allSubstitutions) {
    allSubstitutions = Array.isArray(allSubstitutions)
      ? allSubstitutions
      : [allSubstitutions];
  }

  const getSubstitution = ({key, arg}) => {
    let substitution = substitutions[key];
    if (typeof substitution === 'function') {
      substitution = substitution({arg, key});
    }
    // Todo: Even for `null` `allSubstitutions`, we could have
    //  a mode to throw for non-string/non-DOM (non-numbers?),
    //  or whatever is not likely intended as a target for `toString()`.
    if (allSubstitutions) {
      substitution = allSubstitutions.reduce((subst, allSubst) => {
        return allSubst({
          value: subst, arg, key, locale
        });
      }, substitution);
    } else if (arg && arg.match(/^(?:NUMBER|DATE)(?:\||$)/u)) {
      substitution = defaultAllSubstitutions({
        value: substitution, arg, key, locale
      });
    }
    return substitution;
  };

  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    let returnsDOM = false;
    // Run this block to optimize non-DOM substitutions
    const ret = string.replace(formattingRegex, (_, esc, ky, pipe, arg) => {
      if (esc.length % 2) {
        // Unescape end of odd sequences of escape sequences
        return esc.slice(0, -2) + '{' +
          ky + (pipe || '') + (arg || '') + '}';
      }
      if (missingSuppliedFormatters(ky)) {
        return _;
      }

      const substitution = getSubstitution({key: ky, arg});

      returnsDOM = returnsDOM ||
        (substitution && typeof substitution === 'object' &&
        'nodeType' in substitution);
      usedKeys.push(ky);
      // Unescape and add substitution
      return esc.slice(0, esc.length / 2) + substitution;
    });
    if (!returnsDOM) {
      checkExtraSuppliedFormatters();
      return ret;
    }
    usedKeys.length = 0;
  }
  const nodes = [];
  let result;
  let previousIndex = 0;
  while ((result = formattingRegex.exec(string)) !== null) {
    const [_, esc, ky, pipe, arg] = result;

    const {lastIndex} = formattingRegex;
    const startBracketPos = lastIndex - esc.length - ky.length -
      (pipe || '').length - (arg || '').length - 2;
    if (startBracketPos > previousIndex) {
      nodes.push(string.slice(previousIndex, startBracketPos));
    }
    if (esc.length % 2) {
      // Unescape final part of odd sequences of escape sequences
      nodes.push(
        esc.slice(0, -2) + '{' +
        ky + (pipe || '') + (arg || '') + '}'
      );
      previousIndex = lastIndex;
      continue;
    }

    if (missingSuppliedFormatters(ky)) {
      nodes.push(_);
    } else {
      if (esc.length) { // Unescape
        nodes.push(esc.slice(0, esc.length / 2));
      }

      const substitution = getSubstitution({key: ky, arg});
      nodes.push(substitution);
    }

    previousIndex = lastIndex;
    usedKeys.push(ky);
  }
  if (previousIndex !== string.length) { // Get text at end
    nodes.push(string.slice(previousIndex));
  }
  checkExtraSuppliedFormatters();
  return nodes;
};

/* eslint-disable max-len */
/**
 *
 * @param {PlainObject} cfg
 * @param {string} cfg.string
 * @param {string} cfg.locale The (possibly already resolved) locale for use by
 *   configuring formatters
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|SubstitutionObject} [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {string|DocumentFragment}
 */
export const getDOMForLocaleString = ({
  /* eslint-enable max-len */
  string,
  locale,
  allSubstitutions = [
    defaultAllSubstitutions
  ],
  insertNodes = defaultInsertNodes,
  substitutions = false,
  dom = false,
  forceNodeReturn = false,
  throwOnMissingSuppliedFormatters = true,
  throwOnExtraSuppliedFormatters = true
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

  /**
  * @callback CheckExtraSuppliedFormattersCallback
  * @throws {Error} Upon an extra formatting key being found
  * @returns {void}
  */

  /**
   * @type {CheckExtraSuppliedFormattersCallback}
   */
  const checkExtraSuppliedFormatters = () => {
    if (throwOnExtraSuppliedFormatters) {
      Object.keys(substitutions).forEach((key) => {
        if (!key.startsWith('-') && !usedKeys.includes(key)) {
          throw new Error(`Extra formatting key: ${key}`);
        }
      });
    }
  };

  /**
  * @callback MissingSuppliedFormattersCallback
  * @param {string} key
  * @throws {Error} If missing formatting key
  * @returns {boolean}
  */
  /**
   * @type {MissingSuppliedFormattersCallback}
   */
  const missingSuppliedFormatters = (key) => {
    if (!key.startsWith('-') && !(key in substitutions)) {
      if (throwOnMissingSuppliedFormatters) {
        throw new Error(`Missing formatting key: ${key}`);
      }
      return true;
    }
    return false;
  };

  if (
    !substitutions && !allSubstitutions &&
    !throwOnMissingSuppliedFormatters
  ) {
    return stringOrTextNode(string);
  }
  if (!substitutions) {
    substitutions = {};
  }

  const nodes = insertNodes({
    string, dom, usedKeys, substitutions, allSubstitutions, locale,
    missingSuppliedFormatters,
    checkExtraSuppliedFormatters
  });
  if (typeof nodes === 'string') {
    return stringOrTextNode(nodes);
  }

  const container = document.createDocumentFragment();

  // console.log('nodes', nodes);
  container.append(...nodes);
  return container;
};

/**
* @callback LocaleMatcher
* @param {string} locale The failed locale
* @returns {string|Promise<string>} The new locale to check
*/

/**
* @typedef {PlainObject} LocaleObjectInfo
* @property {LocaleObject} strings The successfully retrieved locale strings
* @property {string} locale The successfully resolved locale
*/

/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher]
 * @returns {Promise<LocaleObjectInfo>}
 */
export const findLocaleStrings = async ({
  locales = navigator.languages,
  defaultLocales = ['en-US'],
  localeResolver = defaultLocaleResolver,
  localesBasePath = '.',
  localeMatcher = 'lookup'
} = {}) => {
  /**
   * @callback getLocale
   * @throws {SyntaxError|TypeError|Error}
   * @param {string} locale
   * @returns {Promise<LocaleObjectInfo>}
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
      const resp = await fetch(url);
      // Todo [file-fetch@>1.2.0]: Remove this ignore; https://github.com/bergos/file-fetch/pull/6
      /* istanbul ignore next */
      if (resp.status === 404) {
        // Don't allow browser (tested in Firefox) to continue
        //  and give `SyntaxError` with missing file or we won't be
        //  able to try without the hyphen
        throw new Error('Trying again');
      }
      const strings = await (resp.json());
      return {
        locale,
        strings
      };
    } catch (err) {
      if (err.name === 'SyntaxError') {
        throw err;
      }
      const newLocale = await localeMatcher(locale);
      return getLocale(newLocale);
    }
  }
  if (localeMatcher === 'lookup') {
    localeMatcher = function (locale) {
      if (!locale.includes('-')) {
        throw new Error('Locale not available');
      }
      // Try without hyphen ("lookup" algorithm: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl )
      return locale.replace(/-.*$/u, '');
    };
  } else if (typeof localeMatcher !== 'function') {
    throw new TypeError('`localeMatcher` must be "lookup" or a function!');
  }
  // eslint-disable-next-line no-return-await
  return await promiseChainForValues(
    [...locales, ...defaultLocales],
    getLocale,
    'No matching locale found!'
  );
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher='lookup']
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='richNested']
 * @param {?AllSubstitutionCallback|AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {false|SubstitutionObject} [cfg.substitutions={}]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */
export const i18n = async function i18n ({
  /* eslint-enable max-len */
  locales,
  defaultLocales,
  localesBasePath,
  localeResolver,
  localeMatcher,
  messageStyle,
  allSubstitutions: defaultAllSubstitutionsValue,
  insertNodes,
  defaults: defaultDefaults,
  substitutions: defaultSubstitutions,
  dom: domDefaults = false,
  forceNodeReturn: forceNodeReturnDefault = false,
  throwOnMissingSuppliedFormatters:
    throwOnMissingSuppliedFormattersDefault = true,
  throwOnExtraSuppliedFormatters:
    throwOnExtraSuppliedFormattersDefault = true
} = {}) {
  const {strings, locale: resolvedLocale} = await findLocaleStrings({
    locales, defaultLocales, localeResolver, localesBasePath, localeMatcher
  });
  if (!strings || typeof strings !== 'object') {
    throw new TypeError(`Locale strings must be an object!`);
  }
  const messageForKey = getMessageForKeyByStyle({messageStyle});
  return (key, substitutions, {
    allSubstitutions = defaultAllSubstitutionsValue,
    defaults = defaultDefaults,
    dom = domDefaults,
    forceNodeReturn = forceNodeReturnDefault,
    throwOnMissingSuppliedFormatters = throwOnMissingSuppliedFormattersDefault,
    throwOnExtraSuppliedFormatters = throwOnExtraSuppliedFormattersDefault
  } = {}) => {
    const message = messageForKey(strings, key);
    const string = getStringFromMessageAndDefaults({
      message: (message && message.value) || false,
      defaults,
      messageForKey,
      key
    });

    return getDOMForLocaleString({
      string,
      locale: resolvedLocale,
      allSubstitutions,
      insertNodes,
      substitutions: {...defaultSubstitutions, ...substitutions},
      dom,
      forceNodeReturn,
      throwOnMissingSuppliedFormatters,
      throwOnExtraSuppliedFormatters
    });
  };
};
