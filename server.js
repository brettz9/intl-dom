import {dirname} from 'path';
import findMatchingLocaleServer from './node/findMatchingLocaleServer.js';

findMatchingLocaleServer({
  basePath: dirname(import.meta.url) + '/test/browser'
});
