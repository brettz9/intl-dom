/* globals fetch, document */
let _fetch = typeof fetch !== 'undefined'
  // istanbul ignore next
  ? fetch
  : null;

/**
 * @param {fetch} f
 * @returns {void}
 */
export const setFetch = (f) => {
  _fetch = f;
};

/**
 * @returns {fetch}
 */
export const getFetch = () => {
  return _fetch;
};

let _doc = typeof document !== 'undefined'
  // istanbul ignore next
  ? document
  : null;

/**
 * @param {document} doc
 * @returns {void}
 */
export const setDocument = (doc) => {
  _doc = doc;
};

/**
 * @returns {document}
 */
export const getDocument = () => {
  return _doc;
};
