import {
  defaultAllSubstitutions
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

describe('defaultAllSubstitutions', function () {
  it('should throw with a bad formatter', function () {
    expect(() => {
      defaultAllSubstitutions({});
    }).to.throw(TypeError, 'Unknown formatter');
  });
});
