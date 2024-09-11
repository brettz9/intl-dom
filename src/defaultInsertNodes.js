import {
  LocalFormatter, RegularFormatter, SwitchFormatter
} from './Formatter.js';
import {defaultAllSubstitutions} from './defaultAllSubstitutions.js';
import {unescapeBackslashes, parseJSONExtra, processRegex} from './utils.js';

/**
 * @typedef {number} Integer
 */

/**
 * @callback Replace
 * @param {{
 *   str: string,
 *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   formatter?: import('./Formatter.js').RegularFormatter|
 *     import('./Formatter.js').LocalFormatter|
 *     import('./Formatter.js').SwitchFormatter
 * }} cfg
 * @returns {string}
 */

/**
 * @callback ProcessSubstitutions
 * @param {{
 *   str: string,
 *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   formatter?: import('./Formatter.js').RegularFormatter|
 *     import('./Formatter.js').LocalFormatter|
 *     import('./Formatter.js').SwitchFormatter
 * }} cfg
 * @returns {(string|Node)[]}
 */

/**
 * Callback to return a string or array of nodes and strings based on
 *   a localized string, substitutions object, and other metadata.
 *
 * `string` - The localized string.
 * `dom` - If substitutions known to contain DOM, can be set
 *    to `true` to optimize.
 * `usedKeys` - Array for tracking which keys have been used. Defaults
 *   to empty array.
 * `substitutions` - The formatting substitutions object.
 * `allSubstitutions` - The
 *   callback or array composed thereof for applying to each substitution.
 * `locale` - The successfully resolved locale
 * `locals` - The local section.
 * `switches` - The switch section.
 * `maximumLocalNestingDepth` - Depth of local variable resolution to
 *   check before reporting a recursion error. Defaults to 3.
 * `missingSuppliedFormatters` - Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * `checkExtraSuppliedFormatters` - No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @typedef {(cfg: {
 *   string: string,
 *   dom?: boolean,
 *   usedKeys: string[],
 *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   allSubstitutions?: ?(
 *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]
 *   )
 *   locale: string|undefined,
 *   locals?: import('./getMessageForKeyByStyle.js').LocalObject|undefined,
 *   switches: import('./defaultLocaleResolver.js').Switches|undefined,
 *   maximumLocalNestingDepth?: Integer,
 *   missingSuppliedFormatters: import('./getDOMForLocaleString.js').
 *     MissingSuppliedFormattersCallback,
 *   checkExtraSuppliedFormatters: import('./getDOMForLocaleString.js').
 *     CheckExtraSuppliedFormattersCallback
 * }) => string|(Node|string)[]} InsertNodesCallback
 */

/**
 * @type {InsertNodesCallback}
 */
