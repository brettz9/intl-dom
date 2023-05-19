// Type definitions for fragmentHtml
// Definitions by: Brett Zamir

/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
      fragmentHtml(fragmentHtml: string): Assertion;
  }
}
/*
declare module 'fragmentHtml' {
  const fragmentHtml: Chai.ChaiPlugin;
  export = fragmentHtml;
}
*/
