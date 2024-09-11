/* globals document -- Simulated browser or browser testing */
import {expect} from 'chai';
import {
  defaultAllSubstitutions
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('defaultAllSubstitutions', function () {
  it('should throw with a bad formatter', function () {
    expect(() => {
      defaultAllSubstitutions(
        // @ts-expect-error Testing bad argument
        {}
      );
    }).to.throw(TypeError, 'Unknown formatter');
  });
  it('should return the supplied value if a string', function () {
    const str = defaultAllSubstitutions({value: 'str'});
    expect(str).to.equal('str');
  });
  it('should return the supplied value if a Node', function () {
    const node = /** @type {Node} */ (defaultAllSubstitutions({
      value: document.createTextNode('str')
    }));
    expect(node.nodeValue).to.equal('str');
  });
  it('should perform number processing', function () {
    const val = defaultAllSubstitutions({
      value: 123456.4567
    });
    expect(val).to.equal('123,456.457');
  });
  it('should perform special number processing', function () {
    const val = defaultAllSubstitutions({
      value: {
        number: [123456.4567, {maximumSignificantDigits: 6}]
      }
    });
    expect(val).to.equal('123,456');
  });
  it('should perform date processing', function () {
    const val = defaultAllSubstitutions({
      value: new Date(Date.UTC(2000, 11, 28, 13, 4, 5))
    });
    expect(val).to.equal('12/28/2000');
  });
  it('should perform relative processing', function () {
    const val = defaultAllSubstitutions({
      value: {
        relative: [
          -3,
          'month'
        ]
      }
    });
    expect(val).to.equal('3 months ago');
  });
});
