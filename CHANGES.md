# intl-dom CHANGES

## ?

- Linting (ESLint): Per latest ash-nazg
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
