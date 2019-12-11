import {sort} from '../src/collation.js';

describe('Collation', function () {
  describe('sort', function () {
    it(
      'should handle collation-based sorting',
      function () {
        const array = sort('en-US', [
          'a', 'z', 'ä', 'a'
        ], {
          sensitivity: 'base'
        });
        expect(array).to.deep.equal(['a', 'ä', 'a', 'z']);
      }
    );
  });
});
