(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DateTimeFormat = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecFromTime = exports.MinFromTime = exports.HourFromTime = exports.DateFromTime = exports.MonthFromTime = exports.InLeapYear = exports.DayWithinYear = exports.DaysInYear = exports.YearFromTime = exports.TimeFromYear = exports.DayFromYear = exports.WeekDay = exports.Day = exports.Type = exports.HasOwnProperty = exports.ArrayCreate = exports.SameValue = exports.ToObject = exports.TimeClip = exports.ToNumber = exports.ToString = void 0;
/**
 * https://tc39.es/ecma262/#sec-tostring
 */
function ToString(o) {
    // Only symbol is irregular...
    if (typeof o === 'symbol') {
        throw TypeError('Cannot convert a Symbol value to a string');
    }
    return String(o);
}
exports.ToString = ToString;
/**
 * https://tc39.es/ecma262/#sec-tonumber
 * @param val
 */
function ToNumber(val) {
    if (val === undefined) {
        return NaN;
    }
    if (val === null) {
        return +0;
    }
    if (typeof val === 'boolean') {
        return val ? 1 : +0;
    }
    if (typeof val === 'number') {
        return val;
    }
    if (typeof val === 'symbol' || typeof val === 'bigint') {
        throw new TypeError('Cannot convert symbol/bigint to number');
    }
    return Number(val);
}
exports.ToNumber = ToNumber;
/**
 * https://tc39.es/ecma262/#sec-tointeger
 * @param n
 */
function ToInteger(n) {
    var number = ToNumber(n);
    if (isNaN(number) || SameValue(number, -0)) {
        return 0;
    }
    if (isFinite(number)) {
        return number;
    }
    var integer = Math.floor(Math.abs(number));
    if (number < 0) {
        integer = -integer;
    }
    if (SameValue(integer, -0)) {
        return 0;
    }
    return integer;
}
/**
 * https://tc39.es/ecma262/#sec-timeclip
 * @param time
 */
function TimeClip(time) {
    if (!isFinite(time)) {
        return NaN;
    }
    if (Math.abs(time) > 8.64 * 1e16) {
        return NaN;
    }
    return ToInteger(time);
}
exports.TimeClip = TimeClip;
/**
 * https://tc39.es/ecma262/#sec-toobject
 * @param arg
 */
function ToObject(arg) {
    if (arg == null) {
        throw new TypeError('undefined/null cannot be converted to object');
    }
    return Object(arg);
}
exports.ToObject = ToObject;
/**
 * https://www.ecma-international.org/ecma-262/11.0/index.html#sec-samevalue
 * @param x
 * @param y
 */
function SameValue(x, y) {
    if (Object.is) {
        return Object.is(x, y);
    }
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
    }
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
}
exports.SameValue = SameValue;
/**
 * https://www.ecma-international.org/ecma-262/11.0/index.html#sec-arraycreate
 * @param len
 */
function ArrayCreate(len) {
    return new Array(len);
}
exports.ArrayCreate = ArrayCreate;
/**
 * https://www.ecma-international.org/ecma-262/11.0/index.html#sec-hasownproperty
 * @param o
 * @param prop
 */
function HasOwnProperty(o, prop) {
    return Object.prototype.hasOwnProperty.call(o, prop);
}
exports.HasOwnProperty = HasOwnProperty;
/**
 * https://www.ecma-international.org/ecma-262/11.0/index.html#sec-type
 * @param x
 */
function Type(x) {
    if (x === null) {
        return 'Null';
    }
    if (typeof x === 'undefined') {
        return 'Undefined';
    }
    if (typeof x === 'function' || typeof x === 'object') {
        return 'Object';
    }
    if (typeof x === 'number') {
        return 'Number';
    }
    if (typeof x === 'boolean') {
        return 'Boolean';
    }
    if (typeof x === 'string') {
        return 'String';
    }
    if (typeof x === 'symbol') {
        return 'Symbol';
    }
    if (typeof x === 'bigint') {
        return 'BigInt';
    }
}
exports.Type = Type;
var MS_PER_DAY = 86400000;
/**
 * https://www.ecma-international.org/ecma-262/11.0/index.html#eqn-modulo
 * @param x
 * @param y
 * @return k of the same sign as y
 */
function mod(x, y) {
    return x - Math.floor(x / y) * y;
}
/**
 * https://tc39.es/ecma262/#eqn-Day
 * @param t
 */
function Day(t) {
    return Math.floor(t / MS_PER_DAY);
}
exports.Day = Day;
/**
 * https://tc39.es/ecma262/#sec-week-day
 * @param t
 */
function WeekDay(t) {
    return mod(Day(t) + 4, 7);
}
exports.WeekDay = WeekDay;
/**
 * https://tc39.es/ecma262/#sec-year-number
 * @param y
 */
function DayFromYear(y) {
    return (365 * (y - 1970) +
        Math.floor((y - 1969) / 4) -
        Math.floor((y - 1901) / 100) +
        Math.floor((y - 1601) / 400));
}
exports.DayFromYear = DayFromYear;
/**
 * https://tc39.es/ecma262/#sec-year-number
 * @param y
 */
function TimeFromYear(y) {
    return MS_PER_DAY * DayFromYear(y);
}
exports.TimeFromYear = TimeFromYear;
/**
 * https://tc39.es/ecma262/#sec-year-number
 * @param t
 */
function YearFromTime(t) {
    var min = Math.ceil(t / MS_PER_DAY / 366);
    var y = min;
    while (TimeFromYear(y) <= t) {
        y++;
    }
    return y - 1;
}
exports.YearFromTime = YearFromTime;
function DaysInYear(y) {
    if (y % 4 !== 0) {
        return 365;
    }
    if (y % 100 !== 0) {
        return 366;
    }
    if (y % 400 !== 0) {
        return 365;
    }
    return 366;
}
exports.DaysInYear = DaysInYear;
function DayWithinYear(t) {
    return Day(t) - DayFromYear(YearFromTime(t));
}
exports.DayWithinYear = DayWithinYear;
function InLeapYear(t) {
    return DaysInYear(YearFromTime(t)) === 365 ? 0 : 1;
}
exports.InLeapYear = InLeapYear;
/**
 * https://tc39.es/ecma262/#sec-month-number
 * @param t
 */
function MonthFromTime(t) {
    var dwy = DayWithinYear(t);
    var leap = InLeapYear(t);
    if (dwy >= 0 && dwy < 31) {
        return 0;
    }
    if (dwy < 59 + leap) {
        return 1;
    }
    if (dwy < 90 + leap) {
        return 2;
    }
    if (dwy < 120 + leap) {
        return 3;
    }
    if (dwy < 151 + leap) {
        return 4;
    }
    if (dwy < 181 + leap) {
        return 5;
    }
    if (dwy < 212 + leap) {
        return 6;
    }
    if (dwy < 243 + leap) {
        return 7;
    }
    if (dwy < 273 + leap) {
        return 8;
    }
    if (dwy < 304 + leap) {
        return 9;
    }
    if (dwy < 334 + leap) {
        return 10;
    }
    if (dwy < 365 + leap) {
        return 11;
    }
    throw new Error('Invalid time');
}
exports.MonthFromTime = MonthFromTime;
function DateFromTime(t) {
    var dwy = DayWithinYear(t);
    var mft = MonthFromTime(t);
    var leap = InLeapYear(t);
    if (mft === 0) {
        return dwy + 1;
    }
    if (mft === 1) {
        return dwy - 30;
    }
    if (mft === 2) {
        return dwy - 58 - leap;
    }
    if (mft === 3) {
        return dwy - 89 - leap;
    }
    if (mft === 4) {
        return dwy - 119 - leap;
    }
    if (mft === 5) {
        return dwy - 150 - leap;
    }
    if (mft === 6) {
        return dwy - 180 - leap;
    }
    if (mft === 7) {
        return dwy - 211 - leap;
    }
    if (mft === 8) {
        return dwy - 242 - leap;
    }
    if (mft === 9) {
        return dwy - 272 - leap;
    }
    if (mft === 10) {
        return dwy - 303 - leap;
    }
    if (mft === 11) {
        return dwy - 333 - leap;
    }
    throw new Error('Invalid time');
}
exports.DateFromTime = DateFromTime;
var HOURS_PER_DAY = 24;
var MINUTES_PER_HOUR = 60;
var SECONDS_PER_MINUTE = 60;
var MS_PER_SECOND = 1e3;
var MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
var MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
function HourFromTime(t) {
    return mod(Math.floor(t / MS_PER_HOUR), HOURS_PER_DAY);
}
exports.HourFromTime = HourFromTime;
function MinFromTime(t) {
    return mod(Math.floor(t / MS_PER_MINUTE), MINUTES_PER_HOUR);
}
exports.MinFromTime = MinFromTime;
function SecFromTime(t) {
    return mod(Math.floor(t / MS_PER_SECOND), SECONDS_PER_MINUTE);
}
exports.SecFromTime = SecFromTime;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestAvailableLocale = void 0;
/**
 * https://tc39.es/ecma402/#sec-bestavailablelocale
 * @param availableLocales
 * @param locale
 */
function BestAvailableLocale(availableLocales, locale) {
    var candidate = locale;
    while (true) {
        if (availableLocales.has(candidate)) {
            return candidate;
        }
        var pos = candidate.lastIndexOf('-');
        if (!~pos) {
            return undefined;
        }
        if (pos >= 2 && candidate[pos - 2] === '-') {
            pos -= 2;
        }
        candidate = candidate.slice(0, pos);
    }
}
exports.BestAvailableLocale = BestAvailableLocale;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestFitMatcher = void 0;
var BestAvailableLocale_1 = require("./BestAvailableLocale");
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-bestfitmatcher
 * @param availableLocales
 * @param requestedLocales
 * @param getDefaultLocale
 */
function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var minimizedAvailableLocaleMap = {};
    var minimizedAvailableLocales = new Set();
    availableLocales.forEach(function (locale) {
        var minimizedLocale = new Intl.Locale(locale)
            .minimize()
            .toString();
        minimizedAvailableLocaleMap[minimizedLocale] = locale;
        minimizedAvailableLocales.add(minimizedLocale);
    });
    var foundLocale;
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
        var l = requestedLocales_1[_i];
        if (foundLocale) {
            break;
        }
        var noExtensionLocale = l.replace(utils_1.UNICODE_EXTENSION_SEQUENCE_REGEX, '');
        if (availableLocales.has(noExtensionLocale)) {
            foundLocale = noExtensionLocale;
            break;
        }
        if (minimizedAvailableLocales.has(noExtensionLocale)) {
            foundLocale = minimizedAvailableLocaleMap[noExtensionLocale];
            break;
        }
        var locale = new Intl.Locale(noExtensionLocale);
        var maximizedRequestedLocale = locale.maximize().toString();
        var minimizedRequestedLocale = locale.minimize().toString();
        // Check minimized locale
        if (minimizedAvailableLocales.has(minimizedRequestedLocale)) {
            foundLocale = minimizedAvailableLocaleMap[minimizedRequestedLocale];
            break;
        }
        // Lookup algo on maximized locale
        foundLocale = BestAvailableLocale_1.BestAvailableLocale(minimizedAvailableLocales, maximizedRequestedLocale);
    }
    return {
        locale: foundLocale || getDefaultLocale(),
    };
}
exports.BestFitMatcher = BestFitMatcher;

},{"./BestAvailableLocale":2,"./utils":66}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalizeLocaleList = void 0;
/**
 * http://ecma-international.org/ecma-402/7.0/index.html#sec-canonicalizelocalelist
 * @param locales
 */
function CanonicalizeLocaleList(locales) {
    // TODO
    return Intl.getCanonicalLocales(locales);
}
exports.CanonicalizeLocaleList = CanonicalizeLocaleList;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalizeTimeZoneName = void 0;
/**
 * https://tc39.es/ecma402/#sec-canonicalizetimezonename
 * @param tz
 */
function CanonicalizeTimeZoneName(tz, _a) {
    var tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var uppercasedZones = Object.keys(tzData).reduce(function (all, z) {
        all[z.toUpperCase()] = z;
        return all;
    }, {});
    var ianaTimeZone = uppercaseLinks[uppercasedTz] || uppercasedZones[uppercasedTz];
    if (ianaTimeZone === 'Etc/UTC' || ianaTimeZone === 'Etc/GMT') {
        return 'UTC';
    }
    return ianaTimeZone;
}
exports.CanonicalizeTimeZoneName = CanonicalizeTimeZoneName;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicFormatMatcher = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
var utils_2 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-basicformatmatcher
 * @param options
 * @param formats
 */
function BasicFormatMatcher(options, formats) {
    var bestScore = -Infinity;
    var bestFormat = formats[0];
    utils_1.invariant(Array.isArray(formats), 'formats should be a list of things');
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
        var format = formats_1[_i];
        var score = 0;
        for (var _a = 0, DATE_TIME_PROPS_1 = utils_2.DATE_TIME_PROPS; _a < DATE_TIME_PROPS_1.length; _a++) {
            var prop = DATE_TIME_PROPS_1[_a];
            var optionsProp = options[prop];
            var formatProp = format[prop];
            if (optionsProp === undefined && formatProp !== undefined) {
                score -= utils_2.additionPenalty;
            }
            else if (optionsProp !== undefined && formatProp === undefined) {
                score -= utils_2.removalPenalty;
            }
            else if (optionsProp !== formatProp) {
                var values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];
                var optionsPropIndex = values.indexOf(optionsProp);
                var formatPropIndex = values.indexOf(formatProp);
                var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
                if (delta === 2) {
                    score -= utils_2.longMorePenalty;
                }
                else if (delta === 1) {
                    score -= utils_2.shortMorePenalty;
                }
                else if (delta === -1) {
                    score -= utils_2.shortLessPenalty;
                }
                else if (delta === -2) {
                    score -= utils_2.longLessPenalty;
                }
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestFormat = format;
        }
    }
    return tslib_1.__assign({}, bestFormat);
}
exports.BasicFormatMatcher = BasicFormatMatcher;

},{"../utils":66,"./utils":20,"tslib":59}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestFitFormatMatcher = exports.bestFitFormatMatcherScore = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
var utils_2 = require("./utils");
var skeleton_1 = require("./skeleton");
function isNumericType(t) {
    return t === 'numeric' || t === '2-digit';
}
/**
 * Credit: https://github.com/andyearnshaw/Intl.js/blob/0958dc1ad8153f1056653ea22b8208f0df289a4e/src/12.datetimeformat.js#L611
 * with some modifications
 * @param options
 * @param format
 */
function bestFitFormatMatcherScore(options, format) {
    var score = 0;
    if (options.hour12 && !format.hour12) {
        score -= utils_2.removalPenalty;
    }
    else if (!options.hour12 && format.hour12) {
        score -= utils_2.additionPenalty;
    }
    for (var _i = 0, DATE_TIME_PROPS_1 = utils_2.DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
        var prop = DATE_TIME_PROPS_1[_i];
        var optionsProp = options[prop];
        var formatProp = format[prop];
        if (optionsProp === undefined && formatProp !== undefined) {
            score -= utils_2.additionPenalty;
        }
        else if (optionsProp !== undefined && formatProp === undefined) {
            score -= utils_2.removalPenalty;
        }
        else if (optionsProp !== formatProp) {
            // extra penalty for numeric vs non-numeric
            if (isNumericType(optionsProp) !==
                isNumericType(formatProp)) {
                score -= utils_2.differentNumericTypePenalty;
            }
            else {
                var values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];
                var optionsPropIndex = values.indexOf(optionsProp);
                var formatPropIndex = values.indexOf(formatProp);
                var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
                if (delta === 2) {
                    score -= utils_2.longMorePenalty;
                }
                else if (delta === 1) {
                    score -= utils_2.shortMorePenalty;
                }
                else if (delta === -1) {
                    score -= utils_2.shortLessPenalty;
                }
                else if (delta === -2) {
                    score -= utils_2.longLessPenalty;
                }
            }
        }
    }
    return score;
}
exports.bestFitFormatMatcherScore = bestFitFormatMatcherScore;
/**
 * https://tc39.es/ecma402/#sec-bestfitformatmatcher
 * Just alias to basic for now
 * @param options
 * @param formats
 * @param implDetails Implementation details
 */
function BestFitFormatMatcher(options, formats) {
    var bestScore = -Infinity;
    var bestFormat = formats[0];
    utils_1.invariant(Array.isArray(formats), 'formats should be a list of things');
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
        var format = formats_1[_i];
        var score = bestFitFormatMatcherScore(options, format);
        if (score > bestScore) {
            bestScore = score;
            bestFormat = format;
        }
    }
    var skeletonFormat = tslib_1.__assign({}, bestFormat);
    var patternFormat = { rawPattern: bestFormat.rawPattern };
    skeleton_1.processDateTimePattern(bestFormat.rawPattern, patternFormat);
    // Kinda following https://github.com/unicode-org/icu/blob/dd50e38f459d84e9bf1b0c618be8483d318458ad/icu4j/main/classes/core/src/com/ibm/icu/text/DateTimePatternGenerator.java
    // Method adjustFieldTypes
    for (var prop in skeletonFormat) {
        var skeletonValue = skeletonFormat[prop];
        var patternValue = patternFormat[prop];
        var requestedValue = options[prop];
        // Don't mess with minute/second or we can get in the situation of
        // 7:0:0 which is weird
        if (prop === 'minute' || prop === 'second') {
            continue;
        }
        // Nothing to do here
        if (!requestedValue) {
            continue;
        }
        // https://unicode.org/reports/tr35/tr35-dates.html#Matching_Skeletons
        // Looks like we should not convert numeric to alphabetic but the other way
        // around is ok
        if (isNumericType(patternValue) &&
            !isNumericType(requestedValue)) {
            continue;
        }
        if (skeletonValue === requestedValue) {
            continue;
        }
        patternFormat[prop] = requestedValue;
    }
    // Copy those over
    patternFormat.pattern = skeletonFormat.pattern;
    patternFormat.pattern12 = skeletonFormat.pattern12;
    patternFormat.skeleton = skeletonFormat.skeleton;
    patternFormat.rangePatterns = skeletonFormat.rangePatterns;
    patternFormat.rangePatterns12 = skeletonFormat.rangePatterns12;
    return patternFormat;
}
exports.BestFitFormatMatcher = BestFitFormatMatcher;

},{"../utils":66,"./skeleton":19,"./utils":20,"tslib":59}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeStyleFormat = void 0;
var utils_1 = require("../utils");
function DateTimeStyleFormat(dateStyle, timeStyle, dataLocaleData) {
    var dateFormat, timeFormat;
    if (timeStyle !== undefined) {
        utils_1.invariant(timeStyle === 'full' ||
            timeStyle === 'long' ||
            timeStyle === 'medium' ||
            timeStyle === 'short', 'invalid timeStyle');
        timeFormat = dataLocaleData.timeFormat[timeStyle];
    }
    if (dateStyle !== undefined) {
        utils_1.invariant(dateStyle === 'full' ||
            dateStyle === 'long' ||
            dateStyle === 'medium' ||
            dateStyle === 'short', 'invalid dateStyle');
        dateFormat = dataLocaleData.dateFormat[dateStyle];
    }
    if (dateStyle !== undefined && timeStyle !== undefined) {
        var format = {};
        for (var field in dateFormat) {
            if (field !== 'pattern') {
                // @ts-ignore
                format[field] = dateFormat[field];
            }
        }
        for (var field in timeFormat) {
            if (field !== 'pattern' && field !== 'pattern12') {
                // @ts-ignore
                format[field] = timeFormat[field];
            }
        }
        var connector = dataLocaleData.dateTimeFormat[dateStyle];
        var pattern = connector
            .replace('{0}', timeFormat.pattern)
            .replace('{1}', dateFormat.pattern);
        format.pattern = pattern;
        if ('pattern12' in timeFormat) {
            var pattern12 = connector
                .replace('{0}', timeFormat.pattern12)
                .replace('{1}', dateFormat.pattern);
            format.pattern12 = pattern12;
        }
        return format;
    }
    if (timeStyle !== undefined) {
        return timeFormat;
    }
    utils_1.invariant(dateStyle !== undefined, 'dateStyle should not be undefined');
    return dateFormat;
}
exports.DateTimeStyleFormat = DateTimeStyleFormat;

},{"../utils":66}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTime = void 0;
var PartitionDateTimePattern_1 = require("./PartitionDateTimePattern");
/**
 * https://tc39.es/ecma402/#sec-formatdatetime
 * @param dtf DateTimeFormat
 * @param x
 */
