import {parseJSONExtra} from './utils.js';
import {sortedList, arrayToSortedListFragment} from './collation.js';

export const getFormatterInfo = ({object}) => {
  if (Array.isArray(object)) {
    if (typeof object[1] === 'function') {
      const [value, callback, options, extraOpts] = object;
      return {value, callback, options, extraOpts};
    }
    const [value, options, extraOpts] = object;
    return {value, options, extraOpts};
  }
  return {value: object};
};

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

  let opts;

  const applyArgs = ({type, options = opts, checkArgOptions = false}) => {
    if (typeof arg === 'string') {
      let [userType, extraArgs, argOptions] = arg.split('|');
      // Alias
      if (userType === 'DATE') {
        userType = 'DATETIME';
      }
      if (userType === type) {
        if (!extraArgs) {
          options = {};
        } else if (!checkArgOptions || argOptions) {
          // Todo: Allow escaping and restoring of pipe symbol
          options = {
            ...options,
            ...parseJSONExtra(
              checkArgOptions && argOptions ? argOptions : extraArgs
            )
          };
        }
      }
    }
    return options;
  };

  if (value && typeof value === 'object') {
    const singleKey = Object.keys(value)[0];
    if ([
      'number', 'date', 'datetime', 'relative', 'list', 'plural'
    ].includes(singleKey)) {
      let extraOpts, callback;
      ({
        value, options: opts, extraOpts, callback
      } = getFormatterInfo({object: value[singleKey]}));

      switch (singleKey) {
      case 'relative':
        // The second argument actually contains the primary options, so swap
        [extraOpts, opts] = [opts, extraOpts];
        return new Intl.RelativeTimeFormat(
          locale, applyArgs({type: 'RELATIVE'})
        ).format(value, extraOpts);

      // ListFormat (with Collator)
      case 'list':
        if (callback) {
          return arrayToSortedListFragment(
            locale, value, callback,
            applyArgs({type: 'LIST'}),
            applyArgs({
              type: 'LIST', options: extraOpts, checkArgOptions: true
            })
          );
        }
        return sortedList(locale, value, applyArgs({type: 'LIST'}), applyArgs({
          type: 'LIST', options: extraOpts, checkArgOptions: true
        }));
      default:
        // Let `number` and `date` types drop through so their options
        //  can be applied
        // Let `plural` be treated as number (since value should be a number)
        break;
      }
    }
  }

  // Numbers
  if (typeof value === 'number') {
    return new Intl.NumberFormat(
      locale,
      applyArgs({type: 'NUMBER'})
    ).format(value);
  }

  // Dates
  if (
    value && typeof value === 'object' &&
    typeof value.getTime === 'function'
  ) {
    return new Intl.DateTimeFormat(
      locale,
      applyArgs({type: 'DATETIME'})
    ).format(value);
  }

  // console.log('value', value);
  throw new TypeError('Unknown formatter');
};
