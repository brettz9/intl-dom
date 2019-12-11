import {processRegex} from './utils.js';

/**
 *
 * @returns {string}
 */
function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, function (c) {
    /* eslint-disable no-bitwise */
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    /* eslint-enable no-bitwise */
  });
}

export const sort = (locale, arrayOfItems, options) => {
  return arrayOfItems.sort(new Intl.Collator(
    locale,
    options
  ).compare);
};

export const list = (locale, arrayOfItems, options) => {
  return new Intl.ListFormat(
    locale, options
  ).format(arrayOfItems);
};

export const sortListSimple = (
  locale, arrayOfItems, listOptions, collationOptions
) => {
  sort(locale, arrayOfItems, collationOptions);
  return list(locale, arrayOfItems, listOptions);
};

export const sortList = (
  locale, arrayOfItems, map, listOptions, collationOptions
) => {
  if (typeof map !== 'function') {
    return sortListSimple(locale, arrayOfItems, map, listOptions);
  }
  sort(locale, arrayOfItems, collationOptions);

  const randomId = generateUUID();

  const placeholderArray = [...arrayOfItems].map(
    (_, i) => `<<${randomId}${i}>>`
  );
  const nodes = [];
  const push = (...args) => {
    nodes.push(...args);
  };

  processRegex(
    // // eslint-disable-next-line prefer-named-capture-group
    new RegExp(`<<${randomId}(\\d)>>`, 'gu'),
    list(locale, placeholderArray, listOptions), {
      betweenMatches: push,
      afterMatch: push,
      onMatch (_, idx) {
        push(map(arrayOfItems[idx], idx));
      }
    }
  );
  const container = document.createDocumentFragment();
  container.append(...nodes);
  return container;
};
