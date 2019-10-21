(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.IntlDom = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  // Todo: Allow literal brackets (with or without substitutions
  //   of the same name present)

  /**
  * @callback PromiseChainErrback
  * @param {any} errBack
  * @returns {Promise<any>|any}
  */

  /**
   * The given array will have its items processed in series; if the supplied
   *  errback, when passed the current item, returns a Promise or value that
   *  resolves, that value will be used for the return result of this function
   *  and no other items in the array will continue to be processed; if it
   *  rejects, however, the next item will be processed.
   * Accept an array of values to pass to an errback which should return
   *  a promise (or final result value) which resolves to a result or which
   *  rejects so that the next item in the array can be checked in series.
   * @param {Array<any>} values Array of values
   * @param {PromiseChainErrback} errBack Accepts an item of the array as its
   *   single argument
   * @returns {Promise<any>} Either resolves to a value derived from an item in
   *  the array or rejects if all items reject
   * @example
   promiseChainForValues(['a', 'b', 'c'], (val) => {
     return new Promise(function (resolve, reject) {
       if (val === 'a') {
         reject(new Error('missing'));
       }
       setTimeout(() => {
         resolve(val);
       }, 100);
     });
   });
   */
  var promiseChainForValues = function promiseChainForValues(values, errBack) {
    return values.reduce(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(p, value) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return p;

              case 3:
                return _context.abrupt("return", _context.sent);

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", errBack(value));

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 6]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }(), Promise.reject(new Error('Intentionally reject so as to begin checking chain')));
  };
  /**
  * @callback SubstitutionCallback
  * @param {string} arg Accepts the second portion of the `bracketRegex` of
  *   `i18n`, i.e., the non-bracketed segments of text from the locale string
  *   following a bracketed segment.
  * @returns {string} The replacement text
  */

  /**
  * @typedef {Object<string, string>} PlainLocaleStringObject
  */

  /**
  * @typedef {PlainObject} LocaleStringSubObject
  * @property {string} message The locale message with any formatting
  *   place-holders
  * @property {string} description A description to add translators
  */

  /**
  * @typedef {PlainObject<string, LocaleStringSubObject>} LocaleStringObject
  */

  /**
   * @callback LocaleResolver
   * @param {string} locale BCP-47 language string
   * @param {string} localesBasePth (Trailing slash optional)
   * @returns {string} URL of the locale file to be fetched
  */

  /**
  * @typedef {PlainObject<string, string|Element|SubstitutionCallback>}
  *   SubstitutionObject
  */

  /**
   * Checks a key (against an object of strings). Optionally
   *  accepts an object of substitutions which are used when finding text
   *  within curly brackets (pipe symbol not allowed in its keys); the
   *  substitutions may be DOM elements as well as strings and may be
   *  functions which return the same (being provided the text after the
   *  pipe within brackets as the single argument).) Optionally accepts a
   *  config object, with the optional key "dom" which if set to `true`
   *  optimizes when DOM elements are (known to be) present
   * @callback I18NCallback
   * @param {string} key Key to check against object of strings
   * @param {false|SubstitutionObject} [substitutions=false]
   * @param {PlainObject} [cfg={}]
   * @param {boolean} [cfg.dom=false]
   * @returns {string|DocumentFragment}
  */

  /**
   * @type {LocaleResolver}
   */

  var DefaultLocaleResolver = function DefaultLocaleResolver(locale, localesBasePth) {
    return "".concat(localesBasePth.replace(/\/$/, ''), "/_locales/").concat(locale, "/messages.json");
  };
  /**
  * @callback MessageStyleCallback
  * @param {LocaleStringObject|PlainLocaleStringObject|PlainObject} obj The exact
  *   format depends on the `cfg.defaults` of `i18n`
  * @param {string} key
  * @returns {false|string} If `false`, will resort to default
  */

  /**
   * @param {PlainObject} [cfg]
   * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
   * @param {string[]} [cfg.defaultLocales=['en-US']]
   * @param {string} [cfg.localesBasePath='.']
   * @param {LocaleResolver} [cfg.localeResolver=DefaultLocaleResolver]
   * @returns {Promise<LocaleStringObject|PlainLocaleStringObject|PlainObject>}
   */

  var findLocaleStrings =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(_ref2) {
      var _ref2$locales, locales, _ref2$defaultLocales, defaultLocales, _ref2$localeResolver, localeResolver, _ref2$localesBasePath, localesBasePath;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _ref2$locales = _ref2.locales, locales = _ref2$locales === void 0 ? navigator.languages : _ref2$locales, _ref2$defaultLocales = _ref2.defaultLocales, defaultLocales = _ref2$defaultLocales === void 0 ? ['en-US'] : _ref2$defaultLocales, _ref2$localeResolver = _ref2.localeResolver, localeResolver = _ref2$localeResolver === void 0 ? DefaultLocaleResolver : _ref2$localeResolver, _ref2$localesBasePath = _ref2.localesBasePath, localesBasePath = _ref2$localesBasePath === void 0 ? '.' : _ref2$localesBasePath;
              _context3.next = 3;
              return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)),
              /*#__PURE__*/
              function () {
                var _getLocale = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(locale) {
                  var url;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          url = localeResolver(locale, localesBasePath);
                          _context2.prev = 1;
                          _context2.next = 4;
                          return fetch(url);

                        case 4:
                          _context2.next = 6;
                          return _context2.sent.json();

                        case 6:
                          return _context2.abrupt("return", _context2.sent);

                        case 9:
                          _context2.prev = 9;
                          _context2.t0 = _context2["catch"](1);

                          if (locale.includes('-')) {
                            _context2.next = 13;
                            break;
                          }

                          throw new Error('Locale not available');

                        case 13:
                          return _context2.abrupt("return", getLocale(locale.replace(/\x2D(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*$/, '')));

                        case 14:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, null, [[1, 9]]);
                }));

                function getLocale(_x4) {
                  return _getLocale.apply(this, arguments);
                }

                return getLocale;
              }());

            case 3:
              return _context3.abrupt("return", _context3.sent);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function findLocaleStrings(_x3) {
      return _ref3.apply(this, arguments);
    };
  }();
  /**
   * @param {PlainObject} [cfg]
   * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
   * @returns {MessageStyleCallback}
   */

  var getMessageForKeyByStyle = function getMessageForKeyByStyle() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$messageStyle = _ref4.messageStyle,
        messageStyle = _ref4$messageStyle === void 0 ? 'rich' : _ref4$messageStyle;

    return typeof messageStyle === 'function' ? messageStyle : messageStyle === 'rich' ? function (obj, key) {
      if (key in obj && obj[key] && 'message' in obj[key] && // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
      typeof obj[key].message === 'string') {
        return obj[key].message;
      }

      return false;
    } : messageStyle === 'plain' ? function (obj, key) {
      if (key in obj && obj[key] && typeof obj[key] === 'string') {
        return obj[key];
      }

      return false;
    } : function () {
      throw new TypeError("Unknown `messageStyle` ".concat(messageStyle));
    }();
  };
  /* eslint-disable max-len */

  /**
   * @param {PlainObject} cfg
   * @param {string} [cfg.message]
   * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
   * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
   * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
   * @param {string} cfg.key Key to check against object of strings
   * @returns {string}
   */

  var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults(_ref5) {
    var message = _ref5.message,
        defaults = _ref5.defaults,
        messageStyle = _ref5.messageStyle,
        _ref5$messageForKey = _ref5.messageForKey,
        messageForKey = _ref5$messageForKey === void 0 ? getMessageForKeyByStyle({
      messageStyle: messageStyle
    }) : _ref5$messageForKey,
        key = _ref5.key;
    // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
    var str = typeof message === 'string' ? message : defaults === false ? function () {
      throw new Error("Key value not found for key: (".concat(key, ")"));
    }() : defaults && _typeof(defaults) === 'object' ? messageForKey(defaults, key) : function () {
      throw new TypeError("Default locale strings must resolve to `false` or an object!");
    }();

    if (str === false) {
      throw new Error("Key value not found for key: (".concat(key, ")"));
    }

    return str;
  };
  /**
   *
   * @param {PlainObject} cfg
   * @param {string} cfg.string
   * @param {false|SubstitutionObject} [cfg.substitutions=false]
   * @param {boolean} [cfg.dom=false]
   * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
   * @param {boolean} [cfg.forceNodeReturn=false]
   * @returns {string|DocumentFragment}
   */

  var getDOMForLocaleString = function getDOMForLocaleString(_ref6) {
    var string = _ref6.string,
        substitutions = _ref6.substitutions,
        dom = _ref6.dom,
        _ref6$bracketRegex = _ref6.bracketRegex,
        bracketRegex = _ref6$bracketRegex === void 0 ? /\{((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)(?:\|((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*))?\}/g : _ref6$bracketRegex,
        _ref6$forceNodeReturn = _ref6.forceNodeReturn,
        forceNodeReturn = _ref6$forceNodeReturn === void 0 ? false : _ref6$forceNodeReturn;

    if (!substitutions) {
      return forceNodeReturn ? document.createTextNode(string) : string;
    } // Give chance to avoid this block when known to contain DOM


    if (!dom) {
      var returnsDOM = false; // Run this block to optimize non-DOM substitutions

      var ret = string.replace(bracketRegex, function (_, ky, arg) {
        var substitution = substitutions[ky];

        if (typeof substitution === 'function') {
          substitution = substitution(arg);
        }

        returnsDOM = returnsDOM || substitution && substitution.nodeType === 1;
        return substitution;
      });

      if (!returnsDOM) {
        return ret;
      }
    }

    var nodes = [];
    var result;
    var previousIndex = 0;

    while ((result = bracketRegex.exec(string)) !== null) {
      var lastIndex = bracketRegex.lastIndex;

      var _result = result,
          _result2 = _slicedToArray(_result, 3),
          bracketedKey = _result2[0],
          ky = _result2[1],
          arg = _result2[2];

      var substitution = substitutions[ky];

      if (typeof substitution === 'function') {
        substitution = substitution(arg);
      }

      var startBracketPos = lastIndex - bracketedKey.length;

      if (startBracketPos > previousIndex) {
        nodes.push(string.slice(previousIndex, startBracketPos));
      }

      nodes.push(substitution);
      previousIndex = lastIndex;
    }

    if (previousIndex !== string.length) {
      // Get text at end
      nodes.push(string.slice(previousIndex));
    }

    var container = document.createDocumentFragment(); // console.log('nodes', nodes);

    container.append.apply(container, nodes);
    return container;
  };
  /* eslint-disable max-len */

  /**
   * @param {PlainObject} [cfg]
   * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
   * @param {string[]} [cfg.defaultLocales=['en-US']]
   * @param {string} [cfg.localesBasePath='.']
   * @param {LocaleResolver} [cfg.localeResolver=DefaultLocaleResolver]
   * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
   * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
   * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
   * @param {boolean} [cfg.forceNodeReturn=false]
   * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
   */

  var i18n =
  /*#__PURE__*/
  function () {
    var _i18n = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(_ref7) {
      var locales, defaultLocales, localesBasePath, localeResolver, defaults, messageStyle, bracketRegex, forceNodeReturn, strings, messageForKey;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              locales = _ref7.locales, defaultLocales = _ref7.defaultLocales, localesBasePath = _ref7.localesBasePath, localeResolver = _ref7.localeResolver, defaults = _ref7.defaults, messageStyle = _ref7.messageStyle, bracketRegex = _ref7.bracketRegex, forceNodeReturn = _ref7.forceNodeReturn;
              _context4.next = 3;
              return findLocaleStrings({
                locales: locales,
                defaultLocales: defaultLocales,
                localeResolver: localeResolver,
                localesBasePath: localesBasePath
              });

            case 3:
              strings = _context4.sent;

              if (!(!strings || _typeof(strings) !== 'object')) {
                _context4.next = 6;
                break;
              }

              throw new TypeError("Locale strings must be an object!");

            case 6:
              messageForKey = getMessageForKeyByStyle({
                messageStyle: messageStyle
              });
              return _context4.abrupt("return", function (key, substitutions) {
                var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                    dom = _ref8.dom;

                var message = messageForKey(strings, key);
                var string = getStringFromMessageAndDefaults({
                  message: message,
                  defaults: defaults,
                  messageForKey: messageForKey,
                  key: key
                });
                return getDOMForLocaleString({
                  string: string,
                  substitutions: substitutions,
                  forceNodeReturn: forceNodeReturn,
                  dom: dom,
                  bracketRegex: bracketRegex
                });
              });

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function i18n(_x5) {
      return _i18n.apply(this, arguments);
    }

    return i18n;
  }();

  exports.DefaultLocaleResolver = DefaultLocaleResolver;
  exports.findLocaleStrings = findLocaleStrings;
  exports.getDOMForLocaleString = getDOMForLocaleString;
  exports.getMessageForKeyByStyle = getMessageForKeyByStyle;
  exports.getStringFromMessageAndDefaults = getStringFromMessageAndDefaults;
  exports.i18n = i18n;
  exports.promiseChainForValues = promiseChainForValues;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
