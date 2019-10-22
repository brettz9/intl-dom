import chai from 'chai';
import chaiDOM from 'chai-dom';
import {JSDOM} from 'jsdom';

import {
  promiseChainForValues,
  defaultLocaleResolver,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  i18n
} from '../src/index.js';

chai.use(chaiDOM);

global.document = (new JSDOM()).window.document;

// Todo: We could replace this with a custom plugin
const container = (string) => {
  const dummyContainer = document.createElement('div');
  dummyContainer.append(string);
  return dummyContainer;
};

describe('API', function () {
  it('should export functions', function () {
    expect(promiseChainForValues).to.be.a('function');
    expect(defaultLocaleResolver).to.be.a('function');
    expect(getMessageForKeyByStyle).to.be.a('function');
    expect(getStringFromMessageAndDefaults).to.be.a('function');
    expect(getDOMForLocaleString).to.be.a('function');
    expect(findLocaleStrings).to.be.a('function');
    expect(i18n).to.be.a('function');
  });
});

/* eslint-disable promise/avoid-new */
describe('promiseChainForValues', function () {
  it('should throw with bad arguments', function () {
    expect(() => {
      promiseChainForValues('nonArrayValues', () => {
        // Empty
      });
    }).to.throw(
      TypeError,
      'The `values` argument to `promiseChainForValues` must be an array.'
    );

    expect(() => {
      promiseChainForValues(['ok'], 'notAFunction');
    }).to.throw(
      TypeError,
      'The `errBack` argument to `promiseChainForValues` must be a function.'
    );
  });
  it('should properly resolve without any rejections', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('a');
    expect(errbackCount, 'should short-circuit').to.equal(1);
  });
  it('should properly accept rejection and continue', async function () {
    let errbackCount = 0;
    const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
      errbackCount++;
      return new Promise(function (resolve, reject) {
        if (v === 'a') {
          reject(new Error('missing'));
        }
        setTimeout(() => {
          resolve(v);
        }, 100);
      });
    });
    expect(val).to.equal('b');
    expect(errbackCount, 'should short-circuit').to.equal(2);
  });
  it(
    'should properly accept multiple rejections and continue',
    async function () {
      let errbackCount = 0;
      const val = await promiseChainForValues(['a', 'b', 'c'], (v) => {
        errbackCount++;
        return new Promise(function (resolve, reject) {
          if (v === 'a' || v === 'b') {
            reject(new Error('missing'));
          }
          setTimeout(() => {
            resolve(v);
          }, 100);
        });
      });
      expect(val).to.equal('c');
      expect(errbackCount, 'should short-circuit').to.equal(3);
    }
  );
});
/* eslint-enable promise/avoid-new */

describe('defaultLocaleResolver', function () {
  it('should throw upon a non-string `localesBasePath`', function () {
    expect(() => {
      const nonStringLocale = null;
      defaultLocaleResolver('/ok/base/path', nonStringLocale);
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `locale`.'
    );
  });
  it('should throw upon a non-string `locale`', function () {
    expect(() => {
      const nonStringBasePath = null;
      const okLocale = 'en';
      defaultLocaleResolver(nonStringBasePath, okLocale);
    }).to.throw(
      TypeError,
      '`defaultLocaleResolver` expects a string `localesBasePath`.'
    );
  });
  it('should resolve with no trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path';
    const path = defaultLocaleResolver(localesBasePath, locale);
    expect(path).to.equal(expected);
  });
  it('should resolve with a trailing slash base path', function () {
    const expected = '/base/path/_locales/en-US/messages.json';
    const locale = 'en-US';
    const localesBasePath = '/base/path/';
    const path = defaultLocaleResolver(localesBasePath, locale);
    expect(path).to.equal(expected);
  });
});

