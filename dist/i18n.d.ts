export function i18nServer({ strings, resolvedLocale, messageStyle, allSubstitutions: defaultAllSubstitutionsValue, insertNodes, keyCheckerConverter, defaults: defaultDefaults, substitutions: defaultSubstitutions, maximumLocalNestingDepth, dom: domDefaults, forceNodeReturn: forceNodeReturnDefault, throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormattersDefault, throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormattersDefault }: {
    strings: import('./getMessageForKeyByStyle.js').LocaleObject;
    resolvedLocale: string;
    messageStyle?: import("./getMessageForKeyByStyle.js").MessageStyleCallback | "richNested" | "rich" | "plain" | "plainNested" | undefined;
    allSubstitutions?: import("./defaultAllSubstitutions.js").AllSubstitutionCallback | import("./defaultAllSubstitutions.js").AllSubstitutionCallback[] | null | undefined;
    insertNodes?: import("./defaultInsertNodes.js").InsertNodesCallback | undefined;
    keyCheckerConverter?: import("./defaultKeyCheckerConverter.js").KeyCheckerConverterCallback | undefined;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    substitutions?: false | import("./defaultLocaleResolver.js").SubstitutionObject | undefined;
    maximumLocalNestingDepth?: number | undefined;
    dom?: boolean | undefined;
    forceNodeReturn?: boolean | undefined;
    throwOnMissingSuppliedFormatters?: boolean | undefined;
    throwOnExtraSuppliedFormatters?: boolean | undefined;
}): I18NCallback;
export function i18n({ locales, defaultLocales, localeStringFinder, localesBasePath, localeResolver, localeMatcher, messageStyle, allSubstitutions, insertNodes, keyCheckerConverter, defaults, substitutions, maximumLocalNestingDepth, dom, forceNodeReturn, throwOnMissingSuppliedFormatters, throwOnExtraSuppliedFormatters }?: {
    locales?: string[] | undefined;
    defaultLocales?: string[] | undefined;
    localeStringFinder?: import("./findLocaleStrings.js").LocaleStringFinder | undefined;
    localesBasePath?: string | undefined;
    localeResolver?: import("./defaultLocaleResolver.js").LocaleResolver | undefined;
    localeMatcher?: "lookup" | import("./findLocaleStrings.js").LocaleMatcher | undefined;
    messageStyle?: import("./getMessageForKeyByStyle.js").MessageStyleCallback | "richNested" | "rich" | "plain" | "plainNested" | undefined;
    allSubstitutions?: import("./defaultAllSubstitutions.js").AllSubstitutionCallback | import("./defaultAllSubstitutions.js").AllSubstitutionCallback[] | null | undefined;
    insertNodes?: import("./defaultInsertNodes.js").InsertNodesCallback | undefined;
    keyCheckerConverter?: import("./defaultKeyCheckerConverter.js").KeyCheckerConverterCallback | undefined;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    substitutions?: false | import("./defaultLocaleResolver.js").SubstitutionObject | undefined;
    maximumLocalNestingDepth?: number | undefined;
    dom?: boolean | undefined;
    forceNodeReturn?: boolean | undefined;
    throwOnMissingSuppliedFormatters?: boolean | undefined;
    throwOnExtraSuppliedFormatters?: boolean | undefined;
} | undefined): Promise<I18NCallback>;
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
export type Integer = number;
import { sort } from './collation.js';
import { sortList } from './collation.js';
import { list } from './collation.js';
//# sourceMappingURL=i18n.d.ts.map