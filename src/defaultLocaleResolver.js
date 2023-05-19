/**
* `arg` - By default, accepts the third portion of the
*   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
*   supply arguments back to the calling script.
* `key` - The substitution key.
* @callback SubstitutionCallback
* @param {{
*   arg: string,
*   key: string
* }} cfg
* @returns {string|Element} The replacement text or element
*/

/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * The first value is the main value.
 * The second are the options related to the main value.
 * The third are any additional options.
 * @typedef {[string|number|Date, object?, object?]} ValueArray
 */

/**
 * @typedef {number} Integer
 */

/**
 * @typedef {[
 *   string[],
 *   (((item: string, i: Integer) => Element)|object)?,
 *   object?,
 *   object?
 * ]} ListValueArray
 */

/**
 * @typedef {[
 *   Date|number, Date|number, Intl.DateTimeFormatOptions|undefined
 * ]} DateRangeValueArray
 */

/**
 * @typedef {[number, Intl.RelativeTimeFormatUnit, object?]} RelativeValueArray
 */

/**
 * @typedef {object} RelativeTimeInfo
 * @property {RelativeValueArray} relative
 */

/**
 * @typedef {object} ListInfo
 * @property {ListValueArray} list
 */

/**
 * @typedef {object} NumberInfo
 * @property {ValueArray|number} number
 */

/**
 * @typedef {object} DateInfo
 * @property {ValueArray} date
 */

/**
 * @typedef {object} DateTimeInfo
 * @property {ValueArray} datetime
 */

/**
 * @typedef {object} DateRangeInfo
 * @property {DateRangeValueArray} dateRange
 */

/**
 * @typedef {object} DatetimeRangeInfo
 * @property {DateRangeValueArray} datetimeRange
 */

/**
 * @typedef {object} RegionInfo
 * @property {ValueArray} region
 */

/**
 * @typedef {object} LanguageInfo
 * @property {ValueArray} language
 */

/**
 * @typedef {object} ScriptInfo
 * @property {ValueArray} script
 */

/**
 * @typedef {object} CurrencyInfo
 * @property {ValueArray} currency
 */

/**
 * @typedef {object} PluralInfo
 * @property {ValueArray} plural
 */

/**
 * @typedef {{[key: string]: string}} PlainLocaleStringBodyObject
 */

/**
 * @typedef {{
 *   [key: string]: string|PlainNestedLocaleStringBodyObject
 * }} PlainNestedLocaleStringBodyObject
 */

/**
 * @typedef {object} SwitchCaseInfo
 * @property {boolean} [default=false] Whether this conditional is the default
 */

/**
 * Contains the type, the message, and optional info about the switch case.
 * @typedef {[string, string, SwitchCaseInfo?]} SwitchCaseArray
 */

/**
 * @typedef {Object<string, SwitchCaseArray>} SwitchArray
 */

/**
 * @typedef {Object<string, SwitchArray>} SwitchArrays
 */

/**
 * @typedef {object} SwitchCase
 * @property {string} message The locale message with any formatting
 *   place-holders; defaults to use of any single conditional
 * @property {string} [description] A description to add for translators
 */

/**
 * @typedef {Object<string, SwitchCase>} Switch
 */

/**
 * @typedef {Object<string, Switch>} Switches
 */

/**
 * @typedef {object} RichLocaleStringSubObject
 * @property {string} message The locale message with any formatting
 *   place-holders; defaults to use of any single conditional
 * @property {string} [description] A description to add for translators
 * @property {Switches} [switches] Conditionals
 */

/**
 * @typedef {{
 *   [key: string]: RichLocaleStringSubObject
 * }} RichLocaleStringBodyObject
 */

/**
 * @typedef {{
 *   [key: string]: RichLocaleStringSubObject|RichNestedLocaleStringBodyObject
 * }} RichNestedLocaleStringBodyObject
 */

/**
 * Takes a base path and locale and gives a URL.
 * @callback LocaleResolver
 * @param {string} localesBasePath (Trailing slash optional)
 * @param {string} locale BCP-47 language string
 * @returns {string|false} URL of the locale file to be fetched
 */

/**
 * @typedef {[
 *   Date|number, Date|number, (Intl.DateTimeFormatOptions|undefined)?
 * ]} DateRange
 */

/**
 * @typedef {string|string[]|number|Date|DateRange|
 *     Element|Node|SubstitutionCallback|
 *     NumberInfo|PluralInfo|CurrencyInfo|LanguageInfo|ScriptInfo|
 *     DatetimeRangeInfo|DateRangeInfo|RegionInfo|DateTimeInfo|DateInfo|
 *     ListInfo|RelativeTimeInfo
 * } SubstitutionObjectValue
 */

/**
 * @typedef {{
 *   [key: string]: SubstitutionObjectValue
 * }} SubstitutionObject
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
  if ((/[./\\]/u).test(locale)) {
    throw new TypeError(
      'Locales cannot use file-reserved characters, `.`, `/` or `\\`'
    );
  }
  return `${localesBasePath.replace(/\/$/u, '')}/_locales/${locale}/messages.json`;
};
