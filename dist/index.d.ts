export { promiseChainForValues } from "./promiseChainForValues.js";
export { defaultLocaleResolver } from "./defaultLocaleResolver.js";
export { defaultAllSubstitutions } from "./defaultAllSubstitutions.js";
export { defaultInsertNodes } from "./defaultInsertNodes.js";
export { defaultKeyCheckerConverter } from "./defaultKeyCheckerConverter.js";
export { getMessageForKeyByStyle } from "./getMessageForKeyByStyle.js";
export { getStringFromMessageAndDefaults } from "./getStringFromMessageAndDefaults.js";
export { getDOMForLocaleString } from "./getDOMForLocaleString.js";
export type Sort = (arrayOfItems: string[], options: Intl.CollatorOptions | undefined) => string[];
export type SortList = (arrayOfItems: string[], map: (str: string, idx: number) => any, listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined) => string | DocumentFragment;
export type List = (arrayOfItems: string[], options?: Intl.ListFormatOptions | undefined) => string;
/**
 * Checks a key (against an object of strings). Optionally
 *  accepts an object of substitutions which are used when finding text
 *  within curly brackets (pipe symbol not allowed in its keys); the
 *  substitutions may be DOM elements as well as strings and may be
 *  functions which return the same (being provided the text after the
 *  pipe within brackets as the single argument).) Optionally accepts a
 *  config object, with the optional key "dom" which if set to `true`
 *  optimizes when DOM elements are (known to be) present.
 * `key` - Key to check against object of strings.
 * `substitutions` - Defaults to `false`.
 * `cfg.dom` - Defaults to `false`.
 */
export type I18NCallback = ((key: string | string[], substitutions?: false | null | undefined | import('./defaultLocaleResolver.js').SubstitutionObject, cfg?: {
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]) | null;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    dom?: boolean;
    forceNodeReturn?: boolean;
    throwOnMissingSuppliedFormatters?: boolean;
    throwOnExtraSuppliedFormatters?: boolean;
}) => string | DocumentFragment | Text) & {
    resolvedLocale: string;
    strings: import('./getMessageForKeyByStyle.js').LocaleObject;
    sort: Sort;
    sortList: SortList;
    list: List;
};
export { Formatter, LocalFormatter, RegularFormatter, SwitchFormatter } from "./Formatter.js";
export { unescapeBackslashes, parseJSONExtra, processRegex, setJSONExtra } from "./utils.js";
export { findLocaleStrings, defaultLocaleMatcher, findLocale, getMatchingLocale } from "./findLocaleStrings.js";
export { setFetch, getFetch, setDocument, getDocument } from "./shared.js";
export { i18n, i18nServer } from "./i18n.js";
//# sourceMappingURL=index.d.ts.map