function FormatDateTime(dtf, x, implDetails) {
    var parts = PartitionDateTimePattern_1.PartitionDateTimePattern(dtf, x, implDetails);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result += part.value;
    }
    return result;
}
exports.FormatDateTime = FormatDateTime;

},{"./PartitionDateTimePattern":15}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimePattern = void 0;
var utils_1 = require("./utils");
var ToLocalTime_1 = require("./ToLocalTime");
var _262_1 = require("../262");
function pad(n) {
    if (n < 10) {
        return "0" + n;
    }
    return String(n);
}
function offsetToGmtString(gmtFormat, hourFormat, offsetInMs, style) {
    var offsetInMinutes = Math.floor(offsetInMs / 60000);
    var mins = Math.abs(offsetInMinutes) % 60;
    var hours = Math.floor(Math.abs(offsetInMinutes) / 60);
    var _a = hourFormat.split(';'), positivePattern = _a[0], negativePattern = _a[1];
    var offsetStr = '';
    var pattern = offsetInMs < 0 ? negativePattern : positivePattern;
    if (style === 'long') {
        offsetStr = pattern
            .replace('HH', pad(hours))
            .replace('H', String(hours))
            .replace('mm', pad(mins))
            .replace('m', String(mins));
    }
    else if (mins || hours) {
        if (!mins) {
            pattern = pattern.replace(/:?m+/, '');
        }
        offsetStr = pattern
            .replace(/H+/, String(hours))
            .replace(/m+/, String(mins));
    }
    return gmtFormat.replace('{0}', offsetStr);
}
/**
 * https://tc39.es/ecma402/#sec-partitiondatetimepattern
 * @param dtf
 * @param x
 */
function FormatDateTimePattern(dtf, patternParts, x, _a) {
    var getInternalSlots = _a.getInternalSlots, localeData = _a.localeData, getDefaultTimeZone = _a.getDefaultTimeZone, tzData = _a.tzData;
    x = _262_1.TimeClip(x);
    /** IMPL START */
    var internalSlots = getInternalSlots(dtf);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = localeData[dataLocale];
    /** IMPL END */
    var locale = internalSlots.locale;
    var nfOptions = Object.create(null);
    nfOptions.useGrouping = false;
    var nf = new Intl.NumberFormat(locale, nfOptions);
    var nf2Options = Object.create(null);
    nf2Options.minimumIntegerDigits = 2;
    nf2Options.useGrouping = false;
    var nf2 = new Intl.NumberFormat(locale, nf2Options);
    var tm = ToLocalTime_1.ToLocalTime(x, 
    // @ts-ignore
    internalSlots.calendar, internalSlots.timeZone, { tzData: tzData });
    var result = [];
    for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
        var patternPart = patternParts_1[_i];
        var p = patternPart.type;
        if (p === 'literal') {
            result.push({
                type: 'literal',
                value: patternPart.value,
            });
        }
        else if (utils_1.DATE_TIME_PROPS.indexOf(p) > -1) {
            var fv = '';
            var f = internalSlots[p];
            // @ts-ignore
            var v = tm[p];
            if (p === 'year' && v <= 0) {
                v = 1 - v;
            }
            if (p === 'month') {
                v++;
            }
            var hourCycle = internalSlots.hourCycle;
            if (p === 'hour' && (hourCycle === 'h11' || hourCycle === 'h12')) {
                v = v % 12;
                if (v === 0 && hourCycle === 'h12') {
                    v = 12;
                }
            }
            if (p === 'hour' && hourCycle === 'h24') {
                if (v === 0) {
                    v = 24;
                }
            }
            if (f === 'numeric') {
                fv = nf.format(v);
            }
            else if (f === '2-digit') {
                fv = nf2.format(v);
                if (fv.length > 2) {
                    fv = fv.slice(fv.length - 2, fv.length);
                }
            }
            else if (f === 'narrow' || f === 'short' || f === 'long') {
                if (p === 'era') {
                    fv = dataLocaleData[p][f][v];
                }
                else if (p === 'timeZoneName') {
                    var timeZoneName = dataLocaleData.timeZoneName, gmtFormat = dataLocaleData.gmtFormat, hourFormat = dataLocaleData.hourFormat;
                    var timeZone = internalSlots.timeZone || getDefaultTimeZone();
                    var timeZoneData = timeZoneName[timeZone];
                    if (timeZoneData && timeZoneData[f]) {
                        fv = timeZoneData[f][+tm.inDST];
                    }
                    else {
                        // Fallback to gmtFormat
                        fv = offsetToGmtString(gmtFormat, hourFormat, tm.timeZoneOffset, f);
                    }
                }
                else if (p === 'month') {
                    fv = dataLocaleData.month[f][v - 1];
                }
                else {
                    fv = dataLocaleData[p][f][v];
                }
            }
            result.push({
                type: p,
                value: fv,
            });
        }
        else if (p === 'ampm') {
            var v = tm.hour;
            var fv = void 0;
            if (v > 11) {
                fv = dataLocaleData.pm;
            }
            else {
                fv = dataLocaleData.am;
            }
            result.push({
                type: 'dayPeriod',
                value: fv,
            });
        }
        else if (p === 'relatedYear') {
            var v = tm.relatedYear;
            // @ts-ignore
            var fv = nf.format(v);
            result.push({
                // @ts-ignore TODO: Fix TS type
                type: 'relatedYear',
                value: fv,
            });
        }
        else if (p === 'yearName') {
            var v = tm.yearName;
            // @ts-ignore
            var fv = nf.format(v);
            result.push({
                // @ts-ignore TODO: Fix TS type
                type: 'yearName',
                value: fv,
            });
        }
    }
    return result;
}
exports.FormatDateTimePattern = FormatDateTimePattern;

},{"../262":1,"./ToLocalTime":18,"./utils":20}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeRange = void 0;
var PartitionDateTimeRangePattern_1 = require("./PartitionDateTimeRangePattern");
function FormatDateTimeRange(dtf, x, y, implDetails) {
    var parts = PartitionDateTimeRangePattern_1.PartitionDateTimeRangePattern(dtf, x, y, implDetails);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result += part.value;
    }
    return result;
}
exports.FormatDateTimeRange = FormatDateTimeRange;

},{"./PartitionDateTimeRangePattern":16}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeRangeToParts = void 0;
var PartitionDateTimeRangePattern_1 = require("./PartitionDateTimeRangePattern");
function FormatDateTimeRangeToParts(dtf, x, y, implDetails) {
    var parts = PartitionDateTimeRangePattern_1.PartitionDateTimeRangePattern(dtf, x, y, implDetails);
    var result = new Array(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result.push({
            type: part.type,
            value: part.value,
            source: part.source,
        });
    }
    return result;
}
exports.FormatDateTimeRangeToParts = FormatDateTimeRangeToParts;

},{"./PartitionDateTimeRangePattern":16}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeToParts = void 0;
var PartitionDateTimePattern_1 = require("./PartitionDateTimePattern");
var _262_1 = require("../262");
/**
 * https://tc39.es/ecma402/#sec-formatdatetimetoparts
 *
 * @param dtf
 * @param x
 * @param implDetails
 */
function FormatDateTimeToParts(dtf, x, implDetails) {
    var parts = PartitionDateTimePattern_1.PartitionDateTimePattern(dtf, x, implDetails);
    var result = _262_1.ArrayCreate(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result.push({
            type: part.type,
            value: part.value,
        });
    }
    return result;
}
exports.FormatDateTimeToParts = FormatDateTimeToParts;

},{"../262":1,"./PartitionDateTimePattern":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeDateTimeFormat = void 0;
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var ToDateTimeOptions_1 = require("./ToDateTimeOptions");
var GetOption_1 = require("../GetOption");
var ResolveLocale_1 = require("../ResolveLocale");
var IsValidTimeZoneName_1 = require("../IsValidTimeZoneName");
var CanonicalizeTimeZoneName_1 = require("../CanonicalizeTimeZoneName");
var BasicFormatMatcher_1 = require("./BasicFormatMatcher");
var BestFitFormatMatcher_1 = require("./BestFitFormatMatcher");
var utils_1 = require("../utils");
var utils_2 = require("./utils");
var DateTimeStyleFormat_1 = require("./DateTimeStyleFormat");
function isTimeRelated(opt) {
    for (var _i = 0, _a = ['hour', 'minute', 'second']; _i < _a.length; _i++) {
        var prop = _a[_i];
        var value = opt[prop];
        if (value !== undefined) {
            return true;
        }
    }
    return false;
}
function resolveHourCycle(hc, hcDefault, hour12) {
    if (hc == null) {
        hc = hcDefault;
    }
    if (hour12 !== undefined) {
        if (hour12) {
            if (hcDefault === 'h11' || hcDefault === 'h23') {
                hc = 'h11';
            }
            else {
                hc = 'h12';
            }
        }
        else {
            utils_1.invariant(!hour12, 'hour12 must not be set');
            if (hcDefault === 'h11' || hcDefault === 'h23') {
                hc = 'h23';
            }
            else {
                hc = 'h24';
            }
        }
    }
    return hc;
}
var TYPE_REGEX = /^[a-z0-9]{3,8}$/i;
/**
 * https://tc39.es/ecma402/#sec-initializedatetimeformat
 * @param dtf DateTimeFormat
 * @param locales locales
 * @param opts options
 */
function InitializeDateTimeFormat(dtf, locales, opts, _a) {
    var getInternalSlots = _a.getInternalSlots, availableLocales = _a.availableLocales, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale, getDefaultTimeZone = _a.getDefaultTimeZone, relevantExtensionKeys = _a.relevantExtensionKeys, tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    // @ts-ignore
    var requestedLocales = CanonicalizeLocaleList_1.CanonicalizeLocaleList(locales);
    var options = ToDateTimeOptions_1.ToDateTimeOptions(opts, 'any', 'date');
    var opt = Object.create(null);
    var matcher = GetOption_1.GetOption(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    opt.localeMatcher = matcher;
    var calendar = GetOption_1.GetOption(options, 'calendar', 'string', undefined, undefined);
    if (calendar !== undefined && !TYPE_REGEX.test(calendar)) {
        throw new RangeError('Malformed calendar');
    }
    var internalSlots = getInternalSlots(dtf);
    opt.ca = calendar;
    var numberingSystem = GetOption_1.GetOption(options, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined && !TYPE_REGEX.test(numberingSystem)) {
        throw new RangeError('Malformed numbering system');
    }
    opt.nu = numberingSystem;
    var hour12 = GetOption_1.GetOption(options, 'hour12', 'boolean', undefined, undefined);
    var hourCycle = GetOption_1.GetOption(options, 'hourCycle', 'string', ['h11', 'h12', 'h23', 'h24'], undefined);
    if (hour12 !== undefined) {
        // @ts-ignore
        hourCycle = null;
    }
    opt.hc = hourCycle;
    var r = ResolveLocale_1.ResolveLocale(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
    internalSlots.locale = r.locale;
    calendar = r.ca;
    internalSlots.calendar = calendar;
    internalSlots.hourCycle = r.hc;
    internalSlots.numberingSystem = r.nu;
    var dataLocale = r.dataLocale;
    internalSlots.dataLocale = dataLocale;
    var timeZone = options.timeZone;
    if (timeZone !== undefined) {
        timeZone = String(timeZone);
        if (!IsValidTimeZoneName_1.IsValidTimeZoneName(timeZone, { tzData: tzData, uppercaseLinks: uppercaseLinks })) {
            throw new RangeError('Invalid timeZoneName');
        }
        timeZone = CanonicalizeTimeZoneName_1.CanonicalizeTimeZoneName(timeZone, { tzData: tzData, uppercaseLinks: uppercaseLinks });
    }
    else {
        timeZone = getDefaultTimeZone();
    }
    internalSlots.timeZone = timeZone;
    opt = Object.create(null);
    opt.weekday = GetOption_1.GetOption(options, 'weekday', 'string', ['narrow', 'short', 'long'], undefined);
    opt.era = GetOption_1.GetOption(options, 'era', 'string', ['narrow', 'short', 'long'], undefined);
    opt.year = GetOption_1.GetOption(options, 'year', 'string', ['2-digit', 'numeric'], undefined);
    opt.month = GetOption_1.GetOption(options, 'month', 'string', ['2-digit', 'numeric', 'narrow', 'short', 'long'], undefined);
    opt.day = GetOption_1.GetOption(options, 'day', 'string', ['2-digit', 'numeric'], undefined);
    opt.hour = GetOption_1.GetOption(options, 'hour', 'string', ['2-digit', 'numeric'], undefined);
    opt.minute = GetOption_1.GetOption(options, 'minute', 'string', ['2-digit', 'numeric'], undefined);
    opt.second = GetOption_1.GetOption(options, 'second', 'string', ['2-digit', 'numeric'], undefined);
    opt.timeZoneName = GetOption_1.GetOption(options, 'timeZoneName', 'string', ['short', 'long'], undefined);
    var dataLocaleData = localeData[dataLocale];
    utils_1.invariant(!!dataLocaleData, "Missing locale data for " + dataLocale);
    var formats = dataLocaleData.formats[calendar];
    // UNSPECCED: IMPLEMENTATION DETAILS
    if (!formats) {
        throw new RangeError("Calendar \"" + calendar + "\" is not supported. Try setting \"calendar\" to 1 of the following: " + Object.keys(dataLocaleData.formats).join(', '));
    }
    matcher = GetOption_1.GetOption(options, 'formatMatcher', 'string', ['basic', 'best fit'], 'best fit');
    var dateStyle = GetOption_1.GetOption(options, 'dateStyle', 'string', ['full', 'long', 'medium', 'short'], undefined);
    internalSlots.dateStyle = dateStyle;
    var timeStyle = GetOption_1.GetOption(options, 'timeStyle', 'string', ['full', 'long', 'medium', 'short'], undefined);
    internalSlots.timeStyle = timeStyle;
    var bestFormat;
    if (dateStyle === undefined && timeStyle === undefined) {
        if (matcher === 'basic') {
            bestFormat = BasicFormatMatcher_1.BasicFormatMatcher(opt, formats);
        }
        else {
            // IMPL DETAILS START
            if (isTimeRelated(opt)) {
                var hc = resolveHourCycle(internalSlots.hourCycle, dataLocaleData.hourCycle, hour12);
                opt.hour12 = hc === 'h11' || hc === 'h12';
            }
            // IMPL DETAILS END
            bestFormat = BestFitFormatMatcher_1.BestFitFormatMatcher(opt, formats);
        }
    }
    else {
        for (var _i = 0, DATE_TIME_PROPS_1 = utils_2.DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
            var prop = DATE_TIME_PROPS_1[_i];
            var p = opt[prop];
            if (p !== undefined) {
                throw new TypeError("Intl.DateTimeFormat can't set option " + prop + " when " + (dateStyle ? 'dateStyle' : 'timeStyle') + " is used");
            }
        }
        bestFormat = DateTimeStyleFormat_1.DateTimeStyleFormat(dateStyle, timeStyle, dataLocaleData);
    }
    // IMPL DETAIL START
    // For debugging
    internalSlots.format = bestFormat;
    // IMPL DETAIL END
    for (var prop in opt) {
        var p = bestFormat[prop];
        if (p !== undefined) {
            internalSlots[prop] = p;
        }
    }
    var pattern;
    var rangePatterns;
    if (internalSlots.hour !== undefined) {
        var hc = resolveHourCycle(internalSlots.hourCycle, dataLocaleData.hourCycle, hour12);
        internalSlots.hourCycle = hc;
        if (hc === 'h11' || hc === 'h12') {
            pattern = bestFormat.pattern12;
            rangePatterns = bestFormat.rangePatterns12;
        }
        else {
            pattern = bestFormat.pattern;
            rangePatterns = bestFormat.rangePatterns;
        }
    }
    else {
        // @ts-ignore
        internalSlots.hourCycle = undefined;
        pattern = bestFormat.pattern;
        rangePatterns = bestFormat.rangePatterns;
    }
    internalSlots.pattern = pattern;
    internalSlots.rangePatterns = rangePatterns;
    return dtf;
}
exports.InitializeDateTimeFormat = InitializeDateTimeFormat;

},{"../CanonicalizeLocaleList":4,"../CanonicalizeTimeZoneName":5,"../GetOption":24,"../IsValidTimeZoneName":26,"../ResolveLocale":54,"../utils":66,"./BasicFormatMatcher":6,"./BestFitFormatMatcher":7,"./DateTimeStyleFormat":8,"./ToDateTimeOptions":17,"./utils":20}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionDateTimePattern = void 0;
var _262_1 = require("../262");
var FormatDateTimePattern_1 = require("./FormatDateTimePattern");
var PartitionPattern_1 = require("../PartitionPattern");
/**
 * https://tc39.es/ecma402/#sec-partitiondatetimepattern
 * @param dtf
 * @param x
 */
function PartitionDateTimePattern(dtf, x, implDetails) {
    x = _262_1.TimeClip(x);
    if (isNaN(x)) {
        throw new RangeError('invalid time');
    }
    /** IMPL START */
    var getInternalSlots = implDetails.getInternalSlots;
    var internalSlots = getInternalSlots(dtf);
    /** IMPL END */
    var pattern = internalSlots.pattern;
    return FormatDateTimePattern_1.FormatDateTimePattern(dtf, PartitionPattern_1.PartitionPattern(pattern), x, implDetails);
}
exports.PartitionDateTimePattern = PartitionDateTimePattern;

},{"../262":1,"../PartitionPattern":44,"./FormatDateTimePattern":10}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionDateTimeRangePattern = void 0;
var _262_1 = require("../262");
var ToLocalTime_1 = require("./ToLocalTime");
var FormatDateTimePattern_1 = require("./FormatDateTimePattern");
var PartitionPattern_1 = require("../PartitionPattern");
var TABLE_2_FIELDS = [
    'era',
    'year',
    'month',
    'day',
    'ampm',
    'hour',
    'minute',
    'second',
];
function PartitionDateTimeRangePattern(dtf, x, y, implDetails) {
    x = _262_1.TimeClip(x);
    if (isNaN(x)) {
        throw new RangeError('Invalid start time');
    }
    y = _262_1.TimeClip(y);
    if (isNaN(y)) {
        throw new RangeError('Invalid end time');
    }
    /** IMPL START */
    var getInternalSlots = implDetails.getInternalSlots, tzData = implDetails.tzData;
    var internalSlots = getInternalSlots(dtf);
    /** IMPL END */
    var tm1 = ToLocalTime_1.ToLocalTime(x, 
    // @ts-ignore
    internalSlots.calendar, internalSlots.timeZone, { tzData: tzData });
    var tm2 = ToLocalTime_1.ToLocalTime(y, 
    // @ts-ignore
    internalSlots.calendar, internalSlots.timeZone, { tzData: tzData });
    var pattern = internalSlots.pattern, rangePatterns = internalSlots.rangePatterns;
    var rangePattern;
    var dateFieldsPracticallyEqual = true;
    var patternContainsLargerDateField = false;
    for (var _i = 0, TABLE_2_FIELDS_1 = TABLE_2_FIELDS; _i < TABLE_2_FIELDS_1.length; _i++) {
        var fieldName = TABLE_2_FIELDS_1[_i];
        if (dateFieldsPracticallyEqual && !patternContainsLargerDateField) {
            if (fieldName === 'ampm') {
                var rp = rangePatterns.ampm;
                if (rangePattern !== undefined && rp === undefined) {
                    patternContainsLargerDateField = true;
                }
                else {
                    var v1 = tm1.hour;
                    var v2 = tm2.hour;
                    if ((v1 > 11 && v2 < 11) || (v1 < 11 && v2 > 11)) {
                        dateFieldsPracticallyEqual = false;
                    }
                    rangePattern = rp;
                }
            }
            else {
                var rp = rangePatterns[fieldName];
                if (rangePattern !== undefined && rp === undefined) {
                    patternContainsLargerDateField = true;
                }
                else {
                    var v1 = tm1[fieldName];
                    var v2 = tm2[fieldName];
                    if (!_262_1.SameValue(v1, v2)) {
                        dateFieldsPracticallyEqual = false;
                    }
                    rangePattern = rp;
                }
            }
        }
    }
    if (dateFieldsPracticallyEqual) {
        var result_2 = FormatDateTimePattern_1.FormatDateTimePattern(dtf, PartitionPattern_1.PartitionPattern(pattern), x, implDetails);
        for (var _a = 0, result_1 = result_2; _a < result_1.length; _a++) {
            var r = result_1[_a];
            r.source = "shared" /* shared */;
        }
        return result_2;
    }
    var result = [];
    if (rangePattern === undefined) {
        rangePattern = rangePatterns.default;
        /** IMPL DETAILS */
        // Now we have to replace {0} & {1} with actual pattern
        for (var _b = 0, _c = rangePattern.patternParts; _b < _c.length; _b++) {
            var patternPart = _c[_b];
            if (patternPart.pattern === '{0}' || patternPart.pattern === '{1}') {
                patternPart.pattern = pattern;
            }
        }
    }
    for (var _d = 0, _e = rangePattern.patternParts; _d < _e.length; _d++) {
        var rangePatternPart = _e[_d];
        var source = rangePatternPart.source, pattern_1 = rangePatternPart.pattern;
        var z = void 0;
        if (source === "startRange" /* startRange */ ||
            source === "shared" /* shared */) {
            z = x;
        }
        else {
            z = y;
        }
        var patternParts = PartitionPattern_1.PartitionPattern(pattern_1);
        var partResult = FormatDateTimePattern_1.FormatDateTimePattern(dtf, patternParts, z, implDetails);
        for (var _f = 0, partResult_1 = partResult; _f < partResult_1.length; _f++) {
            var r = partResult_1[_f];
            r.source = source;
        }
        result = result.concat(partResult);
    }
    return result;
}
exports.PartitionDateTimeRangePattern = PartitionDateTimeRangePattern;

},{"../262":1,"../PartitionPattern":44,"./FormatDateTimePattern":10,"./ToLocalTime":18}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDateTimeOptions = void 0;
var _262_1 = require("../262");
/**
 * https://tc39.es/ecma402/#sec-todatetimeoptions
 * @param options
 * @param required
 * @param defaults
 */
