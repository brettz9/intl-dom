import {setExpectedData} from './utils/utils.js';
import {
  promiseChainForValues,
  defaultLocaleResolver,
  defaultAllSubstitutions,
  defaultInsertNodes,
  getMessageForKeyByStyle,
  getStringFromMessageAndDefaults,
  getDOMForLocaleString,
  findLocaleStrings,
  i18n
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

// Make path resolutions consistent in Node with HTML
if (typeof process !== 'undefined') {
  // eslint-disable-next-line global-require
  process.chdir(require('path').join(__dirname, 'browser'));
}

describe('API', function () {
  it('should export functions', function () {
    expect(promiseChainForValues).to.be.a('function');
    expect(defaultLocaleResolver).to.be.a('function');
    expect(defaultAllSubstitutions).to.be.a('function');
    expect(defaultInsertNodes).to.be.a('function');
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

describe('defaultAllSubstitutions', function () {
  it('should throw with a bad formatter', function () {
    expect(() => {
      defaultAllSubstitutions({});
    }).to.throw(TypeError, 'Unknown formatter');
  });
});

/*
// Currently covered elsewhere indirectly
describe('defaultInsertNodes', function () {
  it('', function () {
    defaultInsertNodes({
      string: ''
    });
  });
});
*/

describe('getMessageForKeyByStyle', function () {
  beforeEach(function () {
    setExpectedData.call(this);
  });
  describe('Default style', function () {
    it('should process in rich nested style', function () {
      const func = getMessageForKeyByStyle();
      const localeObj = {
        body: {
          key: {
            message: 'myKeyValue'
          }
        }
      };
      expect(func(localeObj, 'key').value).to.equal(
        this.expectedRichStyleObject.body.key.message
      );
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });

    it('should process nested in rich nested style', function () {
      const func = getMessageForKeyByStyle();
      const localeObj = {
        body: {
          key: {
            that: {
              lessNested: {
                message: 'anotherKeyValue'
              },
              is: {
                nested: {
                  message: 'myKeyValue'
                }
              }
            }
          }
        }
      };
      expect(func(localeObj, 'key.that.is.nested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested.message
      );
      expect(func(localeObj, 'key.that.lessNested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested.message
      );
      expect(func(localeObj, 'key.that.is.nested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested
      );
      expect(func(localeObj, 'key.that.lessNested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested
      );
      expect(func(localeObj, 'key.that')).to.equal(false);
      expect(func(localeObj, 'key.that.is.nested.too.deep')).to.equal(false);
      expect(func(localeObj, 'a.nested.missingKey')).to.equal(false);
    });
  });
  describe('Function style', function () {
    it('should return function value', function () {
      const localeObj = {
        body: {
          key: 'myKeyValue'
        }
      };
      const func = getMessageForKeyByStyle({
        messageStyle (obj, key) {
          if (obj.body[key]) {
            return {
              value: obj.body[key]
            };
          }
          return false;
        }
      });
      expect(func(localeObj, 'key').value).to.equal(
        this.expectedPlainStyleObject.body.key
      );
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
  });
  describe('Explicit rich style', function () {
    it('should process in rich style', function () {
      const func = getMessageForKeyByStyle({
        messageStyle: 'rich'
      });
      const localeObj = {
        body: {
          key: {
            message: 'myKeyValue'
          }
        }
      };
      expect(func(localeObj, 'key').value).to.equal(
        this.expectedRichStyleObject.body.key.message
      );
      expect(func(localeObj, 'key').info).to.deep.equal(
        this.expectedRichStyleObject.body.key
      );
      expect(func(localeObj, 'missingKey')).to.equal(false);
    });
    it('should process nested in rich nested style', function () {
      const func = getMessageForKeyByStyle({
        messageStyle: 'richNested'
      });
      const localeObj = {
        body: {
          key: {
            that: {
              lessNested: {
                message: 'anotherKeyValue'
              },
              is: {
                nested: {
                  message: 'myKeyValue'
                }
              }
            }
          }
        }
      };
      expect(func(localeObj, 'key.that.is.nested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested.message
      );
      expect(func(localeObj, 'key.that.lessNested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested.message
      );
      expect(func(localeObj, 'key.that.is.nested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested
      );
      expect(func(localeObj, 'key.that.lessNested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested
      );
      expect(func(localeObj, 'key.that')).to.equal(false);
      expect(func(localeObj, 'key.that.is.nested.too.deep')).to.equal(false);
      expect(func(localeObj, 'a.nested.missingKey')).to.equal(false);
    });
  });
  describe('plain style', function () {
    beforeEach(function () {
      setExpectedData.call(this);
    });
    it('should process in plain style', function () {
      const func = getMessageForKeyByStyle({
        messageStyle: 'plain'
      });
      expect(func(this.expectedPlainStyleObject, 'key').value).to.equal(
        this.expectedPlainStyleObject.body.key
      );
      expect(func(this.expectedPlainStyleObject, 'missingKey')).to.equal(false);
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
  beforeEach(function () {
    setExpectedData.call(this);
  });
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
    'should return a string message despite defaults object present',
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
    'should return a string message despite defaults false',
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
          defaults: 500
        });
      }).to.throw(
        Error,
        'Default locale strings must resolve to `false`, nullish, or an object!'
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
        key: 'key',
        defaults: {
          key: {
            message: 'myKeyValue'
          }
        },
        messageStyle: 'rich'
      });
      expect(string).to.equal(this.expectedRichStyleObject.body.key.message);

      string = getStringFromMessageAndDefaults({
        message: undefined,
        key: 'myKey',
        defaults: {
          myKey: 'myKeyValue'
        },
        messageStyle: 'plain'
      });
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
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
          defaults = defaults.body;
          return key in defaults ? {value: String(defaults[key])} : false;
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
  it('should return string (with no `allSubstitutions`)', function () {
    const string = getDOMForLocaleString({
      string: 'simple message',
      allSubstitutions: null,
      throwOnMissingSuppliedFormatters: false
    });
    expect(string).to.equal('simple message');
  });
  it('should return string text node (with `forceNodeReturn`)', function () {
    const node = getDOMForLocaleString({
      string: 'simple message',
      forceNodeReturn: true,
      throwOnMissingSuppliedFormatters: false
    });
    expect(node).to.have.text('simple message');
  });
  it(
    'should return string text node (with `forceNodeReturn` ' +
    'not throwing)',
    function () {
      const node = getDOMForLocaleString({
        string: 'simple message',
        forceNodeReturn: true
      });
      expect(node).to.have.text('simple message');
    }
  );
  it('should return string text node (with `dom`)', function () {
    const node = getDOMForLocaleString({
      string: 'simple message',
      dom: true
    });
    expect(node).to.have.text('simple message');
  });

  it('should return string with a substitution', function () {
    const string = getDOMForLocaleString({
      string: 'simple {msg}',
      substitutions: {
        msg: 'message'
      }
    });
    expect(string).to.equal('simple message');
  });

  it('should return string with a function substitution', function () {
    const string = getDOMForLocaleString({
      string: 'simple {msg}',
      substitutions: {
        msg () {
          return 'message';
        }
      }
    });
    expect(string).to.equal('simple message');
  });

  it(
    'should return string with a function substitution and template argument',
    function () {
      const string = getDOMForLocaleString({
        string: 'simple {msg|UPPER} {msg}',
        substitutions: {
          msg ({arg, key}) {
            return arg === 'UPPER' ? 'MESSAGE' : 'message';
          }
        }
      });
      expect(string).to.equal('simple MESSAGE message');
    }
  );

  it(
    'should return fragment with a function substitution and template argument',
    function () {
      const frag = getDOMForLocaleString({
        string: 'simple {msg|UPPER} {msg}',
        substitutions: {
          msg ({arg, key}) {
            if (arg === 'UPPER') {
              const b = document.createElement('b');
              b.textContent = 'MESSAGE';
              return b;
            }
            const span = document.createElement('span');
            span.textContent = 'message';
            return span;
          }
        }
      });
      expect(frag).to.have.fragmentHtml(
        'simple <b>MESSAGE</b> <span>message</span>'
      );
    }
  );

  it(
    'should return fragment with a function substitution and template ' +
    'argument (and no `allSubstitutions`)',
    function () {
      const frag = getDOMForLocaleString({
        string: 'simple {msg|UPPER} {msg}',
        allSubstitutions: null,
        substitutions: {
          msg ({arg, key}) {
            if (arg === 'UPPER') {
              const b = document.createElement('b');
              b.textContent = 'MESSAGE';
              return b;
            }
            const span = document.createElement('span');
            span.textContent = 'message';
            return span;
          }
        }
      });
      expect(frag).to.have.fragmentHtml(
        'simple <b>MESSAGE</b> <span>message</span>'
      );
    }
  );

  it(
    'should return string with substitutions and custom `insertNodes`',
    function () {
      const str = getDOMForLocaleString({
        // eslint-disable-next-line no-template-curly-in-string
        string: 'simple ${msg}',
        insertNodes ({string, substitutions}) {
          // See `defaultInsertNodes` for a more robust implementation
          //   to emulate
          // eslint-disable-next-line max-len
          // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
          const formattingRegex = /(\\*)\$\{([^}]*?)(?:\|([^}]*))?\}/gu;
          return string.replace(formattingRegex, (_, esc, ky, arg) => {
            const substitution = substitutions[ky];
            return esc + substitution;
          });
        },
        substitutions: {
          msg: 'message'
        }
      });
      expect(str).to.equal('simple message');
    }
  );

  it(
    'should return string with escaped brackets',
    function () {
      const str = getDOMForLocaleString({
        string: 'simple \\{msg}'
      });
      expect(str).to.equal('simple {msg}');
    }
  );

  it(
    'should return string with escaped backslash',
    function () {
      const str = getDOMForLocaleString({
        string: 'simple \\\\{msg}',
        substitutions: {
          msg: 'message'
        }
      });
      expect(str).to.equal('simple \\message');
    }
  );

  it(
    'should return fragment with escaped brackets',
    function () {
      const frag = getDOMForLocaleString({
        string: 'simple \\{msg} {frag}',
        substitutions: {
          frag: document.createElement('br')
        }
      });
      expect(frag).to.have.fragmentHtml('simple {msg} <br>');
    }
  );

  it(
    'should return fragment with escaped backslash',
    function () {
      const frag = getDOMForLocaleString({
        string: 'simple \\\\{msg} {frag}',
        substitutions: {
          msg: 'message',
          frag: document.createElement('br')
        }
      });
      expect(frag).to.have.fragmentHtml('simple \\message <br>');
    }
  );

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
      const node = getDOMForLocaleString({
        string: 'simple {msg}',
        dom: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(node).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions (with `dom`)',
    function () {
      const node = getDOMForLocaleString({
        string: '{simp} {msg}',
        dom: true,
        substitutions: {
          msg: 'message',
          simp: 'simple'
        }
      });
      expect(node).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions of ' +
    'same key (with `dom`)',
    function () {
      const node = getDOMForLocaleString({
        string: '{msg} {msg}',
        dom: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(node).to.have.text('message message');
    }
  );

  it(
    'should return string text node with substitutions (with ' +
    '`forceNodeReturn`)',
    function () {
      const node = getDOMForLocaleString({
        string: 'simple {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(node).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions (with ' +
    '`forceNodeReturn`)',
    function () {
      const node = getDOMForLocaleString({
        string: '{simp} {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message',
          simp: 'simple'
        }
      });
      expect(node).to.have.text('simple message');
    }
  );

  it(
    'should return string text node with multiple substitutions of ' +
    'same key (with `forceNodeReturn`)',
    function () {
      const node = getDOMForLocaleString({
        string: '{msg} {msg}',
        forceNodeReturn: true,
        substitutions: {
          msg: 'message'
        }
      });
      expect(node).to.have.text('message message');
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
    'should not throw with missing supplied formatters and ' +
    '`throwOnMissingSuppliedFormatters` disabled and should ' +
    'return the unformatted string in a text node',
    function () {
      let node;
      expect(() => {
        node = getDOMForLocaleString({
          string: 'A {msg}',
          forceNodeReturn: true,
          throwOnMissingSuppliedFormatters: false,
          substitutions: {
          }
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
    }
  );

  it(
    'should not throw with missing supplied formatters and ' +
    '`throwOnMissingSuppliedFormatters` disabled and should ' +
    'return the unformatted string',
    function () {
      let string;
      expect(() => {
        string = getDOMForLocaleString({
          string: 'A {msg}',
          throwOnMissingSuppliedFormatters: false,
          substitutions: {
          }
        });
      }).to.not.throw();
      expect(string).to.equal('A {msg}');
    }
  );

  it(
    'should not throw with missing supplied formatters and ' +
    '`throwOnMissingSuppliedFormatters` disabled and should ' +
    'return the unformatted string',
    function () {
      let node;
      expect(() => {
        node = getDOMForLocaleString({
          string: 'A {msg}',
          dom: true,
          throwOnMissingSuppliedFormatters: false,
          substitutions: {
          }
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
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
    '`throwOnExtraSuppliedFormatters` disabled and should ' +
    'return the formatted string',
    function () {
      let node;
      expect(() => {
        node = getDOMForLocaleString({
          string: 'A {msg}',
          forceNodeReturn: true,
          throwOnExtraSuppliedFormatters: false,
          substitutions: {
            msg: 'message',
            anExtraOne: 'why am I here?'
          }
        });
      }).to.not.throw();
      expect(node).to.have.text('A message');
    }
  );

  it('should return DOM with DOM substitution', function () {
    const elem = document.createElement('a');
    elem.href = 'http://example.com';
    elem.textContent = 'message';

    const frag = getDOMForLocaleString({
      string: 'simple {msg}',
      substitutions: {
        msg: elem
      }
    });
    expect(frag).to.have.text('simple message');
    expect(frag).to.contain(elem);

    expect(frag).to.have.fragmentHtml('simple <a href="http://example.com">message</a>');
  });

  it('should return DOM with DOM substitution', function () {
    const elem = document.createElement('a');
    elem.href = 'http://example.com';
    elem.textContent = 'message';

    const simpElem = document.createElement('span');
    simpElem.textContent = 'simple';

    const frag = getDOMForLocaleString({
      string: '{simp} {msg}',
      substitutions: {
        msg: elem,
        simp: simpElem
      }
    });
    expect(frag).to.have.text('simple message');
    expect(frag).to.contain(elem);
    expect(frag).to.contain(simpElem);

    expect(frag).to.have.fragmentHtml('<span>simple</span> <a href="http://example.com">message</a>');
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
  beforeEach(function () {
    setNavigatorLanguages([]);
    // Ensure not modified
    setExpectedData.call(this);
  });

  it(
    'should return locale object and no arguments',
    async function () {
      setNavigatorLanguages(['en-US']);
      const {strings, locale} = await findLocaleStrings();
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object with no `locales` and empty `defaultLocales`)',
    async function () {
      setNavigatorLanguages(['en-US']);
      const {strings, locale} = await findLocaleStrings({
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object with no `locales` and empty `defaultLocales`',
    async function () {
      setNavigatorLanguages(['zh-Hans']);
      const {strings, locale} = await findLocaleStrings({
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedZhHans);
      expect(locale).to.equal('zh-Hans');
    }
  );

  it(
    'should return locale object with explicit `locales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-US']
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object when finding locale without hyphen',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['pt-BR']
      });
      expect(strings).to.deep.equal(this.expectedPt);
      expect(locale).to.equal('pt');
    }
  );

  it(
    'should return locale object when needing to revert to secondary ' +
    'item in `locales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['zz', 'en-US', 'zh-Hans'],
        defaultLocales: []
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should return locale object when needing to revert to `defaultLocales`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['zz'],
        defaultLocales: ['en-US']
      });
      expect(strings).to.deep.equal(this.expectedEnUS);
      expect(locale).to.equal('en-US');
    }
  );

  it('should reject with bad JSON locale and no fallbacks', function () {
    return expect(findLocaleStrings({
      locales: ['xy'],
      defaultLocales: []
    })).to.be.rejectedWith(Error, 'No matching locale found!');
  });

  it(
    'should reject with bad locale argument and no fallbacks',
    function () {
      return expect(findLocaleStrings({
        locales: [null],
        defaultLocales: []
      })).to.be.rejectedWith(Error, 'No matching locale found!');
    }
  );

  it(
    'should return locale object when using custom `localeResolver`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localeResolver (localesBasePath, lcle) {
          return `../${lcle}/messages.json`;
        }
      });
      expect(strings).to.deep.equal(this.expectedEnUSTestDirectory);
      expect(locale).to.equal('en-US');
    }
  );

  it(
    'should reject with custom `localeResolver` not returning a string',
    function () {
      return expect(findLocaleStrings({
        locales: ['en-US'],
        localeResolver (localesBasePath, locale) {
          return false;
        }
      })).to.be.rejectedWith(Error, 'No matching locale found!');
    }
  );

  it(
    'should return locale object when using custom `localesBasePath`',
    async function () {
      let {strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localesBasePath: '../'
      });
      expect(strings).to.deep.equal(this.expectedEnUSLocalesTestDirectory);
      expect(locale).to.equal('en-US');

      ({strings, locale} = await findLocaleStrings({
        locales: ['en-US'],
        localesBasePath: '..'
      }));
      expect(strings).to.deep.equal(this.expectedEnUSLocalesTestDirectory);
      expect(locale).to.equal('en-US');
    }
  );
  it(
    'should return locale object when using default `localeMatcher`',
    async function () {
      const {strings, locale} = await findLocaleStrings({
        locales: ['en-ZZ'],
        localeMatcher (lcle) {
          if (lcle === 'en-ZZ') {
            return 'en-GB';
          }
          throw new Error('Locale not available');
        }
      });
      expect(strings).to.deep.equal(this.expectedEnGB);
      expect(locale).to.equal('en-GB');
    }
  );
  it('should throw when given bad `localeMatcher`', function () {
    expect(
      findLocaleStrings({
        locales: ['en-US'],
        localeMatcher: 'nonexistingCustomMatcherName'
      })
    ).to.be.rejectedWith(
      TypeError,
      '`localeMatcher` must be "lookup" or a function!'
    );
  });
});

describe('i18n', function () {
  beforeEach(function () {
    setNavigatorLanguages([]);
    setExpectedData.call(this);
  });
  it('should return a function with empty arguments', async function () {
    const _ = await i18n();
    expect(_).to.be.a('function');
  });
  it('should return a function with empty object argument', async function () {
    const _ = await i18n({});
    expect(_).to.be.a('function');
  });
  it(
    'should return function that can find strings with implicit `locales`',
    async function () {
      const _ = await i18n();
      const string = _('abc');
      expect(string).to.deep.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it(
    'should return function that can find strings with explicit `locales`',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('abc');
      expect(string).to.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it('should reject with non-object JSON', function () {
    return expect(
      i18n({
        locales: ['xx']
      })
    ).to.be.rejectedWith(TypeError, 'Locale strings must be an object!');
  });
  it(
    'should return function that can return string when needing to ' +
    'revert to `defaultLocales`',
    async function () {
      const _ = await i18n({
        locales: ['zz'],
        defaultLocales: ['en-US']
      });
      const string = _('abc');
      expect(string).to.deep.equal(this.expectedEnUS.body.abc.message);
    }
  );
  it(
    'should return function that can return string when using ' +
    'custom `localesBasePath`',
    async function () {
      let _ = await i18n({
        locales: ['en-US'],
        localesBasePath: '../'
      });
      let string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSLocalesTestDirectory.body.abc.message
      );

      _ = await i18n({
        locales: ['en-US'],
        localesBasePath: '..'
      });
      string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSLocalesTestDirectory.body.abc.message
      );
    }
  );
  it(
    'should return function that can return string when using ' +
    'custom `localeResolver`',
    async function () {
      const _ = await i18n({
        locales: ['en-US'],
        localeResolver (localesBasePath, locale) {
          return `../${locale}/messages.json`;
        }
      });
      const string = _('abc');
      expect(string).to.deep.equal(
        this.expectedEnUSTestDirectory.body.abc.message
      );
    }
  );
  it(
    'should return function that can return string processed in plain style',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that can return a string message with a string' +
    'key indicating a string on the `messageStyle` `messageForKey`',
    async function () {
      let _ = await i18n({
        defaults: {
          myKey: {
            message: 'myKeyValue'
          }
        },
        messageStyle: 'rich'
      });
      let string = _('myKey');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);

      _ = await i18n({
        defaults: {
          myKey: 'myKeyValue'
        },
        messageStyle: 'plain'
      });
      string = _('myKey');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that can return a string message with a string' +
    'key indicating `"richNested"` on the `messageStyle` `messageForKey`',
    async function () {
      const _ = await i18n({
        locales: ['ja'],
        messageStyle: 'richNested'
      });
      let string = _('key.that.is.nested');
      expect(string).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested.message
      );

      string = _('key.that.lessNested');
      expect(string).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested.message
      );
      expect(() => {
        _('key.that');
      }).to.throw(Error, 'Key value not found for key: (key.that)');
      expect(() => {
        _('key.that.is.nested.too.deep');
      }).to.throw(
        Error,
        'Key value not found for key: (key.that.is.nested.too.deep)'
      );
      expect(() => {
        _('a.nested.missingKey');
      }).to.throw(Error, 'Key value not found for key: (a.nested.missingKey)');
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'defaults object present',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain',
        defaults: {
          myKey: 'somethingElse'
        }
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );
  it(
    'should return a function that returns a string message ' +
    'despite defaults false',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain',
        defaults: false
      });
      const string = _('key');
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    ' (with `dom`)',
    async function () {
      const _ = await i18n({
        dom: true
      });
      const node = _('abc');
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    '(with `forceNodeReturn`)',
    async function () {
      const _ = await i18n({
        forceNodeReturn: true,
        throwOnMissingSuppliedFormatters: false
      });
      const node = _('abc');
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function which does not throw with missing ' +
    'supplied formatters and `throwOnMissingSuppliedFormatters` disabled',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true,
        throwOnMissingSuppliedFormatters: false,
        substitutions: {
        }
      });
      let node;
      expect(() => {
        node = _('key');
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
    }
  );

  it(
    'should return function which does not throw with extra supplied ' +
    'formatters and `throwOnExtraSuppliedFormatters` disabled and should ' +
    'return the formatted string node',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true,
        throwOnExtraSuppliedFormatters: false
      });
      const node = _('key', {
        msg: 'message',
        anExtraOne: 'why am I here?'
      });
      expect(node).to.have.text('A message');
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'an empty options object present',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', {});
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that returns a string message despite ' +
    'defaults object present (on options object)',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', null, {
        defaults: {
          myKey: 'somethingElse'
        }
      });
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );
  it(
    'should return a function that returns a string message ' +
    'despite defaults false (on options object)',
    async function () {
      const _ = await i18n({
        locales: ['zx'],
        messageStyle: 'plain'
      });
      const string = _('key', null, {
        defaults: false
      });
      expect(string).to.equal(this.expectedPlainStyleObject.body.key);
    }
  );

  it(
    'should return a function that accepts a substitution object to apply ' +
    'by default to all callback calls (ignoring arguments)',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        substitutions: {
          substitution1: 'sub1 that will be overridden',
          substitution2: 'sub2'
        }
      });
      const string = _('key', {
        substitution1: 'sub1'
      });
      expect(string).to.equal('sub2 sub1');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` function to ' +
    'apply to all callback calls',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions ({value, arg, key}) {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }
      });
      const string = _('key', {
        substitution1: 'sub1',
        substitution2: 'sub2'
      });
      expect(string).to.equal('SUB2 sub1');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` function to ' +
    'apply to all callback calls (for DOM)',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions ({value, arg, key}) {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }
      });
      const string = _('key', {
        substitution1: document.createElement('br'),
        substitution2: 'sub2'
      });
      expect(string).to.have.fragmentHtml('SUB2 <br>');
    }
  );

  it(
    'should return a function which does not perform `NumberFormat` ' +
    'processing when passing number and `allSubstitutions` is `null`',
    async function () {
      const _ = await i18n({
        locales: ['en-US'],
        allSubstitutions: null
      });
      const string = _('apples', {
        appleCount: 123456.4567
      });
      expect(string).to.equal('123456.4567 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('apples', {
        appleCount: 123456.4567
      });
      expect(string).to.equal('123,456.457 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateKey', {
        todayDate: new Date(Date.UTC(2000, 11, 28, 3, 4, 5))
      });
      expect(string).to.equal('It is now 12/28/2000');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('apples', {
        appleCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 apples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options overridden within ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('oranges', {
        orangeCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        allSubstitutions: null,
        locales: ['en-US']
      });
      const string = _('oranges', {
        orangeCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options overridden within ' +
    'locale argument (without extra arguments)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('beets', {
        beetCount: {
          number: [123456.4567, {maximumFractionDigits: 5}]
        }
      });
      // Only 3 as `maximumFractionDigits` defaults to 3
      expect(string).to.equal('123,456.457 beets');
    }
  );

  it(
    'should return a function which despite `null` `allSubstitutions` will ' +
    'perform `NumberFormat` processing with options specified within ' +
    'locale argument (without extra arguments)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('beets', {
        beetCount: {
          number: [123456.4567, {maximumFractionDigits: 5}]
        }
      });
      // Only 3 as `maximumFractionDigits` defaults to 3
      expect(string).to.equal('123,456.457 beets');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) overridden by ' +
    'locale argument',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('oranges', {
        orangeCount: {
          number: 123456.4567
        }
      });
      expect(string).to.equal('123,456.5 oranges');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) with options ' +
    'not overridden by argument of a non-number type',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dragonFruit', {
        fruitCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 dragon fruit');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `NumberFormat` processing (with options) with options ' +
    'not overridden by argument of a non-number type (with extra args)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('pineapples', {
        fruitCount: {
          number: [123456.4567, {maximumSignificantDigits: 6}]
        }
      });
      expect(string).to.equal('123,456 pineapples');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `DateTimeFormat` processing (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('dateKey', {
        todayDate: {
          date: [
            new Date(Date.UTC(2000, 11, 28, 3, 4, 5)),
            {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', timeZone: 'America/Los_Angeles'
            }
          ]
        }
      });
      expect(string).to.equal('It is now 12/27/2000, 7 PM');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('relativeKey', {
        relativeTime: {
          relative: [
            -3,
            'month',
            {
              style: 'short'
            }
          ]
        }
      });
      expect(string).to.equal('It was 3 mo. ago');
    }
  );

  it(
    'should return a function whose default `allSubstitutions` will ' +
    'perform `RelativeTimeFormat` processing (with options)',
    async function () {
      const _ = await i18n({
        locales: ['en-US']
      });
      const string = _('listKey', {
        listItems: {
          list: [
            [
              'a', 'z', 'ä', 'a'
            ],
            {
              type: 'disjunction'
            },
            {
              sensitivity: 'base'
            }
          ]
        }
      });
      expect(string).to.equal('The list is: a, ä, a, or z');
    }
  );

  it(
    'should return a function that accepts an `allSubstitutions` array of ' +
    'functions to apply to all callback calls',
    async function () {
      const _ = await i18n({
        locales: ['yy'],
        allSubstitutions: [({value, arg, key}) => {
          return arg === 'UPPER' ? value.toUpperCase() : value;
        }, ({value, arg, key}) => {
          return arg === 'UPPER'
            ? '<strong>' + value.toUpperCase() + '</strong>'
            : value;
        }]
      });
      const string = _('key', {
        substitution1: 'sub1',
        substitution2: 'sub2'
      });
      expect(string).to.equal('<strong>SUB2</strong> sub1');
    }
  );

  it(
    'should return a function that returns a string text node ' +
    ' (with `dom` on options object)',
    async function () {
      let _ = await i18n();
      let node = _('abc', null, {
        dom: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);

      _ = await i18n({});
      node = _('abc', null, {
        dom: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function that returns a string text node ' +
    '(with `forceNodeReturn` on options object)',
    async function () {
      const _ = await i18n({
        throwOnMissingSuppliedFormatters: false
      });
      const node = _('abc', null, {
        forceNodeReturn: true
      });
      expect(node).to.have.text(this.expectedEnUS.body.abc.message);
    }
  );

  it(
    'should return a function which does not throw with missing ' +
    'supplied formatters and `throwOnMissingSuppliedFormatters` disabled ' +
    '(on options object)',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true
      });
      let node;
      expect(() => {
        node = _('key', {}, {
          throwOnMissingSuppliedFormatters: false
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');

      expect(() => {
        node = _('key', null, {
          throwOnMissingSuppliedFormatters: false
        });
      }).to.not.throw();
      expect(node).to.have.text('A {msg}');
    }
  );

  it(
    'should return function which does not throw with extra supplied ' +
    'formatters and `throwOnExtraSuppliedFormatters` disabled (on options ' +
    'object) and should return the formatted string',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        forceNodeReturn: true
      });
      const node = _('key', {
        msg: 'message',
        anExtraOne: 'why am I here?'
      }, {
        throwOnExtraSuppliedFormatters: false
      });
      expect(node).to.have.text('A message');
    }
  );

  it(
    'should function that can return string with default substitutions',
    async function () {
      const _ = await i18n({
        locales: ['fr'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key');
      expect(string).to.equal('A message');
    }
  );

  it(
    'should return function that can return string with default and ' +
    'overriding substitutions',
    async function () {
      const _ = await i18n({
        locales: ['de'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key', {
        simp: 'simple'
      });
      expect(string).to.equal('A simple message');
    }
  );

  it(
    'should return function that can return string with default and ' +
    'overriding substitutions',
    async function () {
      const _ = await i18n({
        locales: ['de'],
        substitutions: {
          msg: 'message'
        }
      });
      const string = _('key', {
        simp: 'simple'
      });
      expect(string).to.equal('A simple message');
    }
  );
});
