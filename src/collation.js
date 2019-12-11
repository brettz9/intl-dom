import {processRegex} from './utils.js';

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

  const placeholderArray = [...arrayOfItems].map((_, i) => `<<S=M${i}S=M>>`);
  const nodes = [];
  const push = (...args) => {
    nodes.push(...args);
  };
  // eslint-disable-next-line prefer-named-capture-group
  processRegex(/<<S=M(\d)S=M>>/gu, list(locale, placeholderArray, listOptions), {
    betweenMatches: push,
    afterMatch: push,
    onMatch (_, idx) {
      push(map(arrayOfItems[idx], idx));
    }
  });
  const container = document.createDocumentFragment();
  container.append(...nodes);
  return container;
};
