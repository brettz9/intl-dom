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
