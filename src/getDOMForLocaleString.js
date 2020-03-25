import {defaultAllSubstitutions} from './defaultAllSubstitutions.js';
import {defaultInsertNodes} from './defaultInsertNodes.js';
import {getDocument} from './shared.js';

export {setDocument, getDocument} from './shared.js';

/* eslint-disable max-len */
/**
 *
 * @param {PlainObject} cfg
 * @param {string} cfg.string
 * @param {string} cfg.locale The (possibly already resolved) locale for use by
 *   configuring formatters
 * @param {LocalObject} [cfg.locals]
 * @param {LocalObject} [cfg.switches]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|SubstitutionObject} [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {string|DocumentFragment}
 */
export const getDOMForLocaleString = ({
  /* eslint-enable max-len */
  string,
  locale,
  locals,
  switches,
  maximumLocalNestingDepth,
  allSubstitutions = [
    defaultAllSubstitutions
  ],
  insertNodes = defaultInsertNodes,
  substitutions = false,
  dom = false,
  forceNodeReturn = false,
  throwOnMissingSuppliedFormatters = true,
  throwOnExtraSuppliedFormatters = true
} = {}) => {
  if (typeof string !== 'string') {
    throw new TypeError(
      'An options object with a `string` property set to a string must ' +
      'be provided for `getDOMForLocaleString`.'
    );
  }
  const stringOrTextNode = (str) => {
    const _doc = getDocument();
    return forceNodeReturn ? _doc.createTextNode(str) : str;
  };

  const usedKeys = [];

  /**
  * @callback CheckExtraSuppliedFormattersCallback
  * @param {SubstitutionObject} substs
  * @throws {Error} Upon an extra formatting key being found
  * @returns {void}
  */

  /**
   * @type {CheckExtraSuppliedFormattersCallback}
   */
  const checkExtraSuppliedFormatters = ({
    substitutions: substs
  }) => {
    if (throwOnExtraSuppliedFormatters) {
      Object.keys(substs).forEach((key) => {
        if (!usedKeys.includes(key)) {
          throw new Error(`Extra formatting key: ${key}`);
        }
      });
    }
  };

  /**
  * @callback MissingSuppliedFormattersCallback
  * @param {string} key
  * @param {SubstitutionObject} substs
  * @throws {Error} If missing formatting key
  * @returns {boolean}
  */
  /**
   * @type {MissingSuppliedFormattersCallback}
   */
  const missingSuppliedFormatters = ({
    key, formatter
  }) => {
    const matching = formatter.isMatch(key);
    if (formatter.constructor.isMatchingKey(key) && !matching) {
      if (throwOnMissingSuppliedFormatters) {
        throw new Error(`Missing formatting key: ${key}`);
      }
      return true;
    }
    return false;
  };

  if (
    !substitutions && !allSubstitutions &&
    !throwOnMissingSuppliedFormatters
  ) {
    return stringOrTextNode(string);
  }
  if (!substitutions) {
    substitutions = {};
  }

  const nodes = insertNodes({
    string, dom, usedKeys, substitutions, allSubstitutions, locale,
    locals, switches,
    missingSuppliedFormatters,
    checkExtraSuppliedFormatters
  });
  if (typeof nodes === 'string') {
    return stringOrTextNode(nodes);
  }

  const _doc = getDocument();
  const container = _doc.createDocumentFragment();
  container.append(...nodes);

  return container;
};
