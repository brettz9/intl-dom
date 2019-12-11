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

export const sortedList = (
  locale, arrayOfItems, listOptions, collationOptions
) => {
  sort(locale, arrayOfItems, collationOptions);
  return list(locale, arrayOfItems, listOptions);
};

export const sortedMap = (
  locale, arrayOfItems, listOptions, collationOptions
) => {
  sort(locale, arrayOfItems, collationOptions);

  const placeholderArray = [...arrayOfItems].map((_, i) => `<<S=M${i}S=M>>`);
  // eslint-disable-next-line prefer-named-capture-group
  return list(locale, placeholderArray, listOptions).replace(/<<S=M(\d)S=M>>/gu);
};