function ToDateTimeOptions(options, required, defaults) {
    if (options === undefined) {
        options = null;
    }
    else {
        options = _262_1.ToObject(options);
    }
    options = Object.create(options);
    var needDefaults = true;
    if (required === 'date' || required === 'any') {
        for (var _i = 0, _a = ['weekday', 'year', 'month', 'day']; _i < _a.length; _i++) {
            var prop = _a[_i];
            var value = options[prop];
            if (value !== undefined) {
                needDefaults = false;
            }
        }
    }
    if (required === 'time' || required === 'any') {
        for (var _b = 0, _c = ['hour', 'minute', 'second']; _b < _c.length; _b++) {
            var prop = _c[_b];
            var value = options[prop];
            if (value !== undefined) {
                needDefaults = false;
            }
        }
    }
    if (options.dateStyle !== undefined || options.timeStyle !== undefined) {
        needDefaults = false;
    }
    if (required === 'date' && options.timeStyle) {
        throw new TypeError('Intl.DateTimeFormat date was required but timeStyle was included');
    }
    if (required === 'time' && options.dateStyle) {
        throw new TypeError('Intl.DateTimeFormat time was required but dateStyle was included');
    }
    if (needDefaults && (defaults === 'date' || defaults === 'all')) {
        for (var _d = 0, _e = ['year', 'month', 'day']; _d < _e.length; _d++) {
            var prop = _e[_d];
            options[prop] = 'numeric';
        }
    }
    if (needDefaults && (defaults === 'time' || defaults === 'all')) {
        for (var _f = 0, _g = ['hour', 'minute', 'second']; _f < _g.length; _f++) {
            var prop = _g[_f];
            options[prop] = 'numeric';
        }
    }
    return options;
}
exports.ToDateTimeOptions = ToDateTimeOptions;

},{"../262":1}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToLocalTime = void 0;
var utils_1 = require("../utils");
var _262_1 = require("../262");
function getApplicableZoneData(t, timeZone, tzData) {
    var _a;
    var zoneData = tzData[timeZone];
    // We don't have data for this so just say it's UTC
    if (!zoneData) {
        return [0, false];
    }
    var i = 0;
    var offset = 0;
    var dst = false;
    for (; i <= zoneData.length; i++) {
        if (i === zoneData.length || zoneData[i][0] * 1e3 > t) {
            _a = zoneData[i - 1], offset = _a[2], dst = _a[3];
            break;
        }
    }
    return [offset * 1e3, dst];
}
/**
 * https://tc39.es/ecma402/#sec-tolocaltime
 * @param t
 * @param calendar
 * @param timeZone
 */
function ToLocalTime(t, calendar, timeZone, _a) {
    var tzData = _a.tzData;
    utils_1.invariant(_262_1.Type(t) === 'Number', 'invalid time');
    utils_1.invariant(calendar === 'gregory', 'We only support Gregory calendar right now');
    var _b = getApplicableZoneData(t, timeZone, tzData), timeZoneOffset = _b[0], inDST = _b[1];
    var tz = t + timeZoneOffset;
    var year = _262_1.YearFromTime(tz);
    return {
        weekday: _262_1.WeekDay(tz),
        era: year < 0 ? 'BC' : 'AD',
        year: year,
        relatedYear: undefined,
        yearName: undefined,
        month: _262_1.MonthFromTime(tz),
        day: _262_1.DateFromTime(tz),
        hour: _262_1.HourFromTime(tz),
        minute: _262_1.MinFromTime(tz),
        second: _262_1.SecFromTime(tz),
        inDST: inDST,
        // IMPORTANT: Not in spec
        timeZoneOffset: timeZoneOffset,
    };
}
exports.ToLocalTime = ToLocalTime;

},{"../262":1,"../utils":66}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitRangePattern = exports.splitFallbackRangePattern = exports.parseDateTimeSkeleton = exports.processDateTimePattern = void 0;
var tslib_1 = require("tslib");
/**
 * https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
 * with some tweaks
 */
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
// trim patterns after transformations
var expPatternTrimmer = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
function matchSkeletonPattern(match, result) {
    var len = match.length;
    switch (match[0]) {
        // Era
        case 'G':
            result.era = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
            return '{era}';
        // Year
        case 'y':
        case 'Y':
        case 'u':
        case 'U':
        case 'r':
            result.year = len === 2 ? '2-digit' : 'numeric';
            return '{year}';
        // Quarter
        case 'q':
        case 'Q':
            throw new RangeError('`w/Q` (quarter) patterns are not supported');
        // Month
        case 'M':
        case 'L':
            result.month = ['numeric', '2-digit', 'short', 'long', 'narrow'][len - 1];
            return '{month}';
        // Week
        case 'w':
        case 'W':
            throw new RangeError('`w/W` (week of year) patterns are not supported');
        case 'd':
            result.day = ['numeric', '2-digit'][len - 1];
            return '{day}';
        case 'D':
        case 'F':
        case 'g':
            result.day = 'numeric';
            return '{day}';
        // Weekday
        case 'E':
            result.weekday = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
            return '{weekday}';
        case 'e':
            result.weekday = [
                'numeric',
                '2-digit',
                'short',
                'long',
                'narrow',
                'short',
            ][len - 1];
            return '{weekday}';
        case 'c':
            result.weekday = [
                'numeric',
                undefined,
                'short',
                'long',
                'narrow',
                'short',
            ][len - 1];
            return '{weekday}';
        // Period
        case 'a': // AM, PM
        case 'b': // am, pm, noon, midnight
        case 'B': // flexible day periods
            result.hour12 = true;
            return '{ampm}';
        // Hour
        case 'h':
            result.hour = ['numeric', '2-digit'][len - 1];
            result.hour12 = true;
            return '{hour}';
        case 'H':
            result.hour = ['numeric', '2-digit'][len - 1];
            return '{hour}';
        case 'K':
            result.hour = ['numeric', '2-digit'][len - 1];
            result.hour12 = true;
            return '{hour}';
        case 'k':
            result.hour = ['numeric', '2-digit'][len - 1];
            return '{hour}';
        case 'j':
        case 'J':
        case 'C':
            throw new RangeError('`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead');
        // Minute
        case 'm':
            result.minute = ['numeric', '2-digit'][len - 1];
            return '{minute}';
        // Second
        case 's':
            result.second = ['numeric', '2-digit'][len - 1];
            return '{second}';
        case 'S':
        case 'A':
            result.second = 'numeric';
            return '{second}';
        // Zone
        case 'z': // 1..3, 4: specific non-location format
        case 'Z': // 1..3, 4, 5: The ISO8601 varios formats
        case 'O': // 1, 4: miliseconds in day short, long
        case 'v': // 1, 4: generic non-location format
        case 'V': // 1, 2, 3, 4: time zone ID or city
        case 'X': // 1, 2, 3, 4: The ISO8601 varios formats
        case 'x': // 1, 2, 3, 4: The ISO8601 varios formats
            result.timeZoneName = len < 4 ? 'short' : 'long';
            return '{timeZoneName}';
    }
    return '';
}
function skeletonTokenToTable2(c) {
    switch (c) {
        // Era
        case 'G':
            return 'era';
        // Year
        case 'y':
        case 'Y':
        case 'u':
        case 'U':
        case 'r':
            return 'year';
        // Month
        case 'M':
        case 'L':
            return 'month';
        // Day
        case 'd':
        case 'D':
        case 'F':
        case 'g':
            return 'day';
        // Period
        case 'a': // AM, PM
        case 'b': // am, pm, noon, midnight
        case 'B': // flexible day periods
            return 'ampm';
        // Hour
        case 'h':
        case 'H':
        case 'K':
        case 'k':
            return 'hour';
        // Minute
        case 'm':
            return 'minute';
        // Second
        case 's':
        case 'S':
        case 'A':
            return 'second';
        default:
            throw new RangeError('Invalid range pattern token');
    }
}
function processDateTimePattern(pattern, result) {
    var literals = [];
    // Use skeleton to populate result, but use mapped pattern to populate pattern
    var pattern12 = pattern
        // Double apostrophe
        .replace(/'{2}/g, '{apostrophe}')
        // Apostrophe-escaped
        .replace(/'(.*?)'/g, function (_, literal) {
        literals.push(literal);
        return "$$" + (literals.length - 1) + "$$";
    })
        .replace(DATE_TIME_REGEX, function (m) { return matchSkeletonPattern(m, result || {}); });
    //Restore literals
    if (literals.length) {
        pattern12 = pattern12
            .replace(/\$\$(\d+)\$\$/g, function (_, i) {
            return literals[+i];
        })
            .replace(/\{apostrophe\}/g, "'");
    }
    // Handle apostrophe-escaped things
    return [
        pattern12
            .replace(/([\s\uFEFF\xA0])\{ampm\}([\s\uFEFF\xA0])/, '$1')
            .replace('{ampm}', '')
            .replace(expPatternTrimmer, ''),
        pattern12,
    ];
}
exports.processDateTimePattern = processDateTimePattern;
/**
 * Parse Date time skeleton into Intl.DateTimeFormatOptions
 * Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * @public
 * @param skeleton skeleton string
 */
function parseDateTimeSkeleton(skeleton, rawPattern, rangePatterns, intervalFormatFallback) {
    if (rawPattern === void 0) { rawPattern = skeleton; }
    var result = {
        pattern: '',
        pattern12: '',
        skeleton: skeleton,
        rawPattern: rawPattern,
        rangePatterns: {},
        rangePatterns12: {},
    };
    if (rangePatterns) {
        for (var k in rangePatterns) {
            var key = skeletonTokenToTable2(k);
            var rawPattern_1 = rangePatterns[k];
            var intervalResult = {
                patternParts: [],
            };
            var _a = processDateTimePattern(rawPattern_1, intervalResult), pattern_1 = _a[0], pattern12_1 = _a[1];
            result.rangePatterns[key] = tslib_1.__assign(tslib_1.__assign({}, intervalResult), { patternParts: splitRangePattern(pattern_1) });
            result.rangePatterns12[key] = tslib_1.__assign(tslib_1.__assign({}, intervalResult), { patternParts: splitRangePattern(pattern12_1) });
        }
    }
    else if (intervalFormatFallback) {
        var patternParts = splitFallbackRangePattern(intervalFormatFallback);
        result.rangePatterns.default = {
            patternParts: patternParts,
        };
        result.rangePatterns12.default = {
            patternParts: patternParts,
        };
    }
    // Process skeleton
    skeleton.replace(DATE_TIME_REGEX, function (m) { return matchSkeletonPattern(m, result); });
    var _b = processDateTimePattern(rawPattern), pattern = _b[0], pattern12 = _b[1];
    result.pattern = pattern;
    result.pattern12 = pattern12;
    return result;
}
exports.parseDateTimeSkeleton = parseDateTimeSkeleton;
function splitFallbackRangePattern(pattern) {
    var parts = pattern.split(/(\{[0|1]\})/g).filter(Boolean);
    return parts.map(function (pattern) {
        switch (pattern) {
            case '{0}':
                return {
                    source: "startRange" /* startRange */,
                    pattern: pattern,
                };
            case '{1}':
                return {
                    source: "endRange" /* endRange */,
                    pattern: pattern,
                };
            default:
                return {
                    source: "shared" /* shared */,
                    pattern: pattern,
                };
        }
    });
}
exports.splitFallbackRangePattern = splitFallbackRangePattern;
function splitRangePattern(pattern) {
    var PART_REGEX = /\{(.*?)\}/g;
    // Map of part and index within the string
    var parts = {};
    var match;
    var splitIndex = 0;
    while ((match = PART_REGEX.exec(pattern))) {
        if (!(match[0] in parts)) {
            parts[match[0]] = match.index;
        }
        else {
            splitIndex = match.index;
            break;
        }
    }
    if (!splitIndex) {
        return [
            {
                source: "startRange" /* startRange */,
                pattern: pattern,
            },
        ];
    }
    return [
        {
            source: "startRange" /* startRange */,
            pattern: pattern.slice(0, splitIndex),
        },
        {
            source: "endRange" /* endRange */,
            pattern: pattern.slice(splitIndex),
        },
    ];
}
exports.splitRangePattern = splitRangePattern;

},{"tslib":59}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortMorePenalty = exports.shortLessPenalty = exports.longMorePenalty = exports.longLessPenalty = exports.differentNumericTypePenalty = exports.additionPenalty = exports.removalPenalty = exports.DATE_TIME_PROPS = void 0;
exports.DATE_TIME_PROPS = [
    'weekday',
    'era',
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'timeZoneName',
];
exports.removalPenalty = 120;
exports.additionPenalty = 20;
exports.differentNumericTypePenalty = 15;
exports.longLessPenalty = 8;
exports.longMorePenalty = 6;
exports.shortLessPenalty = 6;
exports.shortMorePenalty = 3;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNumberOption = void 0;
/**
 * https://tc39.es/ecma402/#sec-defaultnumberoption
 * @param val
 * @param min
 * @param max
 * @param fallback
 */
function DefaultNumberOption(val, min, max, fallback) {
    if (val !== undefined) {
        val = Number(val);
        if (isNaN(val) || val < min || val > max) {
            throw new RangeError(val + " is outside of range [" + min + ", " + max + "]");
        }
        return Math.floor(val);
    }
    return fallback;
}
exports.DefaultNumberOption = DefaultNumberOption;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalCodeForDisplayNames = void 0;
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var utils_1 = require("../utils");
var IsWellFormedCurrencyCode_1 = require("../IsWellFormedCurrencyCode");
var UNICODE_REGION_SUBTAG_REGEX = /^([a-z]{2}|[0-9]{3})$/i;
var ALPHA_4 = /^[a-z]{4}$/i;
function isUnicodeRegionSubtag(region) {
    return UNICODE_REGION_SUBTAG_REGEX.test(region);
}
function isUnicodeScriptSubtag(script) {
    return ALPHA_4.test(script);
}
function CanonicalCodeForDisplayNames(type, code) {
    if (type === 'language') {
        return CanonicalizeLocaleList_1.CanonicalizeLocaleList([code])[0];
    }
    if (type === 'region') {
        if (!isUnicodeRegionSubtag(code)) {
            throw RangeError('invalid region');
        }
        return code.toUpperCase();
    }
    if (type === 'script') {
        if (!isUnicodeScriptSubtag(code)) {
            throw RangeError('invalid script');
        }
        return "" + code[0].toUpperCase() + code.slice(1);
    }
    utils_1.invariant(type === 'currency', 'invalid type');
    if (!IsWellFormedCurrencyCode_1.IsWellFormedCurrencyCode(code)) {
        throw RangeError('invalid currency');
    }
    return code.toUpperCase();
}
exports.CanonicalCodeForDisplayNames = CanonicalCodeForDisplayNames;

},{"../CanonicalizeLocaleList":4,"../IsWellFormedCurrencyCode":27,"../utils":66}],23:[function(require,module,exports){
"use strict";
/**
 * https://tc39.es/ecma402/#sec-getnumberoption
 * @param options
 * @param property
 * @param min
 * @param max
 * @param fallback
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNumberOption = void 0;
var DefaultNumberOption_1 = require("./DefaultNumberOption");
function GetNumberOption(options, property, minimum, maximum, fallback) {
    var val = options[property];
    return DefaultNumberOption_1.DefaultNumberOption(val, minimum, maximum, fallback);
}
exports.GetNumberOption = GetNumberOption;

},{"./DefaultNumberOption":21}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOption = void 0;
var _262_1 = require("./262");
/**
 * https://tc39.es/ecma402/#sec-getoption
 * @param opts
 * @param prop
 * @param type
 * @param values
 * @param fallback
 */
function GetOption(opts, prop, type, values, fallback) {
    // const descriptor = Object.getOwnPropertyDescriptor(opts, prop);
    var value = opts[prop];
    if (value !== undefined) {
        if (type !== 'boolean' && type !== 'string') {
            throw new TypeError('invalid type');
        }
        if (type === 'boolean') {
            value = Boolean(value);
        }
        if (type === 'string') {
            value = _262_1.ToString(value);
        }
        if (values !== undefined && !values.filter(function (val) { return val == value; }).length) {
            throw new RangeError(value + " is not within " + values.join(', '));
        }
        return value;
    }
    return fallback;
}
exports.GetOption = GetOption;

},{"./262":1}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSanctionedSimpleUnitIdentifier = exports.SIMPLE_UNITS = exports.removeUnitNamespace = exports.SANCTIONED_UNITS = void 0;
/**
 * https://tc39.es/ecma402/#table-sanctioned-simple-unit-identifiers
 */
exports.SANCTIONED_UNITS = [
    'angle-degree',
    'area-acre',
    'area-hectare',
    'concentr-percent',
    'digital-bit',
    'digital-byte',
    'digital-gigabit',
    'digital-gigabyte',
    'digital-kilobit',
    'digital-kilobyte',
    'digital-megabit',
    'digital-megabyte',
    'digital-petabyte',
    'digital-terabit',
    'digital-terabyte',
    'duration-day',
    'duration-hour',
    'duration-millisecond',
    'duration-minute',
    'duration-month',
    'duration-second',
    'duration-week',
    'duration-year',
    'length-centimeter',
    'length-foot',
    'length-inch',
    'length-kilometer',
    'length-meter',
    'length-mile-scandinavian',
    'length-mile',
    'length-millimeter',
    'length-yard',
    'mass-gram',
    'mass-kilogram',
    'mass-ounce',
    'mass-pound',
    'mass-stone',
    'temperature-celsius',
    'temperature-fahrenheit',
    'volume-fluid-ounce',
    'volume-gallon',
    'volume-liter',
    'volume-milliliter',
];
// In CLDR, the unit name always follows the form `namespace-unit` pattern.
// For example: `digital-bit` instead of `bit`. This function removes the namespace prefix.
function removeUnitNamespace(unit) {
    return unit.slice(unit.indexOf('-') + 1);
}
exports.removeUnitNamespace = removeUnitNamespace;
/**
 * https://tc39.es/ecma402/#table-sanctioned-simple-unit-identifiers
 */
exports.SIMPLE_UNITS = exports.SANCTIONED_UNITS.map(removeUnitNamespace);
/**
 * https://tc39.es/ecma402/#sec-issanctionedsimpleunitidentifier
 */
function IsSanctionedSimpleUnitIdentifier(unitIdentifier) {
    return exports.SIMPLE_UNITS.indexOf(unitIdentifier) > -1;
}
exports.IsSanctionedSimpleUnitIdentifier = IsSanctionedSimpleUnitIdentifier;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidTimeZoneName = void 0;
/**
 * https://tc39.es/ecma402/#sec-isvalidtimezonename
 * @param tz
 * @param implDetails implementation details
 */
function IsValidTimeZoneName(tz, _a) {
    var tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var zoneNames = new Set(Object.keys(tzData).map(function (z) { return z.toUpperCase(); }));
    return zoneNames.has(uppercasedTz) || uppercasedTz in uppercaseLinks;
}
exports.IsValidTimeZoneName = IsValidTimeZoneName;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsWellFormedCurrencyCode = void 0;
/**
 * This follows https://tc39.es/ecma402/#sec-case-sensitivity-and-case-mapping
 * @param str string to convert
 */
function toUpperCase(str) {
    return str.replace(/([a-z])/g, function (_, c) { return c.toUpperCase(); });
}
var NOT_A_Z_REGEX = /[^A-Z]/;
/**
 * https://tc39.es/ecma402/#sec-iswellformedcurrencycode
 */
function IsWellFormedCurrencyCode(currency) {
    currency = toUpperCase(currency);
    if (currency.length !== 3) {
        return false;
    }
    if (NOT_A_Z_REGEX.test(currency)) {
        return false;
    }
    return true;
}
exports.IsWellFormedCurrencyCode = IsWellFormedCurrencyCode;

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsWellFormedUnitIdentifier = void 0;
var IsSanctionedSimpleUnitIdentifier_1 = require("./IsSanctionedSimpleUnitIdentifier");
/**
 * This follows https://tc39.es/ecma402/#sec-case-sensitivity-and-case-mapping
 * @param str string to convert
 */
function toLowerCase(str) {
    return str.replace(/([A-Z])/g, function (_, c) { return c.toLowerCase(); });
}
/**
 * https://tc39.es/ecma402/#sec-iswellformedunitidentifier
 * @param unit
 */
function IsWellFormedUnitIdentifier(unit) {
    unit = toLowerCase(unit);
    if (IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier(unit)) {
        return true;
    }
    var units = unit.split('-per-');
    if (units.length !== 2) {
        return false;
    }
    var numerator = units[0], denominator = units[1];
    if (!IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier(numerator) ||
        !IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier(denominator)) {
        return false;
    }
    return true;
}
exports.IsWellFormedUnitIdentifier = IsWellFormedUnitIdentifier;

},{"./IsSanctionedSimpleUnitIdentifier":25}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupMatcher = void 0;
var utils_1 = require("./utils");
var BestAvailableLocale_1 = require("./BestAvailableLocale");
/**
 * https://tc39.es/ecma402/#sec-lookupmatcher
 * @param availableLocales
 * @param requestedLocales
 * @param getDefaultLocale
 */
