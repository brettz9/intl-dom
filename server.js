import {dirname} from 'node:path';
import findMatchingLocaleServer from './node/findMatchingLocaleServer.js';

findMatchingLocaleServer({
  basePath: dirname(import.meta.url) + '/test/browser'
});
