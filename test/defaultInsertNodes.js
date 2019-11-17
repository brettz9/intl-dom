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
          maximumLocalNestingDepth: 'not a number'
        });
      }).to.throw(TypeError, '`maximumLocalNestingDepth` must be a number.');
    }
  );
});
