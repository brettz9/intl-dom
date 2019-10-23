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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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
 * @param {string} [errorMessage="Reached end of values array."]
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
function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}
/**
* @callback SubstitutionCallback
* @param {string} arg Accepts the third portion of the `bracketRegex` of
*   `i18n`, i.e., to allow the locale to supply arguments back to the
*   calling script.
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
 * @param {string} localesBasePath (Trailing slash optional)
 * @param {string} locale BCP-47 language string
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


function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    var observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}

var _Pact =
/*#__PURE__*/
function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;

    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        var value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}

function _for(test, update, body) {
  var stage;

  for (;;) {
    var shouldContinue = test();

    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }

    if (!shouldContinue) {
      return result;
    }

    if (shouldContinue.then) {
      stage = 0;
      break;
    }

    var result = body();

    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }

    if (update) {
      var updateValue = update();

      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }

  var pact = new _Pact();

  var reject = _settle.bind(null, pact, 2);

  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;

  function _resumeAfterBody(value) {
    result = value;

    do {
      if (update) {
        updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }

      shouldContinue = test();

      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);

        return;
      }

      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }

      result = body();

      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);

    result.then(_resumeAfterBody).then(void 0, reject);
  }

  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();

      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }

  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var promiseChainForValues = function promiseChainForValues(values, errBack) {
  var errorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Reached end of values array.';

  if (!Array.isArray(values)) {
    throw new TypeError('The `values` argument to `promiseChainForValues` must be an array.');
  }

  if (typeof errBack !== 'function') {
    throw new TypeError('The `errBack` argument to `promiseChainForValues` must be a function.');
  }

  return _async(function () {
    var _exit = false,
        _interrupt = false;
    var ret;
    var p = Promise.reject(new Error('Intentionally reject so as to begin checking chain'));
    var breaking;
    return _continue(_for(function () {
      return !(_interrupt || _exit);
    }, void 0, function () {
      var value = values.shift();
      return _catch(function () {
        // eslint-disable-next-line no-await-in-loop
        return _await(p, function (_p) {
          ret = _p;
          _interrupt = true;
        });
      }, function () {
        if (breaking) {
          throw new Error(errorMessage);
        } // We allow one more try


        if (!values.length) {
          breaking = true;
        } // // eslint-disable-next-line no-await-in-loop


        p = errBack(value);
      });
    }), function (_result2) {
      return  ret;
    });
  })();
};
var defaultLocaleResolver = function defaultLocaleResolver(localesBasePath, locale) {
  if (typeof localesBasePath !== 'string') {
    throw new TypeError('`defaultLocaleResolver` expects a string `localesBasePath`.');
  }

  if (typeof locale !== 'string') {
    throw new TypeError('`defaultLocaleResolver` expects a string `locale`.');
  }

  return "".concat(localesBasePath.replace(/\/$/, ''), "/_locales/").concat(locale, "/messages.json");
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
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$messageStyle = _ref.messageStyle,
      messageStyle = _ref$messageStyle === void 0 ? 'rich' : _ref$messageStyle;

  return typeof messageStyle === 'function' ? messageStyle : messageStyle === 'rich' ? function (obj, key) {
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && _typeof(obj[key]) === 'object' && 'message' in obj[key] && // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
    typeof obj[key].message === 'string') {
      return obj[key].message;
    }

    return false;
  } : messageStyle === 'plain' ? function (obj, key) {
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && typeof obj[key] === 'string') {
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

var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      message = _ref2.message,
      defaults = _ref2.defaults,
      messageStyle = _ref2.messageStyle,
      _ref2$messageForKey = _ref2.messageForKey,
      messageForKey = _ref2$messageForKey === void 0 ? getMessageForKeyByStyle({
    messageStyle: messageStyle
  }) : _ref2$messageForKey,
      key = _ref2.key;

  if (typeof key !== 'string') {
    throw new TypeError('An options object with a `key` string is expected on ' + '`getStringFromMessageAndDefaults`');
  } // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES


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
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @returns {string|DocumentFragment}
 */

var getDOMForLocaleString = function getDOMForLocaleString() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      string = _ref3.string,
      _ref3$substitutions = _ref3.substitutions,
      substitutions = _ref3$substitutions === void 0 ? false : _ref3$substitutions,
      _ref3$dom = _ref3.dom,
      dom = _ref3$dom === void 0 ? false : _ref3$dom,
      _ref3$forceNodeReturn = _ref3.forceNodeReturn,
      forceNodeReturn = _ref3$forceNodeReturn === void 0 ? false : _ref3$forceNodeReturn,
      _ref3$throwOnMissingS = _ref3.throwOnMissingSuppliedFormatters,
      throwOnMissingSuppliedFormatters = _ref3$throwOnMissingS === void 0 ? true : _ref3$throwOnMissingS,
      _ref3$throwOnExtraSup = _ref3.throwOnExtraSuppliedFormatters,
      throwOnExtraSuppliedFormatters = _ref3$throwOnExtraSup === void 0 ? true : _ref3$throwOnExtraSup,
      _ref3$bracketRegex = _ref3.bracketRegex,
      bracketRegex = _ref3$bracketRegex === void 0 ? /(\\*)\{((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)(?:\|((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*))?\}/g : _ref3$bracketRegex;

  if (typeof string !== 'string') {
    throw new TypeError('An options object with a `string` property set to a string must ' + 'be provided for `getDOMForLocaleString`.');
  }

  var stringOrTextNode = function stringOrTextNode(str) {
    return forceNodeReturn ? document.createTextNode(str) : str;
  };

  var usedKeys = [];

  var checkExtraSuppliedFormatters = function checkExtraSuppliedFormatters() {
    if (throwOnExtraSuppliedFormatters) {
      Object.keys(substitutions).forEach(function (key) {
        if (!usedKeys.includes(key)) {
          throw new Error("Extra formatting key: ".concat(key));
        }
      });
    }
  };

  var missingSuppliedFormatters = function missingSuppliedFormatters(ky) {
    if (!(ky in substitutions)) {
      if (throwOnMissingSuppliedFormatters) {
        throw new Error("Missing formatting key: ".concat(ky));
      }

      return true;
    }

    return false;
  };

  if (!substitutions && !throwOnMissingSuppliedFormatters) {
    return stringOrTextNode(string);
  }

  if (!substitutions) {
    substitutions = {};
  } // Give chance to avoid this block when known to contain DOM


  if (!dom) {
    var returnsDOM = false; // Run this block to optimize non-DOM substitutions

    var ret = string.replace(bracketRegex, function (_, esc, ky, arg) {
      if (esc.length % 2) {
        // Ignore odd sequences of escape sequences
        return _;
      }

      if (missingSuppliedFormatters(ky)) {
        return _;
      }

      var substitution = substitutions[ky];

      if (typeof substitution === 'function') {
        substitution = substitution(arg);
      }

      returnsDOM = returnsDOM || substitution && substitution.nodeType === 1;
      usedKeys.push(ky);
      return esc + substitution;
    });
    checkExtraSuppliedFormatters();

    if (!returnsDOM) {
      return stringOrTextNode(ret);
    }

    usedKeys.length = 0;
  }

  var nodes = [];
  var result;
  var previousIndex = 0;

  while ((result = bracketRegex.exec(string)) !== null) {
    var _result3 = result,
        _result4 = _slicedToArray(_result3, 4),
        _ = _result4[0],
        esc = _result4[1],
        ky = _result4[2],
        arg = _result4[3];

    var lastIndex = bracketRegex.lastIndex;

    if (esc % 2) {
      // Ignore odd sequences of escape sequences
      continue;
    }

    var startBracketPos = lastIndex - ky.length - 2;

    if (startBracketPos > previousIndex) {
      nodes.push(string.slice(previousIndex, startBracketPos));
    }

    if (missingSuppliedFormatters(ky)) {
      nodes.push(_);
    } else {
      if (esc.length) {
        nodes.push(esc);
      }

      var substitution = substitutions[ky];

      if (typeof substitution === 'function') {
        substitution = substitution(arg);
      }

      nodes.push(substitution);
    }

    previousIndex = lastIndex;
    usedKeys.push(ky);
  }

  if (previousIndex !== string.length) {
    // Get text at end
    nodes.push(string.slice(previousIndex));
  }

  checkExtraSuppliedFormatters();
  var container = document.createDocumentFragment(); // console.log('nodes', nodes);

  container.append.apply(container, nodes);
  return container;
};
/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @returns {Promise<LocaleStringObject|PlainLocaleStringObject|PlainObject>}
 */

var findLocaleStrings = _async(function () {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref4$locales = _ref4.locales,
      locales = _ref4$locales === void 0 ? navigator.languages : _ref4$locales,
      _ref4$defaultLocales = _ref4.defaultLocales,
      defaultLocales = _ref4$defaultLocales === void 0 ? ['en-US'] : _ref4$defaultLocales,
      _ref4$localeResolver = _ref4.localeResolver,
      localeResolver = _ref4$localeResolver === void 0 ? defaultLocaleResolver : _ref4$localeResolver,
      _ref4$localesBasePath = _ref4.localesBasePath,
      localesBasePath = _ref4$localesBasePath === void 0 ? '.' : _ref4$localesBasePath;

  // eslint-disable-next-line no-return-await
  return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)), function getLocale(locale) {
    try {
      if (typeof locale !== 'string') {
        throw new TypeError('Non-string locale type');
      }

      var url = localeResolver(localesBasePath, locale);

      if (typeof url !== 'string') {
        throw new TypeError('`localeResolver` expected to resolve to (URL) string.');
      }

      return _catch(function () {
        return _await(fetch(url), function (resp) {
          if (resp.status === 404) {
            // Don't allow browser (tested in Firefox) to continue
            //  and give `SyntaxError` with missing file or we won't be
            //  able to try without the hyphen
            throw new Error('Trying again');
          }

          return _await(resp.json());
        });
      }, function (err) {
        if (err.name === 'SyntaxError') {
          throw err;
        }

        if (!locale.includes('-')) {
          throw new Error('Locale not available');
        } // Try without hyphen


        return getLocale(locale.replace(/\x2D(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*$/, ''));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, 'No matching locale found!');
});
/* eslint-disable max-len */

/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=['en-US']]
 * @param {string} [cfg.localesBasePath='.']
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle='rich']
 * @param {RegExp} [cfg.bracketRegex=/\{([^}]*?)(?:\|([^}]*))?\}/gu]
 * @param {false|LocaleStringObject|PlainLocaleStringObject|PlainObject} [cfg.defaults]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */

