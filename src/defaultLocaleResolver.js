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