describe('getMessageForKeyByStyle', function () {
  describe('Default style', function () {
    it('should process in rich style', function () {
      const func = getMessageForKeyByStyle();
      const localeObj = {
        key: {
          message: 'myKeyValue'
        }
      };
      expect(func(localeObj, 'key')).to.equal('myKeyValue');
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
  });
  describe('Function style', function () {
    it('should return function value', function () {
      const localeObj = {
        key: 'myKeyValue'
      };
      const func = getMessageForKeyByStyle({
        messageStyle (obj, key) {
          return obj[key] || false;
        }
      });
      expect(func(localeObj, 'key')).to.equal('myKeyValue');
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
  });
  describe('Explicit rich style', function () {
    it('should process in rich style', function () {
      const func = getMessageForKeyByStyle({
        messageStyle: 'rich'
      });
      const localeObj = {
        key: {
          message: 'myKeyValue'
        }
      };
      expect(func(localeObj, 'key')).to.equal('myKeyValue');
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
  });
  describe('plain style', function () {
    it('should process in plain style', function () {
      const func = getMessageForKeyByStyle({
        messageStyle: 'plain'
      });
      const localeObj = {
        key: 'myKeyValue'
      };
      expect(func(localeObj, 'key')).to.equal('myKeyValue');
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
  });
  describe('Bad style', function () {
    it('should throw with an unknown style', function () {
      expect(() => {
        getMessageForKeyByStyle({
          messageStyle: 'badStyle'
        });
      }).to.throw(TypeError, 'Unknown `messageStyle` badStyle');
    });
  });
});

describe('getStringFromMessageAndDefaults', function () {
  it(
    'should throw with empty argument', function () {
      expect(() => {
        getStringFromMessageAndDefaults();
      }).to.throw(
        TypeError,
        'An options object with a `key` string is expected on ' +
        '`getStringFromMessageAndDefaults`'
      );
    }
  );
  it(
    'should throw with non-string key', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          key: null
        });
      }).to.throw(
        TypeError,
        'An options object with a `key` string is expected on ' +
        '`getStringFromMessageAndDefaults`'
      );
    }
  );
  it('should return a string message', function () {
    const string = getStringFromMessageAndDefaults({
      message: 'myKeyValue',
      key: 'myKey'
    });
    expect(string).to.equal('myKeyValue');
  });
  it(
    'should return a string message with defaults object present',
    function () {
      const string = getStringFromMessageAndDefaults({
        message: 'myKeyValue',
        key: 'myKey',
        defaults: {
          myKey: 'somethingElse'
        }
      });
      expect(string).to.equal('myKeyValue');
    }
  );
  it(
    'should return a string message with defaults false',
    function () {
      const string = getStringFromMessageAndDefaults({
        message: 'myKeyValue',
        key: 'myKey',
        defaults: false
      });
      expect(string).to.equal('myKeyValue');
    }
  );
  it('should return an empty string message', function () {
    const string = getStringFromMessageAndDefaults({
      message: '',
      key: 'myKey'
    });
    expect(string).to.equal('');
  });
  it('should return a string message with an empty string key', function () {
    const string = getStringFromMessageAndDefaults({
      message: 'myKeyValue',
      key: ''
    });
    expect(string).to.equal('myKeyValue');
  });
  it(
    'should throw with an undefined message and ' +
    'defaults set to `false`', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: false
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
    }
  );
  it(
    'should throw with an undefined message and ' +
    'defaults set to non-false/non-object', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: null
        });
      }).to.throw(
        Error,
        'Default locale strings must resolve to `false` or an object!'
      );
    }
  );
  it(
    'should throw with an undefined message and ' +
    '`messageForKey` returning `false`', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {},
          messageForKey (defaults, key) {
            return key in defaults ? String(defaults[key]) : false;
          }
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
    }
  );
  it(
    'should throw with an undefined message and ' +
    '`messageStyle` `messageForKey` returning `false`', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {
            anotherKey: {
              message: 'anotherKeyOk'
            }
          },
          messageStyle: 'rich'
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {
            myKey: {
              message: false
            }
          },
          messageStyle: 'rich'
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {
            myKey: false
          },
          messageStyle: 'plain'
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {
            myKey: {}
          },
          messageStyle: 'plain'
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
      expect(() => {
        getStringFromMessageAndDefaults({
          message: undefined,
          key: 'myKey',
          defaults: {
            anotherKey: 'anotherKeyOk'
          },
          messageStyle: 'plain'
        });
      }).to.throw(Error, 'Key value not found for key: (myKey)');
    }
  );
  it(
    'should return a string message with a string key indicating a string ' +
    'on the `messageStyle` `messageForKey`', function () {
      let string = getStringFromMessageAndDefaults({
        message: undefined,
        key: 'myKey',
        defaults: {
          myKey: {
            message: 'myKeyValue'
          }
        },
        messageStyle: 'rich'
      });
      expect(string).to.equal('myKeyValue');

      string = getStringFromMessageAndDefaults({
        message: undefined,
        key: 'myKey',
        defaults: {
          myKey: 'myKeyValue'
        },
        messageStyle: 'plain'
      });
      expect(string).to.equal('myKeyValue');
    }
  );
  it(
    'should return a string message with a string key indicating a string ' +
    'on a `messageForKey` function', function () {
      const string = getStringFromMessageAndDefaults({
        message: undefined,
        key: 'myKey',
        defaults: {
          myKey: 'myKeyValue'
        },
        messageForKey (defaults, key) {
          return key in defaults ? String(defaults[key]) : false;
        }
      });
      expect(string).to.equal('myKeyValue');
    }
  );
});

