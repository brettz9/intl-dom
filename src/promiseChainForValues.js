/**
* @callback PromiseChainErrback
* @param {any} errBack
* @returns {Promise<any>|any}
*/

/**
 * The given array will have its items processed in series; if the supplied
 *  `errBack` (which is guaranteed to run at least once), when passed the
 *  current item, returns a `Promise` or value that resolves, that value will
 *  be used for the return result of this function and no other items in
 *  the array will continue to be processed; if it rejects, however, the
 *  next item will be processed with `errBack`.
 * Accept an array of values to pass to an errback which should return
 *  a promise (or final result value) which resolves to a result or which
 *  rejects so that the next item in the array can be checked in series.
 * @param {Array<any>} values Array of values
 * @param {PromiseChainErrback} errBack Accepts an item of the array as its
 *   single argument
 * @param {string} [errorMessage="Reached end of values array."]
 * @returns {Promise<any>} Either resolves to a value derived from an item in
 *  the array or rejects if all items reject
 * @example
 promiseChainForValues(['a', 'b', 'c'], (val) => {
   return new Promise(function (resolve, reject) {
     if (val === 'a') {
       reject(new Error('missing'));
     }
     setTimeout(() => {
       resolve(val);
     }, 100);
   });
 });
 */
export const promiseChainForValues = (
  values, errBack, errorMessage = 'Reached end of values array.'
) => {
  if (!Array.isArray(values)) {
    throw new TypeError(
      'The `values` argument to `promiseChainForValues` must be an array.'
    );
  }
  if (typeof errBack !== 'function') {
    throw new TypeError(
      'The `errBack` argument to `promiseChainForValues` must be a function.'
    );
  }
  return (async () => {
    let ret;
    let p = Promise.reject(
      new Error('Intentionally reject so as to begin checking chain')
    );
    let breaking;
    while (true) {
      const value = values.shift();
      try {
        // eslint-disable-next-line no-await-in-loop
        ret = await p;
        break;
      } catch (err) {
        if (breaking) {
          throw new Error(errorMessage);
        }
        // We allow one more try
        if (!values.length) {
          breaking = true;
        }
        // // eslint-disable-next-line no-await-in-loop
        p = errBack(value);
      }
    }
    return ret;
  })();
};