function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var result = { locale: '' };
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
        var locale = requestedLocales_1[_i];
        var noExtensionLocale = locale.replace(utils_1.UNICODE_EXTENSION_SEQUENCE_REGEX, '');
        var availableLocale = BestAvailableLocale_1.BestAvailableLocale(availableLocales, noExtensionLocale);
        if (availableLocale) {
            result.locale = availableLocale;
            if (locale !== noExtensionLocale) {
                result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
            }
            return result;
        }
    }
    result.locale = getDefaultLocale();
    return result;
}
exports.LookupMatcher = LookupMatcher;

},{"./BestAvailableLocale":2,"./utils":66}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupSupportedLocales = void 0;
var utils_1 = require("./utils");
var BestAvailableLocale_1 = require("./BestAvailableLocale");
/**
 * https://tc39.es/ecma402/#sec-lookupsupportedlocales
 * @param availableLocales
 * @param requestedLocales
 */
function LookupSupportedLocales(availableLocales, requestedLocales) {
    var subset = [];
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
        var locale = requestedLocales_1[_i];
        var noExtensionLocale = locale.replace(utils_1.UNICODE_EXTENSION_SEQUENCE_REGEX, '');
        var availableLocale = BestAvailableLocale_1.BestAvailableLocale(availableLocales, noExtensionLocale);
        if (availableLocale) {
            subset.push(availableLocale);
        }
    }
    return subset;
}
exports.LookupSupportedLocales = LookupSupportedLocales;

},{"./BestAvailableLocale":2,"./utils":66}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeExponent = void 0;
var utils_1 = require("../utils");
var ComputeExponentForMagnitude_1 = require("./ComputeExponentForMagnitude");
var FormatNumericToString_1 = require("./FormatNumericToString");
/**
 * The abstract operation ComputeExponent computes an exponent (power of ten) by which to scale x
 * according to the number formatting settings. It handles cases such as 999 rounding up to 1000,
 * requiring a different exponent.
 *
 * NOT IN SPEC: it returns [exponent, magnitude].
 */
function ComputeExponent(numberFormat, x, _a) {
    var getInternalSlots = _a.getInternalSlots;
    if (x === 0) {
        return [0, 0];
    }
    if (x < 0) {
        x = -x;
    }
    var magnitude = utils_1.getMagnitude(x);
    var exponent = ComputeExponentForMagnitude_1.ComputeExponentForMagnitude(numberFormat, magnitude, {
        getInternalSlots: getInternalSlots,
    });
    // Preserve more precision by doing multiplication when exponent is negative.
    x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
    var formatNumberResult = FormatNumericToString_1.FormatNumericToString(getInternalSlots(numberFormat), x);
    if (formatNumberResult.roundedNumber === 0) {
        return [exponent, magnitude];
    }
    var newMagnitude = utils_1.getMagnitude(formatNumberResult.roundedNumber);
    if (newMagnitude === magnitude - exponent) {
        return [exponent, magnitude];
    }
    return [
        ComputeExponentForMagnitude_1.ComputeExponentForMagnitude(numberFormat, magnitude + 1, {
            getInternalSlots: getInternalSlots,
        }),
        magnitude + 1,
    ];
}
exports.ComputeExponent = ComputeExponent;

},{"../utils":66,"./ComputeExponentForMagnitude":32,"./FormatNumericToString":35}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeExponentForMagnitude = void 0;
/**
 * The abstract operation ComputeExponentForMagnitude computes an exponent by which to scale a
 * number of the given magnitude (power of ten of the most significant digit) according to the
 * locale and the desired notation (scientific, engineering, or compact).
 */
function ComputeExponentForMagnitude(numberFormat, magnitude, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var internalSlots = getInternalSlots(numberFormat);
    var notation = internalSlots.notation, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
    switch (notation) {
        case 'standard':
            return 0;
        case 'scientific':
            return magnitude;
        case 'engineering':
            return Math.floor(magnitude / 3) * 3;
        default: {
            // Let exponent be an implementation- and locale-dependent (ILD) integer by which to scale a
            // number of the given magnitude in compact notation for the current locale.
            var compactDisplay = internalSlots.compactDisplay, style = internalSlots.style, currencyDisplay = internalSlots.currencyDisplay;
            var thresholdMap = void 0;
            if (style === 'currency' && currencyDisplay !== 'name') {
                var currency = dataLocaleData.numbers.currency[numberingSystem] ||
                    dataLocaleData.numbers.currency[dataLocaleData.numbers.nu[0]];
                thresholdMap = currency.short;
            }
            else {
                var decimal = dataLocaleData.numbers.decimal[numberingSystem] ||
                    dataLocaleData.numbers.decimal[dataLocaleData.numbers.nu[0]];
                thresholdMap = compactDisplay === 'long' ? decimal.long : decimal.short;
            }
            if (!thresholdMap) {
                return 0;
            }
            var num = String(Math.pow(10, magnitude));
            var thresholds = Object.keys(thresholdMap); // TODO: this can be pre-processed
            if (num < thresholds[0]) {
                return 0;
            }
            if (num > thresholds[thresholds.length - 1]) {
                return thresholds[thresholds.length - 1].length - 1;
            }
            var i = thresholds.indexOf(num);
            if (i === -1) {
                return 0;
            }
            // See https://unicode.org/reports/tr35/tr35-numbers.html#Compact_Number_Formats
            // Special handling if the pattern is precisely `0`.
            var magnitudeKey = thresholds[i];
            // TODO: do we need to handle plural here?
            var compactPattern = thresholdMap[magnitudeKey].other;
            if (compactPattern === '0') {
                return 0;
            }
            // Example: in zh-TW, `10000000` maps to `0000萬`. So we need to return 8 - 4 = 4 here.
            return (magnitudeKey.length -
                thresholdMap[magnitudeKey].other.match(/0+/)[0].length);
        }
    }
}
exports.ComputeExponentForMagnitude = ComputeExponentForMagnitude;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyDigits = void 0;
var _262_1 = require("../262");
/**
 * https://tc39.es/ecma402/#sec-currencydigits
 */
function CurrencyDigits(c, _a) {
    var currencyDigitsData = _a.currencyDigitsData;
    return _262_1.HasOwnProperty(currencyDigitsData, c)
        ? currencyDigitsData[c]
        : 2;
}
exports.CurrencyDigits = CurrencyDigits;

},{"../262":1}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericToParts = void 0;
var PartitionNumberPattern_1 = require("./PartitionNumberPattern");
var _262_1 = require("../262");
function FormatNumericToParts(nf, x, implDetails) {
    var parts = PartitionNumberPattern_1.PartitionNumberPattern(nf, x, implDetails);
    var result = _262_1.ArrayCreate(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result.push({
            type: part.type,
            value: part.value,
        });
    }
    return result;
}
exports.FormatNumericToParts = FormatNumericToParts;

},{"../262":1,"./PartitionNumberPattern":37}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericToString = void 0;
var _262_1 = require("../262");
var ToRawPrecision_1 = require("./ToRawPrecision");
var utils_1 = require("../utils");
var ToRawFixed_1 = require("./ToRawFixed");
/**
 * https://tc39.es/ecma402/#sec-formatnumberstring
 */
function FormatNumericToString(intlObject, x) {
    var isNegative = x < 0 || _262_1.SameValue(x, -0);
    if (isNegative) {
        x = -x;
    }
    var result;
    var rourndingType = intlObject.roundingType;
    switch (rourndingType) {
        case 'significantDigits':
            result = ToRawPrecision_1.ToRawPrecision(x, intlObject.minimumSignificantDigits, intlObject.maximumSignificantDigits);
            break;
        case 'fractionDigits':
            result = ToRawFixed_1.ToRawFixed(x, intlObject.minimumFractionDigits, intlObject.maximumFractionDigits);
            break;
        default:
            result = ToRawPrecision_1.ToRawPrecision(x, 1, 2);
            if (result.integerDigitsCount > 1) {
                result = ToRawFixed_1.ToRawFixed(x, 0, 0);
            }
            break;
    }
    x = result.roundedNumber;
    var string = result.formattedString;
    var int = result.integerDigitsCount;
    var minInteger = intlObject.minimumIntegerDigits;
    if (int < minInteger) {
        var forwardZeros = utils_1.repeat('0', minInteger - int);
        string = forwardZeros + string;
    }
    if (isNegative) {
        x = -x;
    }
    return { roundedNumber: x, formattedString: string };
}
exports.FormatNumericToString = FormatNumericToString;

},{"../262":1,"../utils":66,"./ToRawFixed":40,"./ToRawPrecision":41}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeNumberFormat = void 0;
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var _262_1 = require("../262");
var GetOption_1 = require("../GetOption");
var ResolveLocale_1 = require("../ResolveLocale");
var SetNumberFormatUnitOptions_1 = require("./SetNumberFormatUnitOptions");
var CurrencyDigits_1 = require("./CurrencyDigits");
var SetNumberFormatDigitOptions_1 = require("./SetNumberFormatDigitOptions");
var utils_1 = require("../utils");
/**
 * https://tc39.es/ecma402/#sec-initializenumberformat
 */
function InitializeNumberFormat(nf, locales, opts, _a) {
    var getInternalSlots = _a.getInternalSlots, localeData = _a.localeData, availableLocales = _a.availableLocales, numberingSystemNames = _a.numberingSystemNames, getDefaultLocale = _a.getDefaultLocale, currencyDigitsData = _a.currencyDigitsData;
    // @ts-ignore
    var requestedLocales = CanonicalizeLocaleList_1.CanonicalizeLocaleList(locales);
    var options = opts === undefined ? Object.create(null) : _262_1.ToObject(opts);
    var opt = Object.create(null);
    var matcher = GetOption_1.GetOption(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    opt.localeMatcher = matcher;
    var numberingSystem = GetOption_1.GetOption(options, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined &&
        numberingSystemNames.indexOf(numberingSystem) < 0) {
        // 8.a. If numberingSystem does not match the Unicode Locale Identifier type nonterminal,
        // throw a RangeError exception.
        throw RangeError("Invalid numberingSystems: " + numberingSystem);
    }
    opt.nu = numberingSystem;
    var r = ResolveLocale_1.ResolveLocale(availableLocales, requestedLocales, opt, 
    // [[RelevantExtensionKeys]] slot, which is a constant
    ['nu'], localeData, getDefaultLocale);
    var dataLocaleData = localeData[r.dataLocale];
    utils_1.invariant(!!dataLocaleData, "Missing locale data for " + r.dataLocale);
    var internalSlots = getInternalSlots(nf);
    internalSlots.locale = r.locale;
    internalSlots.dataLocale = r.dataLocale;
    internalSlots.numberingSystem = r.nu;
    internalSlots.dataLocaleData = dataLocaleData;
    SetNumberFormatUnitOptions_1.SetNumberFormatUnitOptions(nf, options, { getInternalSlots: getInternalSlots });
    var style = internalSlots.style;
    var mnfdDefault;
    var mxfdDefault;
    if (style === 'currency') {
        var currency = internalSlots.currency;
        var cDigits = CurrencyDigits_1.CurrencyDigits(currency, { currencyDigitsData: currencyDigitsData });
        mnfdDefault = cDigits;
        mxfdDefault = cDigits;
    }
    else {
        mnfdDefault = 0;
        mxfdDefault = style === 'percent' ? 0 : 3;
    }
    var notation = GetOption_1.GetOption(options, 'notation', 'string', ['standard', 'scientific', 'engineering', 'compact'], 'standard');
    internalSlots.notation = notation;
    SetNumberFormatDigitOptions_1.SetNumberFormatDigitOptions(internalSlots, options, mnfdDefault, mxfdDefault, notation);
    var compactDisplay = GetOption_1.GetOption(options, 'compactDisplay', 'string', ['short', 'long'], 'short');
    if (notation === 'compact') {
        internalSlots.compactDisplay = compactDisplay;
    }
    var useGrouping = GetOption_1.GetOption(options, 'useGrouping', 'boolean', undefined, true);
    internalSlots.useGrouping = useGrouping;
    var signDisplay = GetOption_1.GetOption(options, 'signDisplay', 'string', ['auto', 'never', 'always', 'exceptZero'], 'auto');
    internalSlots.signDisplay = signDisplay;
    return nf;
}
exports.InitializeNumberFormat = InitializeNumberFormat;

},{"../262":1,"../CanonicalizeLocaleList":4,"../GetOption":24,"../ResolveLocale":54,"../utils":66,"./CurrencyDigits":33,"./SetNumberFormatDigitOptions":38,"./SetNumberFormatUnitOptions":39}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionNumberPattern = void 0;
var tslib_1 = require("tslib");
var FormatNumericToString_1 = require("./FormatNumericToString");
var _262_1 = require("../262");
var ComputeExponent_1 = require("./ComputeExponent");
var format_to_parts_1 = tslib_1.__importDefault(require("./format_to_parts"));
/**
 * https://tc39.es/ecma402/#sec-formatnumberstring
 */
function PartitionNumberPattern(numberFormat, x, _a) {
    var _b;
    var getInternalSlots = _a.getInternalSlots;
    var internalSlots = getInternalSlots(numberFormat);
    var pl = internalSlots.pl, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
    var symbols = dataLocaleData.numbers.symbols[numberingSystem] ||
        dataLocaleData.numbers.symbols[dataLocaleData.numbers.nu[0]];
    var magnitude = 0;
    var exponent = 0;
    var n;
    if (isNaN(x)) {
        n = symbols.nan;
    }
    else if (!isFinite(x)) {
        n = symbols.infinity;
    }
    else {
        if (internalSlots.style === 'percent') {
            x *= 100;
        }
        _b = ComputeExponent_1.ComputeExponent(numberFormat, x, {
            getInternalSlots: getInternalSlots,
        }), exponent = _b[0], magnitude = _b[1];
        // Preserve more precision by doing multiplication when exponent is negative.
        x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
        var formatNumberResult = FormatNumericToString_1.FormatNumericToString(internalSlots, x);
        n = formatNumberResult.formattedString;
        x = formatNumberResult.roundedNumber;
    }
    // Based on https://tc39.es/ecma402/#sec-getnumberformatpattern
    // We need to do this before `x` is rounded.
    var sign;
    var signDisplay = internalSlots.signDisplay;
    switch (signDisplay) {
        case 'never':
            sign = 0;
            break;
        case 'auto':
            if (_262_1.SameValue(x, 0) || x > 0 || isNaN(x)) {
                sign = 0;
            }
            else {
                sign = -1;
            }
            break;
        case 'always':
            if (_262_1.SameValue(x, 0) || x > 0 || isNaN(x)) {
                sign = 1;
            }
            else {
                sign = -1;
            }
            break;
        default:
            // x === 0 -> x is 0 or x is -0
            if (x === 0 || isNaN(x)) {
                sign = 0;
            }
            else if (x > 0) {
                sign = 1;
            }
            else {
                sign = -1;
            }
    }
    return format_to_parts_1.default({ roundedNumber: x, formattedString: n, exponent: exponent, magnitude: magnitude, sign: sign }, internalSlots.dataLocaleData, pl, internalSlots);
}
exports.PartitionNumberPattern = PartitionNumberPattern;

},{"../262":1,"./ComputeExponent":31,"./FormatNumericToString":35,"./format_to_parts":43,"tslib":59}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNumberFormatDigitOptions = void 0;
var GetNumberOption_1 = require("../GetNumberOption");
var DefaultNumberOption_1 = require("../DefaultNumberOption");
/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 */
function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
    var mnid = GetNumberOption_1.GetNumberOption(opts, 'minimumIntegerDigits', 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    internalSlots.minimumIntegerDigits = mnid;
    if (mnsd !== undefined || mxsd !== undefined) {
        internalSlots.roundingType = 'significantDigits';
        mnsd = DefaultNumberOption_1.DefaultNumberOption(mnsd, 1, 21, 1);
        mxsd = DefaultNumberOption_1.DefaultNumberOption(mxsd, mnsd, 21, 21);
        internalSlots.minimumSignificantDigits = mnsd;
        internalSlots.maximumSignificantDigits = mxsd;
    }
    else if (mnfd !== undefined || mxfd !== undefined) {
        internalSlots.roundingType = 'fractionDigits';
        mnfd = DefaultNumberOption_1.DefaultNumberOption(mnfd, 0, 20, mnfdDefault);
        var mxfdActualDefault = Math.max(mnfd, mxfdDefault);
        mxfd = DefaultNumberOption_1.DefaultNumberOption(mxfd, mnfd, 20, mxfdActualDefault);
        internalSlots.minimumFractionDigits = mnfd;
        internalSlots.maximumFractionDigits = mxfd;
    }
    else if (notation === 'compact') {
        internalSlots.roundingType = 'compactRounding';
    }
    else {
        internalSlots.roundingType = 'fractionDigits';
        internalSlots.minimumFractionDigits = mnfdDefault;
        internalSlots.maximumFractionDigits = mxfdDefault;
    }
}
exports.SetNumberFormatDigitOptions = SetNumberFormatDigitOptions;

},{"../DefaultNumberOption":21,"../GetNumberOption":23}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNumberFormatUnitOptions = void 0;
var GetOption_1 = require("../GetOption");
var IsWellFormedCurrencyCode_1 = require("../IsWellFormedCurrencyCode");
var IsWellFormedUnitIdentifier_1 = require("../IsWellFormedUnitIdentifier");
/**
 * https://tc39.es/ecma402/#sec-setnumberformatunitoptions
 */
function SetNumberFormatUnitOptions(nf, options, _a) {
    if (options === void 0) { options = Object.create(null); }
    var getInternalSlots = _a.getInternalSlots;
    var internalSlots = getInternalSlots(nf);
    var style = GetOption_1.GetOption(options, 'style', 'string', ['decimal', 'percent', 'currency', 'unit'], 'decimal');
    internalSlots.style = style;
    var currency = GetOption_1.GetOption(options, 'currency', 'string', undefined, undefined);
    if (currency !== undefined && !IsWellFormedCurrencyCode_1.IsWellFormedCurrencyCode(currency)) {
        throw RangeError('Malformed currency code');
    }
    if (style === 'currency' && currency === undefined) {
        throw TypeError('currency cannot be undefined');
    }
    var currencyDisplay = GetOption_1.GetOption(options, 'currencyDisplay', 'string', ['code', 'symbol', 'narrowSymbol', 'name'], 'symbol');
    var currencySign = GetOption_1.GetOption(options, 'currencySign', 'string', ['standard', 'accounting'], 'standard');
    var unit = GetOption_1.GetOption(options, 'unit', 'string', undefined, undefined);
    if (unit !== undefined && !IsWellFormedUnitIdentifier_1.IsWellFormedUnitIdentifier(unit)) {
        throw RangeError('Invalid unit argument for Intl.NumberFormat()');
    }
    if (style === 'unit' && unit === undefined) {
        throw TypeError('unit cannot be undefined');
    }
    var unitDisplay = GetOption_1.GetOption(options, 'unitDisplay', 'string', ['short', 'narrow', 'long'], 'short');
    if (style === 'currency') {
        internalSlots.currency = currency.toUpperCase();
        internalSlots.currencyDisplay = currencyDisplay;
        internalSlots.currencySign = currencySign;
    }
    if (style === 'unit') {
        internalSlots.unit = unit;
        internalSlots.unitDisplay = unitDisplay;
    }
}
exports.SetNumberFormatUnitOptions = SetNumberFormatUnitOptions;

},{"../GetOption":24,"../IsWellFormedCurrencyCode":27,"../IsWellFormedUnitIdentifier":28}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToRawFixed = void 0;
var utils_1 = require("../utils");
/**
 * TODO: dedup with intl-pluralrules and support BigInt
 * https://tc39.es/ecma402/#sec-torawfixed
 * @param x a finite non-negative Number or BigInt
 * @param minFraction and integer between 0 and 20
 * @param maxFraction and integer between 0 and 20
 */
