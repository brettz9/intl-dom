// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';

/**
 * @typedef {any} JSON6
 */

// @ts-expect-error Need typing for JSON6
let _jsonExtra = globalThis.jsonExtra;

/**
 * @param {JSON6} __jsonExtra
 */
export const setJSONExtra = (__jsonExtra) => {
  _jsonExtra = __jsonExtra;
};

/**
 * @param {string} str
 * @returns {string}
 */
export const unescapeBackslashes = (str) => {
  return str.replace(/\\+/gu, (esc) => {
    return esc.slice(0, esc.length / 2);
  });
};

/**
 * @typedef {any} AnyValue
 */

/**
 * @param {string} args
 * @returns {AnyValue}
 */
export const parseJSONExtra = (args) => {
  return _jsonExtra.parse(
    // Doesn't actually currently allow explicit brackets,
    //  but in case we change our regex to allow inner brackets
    '{' + (args || '').replace(/^\{/u, '').replace(/\}$/u, '') + '}'
  );
};

// Todo: Extract to own library (RegExtras?)

/**
 * @callback BetweenMatches
 * @param {string} str
 * @returns {void}
 */

/**
 * @callback AfterMatch
 * @param {string} str
 * @returns {void}
 */

/**
 * @callback EscapeAtOne
 * @param {string} str
 * @returns {void}
 */

/**
 * @param {RegExp} regex
 * @param {string} str
 * @param {{
 *   onMatch: (...arg0: string[]) => void,
 *   extra?: BetweenMatches|AfterMatch|EscapeAtOne
 *   betweenMatches?: BetweenMatches,
 *   afterMatch?: AfterMatch,
 *   escapeAtOne?: EscapeAtOne
 * }} cfg
 */
export const processRegex = (regex, str, {
  onMatch,
  extra,
  betweenMatches,
  afterMatch,
  escapeAtOne
}) => {
  let match;
  let previousIndex = 0;
  if (extra) {
    betweenMatches = extra;
    afterMatch = extra;
    escapeAtOne = extra;
  }
  if (!betweenMatches || !afterMatch) {
    throw new Error(
      'You must have `extra` or `betweenMatches` and `afterMatch` arguments.'
    );
  }
  while ((match = regex.exec(str)) !== null) {
    const [_, esc] = match;
    const {lastIndex} = regex;

    const startMatchPos = lastIndex - _.length;
    if (startMatchPos > previousIndex) {
      betweenMatches(str.slice(previousIndex, startMatchPos));
    }

    if (escapeAtOne && esc.length % 2) {
      previousIndex = lastIndex;
      escapeAtOne(_);
      continue;
    }
    onMatch(...match);
    previousIndex = lastIndex;
  }
  if (previousIndex !== str.length) { // Get text at end
    afterMatch(str.slice(previousIndex));
  }
};
