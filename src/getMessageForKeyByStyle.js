import {unescapeBackslashes, processRegex} from './utils.js';

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
* @typedef {LocaleStringBodyObject|
* PlainLocaleStringBodyObject|PlainObject} LocaleBody
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
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @returns {MessageStyleCallback}
 */
export const getMessageForKeyByStyle = ({
  /* eslint-enable max-len */
  messageStyle = 'richNested'
} = {}) => {
  // Todo: Support `plainNested` style
  return typeof messageStyle === 'function'
    ? messageStyle
    : (messageStyle === 'richNested'
      ? (mainObj, key) => {
        const obj = mainObj && typeof mainObj === 'object' && mainObj.body;
        const keys = [];
        // eslint-disable-next-line prefer-named-capture-group
        const possiblyEscapedCharPattern = /(\\*)\./gu;
        const mergeWithPreviousOrStart = (val) => {
          if (!keys.length) {
            keys[0] = '';
          }
          keys[keys.length - 1] += val;
        };
        processRegex(possiblyEscapedCharPattern, key, {
          // If odd, this is just an escaped dot, so merge content with
          //   any previous
          extra: mergeWithPreviousOrStart,
          onMatch (_, esc) {
            // If even, there are no backslashes, or they are just escaped
            //  backslashes and not an escaped dot, so start anew, though
            //  first merge any backslashes
            mergeWithPreviousOrStart(esc);
            keys.push('');
          }
        });
        const keysUnescaped = keys.map((ky) => {
          return unescapeBackslashes(ky);
        });

        let ret = false;
        let currObj = obj;
        keysUnescaped.some((ky, i, kys) => {
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
          : (messageStyle === 'plainNested'
            ? (mainObj, key) => {
              const obj = mainObj && typeof mainObj === 'object' &&
                mainObj.body;
              if (obj && typeof obj === 'object') {
                const keys = key.split('.');
                const value = keys.reduce((o, k) => {
                  if (o && o[k]) {
                    return o[k];
                  }
                  return null;
                }, obj);
                if (value && typeof value === 'string') {
                  return {value};
                }
              }
              return false;
            }
            : (() => {
              throw new TypeError(`Unknown \`messageStyle\` ${messageStyle}`);
            })()))
      )
    );
};