describe('getDOMForLocaleString', function () {
  it('should throw with bad arguments', function () {
    expect(() => {
      getDOMForLocaleString();
    }).to.throw(
      TypeError,
      'An options object with a `string` property set to a string must ' +
      'be provided for `getDOMForLocaleString`.'
    );

    expect(() => {
      getDOMForLocaleString({
        string: null
      });
    }).to.throw(
      TypeError,
      'An options object with a `string` property set to a string must ' +
      'be provided for `getDOMForLocaleString`.'
    );
  });
  it('should return string', function () {
    const string = getDOMForLocaleString({
      string: 'simple message',
      throwOnMissingSuppliedFormatters: false
    });
    expect(string).to.equal('simple message');
  });
  it('should return string text node (with `forceNodeReturn`)', function () {
    const string = getDOMForLocaleString({
      string: 'simple message',
      forceNodeReturn: true,
      throwOnMissingSuppliedFormatters: false
    });
    expect(string).to.have.text('simple message');
  });
  it(
    'should return string text node (with `forceNodeReturn` ' +
    'not throwing)',
    function () {
      const string = getDOMForLocaleString({
        string: 'simple message',
        forceNodeReturn: true
      });
      expect(string).to.have.text('simple message');
    }
  );
  it('should return string text node (with `dom`)', function () {
    const string = getDOMForLocaleString({
      string: 'simple message',
      dom: true
    });
    expect(string).to.have.text('simple message');
  });

  it('should return string with substitutions', function () {
    const string = getDOMForLocaleString({
      string: 'simple {msg}',
      substitutions: {
        msg: 'message'
      }
    });
    expect(string).to.equal('simple message');
  });

  it('should return string with multiple substitutions', function () {
    const string = getDOMForLocaleString({
      string: '{simp} {msg}',
      substitutions: {
        msg: 'message',
        simp: 'simple'
      }
    });
    expect(string).to.equal('simple message');
  });

  it(
    'should return string with multiple substitutions of ' +
    'same key',
    function () {
      const string = getDOMForLocaleString({
        string: '{msg} {msg}',
        substitutions: {
          msg: 'message'
        }
      });
      expect(string).to.equal('message message');
    }
  );

  it(
    'should return string text node with substitutions (with `dom`)',
    function () {
      const string = getDOMForLocaleString({
        string: 'simple {msg}',
        dom: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(string).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions (with `dom`)',
    function () {
      const string = getDOMForLocaleString({
        string: '{simp} {msg}',
        dom: true,
        substitutions: {
          msg: 'message',
          simp: 'simple'
        }
      });
      expect(string).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions of ' +
    'same key (with `dom`)',
    function () {
      const string = getDOMForLocaleString({
        string: '{msg} {msg}',
        dom: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(string).to.have.text('message message');
    }
  );

  it(
    'should return string text node with substitutions (with ' +
    '`forceNodeReturn`)',
    function () {
      const string = getDOMForLocaleString({
        string: 'simple {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(string).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions (with ' +
    '`forceNodeReturn`)',
    function () {
      const string = getDOMForLocaleString({
        string: '{simp} {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message',
          simp: 'simple'
        }
      });
      expect(string).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions of ' +
    'same key (with `forceNodeReturn`)',
    function () {
      const string = getDOMForLocaleString({
        string: '{msg} {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(string).to.have.text('message message');
    }
  );

  it('should throw with missing supplied formatters', function () {
    expect(() => {
      getDOMForLocaleString({
        string: 'A {msg}',
        forceNodeReturn: true,
        substitutions: {
        }
      });
    }).to.throw(
      Error,
      'Missing formatting key: msg'
    );

    expect(() => {
      getDOMForLocaleString({
        string: 'A {msg}',
        forceNodeReturn: true,
        throwOnMissingSuppliedFormatters: true,
        substitutions: {
        }
      });
    }).to.throw(
      Error,
      'Missing formatting key: msg'
    );
  });

  it(
    'should throw with missing supplied formatters and ' +
    '`throwOnMissingSuppliedFormatters` disabled',
    function () {
      expect(() => {
        getDOMForLocaleString({
          string: 'A {msg}',
          forceNodeReturn: true,
          throwOnMissingSuppliedFormatters: false,
          substitutions: {
          }
        });
      }).to.not.throw();
    }
  );

  it('should throw with extra supplied formatters', function () {
    expect(() => {
      getDOMForLocaleString({
        string: 'A {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message',
          anExtraOne: 'why am I here?'
        }
      });
    }).to.throw(
      Error,
      'Extra formatting key: anExtraOne'
    );

    expect(() => {
      getDOMForLocaleString({
        string: 'A {msg}',
        forceNodeReturn: true,
        throwOnExtraSuppliedFormatters: true,
        substitutions: {
          msg: 'message',
          anExtraOne: 'why am I here?'
        }
      });
    }).to.throw(
      Error,
      'Extra formatting key: anExtraOne'
    );
  });

  it(
    'should not throw with extra supplied formatters and ' +
    '`throwOnExtraSuppliedFormatters` disabled',
    function () {
      expect(() => {
        getDOMForLocaleString({
          string: 'A {msg}',
          forceNodeReturn: true,
          throwOnExtraSuppliedFormatters: false,
          substitutions: {
            msg: 'message',
            anExtraOne: 'why am I here?'
          }
        });
      }).to.not.throw();
    }
  );

  it('should return DOM with DOM substitution', function () {
    const elem = document.createElement('a');
    elem.href = 'http://example.com';
    elem.textContent = 'message';

    const string = getDOMForLocaleString({
      string: 'simple {msg}',
      substitutions: {
        msg: elem
      }
    });
    expect(string).to.have.text('simple message');
    expect(string).to.contain(elem);

    expect(container(string)).to.have.html('simple <a href="http://example.com">message</a>');
  });

  it('should return DOM with DOM substitution', function () {
    const elem = document.createElement('a');
    elem.href = 'http://example.com';
    elem.textContent = 'message';

    const simpElem = document.createElement('span');
    simpElem.textContent = 'simple';

    const string = getDOMForLocaleString({
      string: '{simp} {msg}',
      substitutions: {
        msg: elem,
        simp: simpElem
      }
    });
    expect(string).to.have.text('simple message');
    expect(string).to.contain(elem);
    expect(string).to.contain(simpElem);

    expect(container(string)).to.have.html('<span>simple</span> <a href="http://example.com">message</a>');
  });

  it(
    'should throw with missing supplied formatters (but one DOM formatter)',
    function () {
      expect(() => {
        const simpElem = document.createElement('span');
        simpElem.textContent = 'simple';

        getDOMForLocaleString({
          string: '{simp} {msg}',
          throwOnMissingSuppliedFormatters: true,
          substitutions: {
            simp: simpElem
          }
        });
      }).to.throw(
        Error,
        'Missing formatting key: msg'
      );
    }
  );

  it(
    'should throw with extra supplied formatters (including DOM)',
    function () {
      expect(() => {
        const simpElem = document.createElement('span');
        simpElem.textContent = 'why am I here?';
        getDOMForLocaleString({
          string: 'A {msg}',
          throwOnExtraSuppliedFormatters: true,
          substitutions: {
            msg: 'message',
            anExtraOne: simpElem
          }
        });
      }).to.throw(
        Error,
        'Extra formatting key: anExtraOne'
      );

      expect(() => {
        const simpElem = document.createElement('span');
        simpElem.textContent = 'simple';
        getDOMForLocaleString({
          string: 'A {msg}',
          throwOnExtraSuppliedFormatters: true,
          substitutions: {
            msg: simpElem,
            anExtraOne: 'why am I here?'
          }
        });
      }).to.throw(
        Error,
        'Extra formatting key: anExtraOne'
      );
    }
  );
});

describe('findLocaleStrings', function () {
  // Todo: also test empty arguments
});

describe('i18n', function () {
  // Todo: also test empty arguments
  // Todo: Ensure coverage is complete
  // Todo: Add browser test
  // Todo: Document
});
