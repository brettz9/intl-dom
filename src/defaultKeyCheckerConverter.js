/**
 * @callback KeyCheckerConverterCallback
 * @param {string|string[]} key By default may be an array (if the type ends
 *   with "Nested") or a string, but a non-default validator may do otherwise.
 * @param {"plain"|"plainNested"|"rich"|
 *   "richNested"|
 *   import('./getMessageForKeyByStyle.js').MessageStyleCallback
 * } messageStyle
 * @throws {TypeError}
 * @returns {string} The converted (or unconverted) key
 */

/**
 * @type {KeyCheckerConverterCallback}
 */
export function defaultKeyCheckerConverter (key, messageStyle) {
  if (Array.isArray(key) &&
    key.every((k) => {
      return typeof k === 'string';
    }) &&
    typeof messageStyle === 'string' && messageStyle.endsWith('Nested')
  ) {
    return key.map((k) => {
      return k.replaceAll(/(?<backslashes>\\+)/gu, String.raw`\$<backslashes>`).
        replaceAll('.', String.raw`\.`);
    }).join('.');
  }
  if (typeof key !== 'string') {
    throw new TypeError(
      '`key` is expected to be a string (or array of strings for nested style)'
    );
  }

  return key;
}
