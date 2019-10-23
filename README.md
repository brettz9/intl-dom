# intl-dom

***This project is not yet functional!***

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

## Usage

// Todo: Document here, publish, and update project status above

```js
i18n();
```

## Other methods

Some other methods used by `i18n` are also available for export. You
might wish to use them if you only wish to use some of the logic of `i18n`,
e.g., for string resolution, but not file retrieval.

### `promiseChainForValues`

(This may be swapped out in the future for an equivalent third-party
Promise utility.)

### `defaultLocaleResolver`

### `getMessageForKeyByStyle`

### `getStringFromMessageAndDefaults`

### `getDOMForLocaleString`

### `findLocaleStrings`
