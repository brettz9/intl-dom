'use strict';

module.exports = {
  reject: [
    // Fixing version (to 1.6.1) where it still worked without a global `URL`;
    //   currently needing overwriting of global URL in some projects like
    //   typeson-registry
    'file-fetch'
  ]
};
