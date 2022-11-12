import {setExpectedData} from './utils/utils.js';
import {
  getStringFromMessageAndDefaults
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

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
    'should not throw with non-throwing validator', function () {
      expect(() => {
        getStringFromMessageAndDefaults({
          message: 'ok',
          validator () {
            // Don't throw
          },
          key: null
        });
      }).to.not.throw();
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
