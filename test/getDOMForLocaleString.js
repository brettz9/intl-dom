import {
  getDOMForLocaleString
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

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
    'should return string with escaped backslash sequence',
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
    'should return fragment with escaped backslash sequence',
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

  it(
    'should return DOM with DOM substitution (multiple substitutions)',
    function () {
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
    }
  );

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
