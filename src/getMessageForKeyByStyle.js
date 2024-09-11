import {unescapeBackslashes, processRegex} from './utils.js';

/**
* @typedef {LocaleBody} LocalObject
*/

/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 * @typedef {object} LocaleHead
 * @property {LocalObject} [locals]
 * @property {import('./defaultLocaleResolver.js').Switches} [switches]
*/

/**
 * @typedef {import('./defaultLocaleResolver.js').
 *   RichNestedLocaleStringBodyObject|
 *   import('./defaultLocaleResolver.js').RichLocaleStringBodyObject|
 *   import('./defaultLocaleResolver.js').PlainLocaleStringBodyObject|
 *   import('./defaultLocaleResolver.js').PlainNestedLocaleStringBodyObject|
 *   object
 * } LocaleBody
 */

/**
* @typedef {object} LocaleObject
* @property {LocaleHead} [head]
* @property {LocaleBody} body
*/

/**
* @typedef {object} MessageStyleCallbackResult
* @property {string} value Regardless of message style, will contain
*    the string result
* @property {import(
*  './defaultLocaleResolver.js'
*  ).RichLocaleStringSubObject} [info] Full info on the localized item
*   (for rich message styles only)
*/

/**
* @callback MessageStyleCallback
* @param {LocaleObject} obj The exact
*   format depends on the `cfg.defaults` of `i18n`
* @param {string} key
* @returns {false|MessageStyleCallbackResult} If `false`, will resort to default
*/

/* eslint-disable @stylistic/max-len -- Long */
/**
 * @param {object} [cfg]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle]
 * @returns {MessageStyleCallback}
 */
export const getMessageForKeyByStyle = ({
  /* eslint-enable @stylistic/max-len -- Long */
  messageStyle = 'richNested'
} = {}) => {
  return typeof messageStyle === 'function'
    ? messageStyle
    : (messageStyle === 'richNested'
      ? (mainObj, key) => {
        const obj =
          /**
           * @type {import('./defaultLocaleResolver.js').
           *   RichNestedLocaleStringBodyObject
           * }
           */ (
            mainObj && typeof mainObj === 'object' && mainObj.body
          );

        /**
         * @type {string[]}
         */
        const keys = [];
        // eslint-disable-next-line @stylistic/max-len -- Long
        // eslint-disable-next-line prefer-named-capture-group -- Convenient for now
        const possiblyEscapedCharPattern = /(\\*)\./gu;

        /**
         * @param {string} val
         * @returns {void}
         */
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

        /**
         * @type {false|{
         *   value: string|undefined,
         *   info: import('./defaultLocaleResolver.js').
         *     RichLocaleStringSubObject
         * }}
         */
        let ret = false;
        let currObj = obj;
        keysUnescaped.some((ky, i, kys) => {
          if (!currObj || typeof currObj !== 'object') {
            return true;
          }
          if (
            // If specified key is too deep, we should fail
            i === kys.length - 1 && ky in currObj &&
            currObj[ky] && typeof currObj[ky] === 'object' &&
            'message' in currObj[ky] &&
            // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
            typeof currObj[ky].message === 'string'
          ) {
            ret = {
              value: /** @type {string} */ (currObj[ky].message),
              info:
              /**
               * @type {import('./defaultLocaleResolver.js').
               *   RichLocaleStringSubObject}
               */ (currObj[ky])
            };
          }
          currObj =
            /**
             * @type {import('./defaultLocaleResolver.js').
             *   RichNestedLocaleStringBodyObject
             * }
             */ (currObj[ky]);

          return false;
        });
        return ret;
      }
      : (messageStyle === 'rich'
        ? (mainObj, key) => {
          const obj =
            /**
             * @type {import('./defaultLocaleResolver.js').
             *   RichLocaleStringBodyObject
             * }
             */ (mainObj && typeof mainObj === 'object' && mainObj.body);
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
            const obj =
              /**
               * @type {import('./defaultLocaleResolver.js').
               *   PlainLocaleStringBodyObject
               * }
               */ (
                mainObj && typeof mainObj === 'object' && mainObj.body
              );
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
              const obj =
                /**
                 * @type {import('./defaultLocaleResolver.js').
                 *   PlainNestedLocaleStringBodyObject
                 * }
                 */ (
                  mainObj && typeof mainObj === 'object' && mainObj.body
                );
              if (obj && typeof obj === 'object') {
                // Should really be counting that it is an odd number
                //  of backslashes only
                const keys = key.split(/(?<!\\)\./u);
                const value = keys.reduce(
                  /**
                   * @param {null|string|import('./defaultLocaleResolver.js').
                   *   PlainNestedLocaleStringBodyObject} o
                   * @param {string} k
                   * @returns {null|string|import('./defaultLocaleResolver.js').
                   *   PlainNestedLocaleStringBodyObject}
                   */
                  (o, k) => {
                    if (o && typeof o === 'object' && o[k]) {
                      return o[k];
                    }
                    return null;
                  }, obj
                );
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
