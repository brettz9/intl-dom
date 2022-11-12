import {getMessageForKeyByStyle} from './getMessageForKeyByStyle.js';

/**
 * @callback Validator
 * @param {string} key By default may only be a string, but a non-default
 *   validator may do otherwise.
 * @returns {void}
 */

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {string} [cfg.message] If present, this string will be the return value.
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings; used to find a default if no string `message` is provided.
 * @param {Validator} cfg.validator By default throws a `TypeError` if key is not a string
 * @throws {TypeError}
 * @returns {string}
 */
export const getStringFromMessageAndDefaults = ({
  /* eslint-enable max-len */
  message,
  defaults,
  messageStyle,
  messageForKey = getMessageForKeyByStyle({messageStyle}),
  validator = (key) => {
    if (typeof key !== 'string') {
      throw new TypeError(
        'An options object with a `key` string is expected on ' +
        '`getStringFromMessageAndDefaults`'
      );
    }
  },
  key
} = {}) => {
  validator(key);
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