function ToRawFixed(x, minFraction, maxFraction) {
    var f = maxFraction;
    var n = Math.round(x * Math.pow(10, f));
    var xFinal = n / Math.pow(10, f);
    // n is a positive integer, but it is possible to be greater than 1e21.
    // In such case we will go the slow path.
    // See also: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
    var m;
    if (n < 1e21) {
        m = n.toString();
    }
    else {
        m = n.toString();
        var _a = m.split('e'), mantissa = _a[0], exponent = _a[1];
        m = mantissa.replace('.', '');
        m = m + utils_1.repeat('0', Math.max(+exponent - m.length + 1, 0));
    }
    var int;
    if (f !== 0) {
        var k = m.length;
        if (k <= f) {
            var z = utils_1.repeat('0', f + 1 - k);
            m = z + m;
            k = f + 1;
        }
        var a = m.slice(0, k - f);
        var b = m.slice(k - f);
        m = a + "." + b;
        int = a.length;
    }
    else {
        int = m.length;
    }
    var cut = maxFraction - minFraction;
    while (cut > 0 && m[m.length - 1] === '0') {
        m = m.slice(0, -1);
        cut--;
    }
    if (m[m.length - 1] === '.') {
        m = m.slice(0, -1);
    }
    return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
}
exports.ToRawFixed = ToRawFixed;

},{"../utils":66}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToRawPrecision = void 0;
var utils_1 = require("../utils");
function ToRawPrecision(x, minPrecision, maxPrecision) {
    var p = maxPrecision;
    var m;
    var e;
    var xFinal;
    if (x === 0) {
        m = utils_1.repeat('0', p);
        e = 0;
        xFinal = 0;
    }
    else {
        var xToString = x.toString();
        // If xToString is formatted as scientific notation, the number is either very small or very
        // large. If the precision of the formatted string is lower that requested max precision, we
        // should still infer them from the formatted string, otherwise the formatted result might have
        // precision loss (e.g. 1e41 will not have 0 in every trailing digits).
        var xToStringExponentIndex = xToString.indexOf('e');
        var _a = xToString.split('e'), xToStringMantissa = _a[0], xToStringExponent = _a[1];
        var xToStringMantissaWithoutDecimalPoint = xToStringMantissa.replace('.', '');
        if (xToStringExponentIndex >= 0 &&
            xToStringMantissaWithoutDecimalPoint.length <= p) {
            e = +xToStringExponent;
            m =
                xToStringMantissaWithoutDecimalPoint +
                    utils_1.repeat('0', p - xToStringMantissaWithoutDecimalPoint.length);
            xFinal = x;
        }
        else {
            e = utils_1.getMagnitude(x);
            var decimalPlaceOffset = e - p + 1;
            // n is the integer containing the required precision digits. To derive the formatted string,
            // we will adjust its decimal place in the logic below.
            var n = Math.round(adjustDecimalPlace(x, decimalPlaceOffset));
            // The rounding caused the change of magnitude, so we should increment `e` by 1.
            if (adjustDecimalPlace(n, p - 1) >= 10) {
                e = e + 1;
                // Divide n by 10 to swallow one precision.
                n = Math.floor(n / 10);
            }
            m = n.toString();
            // Equivalent of n * 10 ** (e - p + 1)
            xFinal = adjustDecimalPlace(n, p - 1 - e);
        }
    }
    var int;
    if (e >= p - 1) {
        m = m + utils_1.repeat('0', e - p + 1);
        int = e + 1;
    }
    else if (e >= 0) {
        m = m.slice(0, e + 1) + "." + m.slice(e + 1);
        int = e + 1;
    }
    else {
        m = "0." + utils_1.repeat('0', -e - 1) + m;
        int = 1;
    }
    if (m.indexOf('.') >= 0 && maxPrecision > minPrecision) {
        var cut = maxPrecision - minPrecision;
        while (cut > 0 && m[m.length - 1] === '0') {
            m = m.slice(0, -1);
            cut--;
        }
        if (m[m.length - 1] === '.') {
            m = m.slice(0, -1);
        }
    }
    return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
    // x / (10 ** magnitude), but try to preserve as much floating point precision as possible.
    function adjustDecimalPlace(x, magnitude) {
        return magnitude < 0 ? x * Math.pow(10, -magnitude) : x / Math.pow(10, magnitude);
    }
}
exports.ToRawPrecision = ToRawPrecision;

},{"../utils":66}],42:[function(require,module,exports){
module.exports={ "adlm": ["𞥐", "𞥑", "𞥒", "𞥓", "𞥔", "𞥕", "𞥖", "𞥗", "𞥘", "𞥙"], "ahom": ["𑜰", "𑜱", "𑜲", "𑜳", "𑜴", "𑜵", "𑜶", "𑜷", "𑜸", "𑜹"], "arab": ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"], "arabext": ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"], "bali": ["᭐", "᭑", "᭒", "᭓", "᭔", "᭕", "᭖", "᭗", "᭘", "᭙"], "beng": ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"], "bhks": ["𑱐", "𑱑", "𑱒", "𑱓", "𑱔", "𑱕", "𑱖", "𑱗", "𑱘", "𑱙"], "brah": ["𑁦", "𑁧", "𑁨", "𑁩", "𑁪", "𑁫", "𑁬", "𑁭", "𑁮", "𑁯"], "cakm": ["𑄶", "𑄷", "𑄸", "𑄹", "𑄺", "𑄻", "𑄼", "𑄽", "𑄾", "𑄿"], "cham": ["꩐", "꩑", "꩒", "꩓", "꩔", "꩕", "꩖", "꩗", "꩘", "꩙"], "deva": ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], "diak": ["𑥐", "𑥑", "𑥒", "𑥓", "𑥔", "𑥕", "𑥖", "𑥗", "𑥘", "𑥙"], "fullwide": ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"], "gong": ["𑶠", "𑶡", "𑶢", "𑶣", "𑶤", "𑶥", "𑶦", "𑶧", "𑶨", "𑶩"], "gonm": ["𑵐", "𑵑", "𑵒", "𑵓", "𑵔", "𑵕", "𑵖", "𑵗", "𑵘", "𑵙"], "gujr": ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"], "guru": ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"], "hanidec": ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"], "hmng": ["𖭐", "𖭑", "𖭒", "𖭓", "𖭔", "𖭕", "𖭖", "𖭗", "𖭘", "𖭙"], "hmnp": ["𞅀", "𞅁", "𞅂", "𞅃", "𞅄", "𞅅", "𞅆", "𞅇", "𞅈", "𞅉"], "java": ["꧐", "꧑", "꧒", "꧓", "꧔", "꧕", "꧖", "꧗", "꧘", "꧙"], "kali": ["꤀", "꤁", "꤂", "꤃", "꤄", "꤅", "꤆", "꤇", "꤈", "꤉"], "khmr": ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"], "knda": ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"], "lana": ["᪀", "᪁", "᪂", "᪃", "᪄", "᪅", "᪆", "᪇", "᪈", "᪉"], "lanatham": ["᪐", "᪑", "᪒", "᪓", "᪔", "᪕", "᪖", "᪗", "᪘", "᪙"], "laoo": ["໐", "໑", "໒", "໓", "໔", "໕", "໖", "໗", "໘", "໙"], "lepc": ["᪐", "᪑", "᪒", "᪓", "᪔", "᪕", "᪖", "᪗", "᪘", "᪙"], "limb": ["᥆", "᥇", "᥈", "᥉", "᥊", "᥋", "᥌", "᥍", "᥎", "᥏"], "mathbold": ["𝟎", "𝟏", "𝟐", "𝟑", "𝟒", "𝟓", "𝟔", "𝟕", "𝟖", "𝟗"], "mathdbl": ["𝟘", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡"], "mathmono": ["𝟶", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿"], "mathsanb": ["𝟬", "𝟭", "𝟮", "𝟯", "𝟰", "𝟱", "𝟲", "𝟳", "𝟴", "𝟵"], "mathsans": ["𝟢", "𝟣", "𝟤", "𝟥", "𝟦", "𝟧", "𝟨", "𝟩", "𝟪", "𝟫"], "mlym": ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"], "modi": ["𑙐", "𑙑", "𑙒", "𑙓", "𑙔", "𑙕", "𑙖", "𑙗", "𑙘", "𑙙"], "mong": ["᠐", "᠑", "᠒", "᠓", "᠔", "᠕", "᠖", "᠗", "᠘", "᠙"], "mroo": ["𖩠", "𖩡", "𖩢", "𖩣", "𖩤", "𖩥", "𖩦", "𖩧", "𖩨", "𖩩"], "mtei": ["꯰", "꯱", "꯲", "꯳", "꯴", "꯵", "꯶", "꯷", "꯸", "꯹"], "mymr": ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"], "mymrshan": ["႐", "႑", "႒", "႓", "႔", "႕", "႖", "႗", "႘", "႙"], "mymrtlng": ["꧰", "꧱", "꧲", "꧳", "꧴", "꧵", "꧶", "꧷", "꧸", "꧹"], "newa": ["𑑐", "𑑑", "𑑒", "𑑓", "𑑔", "𑑕", "𑑖", "𑑗", "𑑘", "𑑙"], "nkoo": ["߀", "߁", "߂", "߃", "߄", "߅", "߆", "߇", "߈", "߉"], "olck": ["᱐", "᱑", "᱒", "᱓", "᱔", "᱕", "᱖", "᱗", "᱘", "᱙"], "orya": ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"], "osma": ["𐒠", "𐒡", "𐒢", "𐒣", "𐒤", "𐒥", "𐒦", "𐒧", "𐒨", "𐒩"], "rohg": ["𐴰", "𐴱", "𐴲", "𐴳", "𐴴", "𐴵", "𐴶", "𐴷", "𐴸", "𐴹"], "saur": ["꣐", "꣑", "꣒", "꣓", "꣔", "꣕", "꣖", "꣗", "꣘", "꣙"], "segment": ["🯰", "🯱", "🯲", "🯳", "🯴", "🯵", "🯶", "🯷", "🯸", "🯹"], "shrd": ["𑇐", "𑇑", "𑇒", "𑇓", "𑇔", "𑇕", "𑇖", "𑇗", "𑇘", "𑇙"], "sind": ["𑋰", "𑋱", "𑋲", "𑋳", "𑋴", "𑋵", "𑋶", "𑋷", "𑋸", "𑋹"], "sinh": ["෦", "෧", "෨", "෩", "෪", "෫", "෬", "෭", "෮", "෯"], "sora": ["𑃰", "𑃱", "𑃲", "𑃳", "𑃴", "𑃵", "𑃶", "𑃷", "𑃸", "𑃹"], "sund": ["᮰", "᮱", "᮲", "᮳", "᮴", "᮵", "᮶", "᮷", "᮸", "᮹"], "takr": ["𑛀", "𑛁", "𑛂", "𑛃", "𑛄", "𑛅", "𑛆", "𑛇", "𑛈", "𑛉"], "talu": ["᧐", "᧑", "᧒", "᧓", "᧔", "᧕", "᧖", "᧗", "᧘", "᧙"], "tamldec": ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"], "telu": ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"], "thai": ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"], "tibt": ["༠", "༡", "༢", "༣", "༤", "༥", "༦", "༧", "༨", "༩"], "tirh": ["𑓐", "𑓑", "𑓒", "𑓓", "𑓔", "𑓕", "𑓖", "𑓗", "𑓘", "𑓙"], "vaii": ["ᘠ", "ᘡ", "ᘢ", "ᘣ", "ᘤ", "ᘥ", "ᘦ", "ᘧ", "ᘨ", "ᘩ"], "wara": ["𑣠", "𑣡", "𑣢", "𑣣", "𑣤", "𑣥", "𑣦", "𑣧", "𑣨", "𑣩"], "wcho": ["𞋰", "𞋱", "𞋲", "𞋳", "𞋴", "𞋵", "𞋶", "𞋷", "𞋸", "𞋹"] }

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ToRawFixed_1 = require("./ToRawFixed");
var digitMapping = tslib_1.__importStar(require("./digit-mapping.json"));
// This is from: unicode-12.1.0/General_Category/Symbol/regex.js
// IE11 does not support unicode flag, otherwise this is just /\p{S}/u.
var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B98-\u2BFF\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9B\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD10-\uDD6C\uDD70-\uDDAC\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED5\uDEE0-\uDEEC\uDEF0-\uDEFA\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDD00-\uDD0B\uDD0D-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95]/;
// /^\p{S}/u
var CARET_S_UNICODE_REGEX = new RegExp("^" + S_UNICODE_REGEX.source);
// /\p{S}$/u
var S_DOLLAR_UNICODE_REGEX = new RegExp(S_UNICODE_REGEX.source + "$");
var CLDR_NUMBER_PATTERN = /[#0](?:[\.,][#0]+)*/g;
function formatToParts(numberResult, data, pl, options) {
    var sign = numberResult.sign, exponent = numberResult.exponent, magnitude = numberResult.magnitude;
    var notation = options.notation, style = options.style, numberingSystem = options.numberingSystem;
    var defaultNumberingSystem = data.numbers.nu[0];
    // #region Part 1: partition and interpolate the CLDR number pattern.
    // ----------------------------------------------------------
    var compactNumberPattern = null;
    if (notation === 'compact' && magnitude) {
        compactNumberPattern = getCompactDisplayPattern(numberResult, pl, data, style, options.compactDisplay, options.currencyDisplay, numberingSystem);
    }
    // This is used multiple times
    var nonNameCurrencyPart;
    if (style === 'currency' && options.currencyDisplay !== 'name') {
        var byCurrencyDisplay = data.currencies[options.currency];
        if (byCurrencyDisplay) {
            switch (options.currencyDisplay) {
                case 'code':
                    nonNameCurrencyPart = options.currency;
                    break;
                case 'symbol':
                    nonNameCurrencyPart = byCurrencyDisplay.symbol;
                    break;
                default:
                    nonNameCurrencyPart = byCurrencyDisplay.narrow;
                    break;
            }
        }
        else {
            // Fallback for unknown currency
            nonNameCurrencyPart = options.currency;
        }
    }
    var numberPattern;
    if (!compactNumberPattern) {
        // Note: if the style is unit, or is currency and the currency display is name,
        // its unit parts will be interpolated in part 2. So here we can fallback to decimal.
        if (style === 'decimal' ||
            style === 'unit' ||
            (style === 'currency' && options.currencyDisplay === 'name')) {
            // Shortcut for decimal
            var decimalData = data.numbers.decimal[numberingSystem] ||
                data.numbers.decimal[defaultNumberingSystem];
            numberPattern = getPatternForSign(decimalData.standard, sign);
        }
        else if (style === 'currency') {
            var currencyData = data.numbers.currency[numberingSystem] ||
                data.numbers.currency[defaultNumberingSystem];
            // We replace number pattern part with `0` for easier postprocessing.
            numberPattern = getPatternForSign(currencyData[options.currencySign], sign);
        }
        else {
            // percent
            var percentPattern = data.numbers.percent[numberingSystem] ||
                data.numbers.percent[defaultNumberingSystem];
            numberPattern = getPatternForSign(percentPattern, sign);
        }
    }
    else {
        numberPattern = compactNumberPattern;
    }
    // Extract the decimal number pattern string. It looks like "#,##0,00", which will later be
    // used to infer decimal group sizes.
    var decimalNumberPattern = CLDR_NUMBER_PATTERN.exec(numberPattern)[0];
    // Now we start to substitute patterns
    // 1. replace strings like `0` and `#,##0.00` with `{0}`
    // 2. unquote characters (invariant: the quoted characters does not contain the special tokens)
    numberPattern = numberPattern
        .replace(CLDR_NUMBER_PATTERN, '{0}')
        .replace(/'(.)'/g, '$1');
    // Handle currency spacing (both compact and non-compact).
    if (style === 'currency' && options.currencyDisplay !== 'name') {
        var currencyData = data.numbers.currency[numberingSystem] ||
            data.numbers.currency[defaultNumberingSystem];
        // See `currencySpacing` substitution rule in TR-35.
        // Here we always assume the currencyMatch is "[:^S:]" and surroundingMatch is "[:digit:]".
        //
        // Example 1: for pattern "#,##0.00¤" with symbol "US$", we replace "¤" with the symbol,
        // but insert an extra non-break space before the symbol, because "[:^S:]" matches "U" in
        // "US$" and "[:digit:]" matches the latn numbering system digits.
        //
        // Example 2: for pattern "¤#,##0.00" with symbol "US$", there is no spacing between symbol
        // and number, because `$` does not match "[:^S:]".
        //
        // Implementation note: here we do the best effort to infer the insertion.
        // We also assume that `beforeInsertBetween` and `afterInsertBetween` will never be `;`.
        var afterCurrency = currencyData.currencySpacing.afterInsertBetween;
        if (afterCurrency && !S_DOLLAR_UNICODE_REGEX.test(nonNameCurrencyPart)) {
            numberPattern = numberPattern.replace('¤{0}', "\u00A4" + afterCurrency + "{0}");
        }
        var beforeCurrency = currencyData.currencySpacing.beforeInsertBetween;
        if (beforeCurrency && !CARET_S_UNICODE_REGEX.test(nonNameCurrencyPart)) {
            numberPattern = numberPattern.replace('{0}¤', "{0}" + beforeCurrency + "\u00A4");
        }
    }
    // The following tokens are special: `{0}`, `¤`, `%`, `-`, `+`, `{c:...}.
    var numberPatternParts = numberPattern.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g);
    var numberParts = [];
    var symbols = data.numbers.symbols[numberingSystem] ||
        data.numbers.symbols[defaultNumberingSystem];
    for (var _i = 0, numberPatternParts_1 = numberPatternParts; _i < numberPatternParts_1.length; _i++) {
        var part = numberPatternParts_1[_i];
        if (!part) {
            continue;
        }
        switch (part) {
            case '{0}': {
                // We only need to handle scientific and engineering notation here.
                numberParts.push.apply(numberParts, paritionNumberIntoParts(symbols, numberResult, notation, exponent, numberingSystem, 
                // If compact number pattern exists, do not insert group separators.
                !compactNumberPattern && options.useGrouping, decimalNumberPattern));
                break;
            }
            case '-':
                numberParts.push({ type: 'minusSign', value: symbols.minusSign });
                break;
            case '+':
                numberParts.push({ type: 'plusSign', value: symbols.plusSign });
                break;
            case '%':
                numberParts.push({ type: 'percentSign', value: symbols.percentSign });
                break;
            case '¤':
                // Computed above when handling currency spacing.
                numberParts.push({ type: 'currency', value: nonNameCurrencyPart });
                break;
            default:
                if (/^\{c:/.test(part)) {
                    numberParts.push({
                        type: 'compact',
                        value: part.substring(3, part.length - 1),
                    });
                }
                else {
                    // literal
                    numberParts.push({ type: 'literal', value: part });
                }
                break;
        }
    }
    // #endregion
    // #region Part 2: interpolate unit pattern if necessary.
    // ----------------------------------------------
    switch (style) {
        case 'currency': {
            // `currencyDisplay: 'name'` has similar pattern handling as units.
            if (options.currencyDisplay === 'name') {
                var unitPattern = (data.numbers.currency[numberingSystem] ||
                    data.numbers.currency[defaultNumberingSystem]).unitPattern;
                // Select plural
                var unitName = void 0;
                var currencyNameData = data.currencies[options.currency];
                if (currencyNameData) {
                    unitName = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), currencyNameData.displayName);
                }
                else {
                    // Fallback for unknown currency
                    unitName = options.currency;
                }
                // Do {0} and {1} substitution
                var unitPatternParts = unitPattern.split(/(\{[01]\})/g);
                var result = [];
                for (var _a = 0, unitPatternParts_1 = unitPatternParts; _a < unitPatternParts_1.length; _a++) {
                    var part = unitPatternParts_1[_a];
                    switch (part) {
                        case '{0}':
                            result.push.apply(result, numberParts);
                            break;
                        case '{1}':
                            result.push({ type: 'currency', value: unitName });
                            break;
                        default:
                            if (part) {
                                result.push({ type: 'literal', value: part });
                            }
                            break;
                    }
                }
                return result;
            }
            else {
                return numberParts;
            }
        }
        case 'unit': {
            var unit = options.unit, unitDisplay = options.unitDisplay;
            var unitData = data.units.simple[unit];
            var unitPattern = void 0;
            if (unitData) {
                // Simple unit pattern
                unitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data.units.simple[unit][unitDisplay]);
            }
            else {
                // See: http://unicode.org/reports/tr35/tr35-general.html#perUnitPatterns
                // If cannot find unit in the simple pattern, it must be "per" compound pattern.
                // Implementation note: we are not following TR-35 here because we need to format to parts!
                var _b = unit.split('-per-'), numeratorUnit = _b[0], denominatorUnit = _b[1];
                unitData = data.units.simple[numeratorUnit];
                var numeratorUnitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data.units.simple[numeratorUnit][unitDisplay]);
                var perUnitPattern = data.units.simple[denominatorUnit].perUnit[unitDisplay];
                if (perUnitPattern) {
                    // perUnitPattern exists, combine it with numeratorUnitPattern
                    unitPattern = perUnitPattern.replace('{0}', numeratorUnitPattern);
                }
                else {
                    // get compoundUnit pattern (e.g. "{0} per {1}"), repalce {0} with numerator pattern and {1} with
                    // the denominator pattern in singular form.
                    var perPattern = data.units.compound.per[unitDisplay];
                    var denominatorPattern = selectPlural(pl, 1, data.units.simple[denominatorUnit][unitDisplay]);
                    unitPattern = unitPattern = perPattern
                        .replace('{0}', numeratorUnitPattern)
                        .replace('{1}', denominatorPattern.replace('{0}', ''));
                }
            }
            var result = [];
            // We need spacing around "{0}" because they are not treated as "unit" parts, but "literal".
            for (var _c = 0, _d = unitPattern.split(/(\s*\{0\}\s*)/); _c < _d.length; _c++) {
                var part = _d[_c];
                var interpolateMatch = /^(\s*)\{0\}(\s*)$/.exec(part);
                if (interpolateMatch) {
                    // Space before "{0}"
                    if (interpolateMatch[1]) {
                        result.push({ type: 'literal', value: interpolateMatch[1] });
                    }
                    // "{0}" itself
                    result.push.apply(result, numberParts);
                    // Space after "{0}"
                    if (interpolateMatch[2]) {
                        result.push({ type: 'literal', value: interpolateMatch[2] });
                    }
                }
                else if (part) {
                    result.push({ type: 'unit', value: part });
                }
            }
            return result;
        }
        default:
            return numberParts;
    }
    // #endregion
}
exports.default = formatToParts;
// A subset of https://tc39.es/ecma402/#sec-partitionnotationsubpattern
// Plus the exponent parts handling.
function paritionNumberIntoParts(symbols, numberResult, notation, exponent, numberingSystem, useGrouping, 
/**
 * This is the decimal number pattern without signs or symbols.
 * It is used to infer the group size when `useGrouping` is true.
 *
 * A typical value looks like "#,##0.00" (primary group size is 3).
 * Some locales like Hindi has secondary group size of 2 (e.g. "#,##,##0.00").
 */
decimalNumberPattern) {
    var result = [];
    // eslint-disable-next-line prefer-const
    var n = numberResult.formattedString, x = numberResult.roundedNumber;
    if (isNaN(x)) {
        return [{ type: 'nan', value: n }];
    }
    else if (!isFinite(x)) {
        return [{ type: 'infinity', value: n }];
    }
    var digitReplacementTable = digitMapping[numberingSystem];
    if (digitReplacementTable) {
        n = n.replace(/\d/g, function (digit) { return digitReplacementTable[+digit] || digit; });
    }
    // TODO: Else use an implementation dependent algorithm to map n to the appropriate
    // representation of n in the given numbering system.
    var decimalSepIndex = n.indexOf('.');
    var integer;
    var fraction;
    if (decimalSepIndex > 0) {
        integer = n.slice(0, decimalSepIndex);
        fraction = n.slice(decimalSepIndex + 1);
    }
    else {
        integer = n;
    }
    // #region Grouping integer digits
    // The weird compact and x >= 10000 check is to ensure consistency with Node.js and Chrome.
    // Note that `de` does not have compact form for thousands, but Node.js does not insert grouping separator
    // unless the rounded number is greater than 10000:
    //   NumberFormat('de', {notation: 'compact', compactDisplay: 'short'}).format(1234) //=> "1234"
    //   NumberFormat('de').format(1234) //=> "1.234"
    if (useGrouping && (notation !== 'compact' || x >= 10000)) {
        var groupSepSymbol = symbols.group;
        var groups = [];
        // > There may be two different grouping sizes: The primary grouping size used for the least
        // > significant integer group, and the secondary grouping size used for more significant groups.
        // > If a pattern contains multiple grouping separators, the interval between the last one and the
        // > end of the integer defines the primary grouping size, and the interval between the last two
        // > defines the secondary grouping size. All others are ignored.
        var integerNumberPattern = decimalNumberPattern.split('.')[0];
        var patternGroups = integerNumberPattern.split(',');
        var primaryGroupingSize = 3;
        var secondaryGroupingSize = 3;
        if (patternGroups.length > 1) {
            primaryGroupingSize = patternGroups[patternGroups.length - 1].length;
        }
        if (patternGroups.length > 2) {
            secondaryGroupingSize = patternGroups[patternGroups.length - 2].length;
        }
        var i = integer.length - primaryGroupingSize;
        if (i > 0) {
            // Slice the least significant integer group
            groups.push(integer.slice(i, i + primaryGroupingSize));
            // Then iteratively push the more signicant groups
            // TODO: handle surrogate pairs in some numbering system digits
            for (i -= secondaryGroupingSize; i > 0; i -= secondaryGroupingSize) {
                groups.push(integer.slice(i, i + secondaryGroupingSize));
            }
            groups.push(integer.slice(0, i + secondaryGroupingSize));
        }
        else {
            groups.push(integer);
        }
        while (groups.length > 0) {
            var integerGroup = groups.pop();
            result.push({ type: 'integer', value: integerGroup });
            if (groups.length > 0) {
                result.push({ type: 'group', value: groupSepSymbol });
            }
        }
    }
    else {
        result.push({ type: 'integer', value: integer });
    }
    // #endregion
    if (fraction !== undefined) {
        result.push({ type: 'decimal', value: symbols.decimal }, { type: 'fraction', value: fraction });
    }
    if ((notation === 'scientific' || notation === 'engineering') &&
        isFinite(x)) {
        result.push({ type: 'exponentSeparator', value: symbols.exponential });
        if (exponent < 0) {
            result.push({ type: 'exponentMinusSign', value: symbols.minusSign });
            exponent = -exponent;
        }
        var exponentResult = ToRawFixed_1.ToRawFixed(exponent, 0, 0);
        result.push({
            type: 'exponentInteger',
            value: exponentResult.formattedString,
        });
    }
    return result;
}
function getPatternForSign(pattern, sign) {
    if (pattern.indexOf(';') < 0) {
        pattern = pattern + ";-" + pattern;
    }
    var _a = pattern.split(';'), zeroPattern = _a[0], negativePattern = _a[1];
    switch (sign) {
        case 0:
            return zeroPattern;
        case -1:
            return negativePattern;
        default:
            return negativePattern.indexOf('-') >= 0
                ? negativePattern.replace(/-/g, '+')
                : "+" + zeroPattern;
    }
}
// Find the CLDR pattern for compact notation based on the magnitude of data and style.
//
// Example return value: "¤ {c:laki}000;¤{c:laki} -0" (`sw` locale):
// - Notice the `{c:...}` token that wraps the compact literal.
// - The consecutive zeros are normalized to single zero to match CLDR_NUMBER_PATTERN.
//
// Returning null means the compact display pattern cannot be found.
function getCompactDisplayPattern(numberResult, pl, data, style, compactDisplay, currencyDisplay, numberingSystem) {
    var _a;
    var roundedNumber = numberResult.roundedNumber, sign = numberResult.sign, magnitude = numberResult.magnitude;
    var magnitudeKey = String(Math.pow(10, magnitude));
    var defaultNumberingSystem = data.numbers.nu[0];
    var pattern;
    if (style === 'currency' && currencyDisplay !== 'name') {
        var byNumberingSystem = data.numbers.currency;
        var currencyData = byNumberingSystem[numberingSystem] ||
            byNumberingSystem[defaultNumberingSystem];
        // NOTE: compact notation ignores currencySign!
        var compactPluralRules = (_a = currencyData.short) === null || _a === void 0 ? void 0 : _a[magnitudeKey];
        if (!compactPluralRules) {
            return null;
        }
        pattern = selectPlural(pl, roundedNumber, compactPluralRules);
    }
    else {
        var byNumberingSystem = data.numbers.decimal;
        var byCompactDisplay = byNumberingSystem[numberingSystem] ||
            byNumberingSystem[defaultNumberingSystem];
        var compactPlaralRule = byCompactDisplay[compactDisplay][magnitudeKey];
        if (!compactPlaralRule) {
            return null;
        }
        pattern = selectPlural(pl, roundedNumber, compactPlaralRule);
    }
    // See https://unicode.org/reports/tr35/tr35-numbers.html#Compact_Number_Formats
    // > If the value is precisely “0”, either explicit or defaulted, then the normal number format
    // > pattern for that sort of object is supplied.
    if (pattern === '0') {
        return null;
    }
    pattern = getPatternForSign(pattern, sign)
        // Extract compact literal from the pattern
        .replace(/([^\s;\-\+\d¤]+)/g, '{c:$1}')
        // We replace one or more zeros with a single zero so it matches `CLDR_NUMBER_PATTERN`.
        .replace(/0+/, '0');
    return pattern;
}
function selectPlural(pl, x, rules) {
    return rules[pl.select(x)] || rules.other;
}

},{"./ToRawFixed":40,"./digit-mapping.json":42,"tslib":59}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionPattern = void 0;
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-partitionpattern
 * @param pattern
 */
