// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';
import jsonExtra from '../node_modules/json-6/dist/index.mjs';

export const unescapeBackslashes = (str) => {
  return str.replace(/\\+/gu, (esc) => {
    return esc.slice(0, esc.length / 2);
  });
};

export const parseJSONExtra = (args) => {
  return jsonExtra.parse(
    // Doesn't actually currently allow explicit brackets,
    //  but in case we change our regex to allow inner brackets
    '{' + (args || '').replace(/^\{/u, '').replace(/\}$/u, '') + '}'
  );
};

// Todo: Extract to own library (RegExtras?)
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
