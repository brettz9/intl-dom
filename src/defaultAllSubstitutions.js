import {parseJSONExtra} from './utils.js';

/* eslint-disable max-len */
/**
* @callback AllSubstitutionCallback
* @param {PlainObject} cfg
* @param {string|Node|number|Date|RelativeTimeInfo|ListInfo|NumberInfo|DateInfo} cfg.value Contains
*   the value returned by the individual substitution
* @param {string} cfg.arg See `cfg.arg` of {@link SubstitutionCallback}.
* @param {string} cfg.key The substitution key
* @returns {string|Element} The replacement text or element
*/
/* eslint-enable max-len */

/**
 * @type {AllSubstitutionCallback}
 */
export const defaultAllSubstitutions = ({value, arg, key, locale}) => {
  // Strings or DOM Nodes
  if (
    typeof value === 'string' || (value && typeof value === 'object' &&
    'nodeType' in value)
  ) {
    return value;
  }

  let opts, extraOpts;
  if (value && typeof value === 'object') {
    const singleKey = Object.keys(value)[0];
    if (['number', 'date', 'relative', 'list'].includes(singleKey)) {
      if (Array.isArray(value[singleKey])) {
        [value, opts, extraOpts] = value[singleKey];
      } else {
        value = value[singleKey];
      }

      // Todo: Call `applyArgs` for `relative` and `list` options
      //  so user can call themselves or customize defaults?
      // RelativeTimeFormat
      if (singleKey === 'relative') {
        return new Intl.RelativeTimeFormat(
          locale, extraOpts
        ).format(value, opts);
      }

      // ListFormat (with Collator)
      if (singleKey === 'list') {
        value.sort(new Intl.Collator(locale, extraOpts).compare);
        return new Intl.ListFormat(locale, opts).format(value);
      }
      // Let `number` and `date` types drop through so their options
      //  can be applied
    }
  }

  const applyArgs = (type) => {
    if (typeof arg === 'string') {
      const extraArgDividerPos = arg.indexOf('|');
      let userType, extraArgs;
      if (extraArgDividerPos === -1) {
        userType = arg;
        if (userType === type) {
          opts = {};
        }
      } else {
        userType = arg.slice(0, extraArgDividerPos);
        if (userType === type) {
          extraArgs = arg.slice(extraArgDividerPos + 1);
          // Todo: Allow escaping and restoring of pipe symbol
          opts = {...opts, ...parseJSONExtra(extraArgs)};
        }
      }
    }
    return opts;
  };

  // Numbers
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, applyArgs('NUMBER')).format(value);
  }

  // Dates
  if (
    value && typeof value === 'object' &&
    typeof value.getTime === 'function'
  ) {
    return new Intl.DateTimeFormat(locale, applyArgs('DATETIME')).format(value);
  }

  // console.log('value', value);
  throw new TypeError('Unknown formatter');
};
