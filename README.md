[![npm](http://img.shields.io/npm/v/intl-dom.svg)](https://www.npmjs.com/package/intl-dom)
[![Dependencies](https://img.shields.io/david/brettz9/intl-dom.svg)](https://david-dm.org/brettz9/intl-dom)
[![devDependencies](https://img.shields.io/david/dev/brettz9/intl-dom.svg)](https://david-dm.org/brettz9/intl-dom?type=dev)

[![Actions Status](https://github.com/brettz9/intl-dom/workflows/Node%20CI/badge.svg)](https://github.com/brettz9/intl-dom/actions)
[![Actions Status](https://github.com/brettz9/intl-dom/workflows/Coverage/badge.svg)](https://github.com/brettz9/intl-dom/actions)

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/intl-dom/badge.svg)](https://snyk.io/test/github/brettz9/intl-dom)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/intl-dom.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/intl-dom/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/intl-dom.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/intl-dom/context:javascript)

[![License](https://img.shields.io/npm/l/intl-dom.svg)](LICENSE-MIT.txt)

# intl-dom

This library allows applications to discover locale files (even untrusted ones)
and safely utilize the strings while inserting DOM elements amidst them,
returning a document fragment.

This allows locales to specify the sequence of elements through placeholders
without locales needing to contain the technically-oriented and potentially
unsafe HTML. Projects need not shoe-horn their localizations into always
appending HTML after localized strings of text; projects can instead allow
HTML to be interspersed within the text as suitable for that language
(e.g., for localized links or buttons).

A number of other facilities are available: for pluralization; number,
date-time and relative time formatting; and list sorting.

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

// `fileFetch` or the like is needed for `findLocaleStrings` and `i18n`
const fileFetch = require('file-fetch');

const {
  // UTILITIES
  Formatter, LocalFormatter, RegularFormatter,
  unescapeBackslashes, parseJSONExtra,
  promiseChainForValues,

  // DEFAULTS
  defaultLocaleResolver,
  defaultAllSubstitutions,
  defaultInsertNodes,

  // COMPONENTS
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,

  // INTEGRATED
  i18n
} = require('intl-dom');

global.document = (new JSDOM()).window.document;
global.fetch = fileFetch;
// Now you can use the `intl-dom` methods
```

## Message styles

There are three built-in formats which you can specify for obtaining messages
out of locale files or objects (detailed in the "Built-in styles"
subsections below).

All of the built-in styles have the following high-level structure:

```json
{
  "head": {},
  "body": {
  }
}
```

The `head` is optional, but it can be used to store:

1. Language code and direction (especially until JavaScript may provide an API
    for [obtaining directionality](https://github.com/tc39/ecma402/issues/205)
    dynamically from a locale); one might also use:
    [i18nizeElement](https://github.com/brettz9/i18nizeElement)
2. Translator name and/or contact info
3. `locals` - See the "Local variables" section
4. `switches` - See the "Conditionals/Plurals" section

### Built-in styles

#### "plain"

This format is just a simple key-value map. Its advantage is in its brevity.
Its disadvantage is that additional meta-data cannot be added inline,
e.g., a `description` of the locale entry (see the "rich" format).

```json
{
  "myKey": "This is a key",
  "anotherKey": "This is another key"
}
```

#### "rich"

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

#### `richNested`

This format is follows the same format as `rich`, though it allows nested
keys:

```json
  {
    "key": {
      "that": {
        "is": {
          "nested": {
            "message": "myKeyValue"
          }
        }
      }
    }
  }
```

Such keys are referenced with a `.` separator:

```js
_('key.that.is.nested');
```

(This comes at the cost of reserving `.` for references.)

Note that while `richNested` is the default format, `rich` is used in its
place for `switches` since `switches` can have values for which `.` is
expected (e.g., decimals).

### Head sections

#### Local variables (`locals`)

In the `head` is a property `locals` for storing localized strings (including
potentially hierarchically-nested ones) which are intended to be defined
privately by the locale, rather than being set (or queries) at runtime by
the calling script.

The format follows the same key-value or key-object-with-message-and-values
structure as the formats described under "Message styles".

So for the "rich" (or "richNested") style, it might look like:

```json
{
  "head": {
    "locals": {
      "aLocalVar": {
        "message": "Value of key that can be referenced elsewhere in the locale"
      }
    }
  }
}
```

A locale string in the `body` can then reference such locals with an
initial hyphen within curly brackets:

```json
{
  "localUsingKey": {
    "message": "Here is {-aLocalVar}"
  }
}
```

### Conditionals/Plurals (`switches`)

TODO:
including plurals


### Built-in functions

TODO:

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
1. `defaultAllSubstitutions`
1. `defaultInsertNodes`
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

  // "richNested", "rich", "plain", or a function; see "Message styles" and
  //   `getMessageForKeyByStyle`
  messageStyle: 'richNested',

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
    // Applied after individual substitutions (and each item in the array
    //   pipes to the next)
    allSubstitutions: defaultAllSubstitutions,
    defaults: null,
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

Dynamically obtains locale file data to return a JSON object with the data
as `strings` and the successfully resolved locale as `locale`. Uses
`defaultLocaleResolver` by default for path resolution.

To use a different strategy than "lookup", you can supply a function for
`localeMatcher` which accepts a locale string and should return a string
or a Promise that resolves to another locale to try (or it can throw if
none is found).

#### `defaultLocaleResolver`

Converts a base path and language code into a path, i.e.,
`<basePath>/_locales/<locale>/messages.json`.

### `defaultAllSubstitutions`

Passed information for a substitution and returns the replacement,
automatically applying [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) to numbers and [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
to `Date` objects.

Shortcuts also exist for utilizing [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat)
and [`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat).

For more on `Intl` in the browser, see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl>.

For Node, see <https://nodejs.org/api/intl.html>; note that support or
non-English support for `Intl` may need to be built in at compile time
with special flags detailed on that page, though Node 13 is to build
in support [by default](https://github.com/nodejs/node/commit/1a25e901b7c380929f0d08599f49dd77897a627f).

In our own tests, the `intl-mocha` script uses the `full-icu`
package. Passing `--with-intl=full-icu` seems to require Node having been
prebuilt as such, so we use (and as per `full-icu` instructions),
`--icu-data-dir` instead.

#### `defaultInsertNodes`

The default function for `insertNodes`. Processes the specific string
format for substitutions, conditionals/plurals, local variables, and
built-in functions/arguments, returning the resulting string or Node array.

#### `promiseChainForValues`

`intl-dom` also currently exports a utility for Promises,
`promiseChainForValues`, which can be used to process an array of values
in series and short-circuit the chain when conditions are suitable. (It is
used internally for locale discovery but made available for reuse.)

(This may be swapped out in the future for an equivalent third-party
Promise utility.)

## Collation

--TODO

Collator (demo complex use and refer to how making default for simple cases with `ListFormat`)

- Handle at level *after* retrieving localized items yet before insertion into
  DOM template (however, potentially an intl-dom localized template)
  - [Collation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator)
    - Use `localeMatcher`, e.g., if "lookup" or "best fit" otherwise

--TODO:  Example where server script produces global and is fed

## Credits

This project has been heavily inspired by [Fluent](https://projectfluent.org/fluent/guide/).

## See also

- [i18nizeElement](https://github.com/brettz9/i18nizeElement)

## To-dos

- Ensure coverage in browser is ok?
- Option to parse Fluent files?
- We might accept a `defaultPath` argument to `i18n` to obtain default values
  out of a file, potentially resolvable by a template function which can take
  a locale as argument.
- Support `switches` that are available as sibling to `message`, i.e.,
  in a particular context
- Support named capturing groups for `formattingRegex`
- In rich formats, bless particular style for adding **comments** alongside `message`/`description` (comments for file, group, or item?)