function PartitionPattern(pattern) {
    var result = [];
    var beginIndex = pattern.indexOf('{');
    var endIndex = 0;
    var nextIndex = 0;
    var length = pattern.length;
    while (beginIndex < pattern.length && beginIndex > -1) {
        endIndex = pattern.indexOf('}', beginIndex);
        utils_1.invariant(endIndex > beginIndex, "Invalid pattern " + pattern);
        if (beginIndex > nextIndex) {
            result.push({
                type: 'literal',
                value: pattern.substring(nextIndex, beginIndex),
            });
        }
        result.push({
            type: pattern.substring(beginIndex + 1, endIndex),
            value: undefined,
        });
        nextIndex = endIndex + 1;
        beginIndex = pattern.indexOf('{', nextIndex);
    }
    if (nextIndex < length) {
        result.push({
            type: 'literal',
            value: pattern.substring(nextIndex, length),
        });
    }
    return result;
}
exports.PartitionPattern = PartitionPattern;

},{"./utils":66}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOperands = void 0;
var utils_1 = require("../utils");
var _262_1 = require("../262");
/**
 * http://ecma-international.org/ecma-402/7.0/index.html#sec-getoperands
 * @param s
 */
function GetOperands(s) {
    utils_1.invariant(typeof s === 'string', "GetOperands should have been called with a string");
    var n = _262_1.ToNumber(s);
    utils_1.invariant(isFinite(n), 'n should be finite');
    var dp = s.indexOf('.');
    var iv;
    var f;
    var v;
    var fv = '';
    if (dp === -1) {
        iv = n;
        f = 0;
        v = 0;
    }
    else {
        iv = s.slice(0, dp);
        fv = s.slice(dp, s.length);
        f = _262_1.ToNumber(fv);
        v = fv.length;
    }
    var i = Math.abs(_262_1.ToNumber(iv));
    var w;
    var t;
    if (f !== 0) {
        var ft = fv.replace(/0+$/, '');
        w = ft.length;
        t = _262_1.ToNumber(ft);
    }
    else {
        w = 0;
        t = 0;
    }
    return {
        Number: n,
        IntegerDigits: i,
        NumberOfFractionDigits: v,
        NumberOfFractionDigitsWithoutTrailing: w,
        FractionDigits: f,
        FractionDigitsWithoutTrailing: t,
    };
}
exports.GetOperands = GetOperands;

},{"../262":1,"../utils":66}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializePluralRules = void 0;
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var _262_1 = require("../262");
var GetOption_1 = require("../GetOption");
var SetNumberFormatDigitOptions_1 = require("../NumberFormat/SetNumberFormatDigitOptions");
var ResolveLocale_1 = require("../ResolveLocale");
function InitializePluralRules(pl, locales, options, _a) {
    var availableLocales = _a.availableLocales, relevantExtensionKeys = _a.relevantExtensionKeys, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale, getInternalSlots = _a.getInternalSlots;
    var requestedLocales = CanonicalizeLocaleList_1.CanonicalizeLocaleList(locales);
    var opt = Object.create(null);
    var opts = options === undefined ? Object.create(null) : _262_1.ToObject(options);
    var internalSlots = getInternalSlots(pl);
    internalSlots.initializedPluralRules = true;
    var matcher = GetOption_1.GetOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
    opt.localeMatcher = matcher;
    internalSlots.type = GetOption_1.GetOption(opts, 'type', 'string', ['cardinal', 'ordinal'], 'cardinal');
    SetNumberFormatDigitOptions_1.SetNumberFormatDigitOptions(internalSlots, opts, 0, 3, 'standard');
    var r = ResolveLocale_1.ResolveLocale(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
    internalSlots.locale = r.locale;
    return pl;
}
exports.InitializePluralRules = InitializePluralRules;

},{"../262":1,"../CanonicalizeLocaleList":4,"../GetOption":24,"../NumberFormat/SetNumberFormatDigitOptions":38,"../ResolveLocale":54}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePlural = void 0;
var utils_1 = require("../utils");
var _262_1 = require("../262");
var FormatNumericToString_1 = require("../NumberFormat/FormatNumericToString");
var GetOperands_1 = require("./GetOperands");
/**
 * http://ecma-international.org/ecma-402/7.0/index.html#sec-resolveplural
 * @param pl
 * @param n
 * @param PluralRuleSelect Has to pass in bc it's implementation-specific
 */
function ResolvePlural(pl, n, _a) {
    var getInternalSlots = _a.getInternalSlots, PluralRuleSelect = _a.PluralRuleSelect;
    var internalSlots = getInternalSlots(pl);
    utils_1.invariant(_262_1.Type(internalSlots) === 'Object', 'pl has to be an object');
    utils_1.invariant('initializedPluralRules' in internalSlots, 'pluralrules must be initialized');
    utils_1.invariant(_262_1.Type(n) === 'Number', 'n must be a number');
    if (!isFinite(n)) {
        return 'other';
    }
    var locale = internalSlots.locale, type = internalSlots.type;
    var res = FormatNumericToString_1.FormatNumericToString(internalSlots, n);
    var s = res.formattedString;
    var operands = GetOperands_1.GetOperands(s);
    return PluralRuleSelect(locale, type, n, operands);
}
exports.ResolvePlural = ResolvePlural;

},{"../262":1,"../NumberFormat/FormatNumericToString":35,"../utils":66,"./GetOperands":45}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatRelativeTime = void 0;
var PartitionRelativeTimePattern_1 = require("./PartitionRelativeTimePattern");
function FormatRelativeTime(rtf, value, unit, implDetails) {
    var parts = PartitionRelativeTimePattern_1.PartitionRelativeTimePattern(rtf, value, unit, implDetails);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result += part.value;
    }
    return result;
}
exports.FormatRelativeTime = FormatRelativeTime;

},{"./PartitionRelativeTimePattern":52}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatRelativeTimeToParts = void 0;
var PartitionRelativeTimePattern_1 = require("./PartitionRelativeTimePattern");
var _262_1 = require("../262");
function FormatRelativeTimeToParts(rtf, value, unit, implDetails) {
    var parts = PartitionRelativeTimePattern_1.PartitionRelativeTimePattern(rtf, value, unit, implDetails);
    var result = _262_1.ArrayCreate(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        var o = {
            type: part.type,
            value: part.value,
        };
        if ('unit' in part) {
            o.unit = part.unit;
        }
        result.push(o);
    }
    return result;
}
exports.FormatRelativeTimeToParts = FormatRelativeTimeToParts;

},{"../262":1,"./PartitionRelativeTimePattern":52}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeRelativeTimeFormat = void 0;
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var _262_1 = require("../262");
var GetOption_1 = require("../GetOption");
var ResolveLocale_1 = require("../ResolveLocale");
var utils_1 = require("../utils");
var NUMBERING_SYSTEM_REGEX = /^[a-z0-9]{3,8}(-[a-z0-9]{3,8})*$/i;
function InitializeRelativeTimeFormat(rtf, locales, options, _a) {
    var getInternalSlots = _a.getInternalSlots, availableLocales = _a.availableLocales, relevantExtensionKeys = _a.relevantExtensionKeys, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale;
    var internalSlots = getInternalSlots(rtf);
    internalSlots.initializedRelativeTimeFormat = true;
    var requestedLocales = CanonicalizeLocaleList_1.CanonicalizeLocaleList(locales);
    var opt = Object.create(null);
    var opts = options === undefined ? Object.create(null) : _262_1.ToObject(options);
    var matcher = GetOption_1.GetOption(opts, 'localeMatcher', 'string', ['best fit', 'lookup'], 'best fit');
    opt.localeMatcher = matcher;
    var numberingSystem = GetOption_1.GetOption(opts, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined) {
        if (!NUMBERING_SYSTEM_REGEX.test(numberingSystem)) {
            throw new RangeError("Invalid numbering system " + numberingSystem);
        }
    }
    opt.nu = numberingSystem;
    var r = ResolveLocale_1.ResolveLocale(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
    var locale = r.locale, nu = r.nu;
    internalSlots.locale = locale;
    internalSlots.style = GetOption_1.GetOption(opts, 'style', 'string', ['long', 'narrow', 'short'], 'long');
    internalSlots.numeric = GetOption_1.GetOption(opts, 'numeric', 'string', ['always', 'auto'], 'always');
    var fields = localeData[r.dataLocale];
    utils_1.invariant(!!fields, "Missing locale data for " + r.dataLocale);
    internalSlots.fields = fields;
    internalSlots.numberFormat = new Intl.NumberFormat(locales);
    internalSlots.pluralRules = new Intl.PluralRules(locales);
    internalSlots.numberingSystem = nu;
    return rtf;
}
exports.InitializeRelativeTimeFormat = InitializeRelativeTimeFormat;

},{"../262":1,"../CanonicalizeLocaleList":4,"../GetOption":24,"../ResolveLocale":54,"../utils":66}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakePartsList = void 0;
var PartitionPattern_1 = require("../PartitionPattern");
var utils_1 = require("../utils");
function MakePartsList(pattern, unit, parts) {
    var patternParts = PartitionPattern_1.PartitionPattern(pattern);
    var result = [];
    for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
        var patternPart = patternParts_1[_i];
        if (patternPart.type === 'literal') {
            result.push({
                type: 'literal',
                value: patternPart.value,
            });
        }
        else {
            utils_1.invariant(patternPart.type === '0', "Malformed pattern " + pattern);
            for (var _a = 0, parts_1 = parts; _a < parts_1.length; _a++) {
                var part = parts_1[_a];
                result.push({
                    type: part.type,
                    value: part.value,
                    unit: unit,
                });
            }
        }
    }
    return result;
}
exports.MakePartsList = MakePartsList;

},{"../PartitionPattern":44,"../utils":66}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionRelativeTimePattern = void 0;
var utils_1 = require("../utils");
var SingularRelativeTimeUnit_1 = require("./SingularRelativeTimeUnit");
var MakePartsList_1 = require("./MakePartsList");
var _262_1 = require("../262");
function PartitionRelativeTimePattern(rtf, value, unit, _a) {
    var getInternalSlots = _a.getInternalSlots;
    utils_1.invariant(_262_1.Type(value) === 'Number', "value must be number, instead got " + typeof value, TypeError);
    utils_1.invariant(_262_1.Type(unit) === 'String', "unit must be number, instead got " + typeof value, TypeError);
    if (isNaN(value) || !isFinite(value)) {
        throw new RangeError("Invalid value " + value);
    }
    var resolvedUnit = SingularRelativeTimeUnit_1.SingularRelativeTimeUnit(unit);
    var _b = getInternalSlots(rtf), fields = _b.fields, style = _b.style, numeric = _b.numeric, pluralRules = _b.pluralRules, numberFormat = _b.numberFormat;
    var entry = resolvedUnit;
    if (style === 'short') {
        entry = resolvedUnit + "-short";
    }
    else if (style === 'narrow') {
        entry = resolvedUnit + "-narrow";
    }
    if (!(entry in fields)) {
        entry = resolvedUnit;
    }
    var patterns = fields[entry];
    if (numeric === 'auto') {
        if (_262_1.ToString(value) in patterns) {
            return [
                {
                    type: 'literal',
                    value: patterns[_262_1.ToString(value)],
                },
            ];
        }
    }
    var tl = 'future';
    if (_262_1.SameValue(value, -0) || value < 0) {
        tl = 'past';
    }
    var po = patterns[tl];
    var fv = typeof numberFormat.formatToParts === 'function'
        ? numberFormat.formatToParts(Math.abs(value))
        : // TODO: If formatToParts is not supported, we assume the whole formatted
            // number is a part
            [
                {
                    type: 'literal',
                    value: numberFormat.format(Math.abs(value)),
                    unit: unit,
                },
            ];
    var pr = pluralRules.select(value);
    var pattern = po[pr];
    return MakePartsList_1.MakePartsList(pattern, resolvedUnit, fv);
}
exports.PartitionRelativeTimePattern = PartitionRelativeTimePattern;

},{"../262":1,"../utils":66,"./MakePartsList":51,"./SingularRelativeTimeUnit":53}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingularRelativeTimeUnit = void 0;
var utils_1 = require("../utils");
var _262_1 = require("../262");
/**
 * https://tc39.es/proposal-intl-relative-time/#sec-singularrelativetimeunit
 * @param unit
 */
