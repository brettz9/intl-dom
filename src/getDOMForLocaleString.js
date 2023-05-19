import {defaultAllSubstitutions} from './defaultAllSubstitutions.js';
import {defaultInsertNodes} from './defaultInsertNodes.js';
import {getDocument} from './shared.js';

export {setDocument, getDocument} from './shared.js';

/**
 * @typedef {number} Integer
 */

/**
 * @callback CheckExtraSuppliedFormattersCallback
 * @param {import('./defaultLocaleResolver.js').SubstitutionObject|{
 *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject
 * }} substs (Why is an arg. of `substitutions` being passed in?)
 * @throws {Error} Upon an extra formatting key being found
 * @returns {void}
 */

/**
 * @typedef {(
 *   cfg: {
 *     key: string,
 *     formatter: import('./Formatter.js').LocalFormatter|
 *       import('./Formatter.js').RegularFormatter|
 *       import('./Formatter.js').SwitchFormatter
 *   }
 * ) => boolean} MissingSuppliedFormattersCallback
 */

/**
 *
 * @param {object} cfg
 * @param {string} cfg.string
 * @param {string} [cfg.locale] The (possibly already resolved) locale
 *   for use by configuring formatters
 * @param {import('./getMessageForKeyByStyle.js').LocalObject} [cfg.locals]
 * @param {import('./defaultLocaleResolver.js').Switches} [cfg.switches]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').AllSubstitutionCallback[])
 * } [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {import('./defaultInsertNodes.js').InsertNodesCallback
 * } [cfg.insertNodes=defaultInsertNodes]
 * @param {false|import('./defaultLocaleResolver.js').SubstitutionObject
 * } [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {string|Text|DocumentFragment}
 */
export const getDOMForLocaleString = ({
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
}) => {
  if (typeof string !== 'string') {
    throw new TypeError(
      'An options object with a `string` property set to a string must ' +
      'be provided for `getDOMForLocaleString`.'
    );
  }

  /**
   * @param {string} str
   * @returns {Text|string}
   */
  const stringOrTextNode = (str) => {
    const _doc = getDocument();
    return forceNodeReturn
      ? /** @type {Document} */ (
        _doc
      ).createTextNode(str)
      : str;
  };

  /** @type {string[]} */
  const usedKeys = [];

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
   * @type {MissingSuppliedFormattersCallback}
   */
  const missingSuppliedFormatters = ({
    key, formatter
  }) => {
    const matching = formatter.isMatch(key);
    if (
      /**
       * @type {typeof import('./Formatter.js').LocalFormatter|
       *       typeof import('./Formatter.js').RegularFormatter|
       *       typeof import('./Formatter.js').SwitchFormatter}
       */ (
        formatter.constructor
      ).isMatchingKey(key) && !matching
    ) {
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
    locals,
    switches,
    missingSuppliedFormatters,
    checkExtraSuppliedFormatters
  });
  if (typeof nodes === 'string') {
    return stringOrTextNode(nodes);
  }

  const _doc = getDocument();
  const container = /** @type {Document} */ (_doc).createDocumentFragment();
  container.append(...nodes);

  return container;
};