export const defaultInsertNodes = ({
  string, dom, usedKeys, substitutions, allSubstitutions, locale,
  locals, switches,
  maximumLocalNestingDepth = 3,
  missingSuppliedFormatters,
  checkExtraSuppliedFormatters
}) => {
  if (typeof maximumLocalNestingDepth !== 'number') {
    throw new TypeError('`maximumLocalNestingDepth` must be a number.');
  }

  const addFunctionKeys = () => {
    Object.entries(substitutions).forEach(([key, value]) => {
      if (typeof value === 'function') {
        usedKeys.push(key);
      }
    });
  };
  addFunctionKeys();

  const localFormatter = new LocalFormatter(
    /** @type {import('./getMessageForKeyByStyle.js').LocalObject} */ (locals)
  );
  const regularFormatter = new RegularFormatter(substitutions);
  const switchFormatter = new SwitchFormatter(
    /** @type {import('./defaultLocaleResolver.js').Switches} */
    (switches),
    {substitutions}
  );

  // eslint-disable-next-line prefer-named-capture-group -- Convenient for now
  const formattingRegex = /(\\*)\{((?:[^}]|\\\})*?)(?:(\|)([^}]*))?\}/gu;
  if (allSubstitutions) {
    allSubstitutions = Array.isArray(allSubstitutions)
      ? allSubstitutions
      : [allSubstitutions];
  }

  /**
   * @param {{
   *   key: string,
   *   arg: string,
   *   substs: import('./defaultLocaleResolver.js').SubstitutionObject
   * }} cfg
   * @returns {string|Node}
   */
  const getSubstitution = ({key, arg, substs}) => {
    /** @type {import('./defaultLocaleResolver.js').SubstitutionObjectValue} */
    let substitution;
    const isLocalKey =
      /**
       * @type {typeof import('./Formatter.js').LocalFormatter}
       */ (
        localFormatter.constructor
      ).isMatchingKey(key);
    if (isLocalKey) {
      substitution = localFormatter.getSubstitution(key);
    } else if (
      /**
       * @type {typeof import('./Formatter.js').SwitchFormatter}
       */ (switchFormatter.constructor).isMatchingKey(key)
    ) {
      substitution = switchFormatter.getSubstitution(key, {
        // eslint-disable-next-line object-shorthand -- TS casting
        locale: /** @type {string} */ (locale),
        usedKeys,
        arg,
        missingSuppliedFormatters
      });
    } else {
      substitution = substs[key];
      if (typeof substitution === 'function') {
        substitution = substitution({arg, key});
      }
    }
    // Todo: Could support resolving locals within arguments
    // Todo: Even for `null` `allSubstitutions`, we could have
    //  a mode to throw for non-string/non-DOM (non-numbers?),
    //  or whatever is not likely intended as a target for `toString()`.
    if (allSubstitutions) {
      substitution = /** @type {string|Node} */ (
        /**
         * @type {import('./defaultAllSubstitutions.js').
         *   AllSubstitutionCallback[]
         * }
         */ (
          allSubstitutions
        ).reduce(
          /**
           * @param {import('./defaultLocaleResolver.js').
           *   SubstitutionObjectValue} subst
           * @param {import('./defaultAllSubstitutions.js').
           *   AllSubstitutionCallback} allSubst
           * @returns {string|Node}
           */
          (subst, allSubst) => {
            return allSubst({
              value: subst,
              arg,
              key,
              locale
            });
          }, substitution
        ));
    } else if (arg && (/^(?:NUMBER|DATE(?:TIME|RANGE|TIMERANGE)?|REGION|LANGUAGE|SCRIPT|CURRENCY|RELATIVE|LIST)(?:\||$)/u).test(arg)) {
      substitution = defaultAllSubstitutions({
        value: substitution, arg, key, locale
      });
    }

    // Change this and return type if other substitutions possible
    return /** @type {string|Node} */ (substitution);
  };

  let recursiveLocalCount = 1;
  /**
   * @param {{
   *   substitution: string|Node,
   *   ky: string,
   *   arg: string,
   *   processSubsts: Replace|ProcessSubstitutions
   * }} cfg
   * @returns {number|string|Node|(string|Node)[]}
   */
  const checkLocalVars = ({substitution, ky, arg, processSubsts}) => {
    /** @type {number|string|Node|(string|Node)[]} */
    let subst = substitution;
    if (
      typeof substitution === 'string' &&
      substitution.includes('{')
    ) {
      if (recursiveLocalCount++ > maximumLocalNestingDepth) {
        throw new TypeError('Too much recursion in local variables.');
      }

      if (
        /** @type {typeof import('./Formatter.js').LocalFormatter} */ (
          localFormatter.constructor
        ).isMatchingKey(ky)
      ) {
        let extraSubsts = substitutions;
        let localFormatters;
        if (arg) {
          localFormatters = parseJSONExtra(arg);
          extraSubsts = {
            ...substitutions,
            ...localFormatters
          };
        }
        subst = processSubsts({
          str: substitution, substs: extraSubsts,
          formatter: localFormatter
        });
        if (localFormatters) {
          checkExtraSuppliedFormatters({substitutions: localFormatters});
        }
      } else if (
        /** @type {typeof import('./Formatter.js').SwitchFormatter} */
        (switchFormatter.constructor).isMatchingKey(ky)
      ) {
        subst = processSubsts({
          str: substitution
        });
      }
    }

    return subst;
  };

  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    // Run this block to optimize non-DOM substitutions
    let returnsDOM = false;

    /** @type {Replace} */
    const replace = ({
      str, substs = substitutions,
      formatter = regularFormatter
    }) => {
      return str.replaceAll(
        formattingRegex,
        /**
         * @param {string} _
         * @param {string} esc
         * @param {string} ky
         * @param {string} pipe
         * @param {string} arg
         * @returns {string}
         */
        (_, esc, ky, pipe, arg) => {
          if (esc.length % 2) {
            return _;
          }
          if (missingSuppliedFormatters({
            key: ky,
            formatter
          })) {
            return _;
          }
          /** @type {string|number|Node|(string|Node)[]} */
          let substitution = getSubstitution({key: ky, arg, substs});

          substitution = checkLocalVars({
            substitution, ky, arg, processSubsts: replace
          });

          returnsDOM = returnsDOM ||
            (substitution !== null && typeof substitution === 'object' &&
            'nodeType' in substitution);
          usedKeys.push(ky);
          return esc + substitution;
        }
      );
    };
    const ret = replace({str: string});
    if (!returnsDOM) {
      checkExtraSuppliedFormatters({substitutions});
      usedKeys.length = 0;
      addFunctionKeys();
      return unescapeBackslashes(ret);
    }
    usedKeys.length = 0;
    addFunctionKeys();
  }

  recursiveLocalCount = 1;

  /** @type {ProcessSubstitutions} */
  const processSubstitutions = ({
    str, substs = substitutions, formatter = regularFormatter
  }) => {
    /** @type {(string|Node)[]} */
    const nodes = [];

    // Copy to ensure we are resetting index on each instance (manually
    // resetting on `formattingRegex` is problematic with recursion that
    // uses the same regex copy)
    const regex = new RegExp(formattingRegex, 'gu');

    /**
     * @param {...(string|Node)} args
     */
    const push = (...args) => {
      nodes.push(...args);
    };

    processRegex(regex, str, {
      extra: push,
      onMatch (_, esc, ky, pipe, arg) {
        if (missingSuppliedFormatters({
          key: ky, formatter
        })) {
          push(_);
        } else {
          if (esc.length) {
            push(esc);
          }

          /** @type {string|number|Node|(string|Node)[]} */
          let substitution = getSubstitution({key: ky, arg, substs});
          substitution = checkLocalVars({
            substitution, ky, arg, processSubsts: processSubstitutions
          });
          if (Array.isArray(substitution)) {
            push(...substitution);
          } else if (
            // Clone so that multiple instances may be added (and no
            // side effects to user code)
            substitution && typeof substitution === 'object' &&
            'nodeType' in substitution
          ) {
            push(substitution.cloneNode(true));
          } else {
            // Why no number here?
            push(/** @type {string} */ (substitution));
          }
        }
        usedKeys.push(ky);
      }
    });
    return nodes;
  };
  const nodes = processSubstitutions({str: string});

  checkExtraSuppliedFormatters({substitutions});
  usedKeys.length = 0;
  return nodes.map((node) => {
    if (typeof node === 'string') {
      return unescapeBackslashes(node);
    }
    return node;
  });
};
