// eslint-disable-next-line no-shadow -- Needed
import {expect} from 'chai';
import {
  promiseChainForValues
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

/* eslint-disable promise/avoid-new */
describe('promiseChainForValues', function () {
  it('should throw with bad arguments', function () {
    expect(() => {
      promiseChainForValues(
        // @ts-expect-error Testing bad values
        'nonArrayValues',
        () => {
          // Empty
        }
      );
    }).to.throw(
      TypeError,
      'The `values` argument to `promiseChainForValues` must be an array.'
    );

    expect(() => {
      promiseChainForValues(
        ['ok'],
        // @ts-expect-error Testing bad values
        'notAFunction'
      );
    }).to.throw(
      TypeError,
      'The `errBack` argument to `promiseChainForValues` must be a function.'
    );
  });
  it('should properly resolve without any rejections', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('a');
    expect(errbackCount, 'should short-circuit').to.equal(1);
  });
  it('should properly accept rejection and continue', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        if (v === 'a') {
          reject(new Error('missing'));
          return;
        }
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('b');
    expect(errbackCount, 'should short-circuit').to.equal(2);
  });
  it(
    'should properly accept multiple rejections and continue',
    async function () {
      let errbackCount = 0;
      const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
        errbackCount++;
        return new Promise(function (resolve, reject) {
          if (v === 'a' || v === 'b') {
            reject(new Error('missing'));
            return;
          }
          setTimeout(() => {
            resolve(v);
          }, 100);
        });
      });
      expect(val).to.equal('c');
      expect(errbackCount, 'should short-circuit').to.equal(3);
    }
  );
});
/* eslint-enable promise/avoid-new */
