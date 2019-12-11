import {sort, sortList} from '../src/collation.js';

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
  describe('sortList', function () {
    it(
      'should handle collation-based sorting and adding to HTML',
      function () {
        const array = sortList('en-US', [
          'a', 'z', 'ä', 'a'
        ], (item, i) => {
          const a = document.createElement('a');
          a.id = `_${i}`;
          a.textContent = item;
          return a;
        }, {
          type: 'disjunction'
        }, {
          sensitivity: 'base'
        });
        expect(array).to.have.fragmentHtml(
          '<a id="_0">a</a>, <a id="_1">ä</a>, ' +
            '<a id="_2">a</a>, or <a id="_3">z</a>'
        );
      }
    );
  });
});
