import {getMessageForKeyByStyle} from './index.js';
import {parseJSONExtra} from './utils.js';
import {getFormatterInfo} from './defaultAllSubstitutions.js';

export class Formatter {
}

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

export class LocalFormatter extends Formatter {
  constructor (locals) {
    super();
    this.locals = locals;
  }
  getSubstitution (key) {
    return getSubstitution({
      key: key.slice(1), body: this.locals, type: 'local'
    });
  }
  isMatch (key) {
    const components = key.slice(1).split('.');
    let parent = this.locals;
    return this.constructor.isMatchingKey(key) && components.every((cmpt) => {
      const result = cmpt in parent;
      parent = parent[cmpt];
      return result;
    });
  }
  static isMatchingKey (key) {
    return key.startsWith('-');
  }
}

export class RegularFormatter extends Formatter {
  constructor (substitutions) {
    super();
    this.substitutions = substitutions;
  }
  isMatch (key) {
    return this.constructor.isMatchingKey(key) && key in this.substitutions;
  }
  static isMatchingKey (key) {
    return (/^\w/u).test(key);
  }
}

export class SwitchFormatter extends Formatter {
  constructor (switches, {substitutions}) {
    super();
    this.switches = switches;
    this.substitutions = substitutions;
  }
  getSubstitution (key, {locale, usedKeys, arg, missingSuppliedFormatters}) {
    const ky = this.constructor.getKey(key).slice(1);
    // Expression might not actually use formatter, e.g., for singular,
    //  the conditional might just write out "one"
    usedKeys.push(ky);

    // Todo: Should throw on encountering duplicate fundamental keys (even
    //  if there are different arguments, that should not be allowed)
    const objKey = Object.keys(this.switches).find((switchKey) => {
      return switchKey.split('|')[0] === ky;
    });
    const body = this.switches[objKey];

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

    const formatterValue = this.substitutions[ky];

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
    const messageStyle = 'rich';
    try {
      return getSubstitution({
        messageStyle, key: match || arg, body, type: 'switch'
      });
    } catch (err) {
      try {
        return getSubstitution({
          messageStyle, key: '*' + match, body, type: 'switch'
        });
      } catch (error) {
        const k = Object.keys(body).find(
          (switchKey) => switchKey.startsWith('*')
        );
        if (!k) {
          throw new Error(`No defaults found for switch ${ky}`);
        }
        return getSubstitution({messageStyle, key: k, body, type: 'switch'});
      }
    }
  }
  isMatch (key) {
    return key && this.constructor.isMatchingKey(key) &&
      Object.keys(this.switches).some((switchKey) => {
        return key.slice(1) === this.constructor.getKey(switchKey);
      });
  }
  static isMatchingKey (key) {
    return key.startsWith('~');
  }
  static getKey (key) {
    const match = key.match(/^[^|]*/u);
    return match && match[0];
  }
}
