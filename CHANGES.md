# intl-dom CHANGES

## 0.13.1

- Fix: Allow timestamp for `date:` without `arg`.

## 0.13.0

- Enhancement: Support number (timestamps) for date ranges.

## 0.12.5

- Fix: Ensure that `i18n`, as with `getStringFromMessageAndDefaults`, allows
  for empty string value keys

## 0.12.4

- Fix: Ensure Git tag reflects package
- npm: Update lock

## 0.12.3

- Fix: Properly push `key` for 0.12.1 fix

## 0.12.2

- Fix: Include 0.12.1 improvements in `dist`

## 0.12.1

- Fix: Ensure all function-type `substitutions` are trusted

## 0.12.0

- Enhancement: Add `setJSONExtra` export to avoid global usage
- Docs: Consistent `node_modules` path
- Docs: Update license badge per latest
- npm: Update `file-fetch` (minor)

**Dev-facing**:
- npm: Add `lint` script
- npm: Update devDeps.

## 0.11.0

- npm: Update `file-fetch` (minor), `json-6` (minor)
- Docs: Update info on JSON-6 in the browser

**Dev-facing**:

- Linting: As per latest ash-nazg
- npm: Update devDeps.
- npm: Update from deprecated `babel-eslint` and use `@brettz9/node-static`
  fork without reported vulnerabilities

## 0.10.0

- Enhancement: Support `Intl.DisplayNames` types (region, language, script,
    currency)
- Enhancement: Support `dateRange`
- Docs: Update badges per latest updates
- Linting (ESLint): As per latest ash-nazg
- Testing: Fix browser tests
- npm: Add `prepublishOnly` script
- npm: Update from deprecated `rollup-plugin-babel` to `@rollup/plugin-babel`
    (and make `babelHelpers` explicit)
- npm: Use stable `mocha-multi-reporters`
- npm: Update json-6 and devDeps.

## 0.9.0

- Enhancement: Return server from `findMatchingLocaleServer`
- Update: API as per latest `intl-pluralrules`
- Linting: As per latest ash-nazg
- Docs: Update license badge dev per latest updates (`chai-dom` now
  has proper MIT license meta-data)
- Docs: Add filesize badge
- Testing: Ensure properly closing server (so tests will exit without need for `process.exit()` as added to mocha-multi-reporters fork)
- npm: Point to now merged `mocha-badge-generator`
- npm: Update devDeps

## 0.8.0

- Build: Update as per latest rollup (no changes from browserify)
- Docs: Update coverage and tests badges
- Docs: Add license badges
- npm: Update json6 dep.
- npm: Update devDeps.

## 0.7.0

- Enhancement: Add `setFetch`/`getFetch` to avoid need for a global `fetch`
  in Node
- Enhancement: Add `setDocument`/`getDocument` to avoid need for a global
  `document` in Node

## 0.6.0

- Enhancement: Give synchronous `getMatchingLocale` utility for, e.g., stripping
  hyphens recursively to find a match
- Linting (ESLint): Add `fintechstudios/eslint-plugin-chai-as-promised` and
  fix accordingly
- Linting (ESLint): Add `eslint-plugin-mocha` and fix accordingly
- Linting (ESLint): Add `eslint-plugin-mocha-cleanup`
- Linting (ESLint): Check `.eslintrc.js` file; add
  `eslint-plugin-chai-expect-keywords`
- Linting: As per latest ash-nazg (remove now extraneous disable directve)
- Linting: Include `.mocharc.js` file
- Testing: Fix Node tests (run script `intl-mocha`) to ensure its bootstrapping
  environment directly loads the `PluralRules` shim rather than going through
  the polyfill detection code (which does not do full detection of
  `maximumFractionDigits` support and instead will avoid polyfilling when
  finding the incomplete `PluralRules` implementation).
- npm: Clarify message in script
- npm: Update devDeps and `package-lock.json`

## 0.5.0

- Enhancement: Extract out and export `i18nServer`
- Linting (ESLint): Per latest ash-nazg
- Testing: Use `mocha-multi-reporters` to produce badge with test results
- Docs: Switch to `mocha-badge-generator` for tests badge
- Docs: Add `IssueHunt` badge
- npm: Bump dep. (`file-fetch`)
- npm: Update `package-lock.json`
- npm: Update devDeps

## 0.4.0

- Fix: `json-6` should have been dep.
- Build: Use plain module specifier despite it breaking browser test as
    nyc + esm currently needs this to work in Node 12
- Docs: Locally built Mocha and coverage badges
- Testing: Fix for ESM
- npm: Update devDeps

## 0.3.1

- Build: Update build files (for `list` addition)
- npm: Update devDeps

## 0.3.0

- Enhancement: Expose `list` on `i18n` return function (`_`).
- Testing: Coverage for part of nested switch missing; ignore
  `performance` testing
- npm: Update `rollup`/`rolup-plugin-terser` devDeps.

## 0.2.1

- Security fix: `defaultLocaleResolver` should not allow special characters

## 0.2.0

- Robust initial version (see git history)

## 0.1.0

- Initial version
