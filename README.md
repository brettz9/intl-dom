# intl-dom

This library allows applications to discover locale files (even untrusted ones)
and utilize the strings while inserting DOM elements amidst them, returning a
document fragment.

This allows locales to specify the sequence of elements through placeholders
without actually containing the technically-oriented and potentially unsafe
HTML. Projects need not be shoe-horned into always appending any HTML
after localized strings of text, but allowing them to be interspersed within
the text (e.g., for localized links or buttons).

## Installation

```shell
npm install --save intl-dom
```

For older browser support, you may also need `core-js-bundle`.

### Browser

```html
<script type="./node_modules/intl-dom/dist/index.umd.js"></script>
```

### Browser (ESM)

```js
import {i18n} from './node_modules/intl-dom/dist/index.esm.js';
```

### Browser/Node (Bundle)

```js
import {i18n} from 'intl-dom';
```

### Node

```js
// `jsdom` or such is needed for:
//   `getDOMForLocaleString`, `findLocaleStrings`, `i18n`
const {JSDOM} = require('jsdom');
const {
  promiseChainForValues,
  defaultLocaleResolver,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  i18n
} = require('intl-dom');

global.document = (new JSDOM()).window.document;

// Now you can use the `intl-dom` methods
```

## Message styles

There are two built-in formats which you can specify for obtaining messages
out of locale files or objects.

### "plain"

This format is just a simple key-value map. Its advantage is in its brevity,
and its disadvantage is that additional meta-data cannot be added inline,
e.g., a `description` of the locale entry (see the "rich" format).

```json
{
  "myKey": "This is a key",
  "anotherKey": "This is another key"
}
```

### "rich"

This format is used in the likes of Chrome/WebExtensions i18n. Its
advantage lies in being able to add other meta-data such as `description`
to the individual items. It comes at the cost that it takes more characters
to represent simple messages.

```json
{
  "myKey": {
    "message": "This is my key",
    "description": "This is a description for `myKey` (ignored by i18n but potentially usable by other tools)"
  },
  "anotherKey": {
    "message": "This is another key"
  }
}
```

### Custom formats

You can define your own (JSON) formats. See the `localeResolver`
argument to `i18n`.

## API

### API Overview

`intl-dom` has different functions you can use, whether you need to dynamically
retrieve locale files at run time or just need to have locale messages (potentially
with defaults) extracted from a locale object, and have any place-holders it
contains replaced with strings or DOM Nodes obtained at runtime.

(The first two will probably be of most general interest; the others are used
by the first two and can be used as part of a custom localization system.)

1. `i18n`
1. `getStringFromMessageAndDefaults`
1. `getMessageForKeyByStyle`
1. `getDOMForLocaleString`
1. `findLocaleStrings`
1. `defaultLocaleResolver`
1. `promiseChainForValues`

### API Usage

#### `i18n`

This method ties together all of the elements for full, end-to-end
localization.

It returns a callback that can be used to extract messages out of a
locale file's data, falling back to any defaults (e.g., if the item has
not been translated yet).

In its simplest signature, you can call `i18n` without params:

```js
(async () => {

const _ = await i18n();

})();
```

This will use the default configuration (described below) to find
an appropriate locale file, and returns a function which can be used
to return translated strings (or text nodes) or DOM fragments (depending
on whether you have supplied DOM substitutions). See the "Return value of
callback" subsection of why the return values may differ and how you can
force a `Node` to be returned.

##### Usage of the function returned by `i18n`

This function takes up to three arguments and returns a string, text node, or
DOM fragment. See the "Return value of callback" subsection.

1. Key
2. Substitutions object
3. Options object

(If you need to give options but have no substitutions, you must still provide
`null` for the second argument as the options can't be auto-differentiated
from substitutions.)

For the simplest uses, with just a key or a key and substitutions:

```js
const string = _('key1');

const fragment = _('key2', {
  substitution1: 'aString',

  // The presence of this DOM element, will cause the result to be
  //   a fragment
  substitution2: anElement
});
```

The "Return value of callback" subsection demonstrates the callback's
options object, though see "Arguments and defaults" for a fuller discussion.

##### Return value of callback

With the DOM element method `append`, both strings and fragments (or
other nodes) can be appended, so the default result of this callback--which can produce strings if no DOM substitutions are given and a document fragment otherwise--is
polymorphic relative to that `append` method.

However, if you always want a Node returned, e.g., for full `Node`
polymorphism, you can supply `forceNodeReturn` to the `i18n` constructor
and this will wrap what would otherwise be strings into a text node:

```js
(async () => {

const _ = await i18n({forceNodeReturn: true});

})();
```

You can also supply `forceNodeReturn` on the third argument of the callback
returned from `i18n` (if you want to keep the default `forceNodeReturn`
value but override it on a case-by-case basis):

```js
const fragment = _('key2', {
  substitution1: 'aString',
  substitution2: 'anotherString'
}, {
  forceNodeReturn: true
});
```

##### Arguments and defaults

The following shows the full list of options and available and their
default behavior when left off.

Note that we first list the values supplied to the `i18n` constructor
and then the values for the callback which is returned by `i18n`.

