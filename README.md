[![npm](https://img.shields.io/npm/v/intl-dom.svg)](https://www.npmjs.com/package/intl-dom)
[![Dependencies](https://img.shields.io/david/brettz9/intl-dom.svg)](https://david-dm.org/brettz9/intl-dom)
[![devDependencies](https://img.shields.io/david/dev/brettz9/intl-dom.svg)](https://david-dm.org/brettz9/intl-dom?type=dev)

<!--[![Actions Status](https://github.com/brettz9/intl-dom/workflows/Node%20CI/badge.svg)](https://github.com/brettz9/intl-dom/actions)-->
[![Build Status](https://travis-ci.org/n3ps/json-schema-to-jsdoc.svg?branch=master)](https://travis-ci.org/n3ps/json-schema-to-jsdoc)
[![testing badge](https://raw.githubusercontent.com/brettz9/intl-dom/master/badges/tests-badge.svg?sanitize=true)](badges/tests-badge.svg)
[![coverage badge](https://raw.githubusercontent.com/brettz9/intl-dom/master/badges/coverage-badge.svg?sanitize=true)](badges/coverage-badge.svg)
<!--
[![Actions Status](https://github.com/brettz9/intl-dom/workflows/Coverage/badge.svg)](https://github.com/brettz9/intl-dom/actions)
-->

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/intl-dom/badge.svg)](https://snyk.io/test/github/brettz9/intl-dom)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/intl-dom.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/intl-dom/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/intl-dom.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/intl-dom/context:javascript)

[![Filesize badge](https://raw.githubusercontent.com/brettz9/intl-dom/master/badges/filesize-badge.svg?sanitize=true)](badges/filesize-badge.svg)
<!--[![License](https://img.shields.io/npm/l/intl-dom.svg)](LICENSE-MIT.txt)-->
[![Licenses badge](https://raw.githubusercontent.com/brettz9/intl-dom/master/badges/licenses-badge.svg?sanitize=true)](badges/licenses-badge.svg)

(see also [licenses for dev. deps.](https://raw.githubusercontent.com/brettz9/intl-dom/master/badges/licenses-badge-dev.svg?sanitize=true))

[![issuehunt-to-marktext](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/brettz9/intl-dom)

# intl-dom

This library allows applications to discover locale files and safely
utilize the strings while inserting DOM elements amidst them, returning
a document fragment.

One may thus allow locales to specify the sequence of elements through
placeholders without their needing to contain the technically-oriented
and potentially unsafe HTML. And projects need not confine their
internationalized apps into always having HTML appended after localized
strings of text; the calling code can instead allow HTML to be interspersed
within the localized text as suitable for that language
(e.g., for localized links or buttons).

A number of other facilities are available in `intl-dom`: pluralization;
number, date-time and relative time formatting; and list sorting.

## Project rationale by example

Let's say you have a sentence to internationalize, and it has a link.

Some projects might attempt to compose the HTML in pieces, using, e.g.,
English, as the pattern for all locales. For example, they might have:

```json
{
  "linkIntro": "Here is the ",
  "linkURL": "https://example.com",
  "linkText": "cool link",
  "linkEnd": "I was talking about"
}
```

The calling code might then compose these:

```js
const link = _('linkIntro') +
  '<a href="' + encodeURI(_('linkURL')) + '">' +
  escapeHTML(_('linkText')) +
  '</a>' +
  _('linkEnd');
```

This approach suffers from being English-dependent; some languages might
necessitate the link at the beginning or end only, or otherwise have
different text content as an intro or conclusion than the corresponding
English (which would have been worse had we been tempted to label our
`linkEnd` as something like `talking_about`).

Worse, if the calling code only allows for an intro or conclusion, the
locale might have no choice but to add the link at the end, even if it
is not suitable for that language.

And adding language-specific code within the app programming logic, e.g.,
adding a conclusion if the locale is Spanish, etc., is not a
maintainable solution.

Some projects might instead attempt to solve this by allowing HTML strings
within their locales, e.g.:

```json
{
  "someKey": "Here is the <a href=\"https://example.com\">cool link</a> I was talking about"
}
```

One problem with this approach--besides being unsafe (if the locale
designers don't know HTML or are untrusted sources which are not thoroughly
vetted--such inclusion of code makes it more difficult to change the HTML
structure. If you wanted to add a `target` attribute, for example, you would
need to do so to all locale files.

`intl-dom` therefore uses an approach like this instead:

```json
{
  "linkFormat": "Here is the {link} I was talking about",
  "linkURL": "https://example.com",
  "linkText": "cool link"
}
```

...where the calling code could look like:

```js

const link = document.createElement('a');
link.href = _('linkURL');

// Use `textContent` instead of `innerHTML` in case the localization of
//  `linkText` uses HTML characters!
link.textContent = _('linkText');

const linkDOM = _('linkFormat', {link});

// The following fragment, which can be appended, is built:

// "Here is the <a href="https://example.com">cool link</a> I was talking about"
```

Note that while the resulting `linkDOM` is a DOM element, the
constituents, e.g., those of `linkFormat`, are not composed in such a manner
as to treat them all as trusted HTML. Only the run-time-supplied DOM will be
treated as a DOM object, while the rest are just pure strings. (You must,
as noted in the comment about `textContent`, still escape or sanitize when
injecting into the DOM, e.g., if you are using `innerHTML`
yourself.)

This offers security while allowing for flexibility by language as far as
where the link is placed within the text. There is also no need for
locale-specific handling within the calling code as long as the calling
code adds whole segments to the DOM (e.g., a whole paragraph, or in this
case, a pattern for a link including its surrounding text).

`intl-dom` also takes advantage of facilities for pluralization, number
and date formatting, and list formatting, detailed below, allowing locales
to implement as per their own needs, without the calling code having to
be aware of or itself apply formatting rules; the calling code need only
supply the key and items for substitution. However, the calling code can
provide defaulting behavior to the default.

Note: If you need locale-specific styling, it is recommended
to target the `lang` pseudo-class in CSS and allow for locale-specific
stylesheets, e.g.:

```css
:lang(fr) div.explanation {
  /* As this explanation takes longer in French, make the size smaller */
  font-size: small;
}
```

## Installation

```shell
npm install --save intl-dom
```

If using on Node, you may also need to install a `fetch` implementation,
such as from [file-fetch](https://github.com/bergos/file-fetch), and
either set a global `fetch` or supply it to `setFetch`. You may also need
to install such as `jsdom` and define a global `document` object or
supply it to `setDocument` (with at least the methods
`createDocumentFragment` (returning at least an object with an `append`
method to join passed in elements and text nodes) and, if using,
`forceNodeReturn`, `createTextNode`). (Our tests additionally expect
`createElement`, whose elements use `id`, `href`, `textContent`,
`innerHTML`, `append` and those additional used by the `text` method
within `chai-dom` (`tagName`, `className`, `nodeType`, and `attributes`
(with these having `name` and `value`)).)

```shell
npm install --save intl-dom file-fetch jsdom
```

For older browser support, you may need `core-js-bundle` as well.

And for both Node or the browser, depending on the versions you are
supporting, you may need any of the following:

- [`@formatjs/intl-datetimeformat`](https://www.npmjs.com/package/@formatjs/intl-datetimeformat) (including locale, e.g., `@formatjs/intl-datetimeformat/locale-data/en.js` and timezone info, `@formatjs/intl-datetimeformat/add-all-tz.js` or `@formatjs/intl-datetimeformat/add-golden-tz.js`)
- [`@formatjs/intl-displaynames`](https://www.npmjs.com/package/@formatjs/intl-displaynames) (including locale, e.g., `@formatjs/intl-displaynames/locale-data/en.js`)
- [`intl-pluralrules`](https://www.npmjs.com/package/intl-pluralrules)
- [`intl-relative-time-format`](https://www.npmjs.com/package/intl-list-format) (including locale, e.g., `intl-relative-time-format/locale-data/en-US.js`)
- [`intl-list-format`](https://www.npmjs.com/package/intl-list-format) (including locale, e.g., `intl-list-format/locale-data/en-US.js`)

### Browser

```html
<script type="./node_modules/intl-dom/dist/index.umd.js"></script>
```

### Browser (ESM)

```js
import {i18n, setJSONExtra} from './node_modules/intl-dom/dist/index.esm.js';

// Currently not bundling json-6
import jsonExtra from './node_modules/json-6/dist/index.mjs';

setJSONExtra(jsonExtra);
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
  promiseChainForValues, getMatchingLocale,
  setFetch, setDocument,
  getFetch, getDocument,

  // DEFAULTS
  defaultLocaleResolver,
  defaultAllSubstitutions,
  defaultInsertNodes,

  // COMPONENTS
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  findLocale,
  defaultLocaleMatcher,

  // INTEGRATED
  i18nServer,
  i18n
} = require('intl-dom');

setDocument((new JSDOM()).window.document);
setFetch(fileFetch);
// Now you can use the `intl-dom` methods
```

## Document Structure

All of the locale built-in styles have the following high-level structure:

```json
{
  "head": {},
  "body": {
  }
}
```

## Message styles

There are three built-in formats which you can specify for obtaining messages
out of locale files or objects (detailed in the "Built-in styles"
subsections below).

The `head` is optional, but it can be used to store:

1. Language code and direction (especially until JavaScript may provide an API
    for [obtaining directionality](https://github.com/tc39/ecma402/issues/205)
    dynamically from a locale); one might also use:
    [i18nizeElement](https://github.com/brettz9/i18nizeElement). The properties
    `code` and `direction` are recommended, but not in use.
2. Translator name and/or contact info. No specific format is currently
    recommended.
3. `locals` - See the "Local variables" section
4. `switches` - See the "Conditionals/Plurals" section

Note that you can pass your own `messageStyle` function to `i18n`.

If you want to support a non-JSON format, you will also need to
supply your own `localeStringFinder` to `i18n`.

### Built-in styles

`richNested` is the default format (including both code-supplied
formatters, locale-supplied `locals`, and `switches`).
See `getMessageForKeyByStyle`.

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

#### "plainNested"

This format also maps just to a value, but its keys may be nested. Its
advantage is in its brevity for values, while allowing some complexity of
organization of keys.

Its disadvantage is that additional meta-data cannot be added inline,
e.g., a `description` of the locale entry (see the "rich" format).

```json
{
  "myKey": "This is a key",
  "a": {
    "nested": {
      "key": "This is a nested key"
    }
  }
}
```

Such keys are referenced with a `.` separator:

```js
_('a.nested.key');
```

This comes at the cost of reserving `.` for references (and backslashes
needing escaping). You can escape an actual `.` with `plainNested` with
a backslash.

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

This format follows the same format as `rich`, though it also allows
nested keys:

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

It is the default style for code-supplied formatters, locale-supplied
`locals`, and `switches`.

This comes at the cost of reserving `.` for references (and backslashes
needing escaping). You can escape an actual `.` with `richNested` with
a backslash.

Note that although `switches` follows `richNested`, you do not need
to escape dots and backslashes within its values nor when passing
arguments.

## Body content

The main keys--of whatever style--are stored within a root `body`:

```json
{
  "body": {

  }
}
```

While the styles described above determine how the keys are placed, the
specific formatting within messages is determined elsewhere.

The default format of messages processed by `getDOMForLocaleString` (and
therefore by `i18n` as well), is defined in `defaultInsertNodes`. This
format has the following features:

1. Regular formatters are found by surrounded by curly brackets
    (`{formatterKey}`).
2. A local variable reference has an initial hyphen with curly brackets
    (`{-localKey}`). See the "Local variables" section.
3. A conditional/plural (i.e., `switch`) has an initial tilde with curly
    brackets (`{~switchKey}`). See the "Conditionals/Plurals" section.
4. Additional arguments can be supplied by adding a pipe symbol (`|`)
    and the argument(s). The only arguments with any built-in meaning are
    detailed in the "Built-in functions" section.
5. Literal brackets can be escaped with a single backslash, i.e., `\{`,
    which, escaped in JSON, becomes `\\{`.

## Head sections

### Local variables (`locals`)

In the `head` is a property `locals` for storing localized strings (including
potentially hierarchically-nested ones) which are intended to be defined
privately by the locale. They cannot be directly queried at runtime by
the calling script.

These can allow for reuse of frequent strings as well as allow for avoiding
hard-coding translated terms which could change over time.

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

`richNested` can target nested locals with dots:

```json
{
  "nestedUsingKey": {
    "message": "There is {-nested.local}"
  }
}
```

Locals can also be passed parameters, where the parameters are expressed as
JSON <!--
// https://github.com/d3x0r/JSON6/issues/18
[JSON5](https://github.com/json5/json5),
--> or [JSON6](https://github.com/d3x0r/JSON6) objects, dropping the
outer curly brackets:

```json
{
  "parameterizedLocalUsingKey": {
    "message": "A {-aParameterizedLocalVar|adjective1: \"warm\", adjective2: \"sunny\"}"
  }
}
```

The keys `adjective1` and `adjective2` would then be substituted within `aParameterizedLocalVar` within `locals` as in the following:

```json
{
  "locals": {
    "aParameterizedLocalVar":  {
      "message": "{adjective1} and {adjective2} day"
    }
  }
}
```

...producing:

> "A warm and sunny day"

Note that the locals key message can, as with the main key message,
include regular substitution formatter references, but if a substitution
formatter is of the same name as the parameter, the locale-supplied
parameters take precedence, i.e., with the above locale, the following
would produce the same result despite supplying its own `adjective1`:

```js
_('parameterizedLocalUsingKey', {
  adjective1: 'cold'
});
```

...i.e., still giving:

> "A warm and sunny day"

Parameterized locals can be particularly useful for a locale indicating
various grammatical cases of a variable/term and referencing them, again,
allowing for variation in case the term or its translation might change
(only the local variable would need to be updated). See the section on
"Conditionals/Plurals" for such use cases.

Locals can even reference other locals (and `switches`), though to prevent
accidentally deep nesting or recursion, the `maximumLocalNestingDepth` is
set to `3` by default (in `i18n`, `getDOMForLocaleString`, and
`defaultInsertNodes`).

### Conditionals/Plurals (`switches`)

#### Basic conditionals

The `switches` section of the `head`, like `locals`, is not meant to be
directly queried by the calling code, but is instead referenced within
`body` messages (through `{~aName}`-type syntax).

An example might look like this:

```json
{
  "head": {
    "switches": {
      "executive-pronoun": {
        "*nominative": {
          "message": "he"
        },
        "accusative": {
          "message": "him"
        }
      }
    }
  }
}
```

A locale string within `body` (or `locals`) can then reference such switches
with an initial tilde within curly brackets:

```json
{
  "switchUsingKey": {
    "message": "I gave it to {~executive-pronoun}"
  }
}
```

Note that the initial `*` has a special meaning to indicate that this
is the default value; if you don't pass an argument, that value will be used.

Also note that besides accepting explicit or entirely missing arguments,
switches can, unlike `locals`, accept run-time substitution arguments
which will be used in place of the default.

```js
const _ = await i18n();
const string = _('switchUsingKey', {
  'executive-pronoun': 'accusative'
});
// `string` will be "I gave it to him"
```

However, run-time substitutions will be overridden if the switch is
given an explicit argument in the locale (by a pipe symbol followed by an
explicit argument):

```json
{
  "switchUsingKey": {
    "message": "I think {~executive-pronoun|nominative} saw me."
  }
}
```

...which will return the following regardless of any runtime
substitution value:

> "I think he saw me."

Run-time substitutions can be used in switch messages. For example,
if we had the following above instead:

```json
"executive-pronoun": {
  "*nominative": {
    "message": "he ({executive-pronoun})"
  },
  "accusative": {
    "message": "him ({executive-pronoun})"
  }
}
```

...this could instead return the following:

> "I think he (nominative) saw me."

Note that the defaulting `*` is not added to the message.

Also note that nested `switches` behave differently from normal nested
keys in that only the last portion of a nested key will be available
as a substitution. For example, had our switch been as follows:

```json
{
  "nested": {
    "executive-pronoun": {
      "*nominative": {
        "message": "he ({executive-pronoun})"
      },
      "accusative": {
        "message": "him ({executive-pronoun})"
      }
    }
  }
}
```

...any run-time substitution would still provide `executive-pronoun`
as an argument, and not `nested.executive-pronoun`. However, keys
and locals would need to prefer to the switch with the
`nested.executive-pronoun` syntax. So in JavaScript, we might still have:

```js
_('switchUsingKey', {
  'executive-pronoun': 'accusative'
});
```

...while in a key we might have:

```json
{
  "key": {
    "message": "The pronoun is {~nested.executive-pronoun}"
  }
}
```

The reason for this discrepancy is that the (depth of) nesting of the
switch is meant to be private to the locale, a mere implementation detail,
whereas a substitution--if needed--can be public.

For another example which shows the benefits of the nesting and reusability
in `switches` (or `locals`), and adapting an example from the project that
inspired much of this one, [Fluent](https://projectfluent.org/fluent/guide/terms.html):

```json
{
  "head": {
    "switches": {
      "brand-name": {
        "case": {
          "*nominative": {
            "message": "Firefox"
          },
          "locative": {
            "message": "Firefoxa"
          }
        }
      }
    }
  },
  "body": {
    "about": {
      "message": "Informacje o {~brand-name.case|locative}."
    }
  }
}
```

Note that while the following could be implemented by `locals`, this would
not come with defaulting behavior:

```json
{
  "head": {
    "locals": {
      "brand-name": {
        "case": {
          "nominative": {
            "message": "Firefox"
          },
          "locative": {
            "message": "Firefoxa"
          }
        }
      }
    }
  },
  "body": {
    "about": {
      "message": "Informacje o {-brand-name.case.locative}."
    }
  }
}
```

#### Plurals

Conditionals also have built-in logic for mapping numbers to a suitable
localization (e.g., with different forms of grammr), depending on the
degree of the plural.

If a switch has keys set to the values returnable by [Intl.PluralRules#select](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules/select), i.e., one of "zero", "one", "two", "few", "many" or "other",
depending on the locale, these may be selected in the event a number
is supplied.

For example, with the following:

```json
{
  "locals": {
    "bananas": {
      "one": {
        "message": "one banana"
      },
      "*other": {
        "message": "{bananas} bananas"
      }
    }
  },
  "body": {
    "keyUsingSwitch": {
      "message": "You have {~bananas}."
    }
  }
}
```

```js
const _ = await i18n();

const string1 = _('keyUsingSwitch', {
  bananas: 20
});
// `string1` will be "You have 20 bananas."

const string2 = _('keyUsingSwitch', {
  bananas: 1
});
// `string2` will be "You have one banana."
```

Note that English only has the "one" and "other" forms for cardinal numbers
(the default), but other languages have distinct forms as their grammar
varies, e.g., if there are 0, 1, 2, or 3 items or few vs. many.

Note that these forms, even for English, can vary depending on number
formatting. For example, when there is a decimal place, English doesn't
actually use the "one" form, but instead uses the "other" form.

In order to indicate that the "other" form should be chosen, one
can indicate config along with the provided number by using a `plural`
(or `number`) type:

```js
const _ = await i18n();

const string1 = _('keyUsingSwitch', {
  bananas: {
    plural: [1, {
      minimumFractionDigits: 1
    }]
  }
});
// `string1` will be "You have 1 bananas."
```

Note, however, that while this properly selects our "other" form, it hasn't
actually formatted our number as a decimal. To do that, the locale will
need the built-in `NUMBER` function. (See the "Built-in functions" section
for more.)

```json
"*other": {
  "message": "{bananas|NUMBER|minimumFractionDigits:1} bananas"
}
```

This will give the desired output:

> "You have 1.0 bananas."

To take another example (and one where decimals are more likely),
we might have the following:

```json
{
  "score": {
    "0": {
      "message": "zero points"
    },
    "*other": {
      "message": "{score|NUMBER|minimumFractionDigits:1} points"
    }
  }
}
```

This example highlights another feature, namely, that besides plural
forms, explicit matches can also be made; in this example, for the number,
the text "zero" will be displayed if the supplied value is "0",
and the number will be displayed to one decimal point otherwise.

##### Casting

Continuing with the example in the previous section, rather than
requiring the run-time code to supply the formatting needed
for conditional key selection, locales can cast the supplied value within
the key, using the built-in function approach.

```json
{
  "score|NUMBER|minimumFractionDigits: 1": {
    "0.0": {
      "message": "zero points"
    },
    "*other": {
      "message": "{score|NUMBER|minimumFractionDigits:1} points"
    }
  }
}
```

We are now able to be consistent in showing our matches as based on a single
decimal (or as a plural category).

Note that number formatting is still needed here (for the "other" form) to
ensure this output string with the dynamic number is always shown with one
decimal, but such casting has the benefit of helping the runtime avoid the
need for supplying formatting and also brings control to the locale
as the locale takes precedence regardless of any runtime default setting
(settings are merged, so a run-time-provided setting can still seep through
to act as a default even if the locale overrides one or more other settings).

In the casting, one can also use "PLURAL" settings (based on
[`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/PluralRules)):

```json
{
  "pointsFraction|PLURAL|minimumFractionDigits: 1": {
    "one": {
      "message": "one point"
    },
    "*other": {
      "message": "{pointsFraction|NUMBER|minimumFractionDigits: 1} points"
    }
  }
}
```

One other situation in which explicit `PLURAL` casting is useful is in
ordinal numbers, which may have, as with English, different pluralization
categories for different numbers.

```json
{
  "rank|PLURAL|type: 'ordinal'": {
    "one": {
      "message": "{rank}st"
    },
    "two": {
      "message": "{rank}nd"
    },
    "few": {
      "message": "{rank}rd"
    },
    "*other": {
      "message": "{rank}th"
    }
  }
}
```

Note that if we had not provided the `type: 'ordinal'` config, the
`rank` would not be able to have more than the `"one"` and `"*other"`
categories, as English is limited to these for cardinal numbers, the
default, and therefore a number of 2 or 3 would end up mistakenly as
"2th" or "3th".

## Functions

While one may define one's own functions and their behaviors, the built-in
functions are created by passing the function name as first argument
(following a pipe symbol), and they may optionally be passed additional
JSON <!--
// https://github.com/d3x0r/JSON6/issues/18
[JSON5](https://github.com/json5/json5),
--> or [JSON6](https://github.com/d3x0r/JSON6) objects as parameters,
following another pipe symbol and dropping the outer curly brackets:

```json
{
  "someKey": {
    "message": "It is now {todayDate|DATETIME|year: 'numeric', month: 'long', day: 'numeric'}"
  }
}
```

### Built-in functions

There are some cases where locales will want to override or otherwise control
how a passed-in value is formatted, e.g., in cases where space is limited due
to the language requiring a longer translation in places.

The following subsections document the built-in functions (available as long
as one doesn't disable or override `i18n`'s default
`defaultAllSubstitutions`).

Note that although `PLURAL` follows a similar format in casting, this is not
available as a built-in function usable within normal or local key messages.
See the "Casting" section.

Each of the built-in functions has a corresponding subsitution type
(see "Substitution types"). Note, however, that if a built-in function is used,
a substitution type is not always required (in the case of number or date
values); the substitution type is needed for the runtime to provide default
configuration options, however. The built-in function options, when
specified, take precedence over defaults.

#### `NUMBER`

One may call `NUMBER` with no additional arguments to ensure that basic
number formatting is given (e.g., with commas for the thousands
separator).

```json
"beets": {
  "message": "{beetCount|NUMBER} beets"
},
```

...which for the following code:

```js
const string = _('beets', {
  beetCount: 123456.4567
});
```

...would give:

> 123,456.457 beets

(Only includes 3 digits, as `maximumFractionDigits` defaults to 3.)

One may also pass additional `Intl.NumberFormat` options to control the
exact numeric formatting:

```json
"oranges": {
  "message": "{orangeCount|NUMBER|maximumSignificantDigits: 7} oranges"
},
```

...which, for the following code:

```js
_('oranges', {
  orangeCount: 123456.4567
});
```

...would give:

> 123,456.5 oranges

See [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) for the complete list of options.

#### `DATETIME` (or `DATE`)

One may call `DATETIME` with no additional arguments to ensure that
basic date formatting is given.

```json
"dateKey": {
  "message": "It is now {todayDate|DATE}."
},
```

...which for the following code:

```js
const string = _('dateKey', {
  // The month is 0-based, so "11" is for December
  todayDate: new Date(Date.UTC(2019, 11, 10))
});
```

...would give:

> It is now 12/10/2019.

One may also pass additional `Intl.DateTimeFormat` options to control the
exact date-time formatting:

```json
"dateAliasWithArgAndOptionsKey": {
  "message": "It is now {todayDate|DATETIME|year: 'numeric', month: 'long', day: 'numeric'}."
},
```

...which, for the following code:

```js
const s = _('dateAliasWithArgAndOptionsKey', {
  // The month is 0-based, so "11" is for December
  todayDate: new Date(Date.UTC(2019, 11, 10))
});
```

...would give:

> It is now December 10, 2019.

See [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for the complete list of options.

#### `DATERANGE`

One may call `DATERANGE` with no additional arguments to ensure that
basic date range formatting is given, supplying two dates (and optionally, an
options object).

```json
"dateRangeWithArgKey": {
  "message": "It is between {dates|DATERANGE}."
},
```

...which for the following code:

```js
const string = _('dateRangeWithArgKey', {
  // The month is 0-based, so "11" is for December
  dates: [
    new Date(Date.UTC(2000, 11, 28, 13, 4, 5)),
    new Date(Date.UTC(2001, 11, 28, 7, 8, 9))
    // Can pass options here
  ]
});
```

...would give:

> It is between 12/27/2000, 7 PM – 12/27/2001, 11 PM.

One may also pass additional `Intl.DateTimeFormat` options to control the
exact date-time formatting:

```json
"dateRangeWithArgAndOptionsKey": {
  "message": "It is between {dates|DATERANGE|year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', timeZone: 'America/Los_Angeles'}."
},
```

...which, for the following code:

```js
const s = _('dateRangeWithArgAndOptionsKey', {
  // The month is 0-based, so "11" is for December
  dates: [
    new Date(Date.UTC(2000, 11, 28, 13, 4, 5)),
    new Date(Date.UTC(2001, 11, 28, 7, 8, 9))
  ]
});
```

...would give:

> It is between 12/27/2000, 7 PM – 12/27/2001, 11 PM.

See [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) (used with [Intl.DateTimeFormat.formatRange](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRange)) for the complete list of options.

#### `RELATIVE`

Unlike `NUMBER` or `DATETIME` which can be passed literals or native objects
as substitution values, this built-in function always expects a `relative`
substitution type (see "Substitution types").

You can override particular options that may be supplied with a `relative`
substitution object type:

```json
"relativeWithArgAndOptionsKey": {
  "message": "It was {relativeTime|RELATIVE|style: \"short\"}."
},
```

...which with the following code:

```js
const string = _('relativeWithArgAndOptionsKey', {
  relativeTime: {
    relative: [
      -3,
      'month'
    ]
  }
});
```

...would give:

> It was 3 mo. ago.

To override all supplied `relative` substitution object parameters, you can
use the built-in function without arguments, in which case the defaults
for `Intl.RelativeTimeFormat` will be used:

```json
"relativeWithArgKey": {
  "message": "It was {relativeTime|RELATIVE}"
},
```

...which with the same code above would give:

> It was 3 months ago.

See [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat) for the complete list of options.

#### `REGION`

One may call `REGION` with no additional arguments to ensure that
basic formatting of a region name is given.

```json
"regionWithArgKey": {
  "message": "Country {person} went to: {area|REGION}."
},
```

...which for the following code:

```js
const string = _('regionKey', {
  person: 'Joe',
  area: 'US'
});
```

...would give:

> Country Joe went to: United States.

One may also pass additional `Intl.DisplayNames` (`type: 'region'`) options to
control the exact formatting of the region name:

```json
"regionWithArgAndOptionsKey": {
  "message": "Country {person} went to: {area|REGION|style: 'short'}."
},
```

...which, for the following code:

```js
const s = _('dateAliasWithArgAndOptionsKey', {
  person: 'Joe',
  area: 'US'
});
```

...would give:

> Country Joe went to: US.

See [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) for the complete list of options (with `type`
set to `region`).

#### `LANGUAGE`

One may call `LANGUAGE` with no additional arguments to ensure that
basic formatting of a language name is given.

```json
"languageKey": {
  "message": "Can {person} speak {lang|LANGUAGE}?"
},
```

...which for the following code:

```js
const string = _('languageKey', {
  person: 'Joe',
  lang: 'en-US'
});
```

...would give:

> Can Joe speak American English?

One may also pass additional `Intl.DisplayNames` (`type: 'language'`) options
to control the exact formatting of the language name:

```json
"languageWithArgAndOptionsKey": {
  "message": "Can {person} speak {lang|LANGUAGE|style: 'short'}?"
},
```

...which, for the following code:

```js
const s = _('languageWithArgAndOptionsKey', {
  person: 'Joe',
  lang: 'en-US'
});
```

...would give:

> Can Joe speak US English?

See [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) for the complete list of options (with `type`
set to `language`).

#### `SCRIPT`

One may call `SCRIPT` with no additional arguments to ensure that
basic formatting of a script name is given.

```json
"scriptKey": {
  "message": "Can {person} write {scrpt|SCRIPT}?"
},
```

...which for the following code:

```js
const string = _('scriptKey', {
  person: 'Joe',
  scrpt: 'Cans'
});
```

...would give:

> Can Joe write Unified Canadian Aboriginal Syllabics?

One may also pass additional `Intl.DisplayNames` (`type: 'script'`) options
to control the exact formatting of the script name:

```json
"scriptKeyWithArgAndOptionsKey": {
  "message": "Can {person} write {scrpt|SCRIPT|style: 'short'}?"
},
```

...which, for the following code:

```js
const s = _('scriptKeyWithArgAndOptionsKey', {
  person: 'Joe',
  scrpt: 'Cans'
});
```

...would give:

> Can Joe write UCAS?

See [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) for the complete list of options (with `type`
set to `script`).

#### `CURRENCY`

One may call `CURRENCY` with no additional arguments to ensure that
basic formatting of a currency name is given.

```json
"currencyKey": {
  "message": "Currency unit: {money|CURRENCY} for your donation to {organization}."
},
```

...which for the following code:

```js
const string = _('currencyKey', {
  organization: 'the Red Cross',
  money: 'USD'
});
```

...would give:

> Currency unit: US Dollar for your donation to the Red Cross.

One may also pass additional `Intl.DisplayNames` (`type: 'currency'`) options
to control the exact formatting of the currency name:

```json
"currencyKeyWithArgAndOptionsKey": {
  "message": "Currency unit: {money|CURRENCY|style: 'short'} for your donation to {organization}."
},
```

...which, for the following code:

```js
const s = _('currencyKeyWithArgAndOptionsKey', {
  organization: 'the Red Cross',
  money: 'USD'
});
```

...would give:

> Currency unit: US Dollar for your donation to the Red Cross.

See [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) for the complete list of options (with `type`
set to `currency`).

#### `LIST`

Unlike `NUMBER` or `DATETIME` which can be passed literals or native objects
as substitution values, this built-in function always expects a `list`
substitution type (see "Substitution types").

You can override particular options that may be supplied with a `list`
substitution object type:

```json
"listWithArgAndOptionsKey": {
  "message": "The list is: {listItems|LIST|style: \"long\", type: \"conjunction\"}"
},
```

```js
const string = _('listKey', {
  listItems: {
    list: [
      [
        'a', 'z', 'ä', 'a'
      ],
      {
        type: 'disjunction'
      }
    ]
  }
});
```

...would give:

> The list is: a, a, ä, or z

To override all supplied `list` substitution object parameters, you can
use the built-in function without arguments, in which case the defaults
for `Intl.ListFormat` will be used:

```json
"listWithArgKey": {
  "message": "The list is: {listItems|LIST}"
},
```

...which with the following code:

```js
const string = _('listKey', {
  listItems: {
    list: [
      [
        'a', 'z', 'ä', 'a'
      ]
    ]
  }
});
```

...would give:

> The list is: a, a, ä, and z

In addition to accepting `Intl.ListFormat` arguments, `LIST` optionally
accepts a second set of options which will be used as configuration for
`Intl.Collator`:

```json
"listWithArgAndMultipleOptionsKey": {
  "message": "The list is: {listItems|LIST|style: \"long\", type: \"conjunction\"|sensitivity: \"variant\"}"
},
```

...which with the above code would give:

> The list is: a, a, ä, and z

For wrapping the list results in HTML, see `list` under "Substitution types".

See [Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat) for the complete list of options (and for the
complete list of secondary options, see
[Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator)).

## Collation

While the `LIST` built-in function details one use case where `Intl.Collator`
is put to use within `intl-dom`, namely the supplying of an array of values
to be stringified within a message, this will not help when you need to
build HTML, such as `<select>` `<option>` elements, out of localized messages,
and *then* ensure the elements are sorted.

`intl-dom` provides the methods, `sort` and `sortList` to assist in building
such HTML. There are two versions of these methods. One version is in
`intl-dom/utils.js`, and that version requires an initial argument of a locale.
The other version comes with the locale baked in, and is available on the
function instance returned by `i18n`.

```js
const _ = await i18n();

const sortedArray = _.sort([
  'a', 'z', 'ä', 'a'
], {
  sensitivity: 'base'
});

// `sortedArray` is now: ['a', 'ä', 'a', 'z']

// Now supply the sorted array to an HTML templating
//  utility which builds HTMl from an array, e.g.,

$('body').append('<select>' + sortedArray.map((item) => {
  return '<option>' + item + '</option>';
}).join('') + '</select>');
```

The other method `sortList` allows you to take advantage of
[`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat),
while being able to wrap the individual list items into HTML.

```js
const _ = await i18n();

const fragment = _.sortList(
  [
    'a', 'z', 'ä', 'a'
  ],
  // You can replace this mapper with one suitable to your needs and
  //  templating library
  (item, i) => {
    const a = document.createElement('a');
    a.id = `_${i}`;
    a.textContent = item;
    return a;
  },
  // List options
  {
    type: 'disjunction'
  },
  // Collation options
  {
    sensitivity: 'base'
  }
);

// Gives the following fragment:
// '<a id="_0">a</a>, <a id="_1">ä</a>, <a id="_2">a</a>, or <a id="_3">z</a>
```

See [Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat) for the complete list of options (and for the
complete list of secondary options, see
[Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator)).

## `list`

If you don't need the sorting present with `sortList`, you can use
`list` (with optional options):

```js
const string = _.list([
  'a', 'z', 'ä', 'a'
], {
  type: 'disjunction'
});
```

> 'a, z, ä, or a'

See [Intl.ListFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat) for the complete list of options.

See also `list` under "Substitution types" and "Collation/listing methods".

## API

### API Overview

`intl-dom` has different functions you can use, whether you need to dynamically
retrieve locale files at run time or just need to have locale messages (potentially
with defaults) extracted from a locale object, and have any place-holders it
contains replaced with strings or DOM Nodes obtained at runtime.

(The first (and possibly the second and third) will probably be of most general
interest; the others are used by the first three and can be used as part
of a custom localization system.)

1. `i18n`
1. `i18nServer`
1. `getStringFromMessageAndDefaults`
1. `getMessageForKeyByStyle`
1. `getDOMForLocaleString`
1. `findLocaleStrings`
1. `findLocale`
1. `defaultLocaleMatcher`
1. `defaultLocaleResolver`
1. `defaultAllSubstitutions`
1. `defaultInsertNodes`
1. `promiseChainForValues`
1. `getMatchingLocale`
1. `setFetch`
1. `getFetch`
1. `setDocument`
1. `getDocument`

### API Usage

As the main function, `i18n` is fairly well documented in the sections
below, but other methods only offer a short explanation and example.
See the tests for further examples.

#### `i18n`

This method ties together all of the elements for full, end-to-end
localization.

It returns a callback that can be used to extract messages out of a
locale file's data, falling back to any defaults (e.g., if the item has
not been translated yet).

In its simplest signature, you can call `i18n` without params:

```js
const _ = await i18n();
```

This will use the default configuration (described below) to find
an appropriate locale file, and returns a function which can be used
to return translated strings (or text nodes) or DOM fragments (depending
on whether you have supplied DOM substitutions). See the "Return value of
callback" subsection of why the return values may differ and how you can
force a `Node` to be returned.

Note that the returned function itself has the property `resolvedLocale`
to allow introspection on the locale detected.

The function also has a `strings` property allowing direct access to the
resolved string messages, but this should normally not be directly used
or needed.

##### Usage of the function returned by `i18n`

This function takes up to three arguments and returns a string, text node, or
DOM fragment. See the "Return value of callback" subsection.

1. Key
2. Substitutions object
3. Options object

(If you need to give options but have no substitutions, you must still provide
`null` for the second argument as the options can't be auto-differentiated
from substitutions.)

Here are some of the simplest uses, with just a key or a key and
substitutions:

```js
const string = _('key1');

const fragment = _('key2', {
  substitution1: 'aString',

  // The presence of this DOM element, will cause the result to be
  //   a fragment
  substitution2: anElement
});
```

For other substitution types besides strings and fragments, see
"Substitution types".

The "Return value of callback" subsection demonstrates the callback's
options object, though see "Arguments and defaults" for a fuller discussion.

##### Substitution types

Basic types:

1. String literals: Inserted as is (as a string).
1. DOM elements/fragments: Inserted as is (as DOM); forces return of fragment
1. Number literals: Auto-applies [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
1. `Date` objects: Auto-applies [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
1. Array of two `Date` objects and an optional options object: Auto-applies [`Intl.DateTimeFormat.formatRange`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRange).

In addition to supplying such literal or special native object values, one may
also provide a plain object with one (and only one) of the following reserved
keys. These types either do not have a literal/basic object option, or they are
a long-hand version of them (i.e., `number`, `date`, and `dateRange`).

1. `number`
1. `date` (or `datetime`)
1. `dateRange` (or `datetimeRange`) (accepts a two-item array as its object)
1. `relative`
1. `region`
1. `language`
1. `script`
1. `currency`
1. `list`
1. `plural`

The general pattern is to accept an array where the first item represents a
value (in the case of `relative`, both the first and second items represent
the value), and the subsequent item is an options object (`list` accepts a
second options object as well, and also has a signature with a function that
appears before the options objects).

For `dateRange`, this is instead a two-item array followed by any options.

The following subsections state the precise signature(s) and offer an
expressive example.

###### `number` - `[number, <Intl.NumberFormat Options>]` (or `number`)

**JSON:**

```json
"apples": {
  "message": "{appleCount} apples"
},
```

**JavaScript:**

```js
_('apples', {
  appleCount: {
    number: [123456.4567, {maximumSignificantDigits: 6}]
  }
});
```

**Returns:**

> "123,456 apples"

###### `date` (or `datetime`) - `[Date, <Intl.DateTimeFormat Options>]` (or `Date`)

**JSON:**

```json
"dateKey": {
  "message": "It is now {todayDate}"
},
```

**JavaScript:**

```js
_('dateKey', {
  todayDate: {
    date: [
      new Date(Date.UTC(2000, 11, 28, 13, 4, 5)),
      {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', timeZone: 'America/Los_Angeles'
      }
    ]
  }
});
```

**Returns:**

> "It is now 12/27/2000, 7 PM"

###### `dateRange` (or `datetimeRange`) - `[Date, Date, <Intl.DateTimeFormat Options>]`

**JSON:**

```json
"dateRangeKey": {
  "message": "It is between {dates}."
},
```

**JavaScript:**

```js
_('dateRangeKey', {
  dates: {
    dateRange: [
      // One may alternatively just use timestamps:
      // Date.UTC(2000, 11, 28, 13, 4, 5),
      // Date.UTC(2001, 11, 28, 7, 8, 9),

      new Date(Date.UTC(2000, 11, 28, 13, 4, 5)),
      new Date(Date.UTC(2001, 11, 28, 7, 8, 9)),
      // Optional options object
      {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', timeZone: 'America/Los_Angeles'
      }
    ]
  }
});
```

**Returns:**

> "It is between 12/27/2000, 7 PM – 12/27/2001, 11 PM."

###### `relative` - `[number, unit: string, <Intl.RelativeTimeFormat Options>]`

**JSON:**

```json
"relativeKey": {
  "message": "It was {relativeTime}"
},
```

**JavaScript:**

```js
_('relativeKey', {
  relativeTime: {
    relative: [-3, 'month', {
      style: 'short'
    }]
  }
});
```

**Returns:**

> "It was 3 mo. ago"

###### `region` - `[string, <Intl.DisplayNames Options>]`

**JSON:**

```json
"regionWithArgKey": {
  "message": "Country {person} went to: {area}."
},
```

**JavaScript:**

```js
_('regionWithArgKey', {
  person: 'Joe',
  area: {
    region: [
      'US',
      {
        style: 'long'
      }
    ]
  }
});
```

**Returns:**

> "Country Joe went to: United States."

###### `language` - `[string, <Intl.DisplayNames Options>]`

**JSON:**

```json
"languageWithArgKey": {
  "message": "Can {person} speak {lang|LANGUAGE}?"
},
```

**JavaScript:**

```js
_('languageWithArgKey', {
  person: 'Joe',
  lang: {
    language: [
      'en-US',
      {
        style: 'long'
      }
    ]
  }
});
```

**Returns:**

> "Can Joe speak American English?"

###### `script` - `[string, <Intl.DisplayNames Options>]`

**JSON:**

```json
"scriptKeyWithArgKey": {
  "message": "Can {person} write {scrpt|SCRIPT}?"
},
```

**JavaScript:**

```js
_('scriptKeyWithArgKey', {
  person: 'Joe',
  scrpt: {
    script: [
      'Cans',
      {
        style: 'long'
      }
    ]
  }
});
```

**Returns:**

> "Can Joe write Unified Canadian Aboriginal Syllabics?"

###### `currency` - `[string, <Intl.DisplayNames Options>]`

**JSON:**

```json
"currencyKeyWithArgKey": {
  "message": "Currency unit: {money|CURRENCY} for your donation to {organization}."
},
```

**JavaScript:**

```js
_('currencyKeyWithArgKey', {
  organization: 'the Red Cross',
  money: {
    currency: [
      'USD',
      {
        style: 'long'
      }
    ]
  }
});
```

**Returns:**

> "Currency unit: US Dollar for your donation to the Red Cross."

###### `list` - `[string[], <Intl.ListFormat Options>, <Intl.Collator Options>]` or `[string[], (string, number) => string|Node, <Intl.ListFormat Options>, <Intl.Collator Options>]`

**SIGNATURE 1**

**JSON:**

```json
"listKey": {
  "message": "The list is: {listItems}"
},
```

**JavaScript:**

```js
_('listKey', {
  listItems: {
    list: [
      [
        'a', 'z', 'ä', 'a'
      ],
      {
        type: 'disjunction'
      },
      {
        sensitivity: 'base'
      }
    ]
  }
});
```

**Returns:**

> "The list is: a, ä, a, or z"

**SIGNATURE 2**

**JSON:**

```json
"listKey": {
  "message": "The list is: {listItems}"
},
```

**JavaScript:**

```js
_('listKey', {
  listItems: {
    list: [
      [
        'a', 'z', 'ä', 'a'
      ],
      (item, i) => {
        const a = document.createElement('a');
        a.id = `_${i}`;
        a.textContent = item;
        return a;
      }, {
        type: 'disjunction'
      }, {
        sensitivity: 'base'
      }
    ]
  }
});
```

**Returns:**

> (An HTML fragment equivalent to: `The list is: <a id="_0">a</a>, <a id="_1">ä</a>, <a id="_2">a</a>, or <a id="_3">z</a>`)

###### `plural`- `[number, <Intl.PluralRules Options>]`

See the "Plurals" section for example usage.

See also "Built-in functions".

##### Return value of callback

With the DOM element method `append`, both strings and fragments (or
other nodes) can be appended, so the default result of this callback--which can produce strings if no DOM substitutions are given and a document fragment otherwise--is
polymorphic relative to that `append` method.

However, if you always want a Node returned, e.g., for full `Node`
polymorphism, you can supply `forceNodeReturn` to the `i18n` constructor
and this will wrap what would otherwise be strings into a text node:

```js
const _ = await i18n({forceNodeReturn: true});
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
const _ = await i18n({
  // Array of BCP-47 language strings (the locales primarily
  //   desired by the user)
  locales: navigator.languages,

  // Array of BCP-47 language strings (in case no locales are available
  //  for those specified in `locales`)
  defaultLocales: ['en-US'],

  // Means for obtaining locale and locale strings; see `findLocaleStrings`
  localeStringFinder: findLocaleStrings,

  // String path segment; with the default locale resolver, will
  //   be followed by:
  //       /_locales/<locale>/messages.json
  localesBasePath: '.',

  // Function to take a base path and locale (absolute or relative) and
  //  return a URL; see `defaultLocaleResolver`
  localeResolver: defaultLocaleResolver,

  // May also be a function taking a locale and returning another
  //  locale to check; see `findLocaleStrings`
  localeMatcher: 'lookup',

  // Determines the organization structure style of the locale files;
  //   may be "richNested", "rich", "plain", "plainNested", or a function; see
  //   "Message styles" and `getMessageForKeyByStyle`
  messageStyle: 'richNested',

  // Callback to give replacement text based on a substitution value.
  //  See `defaultAllSubstitutions`
  allSubstitutions: defaultAllSubstitutions,

  // Callback to return a string or array of nodes and strings based on a
  // localized string, substitutions object, and other metadata; see
  // `defaultInsertNodes`
  insertNodes: defaultInsertNodes,

  // Object for falling back if the locale object is missing a given key;
  // `false`, `null`, or `undefined`, it will throw if a value is not found;
  //  should otherwise be an object of the same message style as the locales.
  defaults: undefined,

  // A substitutions object to apply to all keys; if it is a function, it
  //  can accept arguments from the locale and indicate a dynamic replacement.
  //  See the `substitutions` argument discussion under the callback arguments
  //  below and `getDOMForLocaleString` for the function format.
  substitutions: false,

  // For avoiding recursion among local locale variable resolution
  maximumLocalNestingDepth: 3,

  // See the properties of the same name below in the callback arguments
  //   section for an explanation of these values; these values can be
  //   set to change the *default* value in the callback; you can set these
  //   here if you know you wish to minimize the frequency of a need
  //   to manually specify/override

  dom: false,

  // Set to `true` to always return a `Node` (instead of a string or fragment);
  //   See "Return value of callback"
  forceNodeReturn: false,

  // Throws an error if the substitutions object is missing a key found
  //  within the formatting string; if `false`, will allow the string to
  //  be passed without a substitution being made, e.g., the returned
  //  string might be: "Here is a {missingSubstitutionKey}" if
  //  `missingSubstitutionKey` is not on the substitution object
  throwOnMissingSuppliedFormatters: true,

  // Throws an error if the calling code supplies a substitution object
  //  with key(s) that don't end up needed in the specified key (including
  //  cases where the key embeds local variables that use substitution
  //  keys).
  throwOnExtraSuppliedFormatters: true
});
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
      // Depending on the key value, we return, e.g.,
      //  "KEY3" or "key3"
      return arg === 'UPPER' ? key.toUpperCase() : key;
    }
  },

  // Optional options object
  {
    // The following have the same meaning as the properties of the same
    //   name (see the subsection "Arguments and defaults" of the "i8n"
    //   section), but, if given, they will override the default value
    //   that is described there.
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

#### `i18nServer`

Similar to `i18n` but you provide your own locale data, so there are none of
these arguments:

- `locales`
- `defaultLocales`
- `localeStringFinder`
- `localesBasePath`
- `localeResolver`
- `localeMatcher`

This runs synchronously unlike `i18n` since there is no need for a network
request with the locale info supplied by you.

May be of particular use on the server, where it is practical to cache some
locale strings and serve them, rather than fetching them anew each time.
(And the strings and locale could be passed down to the client as a global
so the client wouldn't need to make the new fetches inherent with `i18n`
either.)

#### `getStringFromMessageAndDefaults`

Checks if a message is supplied and if not, checks for a default value out of
a given object (using `getMessageForKeyByStyle` by default). Used internally
by `i18n`.

```js
const string = getStringFromMessageAndDefaults({
  message: undefined,
  key: 'key',
  defaults: {
    key: {
      message: 'myKeyValue'
    }
  },
  messageStyle: 'rich'
});

// Gives "myKeyValue"
```

#### `getMessageForKeyByStyle`

Obtains a callback which can get localized string messages out of
JSON/JavaScript objects based on a given message style (see
"Message styles"). Used internally by `i18n`, `Formatter`,
and `getStringFromMessageAndDefaults`.

```js
const func = getMessageForKeyByStyle({
  messageStyle: 'rich'
});
const localeObj = {
  body: {
    key: {
      message: 'myKeyValue'
    }
  }
};

console.log(func(localeObj, 'key').value);
// Gives: "myKeyValue"

console.log(func(localeObj, 'key').info);
// Gives: {message: 'myKeyValue'}
```

#### `getDOMForLocaleString`

Takes a string, substitutions object, and regular expression to extract
format place-holders and returns a string or document fragment based on
the values supplied to it. May also return a text node if `forceNodeReturn`
is set to `true`.

```js
const elem = document.createElement('a');
elem.href = 'http://example.com';
elem.textContent = 'message';

const frag = getDOMForLocaleString({
  string: 'simple {msg}',
  substitutions: {
    msg: elem
  }
});
// Gives a fragment with content equal to:
//   'simple <a href="http://example.com">message</a>'
```

This method, as with `i18n`, may take functions as `substitutions`
values, potentially:

```js
const string = getDOMForLocaleString({
  string: 'simple {msg|UPPER} {msg}',
  substitutions: {
    msg ({arg, key}) { // `key` is "msg" here
      return arg === 'UPPER' ? 'MESSAGE' : 'message';
    }
  }
});
console.log(string);
// 'simple MESSAGE message';
```

#### `findLocaleStrings`

Dynamically obtains locale file data to return a JSON object with the data
as `strings` and the successfully resolved locale as `locale`. Uses
`defaultLocaleResolver` by default for path resolution.

To use a different strategy than "lookup" (which successively strips
hyphenated subexpressions, e.g., "en" out of "en-US"), you can supply
a function for `localeMatcher` which accepts a locale string and should
return a string or a `Promise` that resolves to another locale to try
(or it can throw if none is found).

Note that you can avoid the need for `locales` by supplying a global
`intlDomLocale`. See the "Server code" section on how it
may be preferable for performance to supply this global based on
server-side detection rather than relying on client-side defaulting.

If all values fail, `defaultLocales` will be used, and this itself
defaults to `["en-US"]`.

```js
const {strings, locale} = await findLocaleStrings({
  locales: ['zz', 'fr'],
  defaultLocales: ['en-US']
});

// Assuming `zz` and `fr` locales are not found
console.log(locale);
// 'en-US'

console.log(strings);
// (The JSON object obtained out of the file at
//  `/_locales/en-US/messages.json`, the default
//  location per the default locale resolver,
//  `defaultLocaleResolver`)
```

#### `findLocale`

As with `findLocaleStrings`, but only returns the `locale` (and as a string
rather than on an object).

```js
const locale = await findLocale({
  locales: ['zz', 'fr'],
  defaultLocales: ['en-US']
});

// Assuming `zz` and `fr` locales are not found
console.log(locale);
// 'en-US'
```

#### `defaultLocaleMatcher`

This follows the ["lookup" algorithm](https://tools.ietf.org/html/rfc4647#section-3.4)
as used by [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_negotiation), successively stripping off
the final hyphen portion until a match may be found. While this function
throws when no hyphen is found, it is only used by `findLocaleStrings`
after any given locale (with or without a hyphen) is checked, and
`findLocaleStrings` will also use `defaultLocales` which should be
a locale known to exist (`defaultLocales` defaults to an array with only
`en-US`, but if you do not have an `en-US` locale,, you must change the
default).

```js
defaultLocaleMatcher('zh-Hant-HK');
```

> 'zh-Hant'

#### `defaultLocaleResolver`

Converts a base path and language code into a path, i.e.,
`<basePath>/_locales/<locale>/messages.json`.

```js
const locale = 'en-US';
const localesBasePath = '/base/path/';
const path = defaultLocaleResolver(localesBasePath, locale);
console.log(path);
// '/base/path/_locales/en-US/messages.json'
```

#### `defaultAllSubstitutions`

Passed information for a substitution and returns the replacement.

Returns the value is if given a string or Node.

```js
defaultAllSubstitutions({value: 'str'});
```

> 'str'

If supplying certain types of literals such as numbers or special
native objects, such as `Date` objects, `Intl` formatting may be automatically
applied.

For example:

```js
defaultAllSubstitutions({
  value: 123456.789
});
```

> '123,456.789'

Plain objects using a single special reserved key may also provide `Intl`
control (or more precise control than for the literals), e.g., as with this
auto-application of [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat):

```js
defaultAllSubstitutions({
  value: {
    number: [123456.4567, {maximumSignificantDigits: 6}]
  }
});
```

> '123,456'

Other `Intl` types can be specified through such objects as well, including for [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat),
[`Intl.RelativeTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat)
and [`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ListFormat):

```js
defaultAllSubstitutions({
  value: {
    relative: [
      -3,
      'month'
    ]
  }
});
```

> '3 months ago'

For more on the accepted types, see "Substitution types".

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

```js
defaultInsertNodes({
  string: 'You have {~bananas}',
  locale: 'en-US',
  substitutions: {
    bananas: 3
  },
  usedKeys: [],
  checkExtraSuppliedFormatters () {
    //
  },
  missingSuppliedFormatters () {
    //
  },
  switches: {
    bananas: {
      one: {
        message: 'one banana'
      },
      '*other': {
        message: '{bananas} bananas'
      }
    }
  }
});
```

> 'You have 3 bananas'

#### `promiseChainForValues`

`intl-dom` also currently exports a utility for Promises,
`promiseChainForValues`, which can be used to process an array of values
in series and short-circuit the chain when conditions are suitable. (It is
used internally for locale discovery but made available for reuse.)

(This may be swapped out in the future for an equivalent third-party
Promise utility.)

Here is an example:

```js
await promiseChainForValues(['a', 'b', 'c'], (v) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(v);
    }, 100);
  });
});
```

Which resolves to:

> 'a'

#### `getMatchingLocale`

This is a utility for synchronously using a locale resolver (the hyphen-stripping
`defaultLocaleMatcher` by default) to find a match within an array of locales
(if there is a match).

```js
getMatchingLocale({locale: 'en-US', locales: ['en']});
```

Which results in:

> 'en'

If no match is found, `false` will be returned.

#### `setFetch`

Sets the `fetch` method used to retrieve locale files, e.g., with
[file-fetch](https://github.com/bergos/file-fetch). Only needed in Node
as the global `fetch` will be checked.

```js
const {setFetch, i18n} = require('intl-dom');
const fileFetch = require('file-fetch');

setFetch(fileFetch);

// Now use `i18n`:
i18n();
```

#### `getFetch`

Retrieves the function set by `setFetch` (or the global `fetch` if none
had been set).

```js
const {setFetch, getFetch, i18n} = require('intl-dom');
const fileFetch = require('file-fetch');

setFetch(fileFetch);

getFetch();
```

Gives:

> (fileFetch)

#### `setDocument`

Sets `document` used for creating fragments, etc.. Only needed in Node
as the global `document` will be checked.

```js
const {setDocument, i18n} = require('intl-dom');
const {JSDOM} = require('jsdom');

setDocument((new JSDOM()).window.document);

// Now use `i18n`:
i18n();
```

#### `getDocument`

Retrieves the object set by `setDocument` (or the global `document` if none
had been set).

```js
const {setDocument, getDocument, i18n} = require('intl-dom');
const {JSDOM} = require('jsdom');

setDocument((new JSDOM()).window.document);

getDocument();
```

Gives:

> ((new JSDOM()).window.document)

#### `Formatter`, `LocalFormatter`, `RegularFormatter`, `SwitchFormatter`

These classes are used by `defaultInsertNodes` (and indirectly by
`getDOMForLocaleString` and `i18n`).

`Formatter` is the base class and these classes should identify the formatting
and performs substitutions. `LocalFormatter` does so for `locals`,
`SwitchFormatter` for `switches` and `RegularFormatter` for
regular keys.

See the `Formatter.js` for the structure and `defaultInsertNodes.js` for usage.

#### Collation/listing methods (`sort`, `list`, `sortList`, `sortListSimple`)

These methods facilitate collation.

`sort` is used by `i18n` and `sortList` is used by `i18n` and
`defaultAllSubstitutions` (see the "Collation" section) though these
methods here might be useful on their own, e.g., if you need to pass in
a locale.

##### `sort`

Simple wrapper for `Intl.Collator#compare` used on an array:

```js
sort('en-US', [
  'a', 'z', 'ä', 'a'
], {
  sensitivity: 'base'
});
```

> ['a', 'ä', 'a', 'z']

##### `list`

Bare wrapper for `Intl.ListFormat#format`:

```js
list('en-US', [
  'a', 'z', 'ä', 'a'
]);
```

> 'a, z, ä, and a'

##### `sortListSimple`

Combines `sort` and `list` to collate an array and format it as a list.
Only produces strings. For generating HTML, use `sortList` instead.

```js
sortListSimple('en-US', [
  'a', 'z', 'ä', 'a'
]);
```

> 'a, a, ä, and z'

##### `sortList`

Behaves like `sortListSimple` but also accepts an optional third argument
map function which can wrap each item in the list, even producing non-string
DOM content.

```js
sortList('en-US', [
  'a', 'z', 'ä', 'a'
], (item, i) => {
  const a = document.createElement('a');
  a.id = `_${i}`;
  a.textContent = item;
  return a;
}, {
  type: 'disjunction'
}, {
  sensitivity: 'base'
});
```

> (A fragment with `<a id="_0">a</a>, <a id="_1">ä</a>, <a id="_2">a</a>, or <a id="_3">z</a>`)

### Server code

Since the locale algorithm uses the simple approach client-side of checking
for the existence of the closest matching locale file, e.g., first checking for
`en-US` then `en`, this can cause unnecessary HTTP requests which can be
optimized out by determining which locale fits a matching file server-side
and supplying that to the client.

You could approach this in two ways:

1. Run `findLocale` or `findLocaleStrings` on demand after supplying a
    `fetch` implementation to `setFetch`, e.g., by using
    [file-fetch](https://github.com/bergos/file-fetch),
    and supplying the `Accept-Language` header for `locales` and
    then returning the best matching locale (or locale contents), e.g.,
    with this info baked in as a global set within a server-generated
    `<script>` or within an always-included, dynamically-generated file.
    This approach is taken in `/node/findMatchingLocaleServer.js` (see
    also `/test/node.js` for its usage). (The `find-matching-locale`
    npm script sets up a server to return the locale as a JSON string.)
    The `i18nServer` method can have its `resolvedLocale` and `strings`
    arguments supplied from the result of `findLocaleStrings`.
2. As above, but iterate through your locales directory, creating a map
    (possibly using a mapper function (e.g., `defaultLocaleMatcher`)) of
    user locales to existing locales, and caching this map for use as a
    browser global (also set within a `<script>` or dynamically-generated
    file). The client-side script can then look through `navigator.languages`
    to find the best match without an HTTP request.

## FAQ

### Why are you using your own JSON format over the Fluent file format?

While I am open to adding built-in support for the Fluent file format,
I felt more comfortable using JSON for starters, because:

1. It is well-known and developers are comfortable parsing it, e.g.,
    to develop translation interfaces.
2. JSON may be more adaptable to some environments like WebExtension
    add-ons (though our default syntax expects `head` and `body`, these
    should be fairly readily convertible programmatically).

The default format in `intl-dom` is intended to be compatible with Project
Fluent, and it should be largely round-trippable (`switches` were added
to our JSON format to avoid clumsiness in long JSON strings, but these
are essentially an out-of-line version of Fluent's inline "selectors").
We did add `RELATIVE` and `LIST` type built-ins, however, and are using
`PLURAL` instead of `NUMBER` for forced plural options.

Fluent files do have some advantages over JSON, however, as far as
avoiding the need for quoting, adding line breaks, etc. One could get
some of these advantages by compiling to JSON from another format, such
as [JSON6](https://github.com/d3x0r/JSON6).

## Credits

This project has been heavily inspired by
[Fluent](https://projectfluent.org/fluent/guide/).

## See also

- [i18nizeElement](https://github.com/brettz9/i18nizeElement)
- [Intl.supportedValuesOf](https://github.com/tc39/proposal-intl-enumeration)
  (not adaptable meaningfully into `intl-dom`, but may be useful to build
  UI like menus which can pass on the internationalized values and config
  passed in to `intl-dom`)

## To-dos

- Support [Intl.DurationFormat](https://github.com/tc39/proposal-intl-duration-format)
with [this polyfill](https://www.npmjs.com/package/intl-unofficial-duration-unit-format?activeTab=readme)?
- Support [Intl.NumberFormat.formatRange](https://github.com/tc39/proposal-intl-numberformat-v3) as it may advance
- Change to **named capturing group for formatters**, not only for internal best
  practices but for ease on users
- Use **dominum** with Jamilih and have tests use Jamilih (minimum's
  deliberately minimal implementation won't allow, e.g., setting
  `id`/`href` properties as we are now, and Jamilih is less verbose anyways.
- Export on main intl-dom?
- Ensure **coverage** in browser is ok?
- Option to **parse** Fluent files?
- **Switches**
  - Expect `{default: true}` instead of `*` in switches or at least allow
    asterisks through escaping
  - Support `switches` that are available as sibling to `message`, i.e.,
    in a particular context
- We might accept a **`defaultPath`** argument to `i18n` to obtain default values
  out of a file, potentially resolvable by a template function which can take
  a locale as argument.
- In **rich formats**, bless particular style for adding **comments** alongside
  `message`/`description` (comments for file, group, or item?)
