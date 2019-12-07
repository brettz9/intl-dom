import {setExpectedData} from './utils/utils.js';
import {
  getMessageForKeyByStyle
// } from '../dist/index.esm.min.js';
} from '../src/index.js';

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
              },
              'has.dot': {
                message: 'dotKeyValue'
              },
              'has.dot.at.end.': {
                message: 'dotAtEndKeyValue'
              },
              'has..double-dots': {
                message: 'doubleDotsKeyValue'
              },
              'has\\': {
                backslashes: {
                  message: 'backslashesKeyValue'
                }
              },
              'has\\.backslashesWithDot': {
                message: 'backslashesWithDotKeyValue'
              }
            }
          }
        }
      };
      expect(func(localeObj, 'key.that.is.nested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested.message
      ).and.to.be.a('string');
      expect(func(localeObj, 'key.that.lessNested').value).to.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested.message
      ).and.to.be.a('string');
      expect(func(localeObj, 'key.that.is.nested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.is.nested
      ).and.to.be.an('object');
      expect(func(localeObj, 'key.that.lessNested').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that.lessNested
      ).and.to.be.an('object');
      expect(func(localeObj, 'key.that.has\\.dot').info).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that['has.dot']
      ).and.to.be.an('object');
      expect(
        func(localeObj, 'key.that.has\\.dot\\.at\\.end\\.').info
      ).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that['has.dot.at.end.']
      ).and.to.be.an('object');
      expect(
        func(localeObj, 'key.that.has\\.\\.double-dots').info
      ).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that['has..double-dots']
      ).and.to.be.an('object');
      expect(
        func(localeObj, 'key.that.has\\\\.backslashes').info
      ).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that[
          'has\\'
        ].backslashes
      ).and.to.be.an('object');
      expect(
        func(localeObj, 'key.that.has\\\\\\.backslashesWithDot').info
      ).to.deep.equal(
        this.expectedRichNestedStyleObject.body.key.that[
          'has\\.backslashesWithDot'
        ]
      ).and.to.be.an('object');

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
          },
          'key.with.dots': {
            message: 'keyWithDotsValue'
          }
        }
      };
      expect(func(localeObj, 'key').value).to.equal(
        this.expectedRichStyleObject.body.key.message
      );
      expect(func(localeObj, 'key').info).to.deep.equal(
        this.expectedRichStyleObject.body.key
      );
      expect(func(localeObj, 'key.with.dots').value).to.equal(
        this.expectedRichStyleObject.body['key.with.dots'].message
      );
      expect(func(localeObj, 'key.with.dots').info).to.deep.equal(
        this.expectedRichStyleObject.body['key.with.dots']
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
      expect(func(this.expectedPlainStyleObject, 'message').value).to.equal(
        this.expectedPlainStyleObject.body.message
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
