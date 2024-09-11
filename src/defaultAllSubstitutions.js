import {parseJSONExtra} from './utils.js';
import {sortList} from './collation.js';

/**
 * @typedef {number} Integer
 */

/**
 * @param {{
 *   object: import('./defaultLocaleResolver.js').DateRangeValueArray|
 *     import('./defaultLocaleResolver.js').ListValueArray|
 *     import('./defaultLocaleResolver.js').RelativeValueArray|
 *     import('./defaultLocaleResolver.js').ValueArray
 * }} cfg
 * @returns {{
 *   value: number|string|string[]|Date,
 *   options?: Intl.NumberFormatOptions|Intl.PluralRulesOptions|
 *     string|Date|number,
 *   extraOpts?: object,
 *   callback?: (item: string, i: Integer) => Element
 * }}
 */
export const getFormatterInfo = ({object}) => {
  if (Array.isArray(object)) {
    if (typeof object[1] === 'function') {
      const [
        value, callback, options, extraOpts
      ] =
        /**
         * @type {[
         *   string[], (item: string, i: Integer) => Element, object, object
         * ]}
         */ (object);
      return {value, callback, options, extraOpts};
    }
    const [value, options, extraOpts] = object;
    return {value, options, extraOpts};
  }
  return {value: object};
};

/**
 * Callback to give replacement text based on a substitution value.
 *
 * `value` - contains the value returned by the individual substitution.
 * `arg` - See `cfg.arg` of {@link SubstitutionCallback}.
 * `key` - The substitution key Not currently in use
 * `locale` - The locale.
 * @typedef {(info: {
 *   value: import('./defaultLocaleResolver.js').SubstitutionObjectValue
 *   arg?: string,
 *   key?: string,
 *   locale?: string
 * }) => string|Node} AllSubstitutionCallback
*/

/**
 * @type {AllSubstitutionCallback}
 */
export const defaultAllSubstitutions = ({value, arg, /* , key */ locale}) => {
  // Strings or DOM Nodes
  if (
    typeof value === 'string' || (value && typeof value === 'object' &&
    'nodeType' in value)
  ) {
    return value;
  }

  /** @type {object|string|Date|number|undefined} */
  let opts;

  /**
   * @param {{
   *   type: string,
   *   options?: object,
   *   checkArgOptions?: boolean;
   * }} cfg
   * @returns {object|undefined}
   */
  const applyArgs = ({
    type,
    options = /** @type {object|undefined} */ (
      opts
    ),
    checkArgOptions = false
  }) => {
    if (typeof arg === 'string') {
      // eslint-disable-next-line prefer-const -- Convenient
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

  let expectsDatetime = false;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const singleKey = Object.keys(value)[0];
    if ([
      'number', 'date', 'datetime', 'dateRange', 'datetimeRange', 'relative',
      'region', 'language', 'script', 'currency',
      'list', 'plural'
    ].includes(singleKey)) {
      let extraOpts, callback;
      /**
       * @typedef {any} AnyValue
       */

      const obj = /** @type {unknown} */ (
        /** @type {AnyValue} */
        (value)[
          /**
            * @type {"number"|"date"|"datetime"|"dateRange"|
            *   "datetimeRange"|"relative"|"region"|"language"|
            *   "script"|"currency"|"list"|"plural"}
            */
          (singleKey)
        ]
      );

      ({
        value, options: opts, extraOpts, callback
      } = getFormatterInfo({
        object:
          /**
           * @type {import('./defaultLocaleResolver.js').DateRangeValueArray|
           *   import('./defaultLocaleResolver.js').ListValueArray|
           *   import('./defaultLocaleResolver.js').RelativeValueArray|
           *   import('./defaultLocaleResolver.js').ValueArray
           * }
           */
          (obj)
      }));

      switch (singleKey) {
      case 'date': case 'datetime':
        expectsDatetime = true;
        break;
      case 'dateRange': case 'datetimeRange': {
        const dtf = new Intl.DateTimeFormat(
          locale,
          applyArgs({type: 'DATERANGE', options: extraOpts})
        );

        return dtf.formatRange(
          ...(
          /** @type {[Date, Date]} */
            ([
              /** @type {number|Date} */
              (value),
              /** @type {Date} */
              (opts)
            ].map((val) => {
              return typeof val === 'number' ? new Date(val) : val;
            }))
          )
        );
      } case 'region': case 'language': case 'script': case 'currency':
        return /** @type {string} */ (new Intl.DisplayNames(
          locale,
          {
            ...applyArgs({type: singleKey.toUpperCase()}),
            type: singleKey
          }
        ).of(/** @type {string} */ (value)));
      case 'relative':
        // The second argument actually contains the primary options, so swap
        // eslint-disable-next-line @stylistic/max-len -- Long
        [extraOpts, opts] = /** @type {[Intl.RelativeTimeFormatUnit, object?]} */ (
          [opts, extraOpts]
        );
        return new Intl.RelativeTimeFormat(
          locale, applyArgs({type: 'RELATIVE'})
        ).format(/** @type {number} */ (value), extraOpts);

      // ListFormat (with Collator)
      case 'list':
        if (callback) {
          return sortList(
            /** @type {string} */ (locale),
            /** @type {string[]} */
            (value),
            callback,
            applyArgs({type: 'LIST'}),
            applyArgs({
              type: 'LIST', options: extraOpts, checkArgOptions: true
            })
          );
        }
        return sortList(
          /** @type {string} */ (locale),
          /** @type {string[]} */
          (value),
          applyArgs({type: 'LIST'}),
          applyArgs({
            type: 'LIST', options: extraOpts, checkArgOptions: true
          })
        );
      default:
        // Let `number` and `date` types drop through so their options
        //  can be applied
        // Let `plural` be treated as number (since value should be a number)
        break;
      }
    }
  }

  // Dates
  if (
    value
  ) {
    if (
      typeof value === 'number' &&
      (expectsDatetime || (/^DATE(?:TIME)(?:\||$)/u).test(
        /** @type {string} */ (arg)
      ))
    ) {
      value = new Date(value);
    }
    if (typeof value === 'object' && 'getTime' in value &&
        typeof value.getTime === 'function') {
      return new Intl.DateTimeFormat(
        locale,
        applyArgs({type: 'DATETIME'})
      ).format(value);
    }
  }

  // Date range
  if (Array.isArray(value)) {
    const extraOpts = /** @type {Intl.DateTimeFormatOptions|undefined} */ (
      value[2]
    );
    return new Intl.DateTimeFormat(
      locale,
      applyArgs({type: 'DATERANGE', options: extraOpts})
    ).formatRange(...(
      /** @type {[Date, Date]} */
      (value.slice(0, 2).map((val) => {
        return typeof val === 'number' ? new Date(val) : val;
      }))
    ));
  }

  // Numbers
  if (typeof value === 'number') {
    return new Intl.NumberFormat(
      locale,
      applyArgs({type: 'NUMBER'})
    ).format(value);
  }

  // console.log('value', value);
  throw new TypeError('Unknown formatter');
};
