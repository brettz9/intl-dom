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

/**
* @callback PromiseChainErrback
* @param {any} errBack
* @returns {Promise<any>|any}
*/

/**
 * The given array will have its items processed in series; if the supplied
 *  `errBack` (which is guaranteed to run at least once), when passed the
 *  current item, returns a `Promise` or value that resolves, that value will
 *  be used for the return result of this function and no other items in
 *  the array will continue to be processed; if it rejects, however, the
 *  next item will be processed with `errBack`.
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
  if (!Array.isArray(values)) {
    throw new TypeError('The `values` argument to `promiseChainForValues` must be an array.');
  }

  if (typeof errBack !== 'function') {
    throw new TypeError('The `errBack` argument to `promiseChainForValues` must be a function.');
  }

  return _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var ret, p, value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            p = Promise.reject(new Error('Intentionally reject so as to begin checking chain'));

          case 1:

            value = values.shift();
            _context.prev = 3;
            _context.next = 6;
            return p;

          case 6:
            ret = _context.sent;
            return _context.abrupt("break", 15);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            p = errBack(value);

          case 13:
            _context.next = 1;
            break;

          case 15:
            return _context.abrupt("return", ret);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 10]]);
  }))();
};
/**
* @callback SubstitutionCallback
* @param {string} arg Accepts the third portion of the `bracketRegex` of
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

var defaultLocaleResolver = function defaultLocaleResolver(locale, localesBasePth) {
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
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @returns {MessageStyleCallback}
 */

var getMessageForKeyByStyle = function getMessageForKeyByStyle() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$messageStyle = _ref2.messageStyle,
      messageStyle = _ref2$messageStyle === void 0 ? 'rich' : _ref2$messageStyle;

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

var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults(_ref3) {
  var message = _ref3.message,
      defaults = _ref3.defaults,
      messageStyle = _ref3.messageStyle,
      _ref3$messageForKey = _ref3.messageForKey,
      messageForKey = _ref3$messageForKey === void 0 ? getMessageForKeyByStyle({
    messageStyle: messageStyle
  }) : _ref3$messageForKey,
      key = _ref3.key;
  // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
  var str = typeof message === 'string' ? message : defaults === false ? false : defaults && _typeof(defaults) === 'object' ? messageForKey(defaults, key) : function () {
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
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnUnsuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnUnsubstitutedFormatters=true]
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @returns {string|DocumentFragment}
 */

var getDOMForLocaleString = function getDOMForLocaleString(_ref4) {
  var string = _ref4.string,
      _ref4$substitutions = _ref4.substitutions,
      substitutions = _ref4$substitutions === void 0 ? false : _ref4$substitutions,
      _ref4$dom = _ref4.dom,
      dom = _ref4$dom === void 0 ? false : _ref4$dom,
      _ref4$forceNodeReturn = _ref4.forceNodeReturn,
      forceNodeReturn = _ref4$forceNodeReturn === void 0 ? false : _ref4$forceNodeReturn,
      _ref4$throwOnMissingS = _ref4.throwOnMissingSuppliedFormatters,
      _ref4$throwOnExtraSup = _ref4.throwOnExtraSuppliedFormatters,
      _ref4$bracketRegex = _ref4.bracketRegex,
      bracketRegex = _ref4$bracketRegex === void 0 ? /(\\*)\{((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)(?:\|((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*))?\}/g : _ref4$bracketRegex;

  if (!substitutions) {
    return forceNodeReturn ? document.createTextNode(string) : string;
  } // Give chance to avoid this block when known to contain DOM


  if (!dom) {
    var returnsDOM = false; // Run this block to optimize non-DOM substitutions

    var ret = string.replace(bracketRegex, function (_, esc, ky, arg) {
      if (esc.length % 2) {
        // Ignore odd sequences of escape sequences
        return _;
      }

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
    var _result = result,
        _result2 = _slicedToArray(_result, 4),
        esc = _result2[0],
        bracketedKey = _result2[1],
        ky = _result2[2],
        arg = _result2[3];

    if (esc % 2) {
      // Ignore odd sequences of escape sequences
      continue;
    }

    var lastIndex = bracketRegex.lastIndex;
    var startBracketPos = lastIndex - bracketedKey.length;

    if (startBracketPos > previousIndex) {
      nodes.push(string.slice(previousIndex, startBracketPos));
    }

    var substitution = substitutions[ky];

    if (typeof substitution === 'function') {
      substitution = substitution(arg);
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
/**
 * @param {PlainObject} [cfg]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @returns {Promise<LocaleStringObject|PlainLocaleStringObject|PlainObject>}
 */

var findLocaleStrings =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref5) {
    var _ref5$locales, locales, _ref5$defaultLocales, defaultLocales, _ref5$localeResolver, localeResolver, _ref5$localesBasePath, localesBasePath;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref5$locales = _ref5.locales, locales = _ref5$locales === void 0 ? navigator.languages : _ref5$locales, _ref5$defaultLocales = _ref5.defaultLocales, defaultLocales = _ref5$defaultLocales === void 0 ? ['en-US'] : _ref5$defaultLocales, _ref5$localeResolver = _ref5.localeResolver, localeResolver = _ref5$localeResolver === void 0 ? defaultLocaleResolver : _ref5$localeResolver, _ref5$localesBasePath = _ref5.localesBasePath, localesBasePath = _ref5$localesBasePath === void 0 ? '.' : _ref5$localesBasePath;
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

              function getLocale(_x2) {
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

  return function findLocaleStrings(_x) {
    return _ref6.apply(this, arguments);
  };
}();
/* eslint-disable max-len */

/**
 * @param {PlainObject} [cfg]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
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

  function i18n(_x3) {
    return _i18n.apply(this, arguments);
  }

  return i18n;
}();

export { defaultLocaleResolver, findLocaleStrings, getDOMForLocaleString, getMessageForKeyByStyle, getStringFromMessageAndDefaults, i18n, promiseChainForValues };
