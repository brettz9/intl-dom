import {getMessageForKeyByStyle} from './index.js';
import {parseJSONExtra} from './utils.js';
import {getFormatterInfo} from './defaultAllSubstitutions.js';

/**
 * Base class for formatting.
 */
export class Formatter {
}

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.key
 * @param {LocaleBody} cfg.body
 * @param {string} cfg.type
 * @param {"richNested"|"rich"|"plain"|
 *   "plainNested"|MessageStyleCallback} cfg.messageStyle
 * @returns {string|Element}
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
   * @param {LocalObject} locals
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
    let parent = this.locals;
    return this.constructor.isMatchingKey(key) && components.every((cmpt) => {
      const result = cmpt in parent;
      parent = parent[cmpt];
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
   * @param {SubstitutionObject} substitutions
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
    return this.constructor.isMatchingKey(key) && key in this.substitutions;
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
   * @param {Switches} switches
   * @param {SubstitutionObject} substitutions
   */
  constructor (switches, {substitutions}) {
    super();
    this.switches = switches;
    this.substitutions = substitutions;
  }

  /**
   * @param {string} key
   * @param {PlainObject} cfg
   * @param {string} cfg.locale
   * @param {string[]} cfg.usedKeys
   * @param {string} cfg.arg
   * @param {MissingSuppliedFormattersCallback} cfg.missingSuppliedFormatters
   * @returns {string}
   */
  getSubstitution (key, {locale, usedKeys, arg, missingSuppliedFormatters}) {
    const ky = this.constructor.getKey(key).slice(1);
    // Expression might not actually use formatter, e.g., for singular,
    //  the conditional might just write out "one"

    const [objKey, body, keySegment] = this.getMatch(ky);
    usedKeys.push(keySegment);

    let type, opts;
    if (objKey && objKey.includes('|')) {
      [, type, opts] = objKey.split('|');
    }
    if (!body) {
      missingSuppliedFormatters({
        key,
        formatter: this
      });
      return '\\{' + key + '}';
    }

    /*
    if (!(ky in this.substitutions)) {
      throw new Error(`Switch expecting formatter: ${ky}`);
    }
    */

    const getNumberFormat = (value, defaultOptions) => {
      const numberOpts = parseJSONExtra(opts);
      return new Intl.NumberFormat(locale, {
        ...defaultOptions, ...numberOpts
      }).format(value);
    };

    const getPluralFormat = (value, defaultOptions) => {
      const pluralOpts = parseJSONExtra(opts);
      return new Intl.PluralRules(locale, {
        ...defaultOptions, ...pluralOpts
      }).select(value);
    };

    const formatterValue = this.substitutions[keySegment];

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
          object: formatterValue[singleKey]
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
        // eslint-disable-next-line default-case
        switch (type) {
        case 'NUMBER':
          match = getNumberFormat(value, options);
          break;
        case 'PLURAL':
          match = getPluralFormat(value, options);
          break;
        }
      }
    }

    // We do not want the default `richNested` here as that will split
    //  up the likes of `0.0`
    const messageStyle = 'richNested';

    const preventNesting = (s) => {
      return s.replace(/\\/gu, '\\\\').replace(/\./gu, '\\.');
    };

    try {
      return getSubstitution({
        messageStyle,
        key: match ? preventNesting(match) : arg,
        body,
        type: 'switch'
      });
    } catch (err) {
      try {
        return getSubstitution({
          messageStyle, key: '*' + preventNesting(match), body, type: 'switch'
        });
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
    return key && this.constructor.isMatchingKey(key) &&
      Boolean(this.getMatch(key.slice(1)).length);
  }

  /**
  * @typedef {GenericArray} SwitchMatch
  * @property {string} 0 objKey
  * @property {LocaleBody} 1 body
  * @property {string} 2 keySegment
  */

  /**
   * @param {string} ky
   * @returns {SwitchMatch}
   */
  getMatch (ky) {
    const ks = ky.split('.');
    return ks.reduce((obj, k, i) => {
      if (i < ks.length - 1) {
        if (!(k in obj)) {
          throw new Error(`Switch key "${k}" not found (from "~${ky}")`);
        }
        return obj[k];
      }
      // Todo: Should throw on encountering duplicate fundamental keys (even
      //  if there are different arguments, that should not be allowed)
      const ret = Object.entries(obj).find(([switchKey]) => {
        return k === this.constructor.getKey(switchKey);
      });

      return ret ? [...ret, k] : [];
    }, this.switches);
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
    return match && match[0];
  }
}
