import {sort, arrayToSortedListFragment} from '../src/collation.js';

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
  describe('arrayToSortedListFragment', function () {
    it(
      'should handle collation-based sorting and adding to HTML',
      function () {
        const array = arrayToSortedListFragment('en-US', [
          'a', 'z', 'ä', 'a'
        ], (item) => {
          const a = document.createElement('a');
          a.textContent = item;
          return a;
        }, {
          type: 'disjunction'
        }, {
          sensitivity: 'base'
        });
        expect(array).to.have.fragmentHtml(
          '<a>a</a>, <a>ä</a>, <a>a</a>, or <a>z</a>'
        );
      }
    );
  });
});
