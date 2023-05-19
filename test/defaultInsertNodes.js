// eslint-disable-next-line no-shadow -- Needed
import {expect} from 'chai';
import {
  defaultInsertNodes
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('defaultInsertNodes', function () {
  it(
    'should throw when passed a non-number `maximumLocalNestingDepth`',
    function () {
      expect(() => {
        defaultInsertNodes({
          // @ts-expect-error Testing bad arguments
          maximumLocalNestingDepth: 'not a number'
        });
      }).to.throw(TypeError, '`maximumLocalNestingDepth` must be a number.');
    }
  );
  it('should process a switch', function () {
    const val = defaultInsertNodes({
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
        return false;
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
    expect(val).to.equal('You have 3 bananas');
  });
});