```js
(async () => {

const _ = await i18n({
  // Array of BCP-47 language strings (the locales primarily
  //   desired by the user)
  locales: navigator.languages,

  // Array of BCP-47 language strings (in case no locales are available
  //  for those specified in `locales`)
  defaultLocales: ['en-US'],

  // String path segment; with the default locale resolver, will
  //   be followed by:
  //       /_locales/<locale>/messages.json
  localesBasePath: '.',

  // See `defaultLocaleResolver`
  localeResolver: defaultLocaleResolver,

  // "rich", "plain", or a function; see "Message styles" and
  //   `getMessageForKeyByStyle`
  messageStyle: 'rich',

  // A regular expression with the first capturing group identifying
  //   a formatted subject (by default, the contents within curly brackets);
  //   the optional second capturing group identifies an optional argument
  //   (by default, a pipe symbol `|` followed by the argument
  //   until the closing curly bracket); named capturing groups are not
  //   currently supported
  formattingRegex: /\{([^}]*?)(?:\|([^}]*))?\}/gu,

  // `false`, `null`, or `undefined`, it will throw if a value is not found;
  //  should otherwise be an object of the same message style as the locales.
  defaults: undefined,

  // `substitutions` here indicates a substitutions object to apply to all
  //  keys; if it is a function, it can accept arguments from the locale
  //  and indicate a dynamic replacement. See the `substitutions` argument
  //  discussion under the callback arguments below and
  //  `getDOMForLocaleString` for the function format.
  substitutions: false,

  // See the properties of the same name below in the callback arguments
  //   section for an explanation of these values; these values can be
  //   set to change the *default* value in the callback; you can set these
  //   here if you know you wish to minimize the frequency of a need
  //   to manually specify/override
  dom: false,
  forceNodeReturn: false,
  throwOnMissingSuppliedFormatters: true,
  throwOnExtraSuppliedFormatters: true
});

})();
```

These are the values for the callback returned by `i18n`. Note that
the string key and substitutions are expressive of what is possible but
are not defaults; the defaults are shown only for the options object.

```js
_(
  // A required string key
  'someKey',

  // Optional substitutions object
  {
    key1: 'a string',
    key2: aDOMNode,
    key3 ({arg, key}) {
      // Depending on the key value, could return, e.g.,
      //  "KEY3" or "key3"
      return arg === 'UPPER' ? key.toUpperCase() : key;
    }
  },

  // Optional options object
  {
    // TODO: document meaning of each and in relation to defaults
    allSubstitutions: null,
    substitutions: false,
    dom: false,
    forceNodeReturn: false,
    throwOnMissingSuppliedFormatters: true,
    throwOnExtraSuppliedFormatters: true
  }
);
```

#### `getStringFromMessageAndDefaults`

Checks if a message is supplied and if not, checks for a default value out of
a given object (using `getMessageForKeyByStyle` by default).

// Todo: Add example code here and in methods following

#### `getMessageForKeyByStyle`

Obtains a callback which can get localized string messages out of
JSON/JavaScript objects based on a given message style (see
"Message styles").

#### `getDOMForLocaleString`

Takes a string, substitutions object, and regular expression to extract
format place-holders and returns a string or document fragment based on
the values supplied to it. May also return a text node if `forceNodeReturn`
is set to `true`.

// Todo: Indicate function format, including `arg`

#### `findLocaleStrings`

Dynamically obtains locale file data to return a JSON object. Uses
`defaultLocaleResolver` by default for path resolution.

#### `defaultLocaleResolver`

Converts a base path and language code into a path, i.e.,
`<basePath>/_locales/<locale>/messages.json`.

#### `promiseChainForValues`

`intl-dom` also currently exports a utility for Promises,
`promiseChainForValues`, which can be used to process an array of values
in series and short-circuit the chain when conditions are suitable. (It is
used internally for locale discovery but made available for reuse.)

(This may be swapped out in the future for an equivalent third-party
Promise utility.)

## To-dos

- We might accept a `defaultPath` argument to `i18n` to obtain default values
  out of a file, potentially resolvable by a template function which can take
  a locale as argument.
- Support named capturing groups for `formattingRegex`
- [Fluent](https://projectfluent.org/fluent/guide/)-inspired:
  - Implement as generic interceptor as function argument to
    `getMessageForKeyByStyle` and/or `getDOMForLocaleString`?
  - Accept generic function in place of `formattingRegex` for more precise and
    possibly easier parsing (could then return tokens of local variable references, placeholders, conditionals (as arguments to those local variable references and placeholders?), built-in function calls)
    - Variables for **intra-locale local variables** references, including
      passing params into them with enumerated selector selection
      and **Placeholders**
      - Arguments to **conditionally process local variables and placeholders**
        - **Selectors** (locale level control; with default)
          - Accept **numbers**: Plurals (zero, one, two, few, many, and other: <http://www.unicode.org/cldr/charts/30/supplemental/language_plural_rules.html>)
            - Use [PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules)
          - Conditional based on **attribute** for local variable ("term") value (e.g.,
            gender, animacy, vowel-starting, etc.)
          - Accept arbitrary numbers/strings to **strings** (enum/switch)
    - Built-in **functions for number, datetime**
  - Handle at level of formatting style (rich, plain, etc.)
    - **Nested attribute** values which share same prefix (easier to type)
    - **Comments within** `message`/`description` (comments for file, group, or item?)
  - Handle at level of processing (as we do DOM); just demo in `allSubstitutions`,
    though also change to allow substitutions to have 2-item arrays with key and
    options, e.g., so can pass on number formatting instructions?
    - **Auto-convert** by default into locale format (using `Intl`)?
      - [Numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
      - [DateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
      - [RelativeTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat)
  - Handle at level *after* retrieving localized items yet before insertion into
    DOM template (however, potentially an intl-dom localized template)
    - [Collation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator)
  - Handle at level of pre-file loading (abstract out current hyphen removing)
    - [localeMatcher](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) ("lookup" or "best fit")
