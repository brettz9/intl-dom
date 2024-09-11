import {getMessageForKeyByStyle} from './index.js';
import {parseJSONExtra} from './utils.js';
import {getFormatterInfo} from './defaultAllSubstitutions.js';

/**
 * Base class for formatting.
 */
export class Formatter {
}

/**
 * @param {object} cfg
 * @param {string} cfg.key
 * @param {import('./getMessageForKeyByStyle.js').LocaleBody} cfg.body
 * @param {string} cfg.type
 * @param {"richNested"|"rich"|"plain"|
 *   "plainNested"|import('./getMessageForKeyByStyle.js').
 *   MessageStyleCallback} [cfg.messageStyle]
 * @returns {string}
 */
const getSubstitution = ({key, body, type, messageStyle = 'richNested'}) => {
  const messageForKey = getMessageForKeyByStyle({messageStyle});
  const substitution = messageForKey({body}, key);
  if (!substitution) {
    throw new Error(`Key value not found for ${type} key: (${key})`);
  }
  // We don't allow a substitution function here or below as comes
  //  from locale and locale content should not pose security concerns
  return substitution.value;
};

/**
 * Formatter for local variables.
 */
export class LocalFormatter extends Formatter {
  /**
   * @param {import('./getMessageForKeyByStyle.js').LocalObject} locals
   */
  constructor (locals) {
    super();
    this.locals = locals;
  }
  /**
   * @param {string} key
   * @returns {string|Element}
   */
  getSubstitution (key) {
    return getSubstitution({
      key: key.slice(1), body: this.locals, type: 'local'
    });
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  isMatch (key) {
    const components = key.slice(1).split('.');
    /** @type {import('./getMessageForKeyByStyle.js').LocaleBody} */
    let parent = this.locals;
    return /** @type {typeof LocalFormatter} */ (
      this.constructor
    ).isMatchingKey(key) && components.every((cmpt) => {
      const result = cmpt in parent;
      parent =
        /**
         * @type {import('./defaultLocaleResolver.js').
         *     RichNestedLocaleStringBodyObject|
         *   import('./defaultLocaleResolver.js').
         *     PlainNestedLocaleStringBodyObject|
         *   import('./defaultLocaleResolver.js').RichLocaleStringSubObject
         * }
         */ (
          /**
           * @type {import('./defaultLocaleResolver.js').
           *     RichNestedLocaleStringBodyObject|
           *   import('./defaultLocaleResolver.js').
           *     PlainNestedLocaleStringBodyObject
           * }
           */ (parent)[cmpt]
        );
      return result;
    });
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  static isMatchingKey (key) {
    return key.startsWith('-');
  }
}

/**
 * Formatter for regular variables.
 */
export class RegularFormatter extends Formatter {
  /**
   * @param {import('./defaultLocaleResolver.js').SubstitutionObject
   * } substitutions
   */
  constructor (substitutions) {
    super();
    this.substitutions = substitutions;
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  isMatch (key) {
    return /** @type {typeof RegularFormatter} */ (
      this.constructor
    ).isMatchingKey(key) && key in this.substitutions;
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  static isMatchingKey (key) {
    return (/^\w/u).test(key);
  }
}

/**
 * Formatter for switch variables.
 */
export class SwitchFormatter extends Formatter {
  /**
   * @param {import('./defaultLocaleResolver.js').Switches} switches
   * @param {object} cfg
   * @param {import('./defaultLocaleResolver.js').
   *   SubstitutionObject} cfg.substitutions
   */
  constructor (switches, {substitutions}) {
    super();
    this.switches = switches;
    this.substitutions = substitutions;
  }

  /**
   * @param {string} key
   * @param {object} cfg
   * @param {string} cfg.locale
   * @param {(string|undefined)[]} cfg.usedKeys
   * @param {string} cfg.arg
   * @param {import('./getDOMForLocaleString.js').
   *   MissingSuppliedFormattersCallback} cfg.missingSuppliedFormatters
   * @returns {string}
   */
  getSubstitution (key, {locale, usedKeys, arg, missingSuppliedFormatters}) {
    const ky = /** @type {typeof SwitchFormatter} */ (
      this.constructor
    ).getKey(key).slice(1);
    // Expression might not actually use formatter, e.g., for singular,
    //  the conditional might just write out "one"

    const [objKey, body, keySegment] = this.getMatch(ky);
    usedKeys.push(keySegment);

    let type;
    /** @type {string} */
    let opts;
    if (objKey && objKey.includes('|')) {
      [, type, opts] = objKey.split('|');
    }
    if (!body) {
      missingSuppliedFormatters({
        key,
        formatter: this
      });
      return String.raw`\{` + key + '}';
    }

    /*
    if (!(ky in this.substitutions)) {
      throw new Error(`Switch expecting formatter: ${ky}`);
    }
    */

    /**
     * @param {number} value
     * @param {Intl.NumberFormatOptions|undefined} [defaultOptions]
     * @returns {string}
     */
    const getNumberFormat = (value, defaultOptions) => {
      const numberOpts = parseJSONExtra(opts);
      return new Intl.NumberFormat(locale, {
        ...defaultOptions, ...numberOpts
      }).format(value);
    };

    /**
     * @param {number} value
     * @param {Intl.PluralRulesOptions|undefined} [defaultOptions]
     * @returns {Intl.LDMLPluralRule}
     */
    const getPluralFormat = (value, defaultOptions) => {
      const pluralOpts = parseJSONExtra(opts);
      return new Intl.PluralRules(locale, {
        ...defaultOptions, ...pluralOpts
      }).select(value);
    };
    const formatterValue = this.substitutions[
      /** @type {string} */ (keySegment)
    ];

    let match = formatterValue;
    if (typeof formatterValue === 'number') {
      switch (type) {
      case 'NUMBER':
        match = getNumberFormat(formatterValue);
        break;
      case 'PLURAL':
        match = getPluralFormat(formatterValue);
        break;
      default:
        match = new Intl.PluralRules(locale).select(formatterValue);
        break;
      }
    } else if (formatterValue && typeof formatterValue === 'object') {
      const singleKey = Object.keys(formatterValue)[0];
      if (['number', 'plural'].includes(singleKey)) {
        const {value, options} = getFormatterInfo({
          object:
          /**
           * @type {import('./defaultLocaleResolver.js').NumberInfo|
           *   import('./defaultLocaleResolver.js').PluralInfo}
           */
          // @ts-expect-error Ok
          (formatterValue)[
            /** @type {"number"|"plural"} */ (singleKey)
          ]
        });
        if (!type) {
          type = singleKey.toUpperCase();
        }
        const typeMatches = singleKey.toUpperCase() === type;
        if (!typeMatches) {
          throw new TypeError(
            `Expecting type "${
              type.toLowerCase()
            }"; instead found "${singleKey}".`
          );
        }
        // eslint-disable-next-line default-case -- Just two cases
        switch (type) {
        case 'NUMBER':
          match = getNumberFormat(
            /** @type {number} */ (value),
            /** @type {Intl.NumberFormatOptions} */
            (options)
          );
          break;
        case 'PLURAL':
          match = getPluralFormat(
            /** @type {number} */ (value),
            /** @type {Intl.PluralRulesOptions} */
            (options)
          );
          break;
        }
      }
    }

    // We do not want the default `richNested` here as that will split
    //  up the likes of `0.0`
    const messageStyle = 'richNested';

    /**
     * @param {string} s
     * @returns {string}
     */
    const preventNesting = (s) => {
      return s.replaceAll('\\', '\\\\').replaceAll('.', String.raw`\.`);
    };

    try {
      return getSubstitution({
        messageStyle,
        key: match ? preventNesting(/** @type {string} */ (match)) : arg,
        body,
        type: 'switch'
      });
    // eslint-disable-next-line no-unused-vars -- Ok
    } catch (err) {
      try {
        return getSubstitution({
          messageStyle,
          key: '*' +
            preventNesting(/** @type {string} */ (match)),
          body,
          type: 'switch'
        });
      // eslint-disable-next-line no-unused-vars -- Ok
      } catch (error) {
        const k = Object.keys(body).find(
          (switchKey) => switchKey.startsWith('*')
        );
        if (!k) {
          throw new Error(`No defaults found for switch ${ky}`);
        }
        return getSubstitution({
          messageStyle, key: preventNesting(k), body, type: 'switch'
        });
      }
    }
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  isMatch (key) {
    return Boolean(
      key && /** @type {typeof SwitchFormatter} */ (
        this.constructor
      ).isMatchingKey(key) &&
        this.getMatch(key.slice(1)).length
    );
  }

  /**
  * @typedef {[
  *   objKey?: string,
  *   body?: import('./getMessageForKeyByStyle.js').LocaleBody,
  *   keySegment?: string
  * ]} SwitchMatch
  */

  /**
   * @typedef {number} Integer
   */

  /**
   * @param {string} ky
   * @returns {SwitchMatch}
   */
  getMatch (ky) {
    const ks = ky.split('.');
    const returnValue = /** @type {unknown} */ (ks.reduce(
      /**
       * @param {import('./defaultLocaleResolver.js').SwitchArrays|
       *   import('./defaultLocaleResolver.js').SwitchArray} obj
       * @param {string} k
       * @param {Integer} i
       * @throws {Error}
       * @returns {SwitchMatch|
       *   import('./defaultLocaleResolver.js').SwitchCaseArray|
       *   import('./defaultLocaleResolver.js').SwitchArray}
       */
      // @ts-expect-error It works
      (obj, k, i) => {
        if (i < ks.length - 1) {
          if (!(k in obj)) {
            throw new Error(`Switch key "${k}" not found (from "~${ky}")`);
          }
          return obj[k];
        }
        // Todo: Should throw on encountering duplicate fundamental keys (even
        //  if there are different arguments, that should not be allowed)
        const ret = Object.entries(obj).find(([switchKey]) => {
          return k === /** @type {typeof SwitchFormatter} */ (
            this.constructor
          ).getKey(switchKey);
        });

        return ret ? [...ret, k] : [];
      }, this.switches
    ));

    return /** @type {SwitchMatch} */ (returnValue);
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  static isMatchingKey (key) {
    return key.startsWith('~');
  }
  /**
   * @param {string} key
   * @returns {string}
   */
  static getKey (key) {
    const match = key.match(/^[^|]*/u);
    return /** @type {string} */ (match && match[0]);
  }
}
