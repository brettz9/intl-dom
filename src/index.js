// UTILITIES
export {
  Formatter, LocalFormatter, RegularFormatter, SwitchFormatter
} from './Formatter.js';
export {unescapeBackslashes, parseJSONExtra, processRegex} from './utils.js';
export {promiseChainForValues} from './promiseChainForValues.js';

// DEFAULTS
export {defaultLocaleResolver} from './defaultLocaleResolver.js';
export {defaultAllSubstitutions} from './defaultAllSubstitutions.js';
export {defaultInsertNodes} from './defaultInsertNodes.js';

// COMPONENTS
export {getMessageForKeyByStyle} from './getMessageForKeyByStyle.js';
export {
  getStringFromMessageAndDefaults
} from './getStringFromMessageAndDefaults.js';
export {getDOMForLocaleString} from './getDOMForLocaleString.js';
export {
  findLocaleStrings, defaultLocaleMatcher, findLocale, getMatchingLocale
} from './findLocaleStrings.js';

export {setFetch, getFetch, setDocument, getDocument} from './shared.js';

// INTEGRATED
export {i18n, i18nServer} from './i18n.js';
