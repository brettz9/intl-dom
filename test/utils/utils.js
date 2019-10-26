/* eslint-disable max-len */
export const setExpectedData = function () {
  this.expectedEnUS = {
    head: {
      locals: {
        aLocalVar: 'a local value',
        aParameterizedLocalVar: '{adjective1} and {adjective2} day'
      }
    },
    body: {
      abc: {
        message: 'aaa'
      },
      apples: {
        message: '{appleCount} apples'
      },
      oranges: {
        message: '{orangeCount|NUMBER|maximumSignificantDigits: 7} oranges'
      },
      beets: {
        message: '{beetCount|NUMBER} beets'
      },
      dragonFruit: {
        message: '{fruitCount|SOME-ARG} dragon fruit'
      },
      pineapples: {
        message: '{fruitCount|SOME-ARG|another arg} pineapples'
      },
      dateKey: {
        message: 'It is now {todayDate}'
      },
      relativeKey: {
        message: 'It was {relativeTime}'
      },
      listKey: {
        message: 'The list is: {listItems}'
      },
      localUsingKey: {
        message: 'Here is {-aLocalVar}'
      },
      parameterizedLocalUsingKey: {
        message: 'A {-aParameterizedLocalVar|adjective1: "warm", adjective2: "sunny"}; with a {subst}'
      }
    }
  };
  this.expectedEnGB = {
    head: {},
    body: {
      abc: {
        message: 'ggg'
      }
    }
  };
  this.expectedEnUSTestDirectory = {
    head: {},
    body: {
      abc: {
        message: 'zzz'
      }
    }
  };
  this.expectedEnUSLocalesTestDirectory = {
    head: {},
    body: {
      abc: {
        message: 'yyy'
      }
    }
  };
  this.expectedZhHans = {
    head: {},
    body: {
      def: {
        message: 'bbb'
      }
    }
  };
  this.expectedPt = {
    head: {},
    body: {
      ghi: {
        message: 'ccc'
      }
    }
  };
  this.expectedPlainStyleObject = {
    head: {},
    body: {
      key: 'myKeyValue'
    }
  };
  this.expectedRichStyleObject = {
    head: {},
    body: {
      key: {
        message: 'myKeyValue'
      }
    }
  };
  this.expectedRichNestedStyleObject = {
    head: {},
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
};
