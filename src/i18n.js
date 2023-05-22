import {getMessageForKeyByStyle} from './getMessageForKeyByStyle.js';
import {findLocaleStrings} from './findLocaleStrings.js';
import {getDOMForLocaleString} from './getDOMForLocaleString.js';
import {
  getStringFromMessageAndDefaults
} from './getStringFromMessageAndDefaults.js';
import {sort, sortList, list} from './collation.js';
import {defaultKeyCheckerConverter} from './defaultKeyCheckerConverter.js';

/**
 * @typedef {import('./index.js').Sort} Sort
 */
/**
 * @typedef {import('./index.js').SortList} SortList
 */
/**
 * @typedef {import('./index.js').List} List
 */

/**
 * @typedef {import('./index.js').I18NCallback} I18NCallback
 */

/**
 * @param {object} cfg
 * @param {import('./getMessageForKeyByStyle.js').LocaleObject} cfg.strings
 * @param {string} cfg.resolvedLocale
 * @param {"richNested"|"rich"|"plain"|"plainNested"|
 *   import('./getMessageForKeyByStyle.js').
 *     MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').
 *     AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {import('./defaultInsertNodes.js').
 *   InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {import('./defaultKeyCheckerConverter.js').
 *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|
 *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
 * @param {false|import('./defaultLocaleResolver.js').
 *   SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {I18NCallback} Rejects if no suitable locale is found.
 */
export const i18nServer = function i18nServer ({
  strings,
  resolvedLocale,
  messageStyle = 'richNested',
  allSubstitutions: defaultAllSubstitutionsValue,
  insertNodes,
  keyCheckerConverter = defaultKeyCheckerConverter,
  defaults: defaultDefaults,
  substitutions: defaultSubstitutions,
  maximumLocalNestingDepth,
  dom: domDefaults = false,
  forceNodeReturn: forceNodeReturnDefault = false,
  throwOnMissingSuppliedFormatters:
    throwOnMissingSuppliedFormattersDefault = true,
  throwOnExtraSuppliedFormatters:
    throwOnExtraSuppliedFormattersDefault = true
}) {
  if (!strings || typeof strings !== 'object') {
    throw new TypeError(`Locale strings must be an object!`);
  }
  const messageForKey = getMessageForKeyByStyle({messageStyle});

  /**
   * @type {I18NCallback}
   */
  const formatter = (key, substitutions, {
    allSubstitutions = defaultAllSubstitutionsValue,
    defaults = defaultDefaults,
    dom = domDefaults,
    forceNodeReturn = forceNodeReturnDefault,
    throwOnMissingSuppliedFormatters = throwOnMissingSuppliedFormattersDefault,
    throwOnExtraSuppliedFormatters = throwOnExtraSuppliedFormattersDefault
  } = {}) => {
    key = /** @type {string} */ (keyCheckerConverter(key, messageStyle));
    const message = messageForKey(strings, key);
    const string = getStringFromMessageAndDefaults({
      message: message && typeof message.value === 'string'
        ? message.value
        : false,
      defaults,
      messageForKey,
      key
    });

    return getDOMForLocaleString({
      string,
      locals: strings.head && strings.head.locals,
      switches: strings.head && strings.head.switches,
      locale: resolvedLocale,
      maximumLocalNestingDepth,
      allSubstitutions,
      insertNodes,
      substitutions: {...defaultSubstitutions, ...substitutions},
      dom,
      forceNodeReturn,
      throwOnMissingSuppliedFormatters,
      throwOnExtraSuppliedFormatters
    });
  };

  formatter.resolvedLocale = resolvedLocale;
  formatter.strings = strings;

  /** @type {Sort} */
  formatter.sort = (arrayOfItems, options) => {
    return sort(resolvedLocale, arrayOfItems, options);
  };

  /** @type {SortList} */
  formatter.sortList = (arrayOfItems, map, listOptions, collationOptions) => {
    return sortList(
      resolvedLocale, arrayOfItems, map, listOptions, collationOptions
    );
  };

  /** @type {List} */
  formatter.list = (arrayOfItems, options) => {
    return list(
      resolvedLocale, arrayOfItems, options
    );
  };

  return formatter;
};

/**
 * @typedef {number} Integer
 */

/**
 * @param {object} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {import('./findLocaleStrings.js').
 *   LocaleStringFinder} [cfg.localeStringFinder=findLocaleStrings]
 * @param {string} [cfg.localesBasePath="."]
 * @param {import('./defaultLocaleResolver.js').
 *   LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|import('./findLocaleStrings.js').
 *   LocaleMatcher} [cfg.localeMatcher="lookup"]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|
 *   import('./getMessageForKeyByStyle.js').
 *     MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').
 *     AllSubstitutionCallback[])} [cfg.allSubstitutions]
 * @param {import('./defaultInsertNodes.js').
 *   InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {import('./defaultKeyCheckerConverter.js').
 *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|
 *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
 * @param {false|
 *   import('./defaultLocaleResolver.js').
 *     SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */
export const i18n = async function i18n ({
  locales,
  defaultLocales,
  localeStringFinder = findLocaleStrings,
  localesBasePath,
  localeResolver,
  localeMatcher,
  messageStyle,
  allSubstitutions,
  insertNodes,
  keyCheckerConverter,
  defaults,
  substitutions,
  maximumLocalNestingDepth,
  dom,
  forceNodeReturn,
  throwOnMissingSuppliedFormatters,
  throwOnExtraSuppliedFormatters
} = {}) {
  const {strings, locale: resolvedLocale} = await localeStringFinder({
    locales, defaultLocales, localeResolver, localesBasePath, localeMatcher
  });
  if (!defaults && defaultLocales) {
    let defaultLocale;
    ({strings: defaults, locale: defaultLocale} = await localeStringFinder({
      locales: defaultLocales,
      defaultLocales: [],
      localeResolver, localesBasePath, localeMatcher
    }));
    if (defaultLocale === resolvedLocale) {
      defaults = null; // No need to fall back
    }
  }

  return i18nServer({
    strings,
    resolvedLocale,
    messageStyle,
    allSubstitutions,
    insertNodes,
    keyCheckerConverter,
    defaults,
    substitutions,
    maximumLocalNestingDepth,
    dom,
    forceNodeReturn,
    throwOnMissingSuppliedFormatters,
    throwOnExtraSuppliedFormatters
  });
};
