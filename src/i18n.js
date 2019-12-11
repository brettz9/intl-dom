import {getMessageForKeyByStyle} from './getMessageForKeyByStyle.js';
import {findLocaleStrings} from './findLocaleStrings.js';
import {getDOMForLocaleString} from './getDOMForLocaleString.js';
import {
  getStringFromMessageAndDefaults
} from './getStringFromMessageAndDefaults.js';
import {sort, arrayToSortedListFragment} from './collation.js';

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
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
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
  maximumLocalNestingDepth,
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
  const formatter = (key, substitutions, {
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

  formatter.sort = (...args) => {
    return sort(resolvedLocale, ...args);
  };

  formatter.arrayToSortedListFragment = (...args) => {
    return arrayToSortedListFragment(
      resolvedLocale, ...args
    );
  };

  return formatter;
};