function SingularRelativeTimeUnit(unit) {
    utils_1.invariant(_262_1.Type(unit) === 'String', 'unit must be a string');
    if (unit === 'seconds')
        return 'second';
    if (unit === 'minutes')
        return 'minute';
    if (unit === 'hours')
        return 'hour';
    if (unit === 'days')
        return 'day';
    if (unit === 'weeks')
        return 'week';
    if (unit === 'months')
        return 'month';
    if (unit === 'quarters')
        return 'quarter';
    if (unit === 'years')
        return 'year';
    if (unit !== 'second' &&
        unit !== 'minute' &&
        unit !== 'hour' &&
        unit !== 'day' &&
        unit !== 'week' &&
        unit !== 'month' &&
        unit !== 'quarter' &&
        unit !== 'year') {
        throw new RangeError('invalid unit');
    }
    return unit;
}
exports.SingularRelativeTimeUnit = SingularRelativeTimeUnit;

},{"../262":1,"../utils":66}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveLocale = void 0;
var LookupMatcher_1 = require("./LookupMatcher");
var BestFitMatcher_1 = require("./BestFitMatcher");
var utils_1 = require("./utils");
var UnicodeExtensionValue_1 = require("./UnicodeExtensionValue");
/**
 * https://tc39.es/ecma402/#sec-resolvelocale
 */
function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var matcher = options.localeMatcher;
    var r;
    if (matcher === 'lookup') {
        r = LookupMatcher_1.LookupMatcher(availableLocales, requestedLocales, getDefaultLocale);
    }
    else {
        r = BestFitMatcher_1.BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale);
    }
    var foundLocale = r.locale;
    var result = { locale: '', dataLocale: foundLocale };
    var supportedExtension = '-u';
    for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
        var key = relevantExtensionKeys_1[_i];
        utils_1.invariant(foundLocale in localeData, "Missing locale data for " + foundLocale);
        var foundLocaleData = localeData[foundLocale];
        utils_1.invariant(typeof foundLocaleData === 'object' && foundLocaleData !== null, "locale data " + key + " must be an object");
        var keyLocaleData = foundLocaleData[key];
        utils_1.invariant(Array.isArray(keyLocaleData), "keyLocaleData for " + key + " must be an array");
        var value = keyLocaleData[0];
        utils_1.invariant(typeof value === 'string' || value === null, "value must be string or null but got " + typeof value + " in key " + key);
        var supportedExtensionAddition = '';
        if (r.extension) {
            var requestedValue = UnicodeExtensionValue_1.UnicodeExtensionValue(r.extension, key);
            if (requestedValue !== undefined) {
                if (requestedValue !== '') {
                    if (~keyLocaleData.indexOf(requestedValue)) {
                        value = requestedValue;
                        supportedExtensionAddition = "-" + key + "-" + value;
                    }
                }
                else if (~requestedValue.indexOf('true')) {
                    value = 'true';
                    supportedExtensionAddition = "-" + key;
                }
            }
        }
        if (key in options) {
            var optionsValue = options[key];
            utils_1.invariant(typeof optionsValue === 'string' ||
                typeof optionsValue === 'undefined' ||
                optionsValue === null, 'optionsValue must be String, Undefined or Null');
            if (~keyLocaleData.indexOf(optionsValue)) {
                if (optionsValue !== value) {
                    value = optionsValue;
                    supportedExtensionAddition = '';
                }
            }
        }
        result[key] = value;
        supportedExtension += supportedExtensionAddition;
    }
    if (supportedExtension.length > 2) {
        var privateIndex = foundLocale.indexOf('-x-');
        if (privateIndex === -1) {
            foundLocale = foundLocale + supportedExtension;
        }
        else {
            var preExtension = foundLocale.slice(0, privateIndex);
            var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
            foundLocale = preExtension + supportedExtension + postExtension;
        }
        foundLocale = Intl.getCanonicalLocales(foundLocale)[0];
    }
    result.locale = foundLocale;
    return result;
}
exports.ResolveLocale = ResolveLocale;

},{"./BestFitMatcher":3,"./LookupMatcher":29,"./UnicodeExtensionValue":56,"./utils":66}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedLocales = void 0;
var _262_1 = require("./262");
var GetOption_1 = require("./GetOption");
var LookupSupportedLocales_1 = require("./LookupSupportedLocales");
/**
 * https://tc39.es/ecma402/#sec-supportedlocales
 * @param availableLocales
 * @param requestedLocales
 * @param options
 */
function SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = 'best fit';
    if (options !== undefined) {
        options = _262_1.ToObject(options);
        matcher = GetOption_1.GetOption(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    }
    if (matcher === 'best fit') {
        return LookupSupportedLocales_1.LookupSupportedLocales(availableLocales, requestedLocales);
    }
    return LookupSupportedLocales_1.LookupSupportedLocales(availableLocales, requestedLocales);
}
exports.SupportedLocales = SupportedLocales;

},{"./262":1,"./GetOption":24,"./LookupSupportedLocales":30}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnicodeExtensionValue = void 0;
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-unicodeextensionvalue
 * @param extension
 * @param key
 */
function UnicodeExtensionValue(extension, key) {
    utils_1.invariant(key.length === 2, 'key must have 2 elements');
    var size = extension.length;
    var searchValue = "-" + key + "-";
    var pos = extension.indexOf(searchValue);
    if (pos !== -1) {
        var start = pos + 4;
        var end = start;
        var k = start;
        var done = false;
        while (!done) {
            var e = extension.indexOf('-', k);
            var len = void 0;
            if (e === -1) {
                len = size - k;
            }
            else {
                len = e - k;
            }
            if (len === 2) {
                done = true;
            }
            else if (e === -1) {
                end = size;
                done = true;
            }
            else {
                end = e;
                k = e + 1;
            }
        }
        return extension.slice(start, end);
    }
    searchValue = "-" + key;
    pos = extension.indexOf(searchValue);
    if (pos !== -1 && pos + 3 === size) {
        return '';
    }
    return undefined;
}
exports.UnicodeExtensionValue = UnicodeExtensionValue;

},{"./utils":66}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMissingLocaleDataError = void 0;
var tslib_1 = require("tslib");
var MissingLocaleDataError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingLocaleDataError, _super);
    function MissingLocaleDataError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'MISSING_LOCALE_DATA';
        return _this;
    }
    return MissingLocaleDataError;
}(Error));
function isMissingLocaleDataError(e) {
    return e.type === 'MISSING_LOCALE_DATA';
}
exports.isMissingLocaleDataError = isMissingLocaleDataError;

},{"tslib":59}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = exports.isMissingLocaleDataError = exports.defineProperty = exports.getMagnitude = exports.setMultiInternalSlots = exports.setInternalSlot = exports.isLiteralPart = exports.getMultiInternalSlots = exports.getInternalSlot = exports.parseDateTimeSkeleton = exports.DATE_TIME_PROPS = exports._formatToParts = exports.BestFitFormatMatcher = void 0;
var tslib_1 = require("tslib");
var BestFitFormatMatcher_1 = require("./DateTimeFormat/BestFitFormatMatcher");
Object.defineProperty(exports, "BestFitFormatMatcher", { enumerable: true, get: function () { return BestFitFormatMatcher_1.BestFitFormatMatcher; } });
tslib_1.__exportStar(require("./CanonicalizeLocaleList"), exports);
tslib_1.__exportStar(require("./CanonicalizeTimeZoneName"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/BasicFormatMatcher"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/DateTimeStyleFormat"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/FormatDateTime"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/FormatDateTimeRange"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/FormatDateTimeRangeToParts"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/FormatDateTimeToParts"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/InitializeDateTimeFormat"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/PartitionDateTimePattern"), exports);
tslib_1.__exportStar(require("./DateTimeFormat/ToDateTimeOptions"), exports);
tslib_1.__exportStar(require("./DisplayNames/CanonicalCodeForDisplayNames"), exports);
tslib_1.__exportStar(require("./GetNumberOption"), exports);
tslib_1.__exportStar(require("./GetOption"), exports);
tslib_1.__exportStar(require("./IsSanctionedSimpleUnitIdentifier"), exports);
tslib_1.__exportStar(require("./IsValidTimeZoneName"), exports);
tslib_1.__exportStar(require("./IsWellFormedCurrencyCode"), exports);
tslib_1.__exportStar(require("./IsWellFormedUnitIdentifier"), exports);
tslib_1.__exportStar(require("./NumberFormat/ComputeExponent"), exports);
tslib_1.__exportStar(require("./NumberFormat/ComputeExponentForMagnitude"), exports);
tslib_1.__exportStar(require("./NumberFormat/CurrencyDigits"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericToParts"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericToString"), exports);
tslib_1.__exportStar(require("./NumberFormat/InitializeNumberFormat"), exports);
tslib_1.__exportStar(require("./NumberFormat/PartitionNumberPattern"), exports);
tslib_1.__exportStar(require("./NumberFormat/SetNumberFormatDigitOptions"), exports);
tslib_1.__exportStar(require("./NumberFormat/SetNumberFormatUnitOptions"), exports);
tslib_1.__exportStar(require("./NumberFormat/ToRawFixed"), exports);
tslib_1.__exportStar(require("./NumberFormat/ToRawPrecision"), exports);
tslib_1.__exportStar(require("./PartitionPattern"), exports);
tslib_1.__exportStar(require("./PluralRules/GetOperands"), exports);
tslib_1.__exportStar(require("./PluralRules/InitializePluralRules"), exports);
tslib_1.__exportStar(require("./PluralRules/ResolvePlural"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/FormatRelativeTime"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/FormatRelativeTimeToParts"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/InitializeRelativeTimeFormat"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/MakePartsList"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/PartitionRelativeTimePattern"), exports);
tslib_1.__exportStar(require("./RelativeTimeFormat/SingularRelativeTimeUnit"), exports);
tslib_1.__exportStar(require("./ResolveLocale"), exports);
tslib_1.__exportStar(require("./SupportedLocales"), exports);
var format_to_parts_1 = require("./NumberFormat/format_to_parts");
Object.defineProperty(exports, "_formatToParts", { enumerable: true, get: function () { return tslib_1.__importDefault(format_to_parts_1).default; } });
var utils_1 = require("./DateTimeFormat/utils");
Object.defineProperty(exports, "DATE_TIME_PROPS", { enumerable: true, get: function () { return utils_1.DATE_TIME_PROPS; } });
var skeleton_1 = require("./DateTimeFormat/skeleton");
Object.defineProperty(exports, "parseDateTimeSkeleton", { enumerable: true, get: function () { return skeleton_1.parseDateTimeSkeleton; } });
var utils_2 = require("./utils");
Object.defineProperty(exports, "getInternalSlot", { enumerable: true, get: function () { return utils_2.getInternalSlot; } });
Object.defineProperty(exports, "getMultiInternalSlots", { enumerable: true, get: function () { return utils_2.getMultiInternalSlots; } });
Object.defineProperty(exports, "isLiteralPart", { enumerable: true, get: function () { return utils_2.isLiteralPart; } });
Object.defineProperty(exports, "setInternalSlot", { enumerable: true, get: function () { return utils_2.setInternalSlot; } });
Object.defineProperty(exports, "setMultiInternalSlots", { enumerable: true, get: function () { return utils_2.setMultiInternalSlots; } });
Object.defineProperty(exports, "getMagnitude", { enumerable: true, get: function () { return utils_2.getMagnitude; } });
Object.defineProperty(exports, "defineProperty", { enumerable: true, get: function () { return utils_2.defineProperty; } });
var data_1 = require("./data");
Object.defineProperty(exports, "isMissingLocaleDataError", { enumerable: true, get: function () { return data_1.isMissingLocaleDataError; } });
tslib_1.__exportStar(require("./types/relative-time"), exports);
tslib_1.__exportStar(require("./types/date-time"), exports);
tslib_1.__exportStar(require("./types/list"), exports);
tslib_1.__exportStar(require("./types/plural-rules"), exports);
tslib_1.__exportStar(require("./types/number"), exports);
tslib_1.__exportStar(require("./types/displaynames"), exports);
var utils_3 = require("./utils");
Object.defineProperty(exports, "invariant", { enumerable: true, get: function () { return utils_3.invariant; } });
tslib_1.__exportStar(require("./262"), exports);

},{"./262":1,"./CanonicalizeLocaleList":4,"./CanonicalizeTimeZoneName":5,"./DateTimeFormat/BasicFormatMatcher":6,"./DateTimeFormat/BestFitFormatMatcher":7,"./DateTimeFormat/DateTimeStyleFormat":8,"./DateTimeFormat/FormatDateTime":9,"./DateTimeFormat/FormatDateTimeRange":11,"./DateTimeFormat/FormatDateTimeRangeToParts":12,"./DateTimeFormat/FormatDateTimeToParts":13,"./DateTimeFormat/InitializeDateTimeFormat":14,"./DateTimeFormat/PartitionDateTimePattern":15,"./DateTimeFormat/ToDateTimeOptions":17,"./DateTimeFormat/skeleton":19,"./DateTimeFormat/utils":20,"./DisplayNames/CanonicalCodeForDisplayNames":22,"./GetNumberOption":23,"./GetOption":24,"./IsSanctionedSimpleUnitIdentifier":25,"./IsValidTimeZoneName":26,"./IsWellFormedCurrencyCode":27,"./IsWellFormedUnitIdentifier":28,"./NumberFormat/ComputeExponent":31,"./NumberFormat/ComputeExponentForMagnitude":32,"./NumberFormat/CurrencyDigits":33,"./NumberFormat/FormatNumericToParts":34,"./NumberFormat/FormatNumericToString":35,"./NumberFormat/InitializeNumberFormat":36,"./NumberFormat/PartitionNumberPattern":37,"./NumberFormat/SetNumberFormatDigitOptions":38,"./NumberFormat/SetNumberFormatUnitOptions":39,"./NumberFormat/ToRawFixed":40,"./NumberFormat/ToRawPrecision":41,"./NumberFormat/format_to_parts":43,"./PartitionPattern":44,"./PluralRules/GetOperands":45,"./PluralRules/InitializePluralRules":46,"./PluralRules/ResolvePlural":47,"./RelativeTimeFormat/FormatRelativeTime":48,"./RelativeTimeFormat/FormatRelativeTimeToParts":49,"./RelativeTimeFormat/InitializeRelativeTimeFormat":50,"./RelativeTimeFormat/MakePartsList":51,"./RelativeTimeFormat/PartitionRelativeTimePattern":52,"./RelativeTimeFormat/SingularRelativeTimeUnit":53,"./ResolveLocale":54,"./SupportedLocales":55,"./data":57,"./types/date-time":60,"./types/displaynames":61,"./types/list":62,"./types/number":63,"./types/plural-rules":64,"./types/relative-time":65,"./utils":66,"tslib":59}],59:[function(require,module,exports){
(function (global){(function (){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangePatternType = void 0;
var RangePatternType;
(function (RangePatternType) {
    RangePatternType["startRange"] = "startRange";
    RangePatternType["shared"] = "shared";
    RangePatternType["endRange"] = "endRange";
})(RangePatternType = exports.RangePatternType || (exports.RangePatternType = {}));

},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],62:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],63:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],64:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],65:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = exports.UNICODE_EXTENSION_SEQUENCE_REGEX = exports.defineProperty = exports.isLiteralPart = exports.getMultiInternalSlots = exports.getInternalSlot = exports.setMultiInternalSlots = exports.setInternalSlot = exports.repeat = exports.getMagnitude = void 0;
/**
 * Cannot do Math.log(x) / Math.log(10) bc if IEEE floating point issue
 * @param x number
 */
function getMagnitude(x) {
    // Cannot count string length via Number.toString because it may use scientific notation
    // for very small or very large numbers.
    return Math.floor(Math.log(x) * Math.LOG10E);
}
exports.getMagnitude = getMagnitude;
function repeat(s, times) {
    if (typeof s.repeat === 'function') {
        return s.repeat(times);
    }
    var arr = new Array(times);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = s;
    }
    return arr.join('');
}
exports.repeat = repeat;
function setInternalSlot(map, pl, field, value) {
    if (!map.get(pl)) {
        map.set(pl, Object.create(null));
    }
    var slots = map.get(pl);
    slots[field] = value;
}
exports.setInternalSlot = setInternalSlot;
function setMultiInternalSlots(map, pl, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var k = _a[_i];
        setInternalSlot(map, pl, k, props[k]);
    }
}
exports.setMultiInternalSlots = setMultiInternalSlots;
function getInternalSlot(map, pl, field) {
    return getMultiInternalSlots(map, pl, field)[field];
}
exports.getInternalSlot = getInternalSlot;
function getMultiInternalSlots(map, pl) {
    var fields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        fields[_i - 2] = arguments[_i];
    }
    var slots = map.get(pl);
    if (!slots) {
        throw new TypeError(pl + " InternalSlot has not been initialized");
    }
    return fields.reduce(function (all, f) {
        all[f] = slots[f];
        return all;
    }, Object.create(null));
}
exports.getMultiInternalSlots = getMultiInternalSlots;
function isLiteralPart(patternPart) {
    return patternPart.type === 'literal';
}
exports.isLiteralPart = isLiteralPart;
/*
  17 ECMAScript Standard Built-in Objects:
    Every built-in Function object, including constructors, that is not
    identified as an anonymous function has a name property whose value
    is a String.

    Unless otherwise specified, the name property of a built-in Function
    object, if it exists, has the attributes { [[Writable]]: false,
    [[Enumerable]]: false, [[Configurable]]: true }.
*/
function defineProperty(target, name, _a) {
    var value = _a.value;
    Object.defineProperty(target, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value,
    });
}
exports.defineProperty = defineProperty;
exports.UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
function invariant(condition, message, Err) {
    if (Err === void 0) { Err = Error; }
    if (!condition) {
        throw new Err(message);
    }
}
exports.invariant = invariant;

},{}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./src/core"), exports);

},{"./src/core":71,"tslib":68}],68:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var should_polyfill_1 = require("./should-polyfill");
var to_locale_string_1 = require("./src/to_locale_string");
if (should_polyfill_1.shouldPolyfill()) {
    ecma402_abstract_1.defineProperty(Intl, 'DateTimeFormat', { value: _1.DateTimeFormat });
    ecma402_abstract_1.defineProperty(Date.prototype, 'toLocaleString', {
        value: function toLocaleString(locales, options) {
            return to_locale_string_1.toLocaleString(this, locales, options);
        },
    });
    ecma402_abstract_1.defineProperty(Date.prototype, 'toLocaleDateString', {
        value: function toLocaleDateString(locales, options) {
            return to_locale_string_1.toLocaleDateString(this, locales, options);
        },
    });
    ecma402_abstract_1.defineProperty(Date.prototype, 'toLocaleTimeString', {
        value: function toLocaleTimeString(locales, options) {
            return to_locale_string_1.toLocaleTimeString(this, locales, options);
        },
    });
}

},{"./":67,"./should-polyfill":70,"./src/to_locale_string":75,"@formatjs/ecma402-abstract":58}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPolyfill = void 0;
function supportsDateStyle() {
    try {
        return !!new Intl.DateTimeFormat(undefined, {
            dateStyle: 'short',
        }).resolvedOptions().dateStyle;
    }
    catch (e) {
        return false;
    }
}
/**
 * https://bugs.chromium.org/p/chromium/issues/detail?id=865351
 */
function hasChromeLt71Bug() {
    try {
        return (new Intl.DateTimeFormat('en', {
            hourCycle: 'h11',
            hour: 'numeric',
        }).formatToParts(0)[2].type !== 'dayPeriod');
    }
    catch (e) {
        return false;
    }
}
/**
 * Node 14's version of Intl.DateTimeFormat does not throw
 * when dateStyle/timeStyle is used with other options.
 * This was fixed in newer V8 versions
 */
