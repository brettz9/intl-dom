# intl-dom

***This project is not yet functional!***

This library allows applications to discover locale files (even untrusted ones)
and utilize the strings while inserting DOM elements amidst them, returning a
document fragment.

## Installation

```shell
npm install --save intl-dom regenerator-runtime
```

For older browser support, you may also need `core-js-bundle`.

### Browser

```html
<script type="./node_modules/regenerator-runtime/runtime.js"></script>
<script type="./node_modules/intl-dom/dist/index.umd.js"></script>
```

### Browser (ESM)

```js
import './node_modules/regenerator-runtime/runtime.js';
import {IntlDom} from './node_modules/intl-dom/dist/index.esm.js';
```

### Browser (Bundle)

```js
import 'regenerator-runtime';
import {IntlDom} from 'intl-dom';
```

## Usage

```js
const {i18n: _} = new IntlDom();
```
