/* globals fetch, document */

/**
 * @typedef {(
 *   input: RequestInfo|URL, init?: RequestInit
 * ) => Promise<Response>} Fetch
 */
/**
 * @type {null|Fetch}
 */
let _fetch = typeof fetch !== 'undefined'
  ? fetch
  /* c8 ignore next */
  : null;

/**
 * @param {Fetch} f
 * @returns {void}
 */
export const setFetch = (f) => {
  _fetch = f;
};

/**
 * @returns {Fetch|null}
 */
export const getFetch = () => {
  return _fetch;
};

/** @type {Document|null} */
let _doc = typeof document !== 'undefined'
  /* c8 ignore next */
  ? document
  : null;

/**
 * @param {Document} doc
 * @returns {void}
 */
export const setDocument = (doc) => {
  _doc = doc;
};

/**
 * @returns {Document|null}
 */
export const getDocument = () => {
  return _doc;
};
