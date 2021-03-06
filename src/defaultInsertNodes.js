import {
  LocalFormatter, RegularFormatter, SwitchFormatter
} from './Formatter.js';
import {defaultAllSubstitutions} from './defaultAllSubstitutions.js';
import {unescapeBackslashes, parseJSONExtra, processRegex} from './utils.js';

/* eslint-disable max-len */
/**
 * Callback to return a string or array of nodes and strings based on a localized
 * string, substitutions object, and other metadata.
 * @callback InsertNodesCallback
 * @param {PlainObject} cfg
 * @param {string} cfg.string The localized string
 * @param {boolean} [cfg.dom] If substitutions known to contain DOM, can be set
 *   to `true` to optimize
 * @param {string[]} [cfg.usedKeys=[]] Array for tracking which keys have been used
 * @param {SubstitutionObject} cfg.substitutions The formatting substitutions object
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions] The
 *   callback or array composed thereof for applying to each substitution.
 * @param {string} locale The successfully resolved locale
 * @param {Integer} [maximumLocalNestingDepth=3] Depth of local variable resolution to
 *   check before reporting a recursion error
 * @param {MissingSuppliedFormattersCallback} [cfg.missingSuppliedFormatters] Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * @param {CheckExtraSuppliedFormattersCallback} [cfg.checkExtraSuppliedFormatters] No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @returns {string|Array<Node|string>}
 */

/**
 * @type {InsertNodesCallback}
 */
export const defaultInsertNodes = ({
  /* eslint-enable max-len */
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

  const localFormatter = new LocalFormatter(locals);
  const regularFormatter = new RegularFormatter(substitutions);
  const switchFormatter = new SwitchFormatter(switches, {substitutions});

  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  const formattingRegex = /(\\*)\{((?:[^}]|\\\})*?)(?:(\|)([^}]*))?\}/gu;
  if (allSubstitutions) {
    allSubstitutions = Array.isArray(allSubstitutions)
      ? allSubstitutions
      : [allSubstitutions];
  }

  const getSubstitution = ({key, arg, substs}) => {
    let substitution;
    const isLocalKey = localFormatter.constructor.isMatchingKey(key);
    if (isLocalKey) {
      substitution = localFormatter.getSubstitution(key);
    } else if (switchFormatter.constructor.isMatchingKey(key)) {
      substitution = switchFormatter.getSubstitution(key, {
        locale, usedKeys, arg,
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
      substitution = allSubstitutions.reduce((subst, allSubst) => {
        return allSubst({
          value: subst, arg, key, locale
        });
      }, substitution);
    } else if (arg && (/^(?:NUMBER|DATE(?:TIME|RANGE|TIMERANGE)?|REGION|LANGUAGE|SCRIPT|CURRENCY|RELATIVE|LIST)(?:\||$)/u).test(arg)) {
      substitution = defaultAllSubstitutions({
        value: substitution, arg, key, locale
      });
    }
    return substitution;
  };

  let recursiveLocalCount = 1;
  const checkLocalVars = ({substitution, ky, arg, processSubsts}) => {
    if (
      typeof substitution === 'string' &&
      substitution.includes('{')
    ) {
      if (recursiveLocalCount++ > maximumLocalNestingDepth) {
        throw new TypeError('Too much recursion in local variables.');
      }

      if (localFormatter.constructor.isMatchingKey(ky)) {
        let extraSubsts = substitutions;
        let localFormatters;
        if (arg) {
          localFormatters = parseJSONExtra(arg);
          extraSubsts = {
            ...substitutions,
            ...localFormatters
          };
        }
        substitution = processSubsts({
          str: substitution, substs: extraSubsts,
          formatter: localFormatter
        });
        if (localFormatters) {
          checkExtraSuppliedFormatters({substitutions: localFormatters});
        }
      } else if (switchFormatter.constructor.isMatchingKey(ky)) {
        substitution = processSubsts({
          str: substitution
        });
      }
    }
    return substitution;
  };

  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    // Run this block to optimize non-DOM substitutions
    let returnsDOM = false;
    const replace = ({
      str, substs = substitutions,
      formatter = regularFormatter
    }) => {
      return str.replace(formattingRegex, (_, esc, ky, pipe, arg) => {
        if (esc.length % 2) {
          return _;
        }
        if (missingSuppliedFormatters({
          key: ky,
          formatter
        })) {
          return _;
        }
        let substitution = getSubstitution({key: ky, arg, substs});

        substitution = checkLocalVars({
          substitution, ky, arg, processSubsts: replace
        });

        returnsDOM = returnsDOM ||
          (substitution && typeof substitution === 'object' &&
          'nodeType' in substitution);
        usedKeys.push(ky);
        return esc + substitution;
      });
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
  const processSubstitutions = ({
    str, substs = substitutions, formatter = regularFormatter
  }) => {
    const nodes = [];

    // Copy to ensure we are resetting index on each instance (manually
    // resetting on `formattingRegex` is problematic with recursion that
    // uses the same regex copy)
    const regex = new RegExp(formattingRegex, 'gu');

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
            push(substitution);
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
