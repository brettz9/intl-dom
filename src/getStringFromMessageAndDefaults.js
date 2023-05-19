import {getMessageForKeyByStyle} from './getMessageForKeyByStyle.js';

/**
 * @param {object} cfg
 * @param {string|false} [cfg.message] If present, this string will be
 *   the return value.
 * @param {false|null|undefined|
 *   import('./getMessageForKeyByStyle.js').LocaleObject
 * } [cfg.defaults]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|
 *   import('./getMessageForKeyByStyle.js').MessageStyleCallback
 * } [cfg.messageStyle="richNested"]
 * @param {import('./getMessageForKeyByStyle.js').
 *   MessageStyleCallback
 * } [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based
 *   on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings;
 *   used to find a default if no string `message` is provided.
 * @returns {string}
 */
export const getStringFromMessageAndDefaults = ({
  message,
  defaults,
  messageStyle,
  messageForKey = getMessageForKeyByStyle({messageStyle}),
  key
}) => {
  // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
  /** @type {string|false} */
  let str;
  if (typeof message === 'string') {
    str = message;
  } else if (
    defaults === false || defaults === undefined || defaults === null
  ) {
    str = false;
  } else if (defaults && typeof defaults === 'object') {
    const msg = messageForKey(defaults, key);
    str = msg ? msg.value : msg;
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
