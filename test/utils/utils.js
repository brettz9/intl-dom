/* eslint-disable @stylistic/max-len -- Long */
export const setExpectedData = function () {
  this.expectedEnUS = {
    head: {
      switches: {
        'switch-without-default': {
          a: {
            message: 'aaa'
          },
          b: {
            message: 'bbb'
          }
        },
        'executive-pronoun': {
          '*nominative': {
            message: 'he'
          },
          accusative: {
            message: 'him'
          }
        },
        bananas: {
          one: {
            message: 'one banana'
          },
          '*other': {
            message: '{bananas} bananas'
          }
        },
        scoreNoCasting: {
          '0.0': {
            message: 'zero points'
          },
          '*other': {
            message: '{scoreNoCasting} points'
          }
        },
        'score|NUMBER|minimumFractionDigits: 1': {
          '0.0': {
            message: 'zero points'
          },
          '*other': {
            message: '{score|NUMBER|minimumFractionDigits:1} points'
          }
        },
        points: {
          one: {
            message: 'one point'
          },
          '*other': {
            message: '{points} points'
          }
        },
        'pointsFraction|PLURAL|minimumFractionDigits: 1': {
          one: {
            message: 'one point'
          },
          '*other': {
            message: '{pointsFraction|NUMBER|minimumFractionDigits: 1} points'
          }
        },
        "rank|PLURAL|type: 'ordinal'": {
          one: {
            message: '{rank}st'
          },
          two: {
            message: '{rank}nd'
          },
          few: {
            message: '{rank}rd'
          },
          '*other': {
            message: '{rank}th'
          }
        },
        nested: {
          scoreNoCasting: {
            '0.0': {
              message: 'zero points'
            },
            '*other': {
              message: '{scoreNoCasting} points'
            }
          },
          "rank|PLURAL|type: 'ordinal'": {
            one: {
              message: '{rank}st'
            },
            two: {
              message: '{rank}nd'
            },
            few: {
              message: '{rank}rd'
            },
            '*other': {
              message: '{rank}th'
            }
          }
        }
      },
      locals: {
        localWithSwitch: {
          message: 'You have {~bananas}'
        },
        localWithSwitchAndArguments: {
          message: 'You finished with {~score}'
        },
        localWithOrdinalSwitch: {
          message: 'You got {~rank}.'
        },
        localWithNestedOrdinalSwitch: {
          message: 'You got {~nested.rank}.'
        },
        localUsingStringSwitch: {
          message: '{~executive-pronoun}'
        },
        localUsingStringSwitchWithExplicitDefault: {
          message: '{~executive-pronoun|nominative}'
        },
        localUsingStringSwitchWithArgument: {
          message: '{~executive-pronoun|accusative}'
        },
        aLocalVar: {
          message: 'a local value'
        },
        aLocalVarWithEscape: {
          message: String.raw`\{-aLocalVar} \\\\\{-aLocalVar} \\{-nested.local}`
        },
        aParameterizedLocalVar: {
          message: '{adjective1} and {adjective2} day; {subst}'
        },
        nested: {
          local: {
            message: '{-aLocalVar} here too'
          }
        },
        nestedWithParameterized: {
          local: {
            message: '{-aLocalVar} here too; {-aParameterizedLocalVar|adjective1: "cold", adjective2: "dreary"}'
          }
        },
        recursive: {
          message: '{-recursive}'
        },
        recursiveTarget: {
          message: '{-indirectlyRecursive}'
        },
        indirectlyRecursive: {
          message: '{-recursiveTarget}'
        }
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
        message: '{orangeCount|NUMBER|maximumSignificantDigits: 7} {oranges}'
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
      dateRangeKey: {
        message: 'It is between {dates}.'
      },
      dateRangeWithArgKey: {
        message: 'It is between {dates|DATERANGE}.'
      },
      dateRangeWithArgAndOptionsKey: {
        message: "It is between {dates|DATERANGE|year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', timeZone: 'America/Los_Angeles'}."
      },
      dateKey: {
        message: 'It is {now} {todayDate}'
      },
      dateWithArgKey: {
        message: 'It is {now} {todayDate|DATE}'
      },
      dateAliasWithArgKey: {
        message: 'It is {now} {todayDate|DATETIME}'
      },
      dateAliasWithArgAndOptionsKey: {
        message: "It is {now} {todayDate|DATETIME|year: 'numeric', month: 'long', day: 'numeric'}"
      },
      regionKey: {
        message: 'Country {person} went to: {area}.'
      },
      regionWithArgKey: {
        message: 'Country {person} went to: {area|REGION}.'
      },
      regionWithArgAndOptionsKey: {
        message: "Country {person} went to: {area|REGION|style: 'short'}."
      },
      languageKey: {
        message: 'Can {person} speak {lang}?'
      },
      languageWithArgKey: {
        message: 'Can {person} speak {lang|LANGUAGE}?'
      },
      languageWithArgAndOptionsKey: {
        message: "Can {person} speak {lang|LANGUAGE|style: 'short'}?"
      },
      scriptKey: {
        message: 'Can {person} write {scrpt}?'
      },
      scriptKeyWithArgKey: {
        message: 'Can {person} write {scrpt|SCRIPT}?'
      },
      scriptKeyWithArgAndOptionsKey: {
        message: "Can {person} write {scrpt|SCRIPT|style: 'short'}?"
      },
      currencyKey: {
        message: 'Currency unit: {money} for your donation to {organization}.'
      },
      currencyKeyWithArgKey: {
        message: 'Currency unit: {money|CURRENCY} for your donation to {organization}.'
      },
      currencyKeyWithArgAndOptionsKey: {
        message: "Currency unit: {money|CURRENCY|style: 'short'} for your donation to {organization}."
      },
      relativeKey: {
        message: 'It was {relativeTime}'
      },
      relativeWithArgKey: {
        message: 'It was {relativeTime|RELATIVE}'
      },
      relativeWithArgAndOptionsKey: {
        message: 'It was {relativeTime|RELATIVE|style: "long"}'
      },
      listKey: {
        message: 'The list is: {listItems}'
      },
      listWithArgKey: {
        message: 'The list is: {listItems|LIST}'
      },
      listWithArgAndOptionsKey: {
        message: 'The list is: {listItems|LIST|style: "long", type: "conjunction"}'
      },
      listWithArgAndMultipleOptionsKey: {
        message: 'The list is: {listItems|LIST|style: "long", type: "conjunction"|sensitivity: "variant"}'
      },
      localUsingKey: {
        message: 'Here is {-aLocalVar}'
      },
      badLocalUsingKey: {
        message: 'Here is {-aLocalVarNonexistent}'
      },
      formatterGivingLocalAppearingKey: {
        message: 'Here is {resolved}'
      },
      usingLocalKeyWithEscape: {
        message: 'Here is an {escaped} expression {-aLocalVarWithEscape}'
      },
      nestedUsingKey: {
        message: 'There is {-nested.local}'
      },
      nestedWithParameterizedUsingKey: {
        message: 'There is {-nestedWithParameterized.local}'
      },
      parameterizedLocalUsingKey: {
        message: 'A {-aParameterizedLocalVar|adjective1: "warm", adjective2: "sunny"}; with a {subst}'
      },
      parameterizedLocalWithExtraUsingKey: {
        message: 'A {-aParameterizedLocalVar|adjective1: "warm", adjective2: "sunny", extra3: "something"}; with a {subst}'
      },
      recursiveUsingKey: {
        message: 'This should never be resolved: {-recursive}'
      },
      indirectlyRecursiveUsingKey: {
        message: 'This should never be resolved either: {-indirectlyRecursive}'
      },
      keyUsingSwitch: {
        message: 'You have {~bananas}'
      },
      keyUsingSwitchWithoutDefault: {
        message: '{~switch-without-default}'
      },
      keyUsingSwitchCasting: {
        message: 'You finished with {~pointsFraction}'
      },
      keyUsingSwitchNoCasting: {
        message: 'You finished with {~points}'
      },
      keyUsingSwitchAndArguments: {
        message: 'You finished with {~score}'
      },
      keyUsingSwitchNoCastingAndArguments: {
        message: 'You finished with {~scoreNoCasting}'
      },
      nestedKeyUsingSwitchNoCastingAndArguments: {
        message: 'You finished with {~nested.scoreNoCasting}'
      },
      keyUsingOrdinalSwitch: {
        message: 'You got {~rank}.'
      },
      keyUsingNestedOrdinalSwitch: {
        message: 'You got {~nested.rank}.'
      },
      keyUsingLocalWithSwitch: {
        message: '{-localWithSwitch}; how much did they cost?'
      },
      keyUsingLocalWithSwitchAndArguments: {
        message: '{-localWithSwitchAndArguments}; good job!'
      },
      keyUsingLocalWithOrdinalSwitch: {
        message: '{-localWithOrdinalSwitch} Not bad!'
      },
      keyUsingLocalWithNestedOrdinalSwitch: {
        message: '{-localWithNestedOrdinalSwitch} Not bad!'
      },
      keyUsingStringSwitch: {
        message: 'This pronoun is nominative: {~executive-pronoun}'
      },
      keyUsingStringSwitchWithExplicitDefault: {
        message: 'This pronoun is nominative: {~executive-pronoun|nominative}'
      },
      keyUsingStringSwitchWithArgument: {
        message: 'This pronoun is accusative: {~executive-pronoun|accusative}'
      },
      keyUsingLocalStringSwitch: {
        message: 'This pronoun is nominative: {-localUsingStringSwitch}'
      },
      keyUsingLocalStringSwitchWithExplicitDefault: {
        message: 'This pronoun is nominative: {-localUsingStringSwitchWithExplicitDefault}'
      },
      keyUsingLocalStringSwitchWithArgument: {
        message: 'This pronoun is accusative: {-localUsingStringSwitchWithArgument}'
      },
      keyReferencingNonexistentSwitch: {
        message: "This switch doesn't exist: {~nonexistentSwitch}"
      },
      keyReferencingNonexistentNestedSwitch: {
        message: "This switch doesn't exist: {~badnested.nonexistentSwitch}"
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
      key: 'myKeyValue',
      message: 'myMessage'
    }
  };
  this.expectedRichStyleObject = {
    head: {},
    body: {
      key: {
        message: 'myKeyValue'
      },
      'key.with.dots': {
        message: 'keyWithDotsValue'
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

  this.expectedPlainNestedStyleObject = {
    head: {},
    body: {
      key: {
        that: {
          lessNested: 'anotherKeyValue',
          is: {
            nested: 'myKeyValue'
          },
          'has.dot': 'dotKeyValue',
          'has.dot.at.end.': 'dotAtEndKeyValue',
          'has..double-dots': 'doubleDotsKeyValue',
          'has\\': {
            backslashes: 'backslashesKeyValue'
          },
          'has\\.backslashesWithDot': 'backslashesWithDotKeyValue'
        }
      }
    }
  };
};
