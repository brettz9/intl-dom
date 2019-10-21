import 'regenerator-runtime/runtime.js';
import {DefaultLocaleResolver} from '../dist/index.esm.js';

describe('API', function () {
  it('DefaultLocaleResolver', function () {
    expect(DefaultLocaleResolver).to.be.a('function');
  });
});