var i18n = function i18n() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      locales = _ref5.locales,
      defaultLocales = _ref5.defaultLocales,
      localesBasePath = _ref5.localesBasePath,
      localeResolver = _ref5.localeResolver,
      messageStyle = _ref5.messageStyle,
      bracketRegex = _ref5.bracketRegex,
      defaultSubstitutions = _ref5.substitutions,
      defaultDefaults = _ref5.defaults,
      _ref5$dom = _ref5.dom,
      domDefaults = _ref5$dom === void 0 ? false : _ref5$dom,
      _ref5$forceNodeReturn = _ref5.forceNodeReturn,
      forceNodeReturnDefault = _ref5$forceNodeReturn === void 0 ? false : _ref5$forceNodeReturn,
      _ref5$throwOnMissingS = _ref5.throwOnMissingSuppliedFormatters,
      throwOnMissingSuppliedFormattersDefault = _ref5$throwOnMissingS === void 0 ? true : _ref5$throwOnMissingS,
      _ref5$throwOnExtraSup = _ref5.throwOnExtraSuppliedFormatters,
      throwOnExtraSuppliedFormattersDefault = _ref5$throwOnExtraSup === void 0 ? true : _ref5$throwOnExtraSup;

  return _await(findLocaleStrings({
    locales: locales,
    defaultLocales: defaultLocales,
    localeResolver: localeResolver,
    localesBasePath: localesBasePath
  }), function (strings) {
    if (!strings || _typeof(strings) !== 'object') {
      throw new TypeError("Locale strings must be an object!");
    }

    var messageForKey = getMessageForKeyByStyle({
      messageStyle: messageStyle
    });
    return function (key, substitutions) {
      var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref6$defaults = _ref6.defaults,
          defaults = _ref6$defaults === void 0 ? defaultDefaults : _ref6$defaults,
          _ref6$dom = _ref6.dom,
          dom = _ref6$dom === void 0 ? domDefaults : _ref6$dom,
          _ref6$forceNodeReturn = _ref6.forceNodeReturn,
          forceNodeReturn = _ref6$forceNodeReturn === void 0 ? forceNodeReturnDefault : _ref6$forceNodeReturn,
          _ref6$throwOnMissingS = _ref6.throwOnMissingSuppliedFormatters,
          throwOnMissingSuppliedFormatters = _ref6$throwOnMissingS === void 0 ? throwOnMissingSuppliedFormattersDefault : _ref6$throwOnMissingS,
          _ref6$throwOnExtraSup = _ref6.throwOnExtraSuppliedFormatters,
          throwOnExtraSuppliedFormatters = _ref6$throwOnExtraSup === void 0 ? throwOnExtraSuppliedFormattersDefault : _ref6$throwOnExtraSup;

      var message = messageForKey(strings, key);
      var string = getStringFromMessageAndDefaults({
        message: message,
        defaults: defaults,
        messageForKey: messageForKey,
        key: key
      });
      return getDOMForLocaleString({
        string: string,
        substitutions: _objectSpread2({}, defaultSubstitutions, {}, substitutions),
        dom: dom,
        forceNodeReturn: forceNodeReturn,
        throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
        throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters,
        bracketRegex: bracketRegex
      });
    };
  });
};

export { defaultLocaleResolver, findLocaleStrings, getDOMForLocaleString, getMessageForKeyByStyle, getStringFromMessageAndDefaults, i18n, promiseChainForValues };