function hasUnthrownDateTimeStyleBug() {
    try {
        return !!new Intl.DateTimeFormat('en', {
            dateStyle: 'short',
            hour: 'numeric',
        }).format(new Date(0));
    }
    catch (e) {
        return false;
    }
}
function shouldPolyfill() {
    return (!('DateTimeFormat' in Intl) ||
        !('formatToParts' in Intl.DateTimeFormat.prototype) ||
        !('formatRange' in Intl.DateTimeFormat.prototype) ||
        hasChromeLt71Bug() ||
        hasUnthrownDateTimeStyleBug() ||
        !supportsDateStyle());
}
exports.shouldPolyfill = shouldPolyfill;

},{}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeFormat = void 0;
var tslib_1 = require("tslib");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var get_internal_slots_1 = tslib_1.__importDefault(require("./get_internal_slots"));
var links_1 = tslib_1.__importDefault(require("./data/links"));
var packer_1 = require("./packer");
var UPPERCASED_LINKS = Object.keys(links_1.default).reduce(function (all, l) {
    all[l.toUpperCase()] = links_1.default[l];
    return all;
}, {});
var RESOLVED_OPTIONS_KEYS = [
    'locale',
    'calendar',
    'numberingSystem',
    'dateStyle',
    'timeStyle',
    'timeZone',
    'hourCycle',
    'weekday',
    'era',
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'timeZoneName',
];
var formatDescriptor = {
    enumerable: false,
    configurable: true,
    get: function () {
        if (typeof this !== 'object' || !(this instanceof exports.DateTimeFormat)) {
            throw TypeError('Intl.DateTimeFormat format property accessor called on incompatible receiver');
        }
        var internalSlots = get_internal_slots_1.default(this);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var dtf = this;
        var boundFormat = internalSlots.boundFormat;
        if (boundFormat === undefined) {
            // https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_diff_out.html#sec-number-format-functions
            boundFormat = function (date) {
                var x;
                if (date === undefined) {
                    x = Date.now();
                }
                else {
                    x = Number(date);
                }
                return ecma402_abstract_1.FormatDateTime(dtf, x, {
                    getInternalSlots: get_internal_slots_1.default,
                    localeData: exports.DateTimeFormat.localeData,
                    tzData: exports.DateTimeFormat.tzData,
                    getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
                });
            };
            try {
                // https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/prototype/format/format-function-name.js
                Object.defineProperty(boundFormat, 'name', {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value: '',
                });
            }
            catch (e) {
                // In older browser (e.g Chrome 36 like polyfill.io)
                // TypeError: Cannot redefine property: name
            }
            internalSlots.boundFormat = boundFormat;
        }
        return boundFormat;
    },
};
try {
    // https://github.com/tc39/test262/blob/master/test/intl402/NumberFormat/prototype/format/name.js
    Object.defineProperty(formatDescriptor.get, 'name', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: 'get format',
    });
}
catch (e) {
    // In older browser (e.g Chrome 36 like polyfill.io)
    // TypeError: Cannot redefine property: name
}
exports.DateTimeFormat = function (locales, options) {
    // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
    if (!this || !(this instanceof exports.DateTimeFormat)) {
        return new exports.DateTimeFormat(locales, options);
    }
    ecma402_abstract_1.InitializeDateTimeFormat(this, locales, options, {
        tzData: exports.DateTimeFormat.tzData,
        uppercaseLinks: UPPERCASED_LINKS,
        availableLocales: exports.DateTimeFormat.availableLocales,
        relevantExtensionKeys: exports.DateTimeFormat.relevantExtensionKeys,
        getDefaultLocale: exports.DateTimeFormat.getDefaultLocale,
        getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        getInternalSlots: get_internal_slots_1.default,
        localeData: exports.DateTimeFormat.localeData,
    });
    /** IMPL START */
    var internalSlots = get_internal_slots_1.default(this);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = exports.DateTimeFormat.localeData[dataLocale];
    ecma402_abstract_1.invariant(dataLocaleData !== undefined, "Cannot load locale-dependent data for " + dataLocale + ".");
    /** IMPL END */
};
// Static properties
ecma402_abstract_1.defineProperty(exports.DateTimeFormat, 'supportedLocalesOf', {
    value: function supportedLocalesOf(locales, options) {
        return ecma402_abstract_1.SupportedLocales(exports.DateTimeFormat.availableLocales, ecma402_abstract_1.CanonicalizeLocaleList(locales), options);
    },
});
ecma402_abstract_1.defineProperty(exports.DateTimeFormat.prototype, 'resolvedOptions', {
    value: function resolvedOptions() {
        if (typeof this !== 'object' || !(this instanceof exports.DateTimeFormat)) {
            throw TypeError('Method Intl.DateTimeFormat.prototype.resolvedOptions called on incompatible receiver');
        }
        var internalSlots = get_internal_slots_1.default(this);
        var ro = {};
        for (var _i = 0, RESOLVED_OPTIONS_KEYS_1 = RESOLVED_OPTIONS_KEYS; _i < RESOLVED_OPTIONS_KEYS_1.length; _i++) {
            var key = RESOLVED_OPTIONS_KEYS_1[_i];
            var value = internalSlots[key];
            if (key === 'hourCycle') {
                var hour12 = value === 'h11' || value === 'h12'
                    ? true
                    : value === 'h23' || value === 'h24'
                        ? false
                        : undefined;
                if (hour12 !== undefined) {
                    ro.hour12 = hour12;
                }
            }
            if (ecma402_abstract_1.DATE_TIME_PROPS.indexOf(key) > -1) {
                if (internalSlots.dateStyle !== undefined ||
                    internalSlots.timeStyle !== undefined) {
                    value = undefined;
                }
            }
            if (value !== undefined) {
                ro[key] = value;
            }
        }
        return ro;
    },
});
ecma402_abstract_1.defineProperty(exports.DateTimeFormat.prototype, 'formatToParts', {
    value: function formatToParts(date) {
        if (date === undefined) {
            date = Date.now();
        }
        else {
            date = ecma402_abstract_1.ToNumber(date);
        }
        return ecma402_abstract_1.FormatDateTimeToParts(this, date, {
            getInternalSlots: get_internal_slots_1.default,
            localeData: exports.DateTimeFormat.localeData,
            tzData: exports.DateTimeFormat.tzData,
            getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        });
    },
});
ecma402_abstract_1.defineProperty(exports.DateTimeFormat.prototype, 'formatRangeToParts', {
    value: function formatRangeToParts(startDate, endDate) {
        var dtf = this;
        if (typeof dtf !== 'object') {
            throw new TypeError();
        }
        if (startDate === undefined || endDate === undefined) {
            throw new TypeError('startDate/endDate cannot be undefined');
        }
        var x = ecma402_abstract_1.ToNumber(startDate);
        var y = ecma402_abstract_1.ToNumber(endDate);
        return ecma402_abstract_1.FormatDateTimeRangeToParts(dtf, x, y, {
            getInternalSlots: get_internal_slots_1.default,
            localeData: exports.DateTimeFormat.localeData,
            tzData: exports.DateTimeFormat.tzData,
            getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        });
    },
});
ecma402_abstract_1.defineProperty(exports.DateTimeFormat.prototype, 'formatRange', {
    value: function formatRange(startDate, endDate) {
        var dtf = this;
        if (typeof dtf !== 'object') {
            throw new TypeError();
        }
        if (startDate === undefined || endDate === undefined) {
            throw new TypeError('startDate/endDate cannot be undefined');
        }
        var x = ecma402_abstract_1.ToNumber(startDate);
        var y = ecma402_abstract_1.ToNumber(endDate);
        return ecma402_abstract_1.FormatDateTimeRange(dtf, x, y, {
            getInternalSlots: get_internal_slots_1.default,
            localeData: exports.DateTimeFormat.localeData,
            tzData: exports.DateTimeFormat.tzData,
            getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        });
    },
});
var DEFAULT_TIMEZONE = 'UTC';
exports.DateTimeFormat.__setDefaultTimeZone = function (timeZone) {
    if (timeZone !== undefined) {
        timeZone = String(timeZone);
        if (!ecma402_abstract_1.IsValidTimeZoneName(timeZone, {
            tzData: exports.DateTimeFormat.tzData,
            uppercaseLinks: UPPERCASED_LINKS,
        })) {
            throw new RangeError('Invalid timeZoneName');
        }
        timeZone = ecma402_abstract_1.CanonicalizeTimeZoneName(timeZone, {
            tzData: exports.DateTimeFormat.tzData,
            uppercaseLinks: UPPERCASED_LINKS,
        });
    }
    else {
        timeZone = DEFAULT_TIMEZONE;
    }
    exports.DateTimeFormat.__defaultTimeZone = timeZone;
};
exports.DateTimeFormat.relevantExtensionKeys = ['nu', 'ca', 'hc'];
exports.DateTimeFormat.__defaultTimeZone = DEFAULT_TIMEZONE;
exports.DateTimeFormat.getDefaultTimeZone = function () { return exports.DateTimeFormat.__defaultTimeZone; };
exports.DateTimeFormat.__addLocaleData = function __addLocaleData() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    var _loop_1 = function (d, locale) {
        var dateFormat = d.dateFormat, timeFormat = d.timeFormat, dateTimeFormat = d.dateTimeFormat, formats = d.formats, intervalFormats = d.intervalFormats, rawData = tslib_1.__rest(d, ["dateFormat", "timeFormat", "dateTimeFormat", "formats", "intervalFormats"]);
        var processedData = tslib_1.__assign(tslib_1.__assign({}, rawData), { dateFormat: {
                full: ecma402_abstract_1.parseDateTimeSkeleton(dateFormat.full),
                long: ecma402_abstract_1.parseDateTimeSkeleton(dateFormat.long),
                medium: ecma402_abstract_1.parseDateTimeSkeleton(dateFormat.medium),
                short: ecma402_abstract_1.parseDateTimeSkeleton(dateFormat.short),
            }, timeFormat: {
                full: ecma402_abstract_1.parseDateTimeSkeleton(timeFormat.full),
                long: ecma402_abstract_1.parseDateTimeSkeleton(timeFormat.long),
                medium: ecma402_abstract_1.parseDateTimeSkeleton(timeFormat.medium),
                short: ecma402_abstract_1.parseDateTimeSkeleton(timeFormat.short),
            }, dateTimeFormat: {
                full: ecma402_abstract_1.parseDateTimeSkeleton(dateTimeFormat.full).pattern,
                long: ecma402_abstract_1.parseDateTimeSkeleton(dateTimeFormat.long).pattern,
                medium: ecma402_abstract_1.parseDateTimeSkeleton(dateTimeFormat.medium).pattern,
                short: ecma402_abstract_1.parseDateTimeSkeleton(dateTimeFormat.short).pattern,
            }, formats: {} });
        var _loop_2 = function (calendar) {
            processedData.formats[calendar] = Object.keys(formats[calendar]).map(function (skeleton) {
                return ecma402_abstract_1.parseDateTimeSkeleton(skeleton, formats[calendar][skeleton], intervalFormats[skeleton], intervalFormats.intervalFormatFallback);
            });
        };
        for (var calendar in formats) {
            _loop_2(calendar);
        }
        var minimizedLocale = new Intl.Locale(locale)
            .minimize()
            .toString();
        exports.DateTimeFormat.localeData[locale] = exports.DateTimeFormat.localeData[minimizedLocale] = processedData;
        exports.DateTimeFormat.availableLocales.add(locale);
        exports.DateTimeFormat.availableLocales.add(minimizedLocale);
        if (!exports.DateTimeFormat.__defaultLocale) {
            exports.DateTimeFormat.__defaultLocale = minimizedLocale;
        }
    };
    for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
        var _b = data_1[_a], d = _b.data, locale = _b.locale;
        _loop_1(d, locale);
    }
};
Object.defineProperty(exports.DateTimeFormat.prototype, 'format', formatDescriptor);
exports.DateTimeFormat.__defaultLocale = '';
exports.DateTimeFormat.localeData = {};
exports.DateTimeFormat.availableLocales = new Set();
exports.DateTimeFormat.getDefaultLocale = function () {
    return exports.DateTimeFormat.__defaultLocale;
};
exports.DateTimeFormat.polyfilled = true;
exports.DateTimeFormat.tzData = {};
exports.DateTimeFormat.__addTZData = function (d) {
    exports.DateTimeFormat.tzData = packer_1.unpack(d);
};
try {
    if (typeof Symbol !== 'undefined') {
        Object.defineProperty(exports.DateTimeFormat.prototype, Symbol.toStringTag, {
            value: 'Intl.DateTimeFormat',
            writable: false,
            enumerable: false,
            configurable: true,
        });
    }
    Object.defineProperty(exports.DateTimeFormat.prototype.constructor, 'length', {
        value: 1,
        writable: false,
        enumerable: false,
        configurable: true,
    });
}
catch (e) {
    // Meta fix so we're test262-compliant, not important
}

},{"./data/links":72,"./get_internal_slots":73,"./packer":74,"@formatjs/ecma402-abstract":58,"tslib":68}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @generated
// prettier-ignore
exports.default = {
    "Africa/Asmera": "Africa/Nairobi",
    "Africa/Timbuktu": "Africa/Abidjan",
    "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
    "America/Atka": "America/Adak",
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "America/Catamarca": "America/Argentina/Catamarca",
    "America/Coral_Harbour": "America/Atikokan",
    "America/Cordoba": "America/Argentina/Cordoba",
    "America/Ensenada": "America/Tijuana",
    "America/Fort_Wayne": "America/Indiana/Indianapolis",
    "America/Godthab": "America/Nuuk",
    "America/Indianapolis": "America/Indiana/Indianapolis",
    "America/Jujuy": "America/Argentina/Jujuy",
    "America/Knox_IN": "America/Indiana/Knox",
    "America/Louisville": "America/Kentucky/Louisville",
    "America/Mendoza": "America/Argentina/Mendoza",
    "America/Montreal": "America/Toronto",
    "America/Porto_Acre": "America/Rio_Branco",
    "America/Rosario": "America/Argentina/Cordoba",
    "America/Santa_Isabel": "America/Tijuana",
    "America/Shiprock": "America/Denver",
    "America/Virgin": "America/Port_of_Spain",
    "Antarctica/South_Pole": "Pacific/Auckland",
    "Asia/Ashkhabad": "Asia/Ashgabat",
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Chongqing": "Asia/Shanghai",
    "Asia/Chungking": "Asia/Shanghai",
    "Asia/Dacca": "Asia/Dhaka",
    "Asia/Harbin": "Asia/Shanghai",
    "Asia/Kashgar": "Asia/Urumqi",
    "Asia/Katmandu": "Asia/Kathmandu",
    "Asia/Macao": "Asia/Macau",
    "Asia/Rangoon": "Asia/Yangon",
    "Asia/Saigon": "Asia/Ho_Chi_Minh",
    "Asia/Tel_Aviv": "Asia/Jerusalem",
    "Asia/Thimbu": "Asia/Thimphu",
    "Asia/Ujung_Pandang": "Asia/Makassar",
    "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
    "Atlantic/Faeroe": "Atlantic/Faroe",
    "Atlantic/Jan_Mayen": "Europe/Oslo",
    "Australia/ACT": "Australia/Sydney",
    "Australia/Canberra": "Australia/Sydney",
    "Australia/LHI": "Australia/Lord_Howe",
    "Australia/NSW": "Australia/Sydney",
    "Australia/North": "Australia/Darwin",
    "Australia/Queensland": "Australia/Brisbane",
    "Australia/South": "Australia/Adelaide",
    "Australia/Tasmania": "Australia/Hobart",
    "Australia/Victoria": "Australia/Melbourne",
    "Australia/West": "Australia/Perth",
    "Australia/Yancowinna": "Australia/Broken_Hill",
    "Brazil/Acre": "America/Rio_Branco",
    "Brazil/DeNoronha": "America/Noronha",
    "Brazil/East": "America/Sao_Paulo",
    "Brazil/West": "America/Manaus",
    "Canada/Atlantic": "America/Halifax",
    "Canada/Central": "America/Winnipeg",
    "Canada/Eastern": "America/Toronto",
    "Canada/Mountain": "America/Edmonton",
    "Canada/Newfoundland": "America/St_Johns",
    "Canada/Pacific": "America/Vancouver",
    "Canada/Saskatchewan": "America/Regina",
    "Canada/Yukon": "America/Whitehorse",
    "Chile/Continental": "America/Santiago",
    "Chile/EasterIsland": "Pacific/Easter",
    "Cuba": "America/Havana",
    "Egypt": "Africa/Cairo",
    "Eire": "Europe/Dublin",
    "Etc/UCT": "Etc/UTC",
    "Europe/Belfast": "Europe/London",
    "Europe/Tiraspol": "Europe/Chisinau",
    "GB": "Europe/London",
    "GB-Eire": "Europe/London",
    "GMT+0": "Etc/GMT",
    "GMT-0": "Etc/GMT",
    "GMT0": "Etc/GMT",
    "Greenwich": "Etc/GMT",
    "Hongkong": "Asia/Hong_Kong",
    "Iceland": "Atlantic/Reykjavik",
    "Iran": "Asia/Tehran",
    "Israel": "Asia/Jerusalem",
    "Jamaica": "America/Jamaica",
    "Japan": "Asia/Tokyo",
    "Kwajalein": "Pacific/Kwajalein",
    "Libya": "Africa/Tripoli",
    "Mexico/BajaNorte": "America/Tijuana",
    "Mexico/BajaSur": "America/Mazatlan",
    "Mexico/General": "America/Mexico_City",
    "NZ": "Pacific/Auckland",
    "NZ-CHAT": "Pacific/Chatham",
    "Navajo": "America/Denver",
    "PRC": "Asia/Shanghai",
    "Pacific/Johnston": "Pacific/Honolulu",
    "Pacific/Ponape": "Pacific/Pohnpei",
    "Pacific/Samoa": "Pacific/Pago_Pago",
    "Pacific/Truk": "Pacific/Chuuk",
    "Pacific/Yap": "Pacific/Chuuk",
    "Poland": "Europe/Warsaw",
    "Portugal": "Europe/Lisbon",
    "ROC": "Asia/Taipei",
    "ROK": "Asia/Seoul",
    "Singapore": "Asia/Singapore",
    "Turkey": "Europe/Istanbul",
    "UCT": "Etc/UTC",
    "US/Alaska": "America/Anchorage",
    "US/Aleutian": "America/Adak",
    "US/Arizona": "America/Phoenix",
    "US/Central": "America/Chicago",
    "US/East-Indiana": "America/Indiana/Indianapolis",
    "US/Eastern": "America/New_York",
    "US/Hawaii": "Pacific/Honolulu",
    "US/Indiana-Starke": "America/Indiana/Knox",
    "US/Michigan": "America/Detroit",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    "US/Samoa": "Pacific/Pago_Pago",
    "UTC": "Etc/UTC",
    "Universal": "Etc/UTC",
    "W-SU": "Europe/Moscow",
    "Zulu": "Etc/UTC"
};

},{}],73:[function(require,module,exports){
"use strict";
// Type-only circular import
// eslint-disable-next-line import/no-cycle
Object.defineProperty(exports, "__esModule", { value: true });
var internalSlotMap = new WeakMap();
function getInternalSlots(x) {
    var internalSlots = internalSlotMap.get(x);
    if (!internalSlots) {
        internalSlots = Object.create(null);
        internalSlotMap.set(x, internalSlots);
    }
    return internalSlots;
}
exports.default = getInternalSlots;

},{}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpack = exports.pack = void 0;
var tslib_1 = require("tslib");
function pack(data) {
    var zoneNames = Object.keys(data.zones);
    zoneNames.sort(); // so output is stable
    return {
        zones: zoneNames.map(function (zone) {
            return tslib_1.__spreadArrays([
                zone
            ], data.zones[zone].map(function (_a) {
                var ts = _a[0], others = _a.slice(1);
                return tslib_1.__spreadArrays([ts === '' ? '' : ts.toString(36)], others).join(',');
            })).join('|');
        }),
        abbrvs: data.abbrvs.join('|'),
        offsets: data.offsets.map(function (o) { return o.toString(36); }).join('|'),
    };
}
exports.pack = pack;
function unpack(data) {
    var abbrvs = data.abbrvs.split('|');
    var offsets = data.offsets.split('|').map(function (n) { return parseInt(n, 36); });
    var packedZones = data.zones;
    var zones = {};
    for (var _i = 0, packedZones_1 = packedZones; _i < packedZones_1.length; _i++) {
        var d = packedZones_1[_i];
        var _a = d.split('|'), zone = _a[0], zoneData = _a.slice(1);
        zones[zone] = zoneData
            .map(function (z) { return z.split(','); })
            .map(function (_a) {
            var ts = _a[0], abbrvIndex = _a[1], offsetIndex = _a[2], dst = _a[3];
            return [
                ts === '' ? -Infinity : parseInt(ts, 36),
                abbrvs[+abbrvIndex],
                offsets[+offsetIndex],
                dst === '1',
            ];
        });
    }
    return zones;
}
exports.unpack = unpack;

},{"tslib":68}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLocaleTimeString = exports.toLocaleDateString = exports.toLocaleString = void 0;
// eslint-disable-next-line import/no-cycle
var core_1 = require("./core");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
/**
 * Number.prototype.toLocaleString ponyfill
 * https://tc39.es/ecma402/#sup-number.prototype.tolocalestring
 */
function toLocaleString(x, locales, options) {
    var dtf = new core_1.DateTimeFormat(locales, options);
    return dtf.format(x);
}
exports.toLocaleString = toLocaleString;
function toLocaleDateString(x, locales, options) {
    var dtf = new core_1.DateTimeFormat(locales, ecma402_abstract_1.ToDateTimeOptions(options, 'date', 'date'));
    return dtf.format(x);
}
exports.toLocaleDateString = toLocaleDateString;
function toLocaleTimeString(x, locales, options) {
    var dtf = new core_1.DateTimeFormat(locales, ecma402_abstract_1.ToDateTimeOptions(options, 'time', 'time'));
    return dtf.format(x);
}
exports.toLocaleTimeString = toLocaleTimeString;

},{"./core":71,"@formatjs/ecma402-abstract":58}]},{},[69])(69)
});
