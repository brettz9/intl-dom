(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DateTimeFormat = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msFromTime = exports.OrdinaryHasInstance = exports.SecFromTime = exports.MinFromTime = exports.HourFromTime = exports.DateFromTime = exports.MonthFromTime = exports.InLeapYear = exports.DayWithinYear = exports.DaysInYear = exports.YearFromTime = exports.TimeFromYear = exports.DayFromYear = exports.WeekDay = exports.Day = exports.Type = exports.HasOwnProperty = exports.ArrayCreate = exports.SameValue = exports.ToObject = exports.TimeClip = exports.ToNumber = exports.ToString = void 0;
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
    if (Math.abs(time) > 8.64 * 1e15) {
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
    return Date.UTC(y, 0) / MS_PER_DAY;
}
exports.DayFromYear = DayFromYear;
/**
 * https://tc39.es/ecma262/#sec-year-number
 * @param y
 */
function TimeFromYear(y) {
    return Date.UTC(y, 0);
}
exports.TimeFromYear = TimeFromYear;
/**
 * https://tc39.es/ecma262/#sec-year-number
 * @param t
 */
function YearFromTime(t) {
    return new Date(t).getUTCFullYear();
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
function IsCallable(fn) {
    return typeof fn === 'function';
}
/**
 * The abstract operation OrdinaryHasInstance implements
 * the default algorithm for determining if an object O
 * inherits from the instance object inheritance path
 * provided by constructor C.
 * @param C class
 * @param O object
 * @param internalSlots internalSlots
 */
function OrdinaryHasInstance(C, O, internalSlots) {
    if (!IsCallable(C)) {
        return false;
    }
    if (internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction) {
        var BC = internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction;
        return O instanceof BC;
    }
    if (typeof O !== 'object') {
        return false;
    }
    var P = C.prototype;
    if (typeof P !== 'object') {
        throw new TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
    }
    return Object.prototype.isPrototypeOf.call(P, O);
}
exports.OrdinaryHasInstance = OrdinaryHasInstance;
function msFromTime(t) {
    return mod(t, MS_PER_SECOND);
}
exports.msFromTime = msFromTime;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalizeTimeZoneName = void 0;
/**
 * https://tc39.es/ecma402/#sec-canonicalizetimezonename
 * @param tz
 */
function CanonicalizeTimeZoneName(tz, _a) {
    var zoneNames = _a.zoneNames, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var uppercasedZones = zoneNames.reduce(function (all, z) {
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

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoerceOptionsToObject = void 0;
var _262_1 = require("./262");
/**
 * https://tc39.es/ecma402/#sec-coerceoptionstoobject
 * @param options
 * @returns
 */
function CoerceOptionsToObject(options) {
    if (typeof options === 'undefined') {
        return Object.create(null);
    }
    return (0, _262_1.ToObject)(options);
}
exports.CoerceOptionsToObject = CoerceOptionsToObject;

},{"./262":1}],5:[function(require,module,exports){
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
function DefaultNumberOption(inputVal, min, max, fallback) {
    if (inputVal === undefined) {
        // @ts-expect-error
        return fallback;
    }
    var val = Number(inputVal);
    if (isNaN(val) || val < min || val > max) {
        throw new RangeError("".concat(val, " is outside of range [").concat(min, ", ").concat(max, "]"));
    }
    return Math.floor(val);
}
exports.DefaultNumberOption = DefaultNumberOption;

},{}],6:[function(require,module,exports){
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
    return (0, DefaultNumberOption_1.DefaultNumberOption)(val, minimum, maximum, fallback);
}
exports.GetNumberOption = GetNumberOption;

},{"./DefaultNumberOption":5}],7:[function(require,module,exports){
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
    if (typeof opts !== 'object') {
        throw new TypeError('Options must be an object');
    }
    var value = opts[prop];
    if (value !== undefined) {
        if (type !== 'boolean' && type !== 'string') {
            throw new TypeError('invalid type');
        }
        if (type === 'boolean') {
            value = Boolean(value);
        }
        if (type === 'string') {
            value = (0, _262_1.ToString)(value);
        }
        if (values !== undefined && !values.filter(function (val) { return val == value; }).length) {
            throw new RangeError("".concat(value, " is not within ").concat(values.join(', ')));
        }
        return value;
    }
    return fallback;
}
exports.GetOption = GetOption;

},{"./262":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOptionsObject = void 0;
/**
 * https://tc39.es/ecma402/#sec-getoptionsobject
 * @param options
 * @returns
 */
function GetOptionsObject(options) {
    if (typeof options === 'undefined') {
        return Object.create(null);
    }
    if (typeof options === 'object') {
        return options;
    }
    throw new TypeError('Options must be an object');
}
exports.GetOptionsObject = GetOptionsObject;

},{}],9:[function(require,module,exports){
"use strict";
/**
 * https://tc39.es/ecma402/#sec-getstringorbooleanoption
 * @param opts
 * @param prop
 * @param values
 * @param trueValue
 * @param falsyValue
 * @param fallback
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStringOrBooleanOption = void 0;
var _262_1 = require("./262");
function GetStringOrBooleanOption(opts, prop, values, trueValue, falsyValue, fallback) {
    var value = opts[prop];
    if (value === undefined) {
        return fallback;
    }
    if (value === true) {
        return trueValue;
    }
    var valueBoolean = Boolean(value);
    if (valueBoolean === false) {
        return falsyValue;
    }
    value = (0, _262_1.ToString)(value);
    if (value === 'true' || value === 'false') {
        return fallback;
    }
    if ((values || []).indexOf(value) === -1) {
        throw new RangeError("Invalid value ".concat(value));
    }
    return value;
}
exports.GetStringOrBooleanOption = GetStringOrBooleanOption;

},{"./262":1}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidTimeZoneName = void 0;
/**
 * https://tc39.es/ecma402/#sec-isvalidtimezonename
 * @param tz
 * @param implDetails implementation details
 */
function IsValidTimeZoneName(tz, _a) {
    var zoneNamesFromData = _a.zoneNamesFromData, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var zoneNames = new Set();
    var linkNames = new Set();
    zoneNamesFromData.map(function (z) { return z.toUpperCase(); }).forEach(function (z) { return zoneNames.add(z); });
    Object.keys(uppercaseLinks).forEach(function (linkName) {
        linkNames.add(linkName.toUpperCase());
        zoneNames.add(uppercaseLinks[linkName].toUpperCase());
    });
    return zoneNames.has(uppercasedTz) || linkNames.has(uppercasedTz);
}
exports.IsValidTimeZoneName = IsValidTimeZoneName;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
    if ((0, IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier)(unit)) {
        return true;
    }
    var units = unit.split('-per-');
    if (units.length !== 2) {
        return false;
    }
    var numerator = units[0], denominator = units[1];
    if (!(0, IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier)(numerator) ||
        !(0, IsSanctionedSimpleUnitIdentifier_1.IsSanctionedSimpleUnitIdentifier)(denominator)) {
        return false;
    }
    return true;
}
exports.IsWellFormedUnitIdentifier = IsWellFormedUnitIdentifier;

},{"./IsSanctionedSimpleUnitIdentifier":10}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyUnsignedRoundingMode = void 0;
function ApplyUnsignedRoundingMode(x, r1, r2, unsignedRoundingMode) {
    if (x === r1)
        return r1;
    if (unsignedRoundingMode === undefined) {
        throw new Error('unsignedRoundingMode is mandatory');
    }
    if (unsignedRoundingMode === 'zero') {
        return r1;
    }
    if (unsignedRoundingMode === 'infinity') {
        return r2;
    }
    var d1 = x - r1;
    var d2 = r2 - x;
    if (d1 < d2) {
        return r1;
    }
    if (d2 < d1) {
        return r2;
    }
    if (d1 !== d2) {
        throw new Error('Unexpected error');
    }
    if (unsignedRoundingMode === 'half-zero') {
        return r1;
    }
    if (unsignedRoundingMode === 'half-infinity') {
        return r2;
    }
    if (unsignedRoundingMode !== 'half-even') {
        throw new Error("Unexpected value for unsignedRoundingMode: ".concat(unsignedRoundingMode));
    }
    var cardinality = (r1 / (r2 - r1)) % 2;
    if (cardinality === 0) {
        return r1;
    }
    return r2;
}
exports.ApplyUnsignedRoundingMode = ApplyUnsignedRoundingMode;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseNumberRange = void 0;
/**
 * https://tc39.es/ecma402/#sec-collapsenumberrange
 */
function CollapseNumberRange(result) {
    return result;
}
exports.CollapseNumberRange = CollapseNumberRange;

},{}],16:[function(require,module,exports){
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
    var magnitude = (0, utils_1.getMagnitude)(x);
    var exponent = (0, ComputeExponentForMagnitude_1.ComputeExponentForMagnitude)(numberFormat, magnitude, {
        getInternalSlots: getInternalSlots,
    });
    // Preserve more precision by doing multiplication when exponent is negative.
    x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
    var formatNumberResult = (0, FormatNumericToString_1.FormatNumericToString)(getInternalSlots(numberFormat), x);
    if (formatNumberResult.roundedNumber === 0) {
        return [exponent, magnitude];
    }
    var newMagnitude = (0, utils_1.getMagnitude)(formatNumberResult.roundedNumber);
    if (newMagnitude === magnitude - exponent) {
        return [exponent, magnitude];
    }
    return [
        (0, ComputeExponentForMagnitude_1.ComputeExponentForMagnitude)(numberFormat, magnitude + 1, {
            getInternalSlots: getInternalSlots,
        }),
        magnitude + 1,
    ];
}
exports.ComputeExponent = ComputeExponent;

},{"../utils":45,"./ComputeExponentForMagnitude":17,"./FormatNumericToString":23}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyDigits = void 0;
var _262_1 = require("../262");
/**
 * https://tc39.es/ecma402/#sec-currencydigits
 */
function CurrencyDigits(c, _a) {
    var currencyDigitsData = _a.currencyDigitsData;
    return (0, _262_1.HasOwnProperty)(currencyDigitsData, c)
        ? currencyDigitsData[c]
        : 2;
}
exports.CurrencyDigits = CurrencyDigits;

},{"../262":1}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatApproximately = void 0;
/**
 * https://tc39.es/ecma402/#sec-formatapproximately
 */
function FormatApproximately(numberFormat, result, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var internalSlots = getInternalSlots(numberFormat);
    var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
    var approximatelySign = symbols.approximatelySign;
    result.push({ type: 'approximatelySign', value: approximatelySign });
    return result;
}
exports.FormatApproximately = FormatApproximately;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericRange = void 0;
var PartitionNumberRangePattern_1 = require("./PartitionNumberRangePattern");
/**
 * https://tc39.es/ecma402/#sec-formatnumericrange
 */
function FormatNumericRange(numberFormat, x, y, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var parts = (0, PartitionNumberRangePattern_1.PartitionNumberRangePattern)(numberFormat, x, y, {
        getInternalSlots: getInternalSlots,
    });
    return parts.map(function (part) { return part.value; }).join('');
}
exports.FormatNumericRange = FormatNumericRange;

},{"./PartitionNumberRangePattern":27}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericRangeToParts = void 0;
var PartitionNumberRangePattern_1 = require("./PartitionNumberRangePattern");
/**
 * https://tc39.es/ecma402/#sec-formatnumericrangetoparts
 */
function FormatNumericRangeToParts(numberFormat, x, y, _a) {
    var getInternalSlots = _a.getInternalSlots;
    var parts = (0, PartitionNumberRangePattern_1.PartitionNumberRangePattern)(numberFormat, x, y, {
        getInternalSlots: getInternalSlots,
    });
    return parts.map(function (part, index) { return ({
        type: part.type,
        value: part.value,
        source: part.source,
        result: index.toString(),
    }); });
}
exports.FormatNumericRangeToParts = FormatNumericRangeToParts;

},{"./PartitionNumberRangePattern":27}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatNumericToParts = void 0;
var PartitionNumberPattern_1 = require("./PartitionNumberPattern");
var _262_1 = require("../262");
function FormatNumericToParts(nf, x, implDetails) {
    var parts = (0, PartitionNumberPattern_1.PartitionNumberPattern)(nf, x, implDetails);
    var result = (0, _262_1.ArrayCreate)(0);
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

},{"../262":1,"./PartitionNumberPattern":26}],23:[function(require,module,exports){
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
    var isNegative = x < 0 || (0, _262_1.SameValue)(x, -0);
    if (isNegative) {
        x = -x;
    }
    var result;
    var rourndingType = intlObject.roundingType;
    switch (rourndingType) {
        case 'significantDigits':
            result = (0, ToRawPrecision_1.ToRawPrecision)(x, intlObject.minimumSignificantDigits, intlObject.maximumSignificantDigits);
            break;
        case 'fractionDigits':
            result = (0, ToRawFixed_1.ToRawFixed)(x, intlObject.minimumFractionDigits, intlObject.maximumFractionDigits);
            break;
        default:
            result = (0, ToRawPrecision_1.ToRawPrecision)(x, 1, 2);
            if (result.integerDigitsCount > 1) {
                result = (0, ToRawFixed_1.ToRawFixed)(x, 0, 0);
            }
            break;
    }
    x = result.roundedNumber;
    var string = result.formattedString;
    var int = result.integerDigitsCount;
    var minInteger = intlObject.minimumIntegerDigits;
    if (int < minInteger) {
        var forwardZeros = (0, utils_1.repeat)('0', minInteger - int);
        string = forwardZeros + string;
    }
    if (isNegative) {
        x = -x;
    }
    return { roundedNumber: x, formattedString: string };
}
exports.FormatNumericToString = FormatNumericToString;

},{"../262":1,"../utils":45,"./ToRawFixed":30,"./ToRawPrecision":31}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUnsignedRoundingMode = void 0;
var negativeMapping = {
    ceil: 'zero',
    floor: 'infinity',
    expand: 'infinity',
    trunc: 'zero',
    halfCeil: 'half-zero',
    halfFloor: 'half-infinity',
    halfExpand: 'half-infinity',
    halfTrunc: 'half-zero',
    halfEven: 'half-even',
};
var positiveMapping = {
    ceil: 'infinity',
    floor: 'zero',
    expand: 'infinity',
    trunc: 'zero',
    halfCeil: 'half-infinity',
    halfFloor: 'half-zero',
    halfExpand: 'half-infinity',
    halfTrunc: 'half-zero',
    halfEven: 'half-even',
};
function GetUnsignedRoundingMode(roundingMode, isNegative) {
    if (isNegative) {
        return negativeMapping[roundingMode];
    }
    return positiveMapping[roundingMode];
}
exports.GetUnsignedRoundingMode = GetUnsignedRoundingMode;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeNumberFormat = void 0;
var intl_localematcher_1 = require("@formatjs/intl-localematcher");
var CanonicalizeLocaleList_1 = require("../CanonicalizeLocaleList");
var CoerceOptionsToObject_1 = require("../CoerceOptionsToObject");
var GetNumberOption_1 = require("../GetNumberOption");
var GetOption_1 = require("../GetOption");
var GetStringOrBooleanOption_1 = require("../GetStringOrBooleanOption");
var utils_1 = require("../utils");
var CurrencyDigits_1 = require("./CurrencyDigits");
var SetNumberFormatDigitOptions_1 = require("./SetNumberFormatDigitOptions");
var SetNumberFormatUnitOptions_1 = require("./SetNumberFormatUnitOptions");
var VALID_ROUND_INCREMENT_VALUES = [
    1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000,
];
/**
 * https://tc39.es/ecma402/#sec-initializenumberformat
 */
function InitializeNumberFormat(nf, locales, opts, _a) {
    var getInternalSlots = _a.getInternalSlots, localeData = _a.localeData, availableLocales = _a.availableLocales, numberingSystemNames = _a.numberingSystemNames, getDefaultLocale = _a.getDefaultLocale, currencyDigitsData = _a.currencyDigitsData;
    // @ts-ignore
    var requestedLocales = (0, CanonicalizeLocaleList_1.CanonicalizeLocaleList)(locales);
    var options = (0, CoerceOptionsToObject_1.CoerceOptionsToObject)(opts);
    var opt = Object.create(null);
    var matcher = (0, GetOption_1.GetOption)(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    opt.localeMatcher = matcher;
    var numberingSystem = (0, GetOption_1.GetOption)(options, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined &&
        numberingSystemNames.indexOf(numberingSystem) < 0) {
        // 8.a. If numberingSystem does not match the Unicode Locale Identifier type nonterminal,
        // throw a RangeError exception.
        throw RangeError("Invalid numberingSystems: ".concat(numberingSystem));
    }
    opt.nu = numberingSystem;
    var r = (0, intl_localematcher_1.ResolveLocale)(Array.from(availableLocales), requestedLocales, opt, 
    // [[RelevantExtensionKeys]] slot, which is a constant
    ['nu'], localeData, getDefaultLocale);
    var dataLocaleData = localeData[r.dataLocale];
    (0, utils_1.invariant)(!!dataLocaleData, "Missing locale data for ".concat(r.dataLocale));
    var internalSlots = getInternalSlots(nf);
    internalSlots.locale = r.locale;
    internalSlots.dataLocale = r.dataLocale;
    internalSlots.numberingSystem = r.nu;
    internalSlots.dataLocaleData = dataLocaleData;
    (0, SetNumberFormatUnitOptions_1.SetNumberFormatUnitOptions)(nf, options, { getInternalSlots: getInternalSlots });
    var style = internalSlots.style;
    var mnfdDefault;
    var mxfdDefault;
    if (style === 'currency') {
        var currency = internalSlots.currency;
        var cDigits = (0, CurrencyDigits_1.CurrencyDigits)(currency, { currencyDigitsData: currencyDigitsData });
        mnfdDefault = cDigits;
        mxfdDefault = cDigits;
    }
    else {
        mnfdDefault = 0;
        mxfdDefault = style === 'percent' ? 0 : 3;
    }
    var notation = (0, GetOption_1.GetOption)(options, 'notation', 'string', ['standard', 'scientific', 'engineering', 'compact'], 'standard');
    internalSlots.notation = notation;
    (0, SetNumberFormatDigitOptions_1.SetNumberFormatDigitOptions)(internalSlots, options, mnfdDefault, mxfdDefault, notation);
    var roundingIncrement = (0, GetNumberOption_1.GetNumberOption)(options, 'roundingIncrement', 1, 5000, 1);
    if (VALID_ROUND_INCREMENT_VALUES.indexOf(roundingIncrement) === -1) {
        throw new RangeError("Invalid rounding increment value: ".concat(roundingIncrement, ".\nValid values are ").concat(VALID_ROUND_INCREMENT_VALUES, "."));
    }
    if (roundingIncrement !== 1 &&
        internalSlots.roundingType !== 'fractionDigits') {
        throw new TypeError("For roundingIncrement > 1 only fractionDigits is a valid roundingType");
    }
    if (roundingIncrement !== 1 &&
        internalSlots.maximumFractionDigits !== internalSlots.minimumFractionDigits) {
        throw new RangeError('With roundingIncrement > 1, maximumFractionDigits and minimumFractionDigits must be equal.');
    }
    internalSlots.roundingIncrement = roundingIncrement;
    var trailingZeroDisplay = (0, GetOption_1.GetOption)(options, 'trailingZeroDisplay', 'string', ['auto', 'stripIfInteger'], 'auto');
    internalSlots.trailingZeroDisplay = trailingZeroDisplay;
    var compactDisplay = (0, GetOption_1.GetOption)(options, 'compactDisplay', 'string', ['short', 'long'], 'short');
    var defaultUseGrouping = 'auto';
    if (notation === 'compact') {
        internalSlots.compactDisplay = compactDisplay;
        defaultUseGrouping = 'min2';
    }
    internalSlots.useGrouping = (0, GetStringOrBooleanOption_1.GetStringOrBooleanOption)(options, 'useGrouping', ['min2', 'auto', 'always'], 'always', false, defaultUseGrouping);
    internalSlots.signDisplay = (0, GetOption_1.GetOption)(options, 'signDisplay', 'string', ['auto', 'never', 'always', 'exceptZero', 'negative'], 'auto');
    internalSlots.roundingMode = (0, GetOption_1.GetOption)(options, 'roundingMode', 'string', [
        'ceil',
        'floor',
        'expand',
        'trunc',
        'halfCeil',
        'halfFloor',
        'halfExpand',
        'halfTrunc',
        'halfEven',
    ], 'halfExpand');
    return nf;
}
exports.InitializeNumberFormat = InitializeNumberFormat;

},{"../CanonicalizeLocaleList":2,"../CoerceOptionsToObject":4,"../GetNumberOption":6,"../GetOption":7,"../GetStringOrBooleanOption":9,"../utils":45,"./CurrencyDigits":18,"./SetNumberFormatDigitOptions":28,"./SetNumberFormatUnitOptions":29,"@formatjs/intl-localematcher":79}],26:[function(require,module,exports){
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
    else if (x == Number.POSITIVE_INFINITY || x == Number.NEGATIVE_INFINITY) {
        n = symbols.infinity;
    }
    else {
        if (!(0, _262_1.SameValue)(x, -0)) {
            if (!isFinite(x)) {
                throw new Error('Input must be a mathematical value');
            }
            if (internalSlots.style == 'percent') {
                x *= 100;
            }
            ;
            _b = (0, ComputeExponent_1.ComputeExponent)(numberFormat, x, {
                getInternalSlots: getInternalSlots,
            }), exponent = _b[0], magnitude = _b[1];
            // Preserve more precision by doing multiplication when exponent is negative.
            x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
        }
        var formatNumberResult = (0, FormatNumericToString_1.FormatNumericToString)(internalSlots, x);
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
            if ((0, _262_1.SameValue)(x, 0) || x > 0 || isNaN(x)) {
                sign = 0;
            }
            else {
                sign = -1;
            }
            break;
        case 'always':
            if ((0, _262_1.SameValue)(x, 0) || x > 0 || isNaN(x)) {
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
    return (0, format_to_parts_1.default)({ roundedNumber: x, formattedString: n, exponent: exponent, magnitude: magnitude, sign: sign }, internalSlots.dataLocaleData, pl, internalSlots);
}
exports.PartitionNumberPattern = PartitionNumberPattern;

},{"../262":1,"./ComputeExponent":16,"./FormatNumericToString":23,"./format_to_parts":33,"tslib":80}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionNumberRangePattern = void 0;
var PartitionNumberPattern_1 = require("./PartitionNumberPattern");
var CollapseNumberRange_1 = require("./CollapseNumberRange");
var FormatApproximately_1 = require("./FormatApproximately");
/**
 * https://tc39.es/ecma402/#sec-partitionnumberrangepattern
 */
function PartitionNumberRangePattern(numberFormat, x, y, _a) {
    var getInternalSlots = _a.getInternalSlots;
    if (isNaN(x) || isNaN(y)) {
        throw new RangeError('Input must be a number');
    }
    var result = [];
    var xResult = (0, PartitionNumberPattern_1.PartitionNumberPattern)(numberFormat, x, { getInternalSlots: getInternalSlots });
    var yResult = (0, PartitionNumberPattern_1.PartitionNumberPattern)(numberFormat, y, { getInternalSlots: getInternalSlots });
    if (xResult === yResult) {
        return (0, FormatApproximately_1.FormatApproximately)(numberFormat, xResult, { getInternalSlots: getInternalSlots });
    }
    for (var _i = 0, xResult_1 = xResult; _i < xResult_1.length; _i++) {
        var r = xResult_1[_i];
        r.source = 'startRange';
    }
    result = result.concat(xResult);
    var internalSlots = getInternalSlots(numberFormat);
    var symbols = internalSlots.dataLocaleData.numbers.symbols[internalSlots.numberingSystem];
    result.push({ type: 'literal', value: symbols.rangeSign, source: 'shared' });
    for (var _b = 0, yResult_1 = yResult; _b < yResult_1.length; _b++) {
        var r = yResult_1[_b];
        r.source = 'endRange';
    }
    result = result.concat(yResult);
    return (0, CollapseNumberRange_1.CollapseNumberRange)(result);
}
exports.PartitionNumberRangePattern = PartitionNumberRangePattern;

},{"./CollapseNumberRange":15,"./FormatApproximately":19,"./PartitionNumberPattern":26}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNumberFormatDigitOptions = void 0;
var DefaultNumberOption_1 = require("../DefaultNumberOption");
var GetNumberOption_1 = require("../GetNumberOption");
var GetOption_1 = require("../GetOption");
/**
 * https://tc39.es/ecma402/#sec-setnfdigitoptions
 */
function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
    var mnid = (0, GetNumberOption_1.GetNumberOption)(opts, 'minimumIntegerDigits', 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    internalSlots.minimumIntegerDigits = mnid;
    var roundingPriority = (0, GetOption_1.GetOption)(opts, 'roundingPriority', 'string', ['auto', 'morePrecision', 'lessPrecision'], 'auto');
    var hasSd = mnsd !== undefined || mxsd !== undefined;
    var hasFd = mnfd !== undefined || mxfd !== undefined;
    var needSd = true;
    var needFd = true;
    if (roundingPriority === 'auto') {
        needSd = hasSd;
        if (hasSd || (!hasFd && notation === 'compact')) {
            needFd = false;
        }
    }
    if (needSd) {
        if (hasSd) {
            mnsd = (0, DefaultNumberOption_1.DefaultNumberOption)(mnsd, 1, 21, 1);
            mxsd = (0, DefaultNumberOption_1.DefaultNumberOption)(mxsd, mnsd, 21, 21);
            internalSlots.minimumSignificantDigits = mnsd;
            internalSlots.maximumSignificantDigits = mxsd;
        }
        else {
            internalSlots.minimumSignificantDigits = 1;
            internalSlots.maximumSignificantDigits = 21;
        }
    }
    if (needFd) {
        if (hasFd) {
            mnfd = (0, DefaultNumberOption_1.DefaultNumberOption)(mnfd, 0, 20, undefined);
            mxfd = (0, DefaultNumberOption_1.DefaultNumberOption)(mxfd, 0, 20, undefined);
            if (mnfd === undefined) {
                // @ts-expect-error
                mnfd = Math.min(mnfdDefault, mxfd);
            }
            else if (mxfd === undefined) {
                mxfd = Math.max(mxfdDefault, mnfd);
            }
            else if (mnfd > mxfd) {
                throw new RangeError("Invalid range, ".concat(mnfd, " > ").concat(mxfd));
            }
            internalSlots.minimumFractionDigits = mnfd;
            internalSlots.maximumFractionDigits = mxfd;
        }
        else {
            internalSlots.minimumFractionDigits = mnfdDefault;
            internalSlots.maximumFractionDigits = mxfdDefault;
        }
    }
    if (needSd || needFd) {
        if (roundingPriority === 'morePrecision') {
            internalSlots.roundingType = 'morePrecision';
        }
        else if (roundingPriority === 'lessPrecision') {
            internalSlots.roundingType = 'lessPrecision';
        }
        else if (hasSd) {
            internalSlots.roundingType = 'significantDigits';
        }
        else {
            internalSlots.roundingType = 'fractionDigits';
        }
    }
    else {
        internalSlots.roundingType = 'morePrecision';
        internalSlots.minimumFractionDigits = 0;
        internalSlots.maximumFractionDigits = 0;
        internalSlots.minimumSignificantDigits = 1;
        internalSlots.maximumSignificantDigits = 2;
    }
}
exports.SetNumberFormatDigitOptions = SetNumberFormatDigitOptions;

},{"../DefaultNumberOption":5,"../GetNumberOption":6,"../GetOption":7}],29:[function(require,module,exports){
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
    var style = (0, GetOption_1.GetOption)(options, 'style', 'string', ['decimal', 'percent', 'currency', 'unit'], 'decimal');
    internalSlots.style = style;
    var currency = (0, GetOption_1.GetOption)(options, 'currency', 'string', undefined, undefined);
    if (currency !== undefined && !(0, IsWellFormedCurrencyCode_1.IsWellFormedCurrencyCode)(currency)) {
        throw RangeError('Malformed currency code');
    }
    if (style === 'currency' && currency === undefined) {
        throw TypeError('currency cannot be undefined');
    }
    var currencyDisplay = (0, GetOption_1.GetOption)(options, 'currencyDisplay', 'string', ['code', 'symbol', 'narrowSymbol', 'name'], 'symbol');
    var currencySign = (0, GetOption_1.GetOption)(options, 'currencySign', 'string', ['standard', 'accounting'], 'standard');
    var unit = (0, GetOption_1.GetOption)(options, 'unit', 'string', undefined, undefined);
    if (unit !== undefined && !(0, IsWellFormedUnitIdentifier_1.IsWellFormedUnitIdentifier)(unit)) {
        throw RangeError('Invalid unit argument for Intl.NumberFormat()');
    }
    if (style === 'unit' && unit === undefined) {
        throw TypeError('unit cannot be undefined');
    }
    var unitDisplay = (0, GetOption_1.GetOption)(options, 'unitDisplay', 'string', ['short', 'narrow', 'long'], 'short');
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

},{"../GetOption":7,"../IsWellFormedCurrencyCode":12,"../IsWellFormedUnitIdentifier":13}],30:[function(require,module,exports){
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
        m = m + (0, utils_1.repeat)('0', Math.max(+exponent - m.length + 1, 0));
    }
    var int;
    if (f !== 0) {
        var k = m.length;
        if (k <= f) {
            var z = (0, utils_1.repeat)('0', f + 1 - k);
            m = z + m;
            k = f + 1;
        }
        var a = m.slice(0, k - f);
        var b = m.slice(k - f);
        m = "".concat(a, ".").concat(b);
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

},{"../utils":45}],31:[function(require,module,exports){
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
        m = (0, utils_1.repeat)('0', p);
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
                    (0, utils_1.repeat)('0', p - xToStringMantissaWithoutDecimalPoint.length);
            xFinal = x;
        }
        else {
            e = (0, utils_1.getMagnitude)(x);
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
        m = m + (0, utils_1.repeat)('0', e - p + 1);
        int = e + 1;
    }
    else if (e >= 0) {
        m = "".concat(m.slice(0, e + 1), ".").concat(m.slice(e + 1));
        int = e + 1;
    }
    else {
        m = "0.".concat((0, utils_1.repeat)('0', -e - 1)).concat(m);
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

},{"../utils":45}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitMapping = void 0;
exports.digitMapping = {
    "adlm": [
        "𞥐",
        "𞥑",
        "𞥒",
        "𞥓",
        "𞥔",
        "𞥕",
        "𞥖",
        "𞥗",
        "𞥘",
        "𞥙"
    ],
    "ahom": [
        "𑜰",
        "𑜱",
        "𑜲",
        "𑜳",
        "𑜴",
        "𑜵",
        "𑜶",
        "𑜷",
        "𑜸",
        "𑜹"
    ],
    "arab": [
        "٠",
        "١",
        "٢",
        "٣",
        "٤",
        "٥",
        "٦",
        "٧",
        "٨",
        "٩"
    ],
    "arabext": [
        "۰",
        "۱",
        "۲",
        "۳",
        "۴",
        "۵",
        "۶",
        "۷",
        "۸",
        "۹"
    ],
    "bali": [
        "᭐",
        "᭑",
        "᭒",
        "᭓",
        "᭔",
        "᭕",
        "᭖",
        "᭗",
        "᭘",
        "᭙"
    ],
    "beng": [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯"
    ],
    "bhks": [
        "𑱐",
        "𑱑",
        "𑱒",
        "𑱓",
        "𑱔",
        "𑱕",
        "𑱖",
        "𑱗",
        "𑱘",
        "𑱙"
    ],
    "brah": [
        "𑁦",
        "𑁧",
        "𑁨",
        "𑁩",
        "𑁪",
        "𑁫",
        "𑁬",
        "𑁭",
        "𑁮",
        "𑁯"
    ],
    "cakm": [
        "𑄶",
        "𑄷",
        "𑄸",
        "𑄹",
        "𑄺",
        "𑄻",
        "𑄼",
        "𑄽",
        "𑄾",
        "𑄿"
    ],
    "cham": [
        "꩐",
        "꩑",
        "꩒",
        "꩓",
        "꩔",
        "꩕",
        "꩖",
        "꩗",
        "꩘",
        "꩙"
    ],
    "deva": [
        "०",
        "१",
        "२",
        "३",
        "४",
        "५",
        "६",
        "७",
        "८",
        "९"
    ],
    "diak": [
        "𑥐",
        "𑥑",
        "𑥒",
        "𑥓",
        "𑥔",
        "𑥕",
        "𑥖",
        "𑥗",
        "𑥘",
        "𑥙"
    ],
    "fullwide": [
        "０",
        "１",
        "２",
        "３",
        "４",
        "５",
        "６",
        "７",
        "８",
        "９"
    ],
    "gong": [
        "𑶠",
        "𑶡",
        "𑶢",
        "𑶣",
        "𑶤",
        "𑶥",
        "𑶦",
        "𑶧",
        "𑶨",
        "𑶩"
    ],
    "gonm": [
        "𑵐",
        "𑵑",
        "𑵒",
        "𑵓",
        "𑵔",
        "𑵕",
        "𑵖",
        "𑵗",
        "𑵘",
        "𑵙"
    ],
    "gujr": [
        "૦",
        "૧",
        "૨",
        "૩",
        "૪",
        "૫",
        "૬",
        "૭",
        "૮",
        "૯"
    ],
    "guru": [
        "੦",
        "੧",
        "੨",
        "੩",
        "੪",
        "੫",
        "੬",
        "੭",
        "੮",
        "੯"
    ],
    "hanidec": [
        "〇",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
    ],
    "hmng": [
        "𖭐",
        "𖭑",
        "𖭒",
        "𖭓",
        "𖭔",
        "𖭕",
        "𖭖",
        "𖭗",
        "𖭘",
        "𖭙"
    ],
    "hmnp": [
        "𞅀",
        "𞅁",
        "𞅂",
        "𞅃",
        "𞅄",
        "𞅅",
        "𞅆",
        "𞅇",
        "𞅈",
        "𞅉"
    ],
    "java": [
        "꧐",
        "꧑",
        "꧒",
        "꧓",
        "꧔",
        "꧕",
        "꧖",
        "꧗",
        "꧘",
        "꧙"
    ],
    "kali": [
        "꤀",
        "꤁",
        "꤂",
        "꤃",
        "꤄",
        "꤅",
        "꤆",
        "꤇",
        "꤈",
        "꤉"
    ],
    "khmr": [
        "០",
        "១",
        "២",
        "៣",
        "៤",
        "៥",
        "៦",
        "៧",
        "៨",
        "៩"
    ],
    "knda": [
        "೦",
        "೧",
        "೨",
        "೩",
        "೪",
        "೫",
        "೬",
        "೭",
        "೮",
        "೯"
    ],
    "lana": [
        "᪀",
        "᪁",
        "᪂",
        "᪃",
        "᪄",
        "᪅",
        "᪆",
        "᪇",
        "᪈",
        "᪉"
    ],
    "lanatham": [
        "᪐",
        "᪑",
        "᪒",
        "᪓",
        "᪔",
        "᪕",
        "᪖",
        "᪗",
        "᪘",
        "᪙"
    ],
    "laoo": [
        "໐",
        "໑",
        "໒",
        "໓",
        "໔",
        "໕",
        "໖",
        "໗",
        "໘",
        "໙"
    ],
    "lepc": [
        "᪐",
        "᪑",
        "᪒",
        "᪓",
        "᪔",
        "᪕",
        "᪖",
        "᪗",
        "᪘",
        "᪙"
    ],
    "limb": [
        "᥆",
        "᥇",
        "᥈",
        "᥉",
        "᥊",
        "᥋",
        "᥌",
        "᥍",
        "᥎",
        "᥏"
    ],
    "mathbold": [
        "𝟎",
        "𝟏",
        "𝟐",
        "𝟑",
        "𝟒",
        "𝟓",
        "𝟔",
        "𝟕",
        "𝟖",
        "𝟗"
    ],
    "mathdbl": [
        "𝟘",
        "𝟙",
        "𝟚",
        "𝟛",
        "𝟜",
        "𝟝",
        "𝟞",
        "𝟟",
        "𝟠",
        "𝟡"
    ],
    "mathmono": [
        "𝟶",
        "𝟷",
        "𝟸",
        "𝟹",
        "𝟺",
        "𝟻",
        "𝟼",
        "𝟽",
        "𝟾",
        "𝟿"
    ],
    "mathsanb": [
        "𝟬",
        "𝟭",
        "𝟮",
        "𝟯",
        "𝟰",
        "𝟱",
        "𝟲",
        "𝟳",
        "𝟴",
        "𝟵"
    ],
    "mathsans": [
        "𝟢",
        "𝟣",
        "𝟤",
        "𝟥",
        "𝟦",
        "𝟧",
        "𝟨",
        "𝟩",
        "𝟪",
        "𝟫"
    ],
    "mlym": [
        "൦",
        "൧",
        "൨",
        "൩",
        "൪",
        "൫",
        "൬",
        "൭",
        "൮",
        "൯"
    ],
    "modi": [
        "𑙐",
        "𑙑",
        "𑙒",
        "𑙓",
        "𑙔",
        "𑙕",
        "𑙖",
        "𑙗",
        "𑙘",
        "𑙙"
    ],
    "mong": [
        "᠐",
        "᠑",
        "᠒",
        "᠓",
        "᠔",
        "᠕",
        "᠖",
        "᠗",
        "᠘",
        "᠙"
    ],
    "mroo": [
        "𖩠",
        "𖩡",
        "𖩢",
        "𖩣",
        "𖩤",
        "𖩥",
        "𖩦",
        "𖩧",
        "𖩨",
        "𖩩"
    ],
    "mtei": [
        "꯰",
        "꯱",
        "꯲",
        "꯳",
        "꯴",
        "꯵",
        "꯶",
        "꯷",
        "꯸",
        "꯹"
    ],
    "mymr": [
        "၀",
        "၁",
        "၂",
        "၃",
        "၄",
        "၅",
        "၆",
        "၇",
        "၈",
        "၉"
    ],
    "mymrshan": [
        "႐",
        "႑",
        "႒",
        "႓",
        "႔",
        "႕",
        "႖",
        "႗",
        "႘",
        "႙"
    ],
    "mymrtlng": [
        "꧰",
        "꧱",
        "꧲",
        "꧳",
        "꧴",
        "꧵",
        "꧶",
        "꧷",
        "꧸",
        "꧹"
    ],
    "newa": [
        "𑑐",
        "𑑑",
        "𑑒",
        "𑑓",
        "𑑔",
        "𑑕",
        "𑑖",
        "𑑗",
        "𑑘",
        "𑑙"
    ],
    "nkoo": [
        "߀",
        "߁",
        "߂",
        "߃",
        "߄",
        "߅",
        "߆",
        "߇",
        "߈",
        "߉"
    ],
    "olck": [
        "᱐",
        "᱑",
        "᱒",
        "᱓",
        "᱔",
        "᱕",
        "᱖",
        "᱗",
        "᱘",
        "᱙"
    ],
    "orya": [
        "୦",
        "୧",
        "୨",
        "୩",
        "୪",
        "୫",
        "୬",
        "୭",
        "୮",
        "୯"
    ],
    "osma": [
        "𐒠",
        "𐒡",
        "𐒢",
        "𐒣",
        "𐒤",
        "𐒥",
        "𐒦",
        "𐒧",
        "𐒨",
        "𐒩"
    ],
    "rohg": [
        "𐴰",
        "𐴱",
        "𐴲",
        "𐴳",
        "𐴴",
        "𐴵",
        "𐴶",
        "𐴷",
        "𐴸",
        "𐴹"
    ],
    "saur": [
        "꣐",
        "꣑",
        "꣒",
        "꣓",
        "꣔",
        "꣕",
        "꣖",
        "꣗",
        "꣘",
        "꣙"
    ],
    "segment": [
        "🯰",
        "🯱",
        "🯲",
        "🯳",
        "🯴",
        "🯵",
        "🯶",
        "🯷",
        "🯸",
        "🯹"
    ],
    "shrd": [
        "𑇐",
        "𑇑",
        "𑇒",
        "𑇓",
        "𑇔",
        "𑇕",
        "𑇖",
        "𑇗",
        "𑇘",
        "𑇙"
    ],
    "sind": [
        "𑋰",
        "𑋱",
        "𑋲",
        "𑋳",
        "𑋴",
        "𑋵",
        "𑋶",
        "𑋷",
        "𑋸",
        "𑋹"
    ],
    "sinh": [
        "෦",
        "෧",
        "෨",
        "෩",
        "෪",
        "෫",
        "෬",
        "෭",
        "෮",
        "෯"
    ],
    "sora": [
        "𑃰",
        "𑃱",
        "𑃲",
        "𑃳",
        "𑃴",
        "𑃵",
        "𑃶",
        "𑃷",
        "𑃸",
        "𑃹"
    ],
    "sund": [
        "᮰",
        "᮱",
        "᮲",
        "᮳",
        "᮴",
        "᮵",
        "᮶",
        "᮷",
        "᮸",
        "᮹"
    ],
    "takr": [
        "𑛀",
        "𑛁",
        "𑛂",
        "𑛃",
        "𑛄",
        "𑛅",
        "𑛆",
        "𑛇",
        "𑛈",
        "𑛉"
    ],
    "talu": [
        "᧐",
        "᧑",
        "᧒",
        "᧓",
        "᧔",
        "᧕",
        "᧖",
        "᧗",
        "᧘",
        "᧙"
    ],
    "tamldec": [
        "௦",
        "௧",
        "௨",
        "௩",
        "௪",
        "௫",
        "௬",
        "௭",
        "௮",
        "௯"
    ],
    "telu": [
        "౦",
        "౧",
        "౨",
        "౩",
        "౪",
        "౫",
        "౬",
        "౭",
        "౮",
        "౯"
    ],
    "thai": [
        "๐",
        "๑",
        "๒",
        "๓",
        "๔",
        "๕",
        "๖",
        "๗",
        "๘",
        "๙"
    ],
    "tibt": [
        "༠",
        "༡",
        "༢",
        "༣",
        "༤",
        "༥",
        "༦",
        "༧",
        "༨",
        "༩"
    ],
    "tirh": [
        "𑓐",
        "𑓑",
        "𑓒",
        "𑓓",
        "𑓔",
        "𑓕",
        "𑓖",
        "𑓗",
        "𑓘",
        "𑓙"
    ],
    "vaii": [
        "ᘠ",
        "ᘡ",
        "ᘢ",
        "ᘣ",
        "ᘤ",
        "ᘥ",
        "ᘦ",
        "ᘧ",
        "ᘨ",
        "ᘩ"
    ],
    "wara": [
        "𑣠",
        "𑣡",
        "𑣢",
        "𑣣",
        "𑣤",
        "𑣥",
        "𑣦",
        "𑣧",
        "𑣨",
        "𑣩"
    ],
    "wcho": [
        "𞋰",
        "𞋱",
        "𞋲",
        "𞋳",
        "𞋴",
        "𞋵",
        "𞋶",
        "𞋷",
        "𞋸",
        "𞋹"
    ]
};

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var regex_generated_1 = require("../regex.generated");
var ToRawFixed_1 = require("./ToRawFixed");
var digit_mapping_generated_1 = require("./digit-mapping.generated");
// This is from: unicode-12.1.0/General_Category/Symbol/regex.js
// IE11 does not support unicode flag, otherwise this is just /\p{S}/u.
// /^\p{S}/u
var CARET_S_UNICODE_REGEX = new RegExp("^".concat(regex_generated_1.S_UNICODE_REGEX.source));
// /\p{S}$/u
var S_DOLLAR_UNICODE_REGEX = new RegExp("".concat(regex_generated_1.S_UNICODE_REGEX.source, "$"));
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
            numberPattern = numberPattern.replace('¤{0}', "\u00A4".concat(afterCurrency, "{0}"));
        }
        var beforeCurrency = currencyData.currencySpacing.beforeInsertBetween;
        if (beforeCurrency && !CARET_S_UNICODE_REGEX.test(nonNameCurrencyPart)) {
            numberPattern = numberPattern.replace('{0}¤', "{0}".concat(beforeCurrency, "\u00A4"));
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
                !compactNumberPattern && Boolean(options.useGrouping), decimalNumberPattern, style));
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
decimalNumberPattern, style) {
    var result = [];
    // eslint-disable-next-line prefer-const
    var n = numberResult.formattedString, x = numberResult.roundedNumber;
    if (isNaN(x)) {
        return [{ type: 'nan', value: n }];
    }
    else if (!isFinite(x)) {
        return [{ type: 'infinity', value: n }];
    }
    var digitReplacementTable = digit_mapping_generated_1.digitMapping[numberingSystem];
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
        // a. Let groupSepSymbol be the implementation-, locale-, and numbering system-dependent (ILND) String representing the grouping separator.
        // For currency we should use `currencyGroup` instead of generic `group`
        var groupSepSymbol = style === 'currency' && symbols.currencyGroup != null
            ? symbols.currencyGroup
            : symbols.group;
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
        var decimalSepSymbol = style === 'currency' && symbols.currencyDecimal != null
            ? symbols.currencyDecimal
            : symbols.decimal;
        result.push({ type: 'decimal', value: decimalSepSymbol }, { type: 'fraction', value: fraction });
    }
    if ((notation === 'scientific' || notation === 'engineering') &&
        isFinite(x)) {
        result.push({ type: 'exponentSeparator', value: symbols.exponential });
        if (exponent < 0) {
            result.push({ type: 'exponentMinusSign', value: symbols.minusSign });
            exponent = -exponent;
        }
        var exponentResult = (0, ToRawFixed_1.ToRawFixed)(exponent, 0, 0);
        result.push({
            type: 'exponentInteger',
            value: exponentResult.formattedString,
        });
    }
    return result;
}
function getPatternForSign(pattern, sign) {
    if (pattern.indexOf(';') < 0) {
        pattern = "".concat(pattern, ";-").concat(pattern);
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
                : "+".concat(zeroPattern);
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

},{"../regex.generated":38,"./ToRawFixed":30,"./digit-mapping.generated":32}],34:[function(require,module,exports){
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
        (0, utils_1.invariant)(endIndex > beginIndex, "Invalid pattern ".concat(pattern));
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

},{"./utils":45}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedLocales = void 0;
var intl_localematcher_1 = require("@formatjs/intl-localematcher");
var _262_1 = require("./262");
var GetOption_1 = require("./GetOption");
/**
 * https://tc39.es/ecma402/#sec-supportedlocales
 * @param availableLocales
 * @param requestedLocales
 * @param options
 */
function SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = 'best fit';
    if (options !== undefined) {
        options = (0, _262_1.ToObject)(options);
        matcher = (0, GetOption_1.GetOption)(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    }
    if (matcher === 'best fit') {
        return (0, intl_localematcher_1.LookupSupportedLocales)(Array.from(availableLocales), requestedLocales);
    }
    return (0, intl_localematcher_1.LookupSupportedLocales)(Array.from(availableLocales), requestedLocales);
}
exports.SupportedLocales = SupportedLocales;

},{"./262":1,"./GetOption":7,"@formatjs/intl-localematcher":79}],36:[function(require,module,exports){
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

},{"tslib":80}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = exports.isMissingLocaleDataError = exports.setMultiInternalSlots = exports.setInternalSlot = exports.isLiteralPart = exports.getMultiInternalSlots = exports.getMagnitude = exports.getInternalSlot = exports.defineProperty = exports.createDataProperty = exports._formatToParts = void 0;
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./CanonicalizeLocaleList"), exports);
tslib_1.__exportStar(require("./CanonicalizeTimeZoneName"), exports);
tslib_1.__exportStar(require("./CoerceOptionsToObject"), exports);
tslib_1.__exportStar(require("./GetNumberOption"), exports);
tslib_1.__exportStar(require("./GetOption"), exports);
tslib_1.__exportStar(require("./GetOptionsObject"), exports);
tslib_1.__exportStar(require("./GetStringOrBooleanOption"), exports);
tslib_1.__exportStar(require("./IsSanctionedSimpleUnitIdentifier"), exports);
tslib_1.__exportStar(require("./IsValidTimeZoneName"), exports);
tslib_1.__exportStar(require("./IsWellFormedCurrencyCode"), exports);
tslib_1.__exportStar(require("./IsWellFormedUnitIdentifier"), exports);
tslib_1.__exportStar(require("./NumberFormat/ApplyUnsignedRoundingMode"), exports);
tslib_1.__exportStar(require("./NumberFormat/CollapseNumberRange"), exports);
tslib_1.__exportStar(require("./NumberFormat/ComputeExponent"), exports);
tslib_1.__exportStar(require("./NumberFormat/ComputeExponentForMagnitude"), exports);
tslib_1.__exportStar(require("./NumberFormat/CurrencyDigits"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatApproximately"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericRange"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericRangeToParts"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericToParts"), exports);
tslib_1.__exportStar(require("./NumberFormat/FormatNumericToString"), exports);
tslib_1.__exportStar(require("./NumberFormat/GetUnsignedRoundingMode"), exports);
tslib_1.__exportStar(require("./NumberFormat/InitializeNumberFormat"), exports);
tslib_1.__exportStar(require("./NumberFormat/PartitionNumberPattern"), exports);
tslib_1.__exportStar(require("./NumberFormat/PartitionNumberRangePattern"), exports);
tslib_1.__exportStar(require("./NumberFormat/SetNumberFormatDigitOptions"), exports);
tslib_1.__exportStar(require("./NumberFormat/SetNumberFormatUnitOptions"), exports);
tslib_1.__exportStar(require("./NumberFormat/ToRawFixed"), exports);
tslib_1.__exportStar(require("./NumberFormat/ToRawPrecision"), exports);
var format_to_parts_1 = require("./NumberFormat/format_to_parts");
Object.defineProperty(exports, "_formatToParts", { enumerable: true, get: function () { return tslib_1.__importDefault(format_to_parts_1).default; } });
tslib_1.__exportStar(require("./PartitionPattern"), exports);
tslib_1.__exportStar(require("./SupportedLocales"), exports);
var utils_1 = require("./utils");
Object.defineProperty(exports, "createDataProperty", { enumerable: true, get: function () { return utils_1.createDataProperty; } });
Object.defineProperty(exports, "defineProperty", { enumerable: true, get: function () { return utils_1.defineProperty; } });
Object.defineProperty(exports, "getInternalSlot", { enumerable: true, get: function () { return utils_1.getInternalSlot; } });
Object.defineProperty(exports, "getMagnitude", { enumerable: true, get: function () { return utils_1.getMagnitude; } });
Object.defineProperty(exports, "getMultiInternalSlots", { enumerable: true, get: function () { return utils_1.getMultiInternalSlots; } });
Object.defineProperty(exports, "isLiteralPart", { enumerable: true, get: function () { return utils_1.isLiteralPart; } });
Object.defineProperty(exports, "setInternalSlot", { enumerable: true, get: function () { return utils_1.setInternalSlot; } });
Object.defineProperty(exports, "setMultiInternalSlots", { enumerable: true, get: function () { return utils_1.setMultiInternalSlots; } });
tslib_1.__exportStar(require("./262"), exports);
var data_1 = require("./data");
Object.defineProperty(exports, "isMissingLocaleDataError", { enumerable: true, get: function () { return data_1.isMissingLocaleDataError; } });
tslib_1.__exportStar(require("./types/date-time"), exports);
tslib_1.__exportStar(require("./types/displaynames"), exports);
tslib_1.__exportStar(require("./types/list"), exports);
tslib_1.__exportStar(require("./types/number"), exports);
tslib_1.__exportStar(require("./types/plural-rules"), exports);
tslib_1.__exportStar(require("./types/relative-time"), exports);
var utils_2 = require("./utils");
Object.defineProperty(exports, "invariant", { enumerable: true, get: function () { return utils_2.invariant; } });

},{"./262":1,"./CanonicalizeLocaleList":2,"./CanonicalizeTimeZoneName":3,"./CoerceOptionsToObject":4,"./GetNumberOption":6,"./GetOption":7,"./GetOptionsObject":8,"./GetStringOrBooleanOption":9,"./IsSanctionedSimpleUnitIdentifier":10,"./IsValidTimeZoneName":11,"./IsWellFormedCurrencyCode":12,"./IsWellFormedUnitIdentifier":13,"./NumberFormat/ApplyUnsignedRoundingMode":14,"./NumberFormat/CollapseNumberRange":15,"./NumberFormat/ComputeExponent":16,"./NumberFormat/ComputeExponentForMagnitude":17,"./NumberFormat/CurrencyDigits":18,"./NumberFormat/FormatApproximately":19,"./NumberFormat/FormatNumericRange":20,"./NumberFormat/FormatNumericRangeToParts":21,"./NumberFormat/FormatNumericToParts":22,"./NumberFormat/FormatNumericToString":23,"./NumberFormat/GetUnsignedRoundingMode":24,"./NumberFormat/InitializeNumberFormat":25,"./NumberFormat/PartitionNumberPattern":26,"./NumberFormat/PartitionNumberRangePattern":27,"./NumberFormat/SetNumberFormatDigitOptions":28,"./NumberFormat/SetNumberFormatUnitOptions":29,"./NumberFormat/ToRawFixed":30,"./NumberFormat/ToRawPrecision":31,"./NumberFormat/format_to_parts":33,"./PartitionPattern":34,"./SupportedLocales":35,"./data":36,"./types/date-time":39,"./types/displaynames":40,"./types/list":41,"./types/number":42,"./types/plural-rules":43,"./types/relative-time":44,"./utils":45,"tslib":80}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S_UNICODE_REGEX = void 0;
// @generated from regex-gen.ts
exports.S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangePatternType = void 0;
var RangePatternType;
(function (RangePatternType) {
    RangePatternType["startRange"] = "startRange";
    RangePatternType["shared"] = "shared";
    RangePatternType["endRange"] = "endRange";
})(RangePatternType || (exports.RangePatternType = RangePatternType = {}));

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],42:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],43:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],44:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = exports.UNICODE_EXTENSION_SEQUENCE_REGEX = exports.createDataProperty = exports.defineProperty = exports.isLiteralPart = exports.getMultiInternalSlots = exports.getInternalSlot = exports.setMultiInternalSlots = exports.setInternalSlot = exports.repeat = exports.getMagnitude = void 0;
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
        throw new TypeError("".concat(pl, " InternalSlot has not been initialized"));
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
/**
 * 7.3.5 CreateDataProperty
 * @param target
 * @param name
 * @param value
 */
function createDataProperty(target, name, value) {
    Object.defineProperty(target, name, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: value,
    });
}
exports.createDataProperty = createDataProperty;
exports.UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
function invariant(condition, message, Err) {
    if (Err === void 0) { Err = Error; }
    if (!condition) {
        throw new Err(message);
    }
}
exports.invariant = invariant;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./src/core"), exports);

},{"./src/core":63,"tslib":80}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPolyfill = void 0;
var intl_localematcher_1 = require("@formatjs/intl-localematcher");
var supported_locales_generated_1 = require("./supported-locales.generated");
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
function supportedLocalesOf(locale) {
    if (!locale) {
        return true;
    }
    var locales = Array.isArray(locale) ? locale : [locale];
    return (Intl.DateTimeFormat.supportedLocalesOf(locales).length === locales.length);
}
function shouldPolyfill(locale) {
    if (locale === void 0) { locale = 'en'; }
    if (!('DateTimeFormat' in Intl) ||
        !('formatToParts' in Intl.DateTimeFormat.prototype) ||
        !('formatRange' in Intl.DateTimeFormat.prototype) ||
        hasChromeLt71Bug() ||
        hasUnthrownDateTimeStyleBug() ||
        !supportsDateStyle() ||
        !supportedLocalesOf(locale)) {
        return locale ? (0, intl_localematcher_1.match)([locale], supported_locales_generated_1.supportedLocales, 'en') : undefined;
    }
}
exports.shouldPolyfill = shouldPolyfill;

},{"./supported-locales.generated":68,"@formatjs/intl-localematcher":79}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicFormatMatcher = void 0;
var tslib_1 = require("tslib");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-basicformatmatcher
 * @param options
 * @param formats
 */
function BasicFormatMatcher(options, formats) {
    var bestScore = -Infinity;
    var bestFormat = formats[0];
    (0, ecma402_abstract_1.invariant)(Array.isArray(formats), 'formats should be a list of things');
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
        var format = formats_1[_i];
        var score = 0;
        for (var _a = 0, DATE_TIME_PROPS_1 = utils_1.DATE_TIME_PROPS; _a < DATE_TIME_PROPS_1.length; _a++) {
            var prop = DATE_TIME_PROPS_1[_a];
            var optionsProp = options[prop];
            var formatProp = format[prop];
            if (optionsProp === undefined && formatProp !== undefined) {
                score -= utils_1.additionPenalty;
            }
            else if (optionsProp !== undefined && formatProp === undefined) {
                score -= utils_1.removalPenalty;
            }
            else if (prop === 'timeZoneName') {
                if (optionsProp === 'short' || optionsProp === 'shortGeneric') {
                    if (formatProp === 'shortOffset') {
                        score -= utils_1.offsetPenalty;
                    }
                    else if (formatProp === 'longOffset') {
                        score -= utils_1.offsetPenalty + utils_1.shortMorePenalty;
                    }
                    else if (optionsProp === 'short' && formatProp === 'long') {
                        score -= utils_1.shortMorePenalty;
                    }
                    else if (optionsProp === 'shortGeneric' &&
                        formatProp === 'longGeneric') {
                        score -= utils_1.shortMorePenalty;
                    }
                    else if (optionsProp !== formatProp) {
                        score -= utils_1.removalPenalty;
                    }
                }
                else if (optionsProp === 'shortOffset' &&
                    formatProp === 'longOffset') {
                    score -= utils_1.shortMorePenalty;
                }
                else if (optionsProp === 'long' || optionsProp === 'longGeneric') {
                    if (formatProp === 'longOffset') {
                        score -= utils_1.offsetPenalty;
                    }
                    else if (formatProp === 'shortOffset') {
                        score -= utils_1.offsetPenalty + utils_1.longLessPenalty;
                    }
                    else if (optionsProp === 'long' && formatProp === 'short') {
                        score -= utils_1.longLessPenalty;
                    }
                    else if (optionsProp === 'longGeneric' &&
                        formatProp === 'shortGeneric') {
                        score -= utils_1.longLessPenalty;
                    }
                    else if (optionsProp !== formatProp) {
                        score -= utils_1.removalPenalty;
                    }
                }
                else if (optionsProp === 'longOffset' &&
                    formatProp === 'shortOffset') {
                    score -= utils_1.longLessPenalty;
                }
                else if (optionsProp !== formatProp) {
                    score -= utils_1.removalPenalty;
                }
            }
            else if (optionsProp !== formatProp) {
                var values = void 0;
                if (prop === 'fractionalSecondDigits') {
                    values = [1, 2, 3];
                }
                else {
                    values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];
                }
                var optionsPropIndex = values.indexOf(optionsProp);
                var formatPropIndex = values.indexOf(formatProp);
                var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
                if (delta === 2) {
                    score -= utils_1.longMorePenalty;
                }
                else if (delta === 1) {
                    score -= utils_1.shortMorePenalty;
                }
                else if (delta === -1) {
                    score -= utils_1.shortLessPenalty;
                }
                else if (delta === -2) {
                    score -= utils_1.longLessPenalty;
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

},{"./utils":62,"@formatjs/ecma402-abstract":37,"tslib":80}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestFitFormatMatcher = exports.bestFitFormatMatcherScore = void 0;
var tslib_1 = require("tslib");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var utils_1 = require("./utils");
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
        score -= utils_1.removalPenalty;
    }
    else if (!options.hour12 && format.hour12) {
        score -= utils_1.additionPenalty;
    }
    for (var _i = 0, DATE_TIME_PROPS_1 = utils_1.DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
        var prop = DATE_TIME_PROPS_1[_i];
        var optionsProp = options[prop];
        var formatProp = format[prop];
        if (optionsProp === undefined && formatProp !== undefined) {
            score -= utils_1.additionPenalty;
        }
        else if (optionsProp !== undefined && formatProp === undefined) {
            score -= utils_1.removalPenalty;
        }
        else if (optionsProp !== formatProp) {
            // extra penalty for numeric vs non-numeric
            if (isNumericType(optionsProp) !==
                isNumericType(formatProp)) {
                score -= utils_1.differentNumericTypePenalty;
            }
            else {
                var values = ['2-digit', 'numeric', 'narrow', 'short', 'long'];
                var optionsPropIndex = values.indexOf(optionsProp);
                var formatPropIndex = values.indexOf(formatProp);
                var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
                if (delta === 2) {
                    score -= utils_1.longMorePenalty;
                }
                else if (delta === 1) {
                    score -= utils_1.shortMorePenalty;
                }
                else if (delta === -1) {
                    score -= utils_1.shortLessPenalty;
                }
                else if (delta === -2) {
                    score -= utils_1.longLessPenalty;
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
    (0, ecma402_abstract_1.invariant)(Array.isArray(formats), 'formats should be a list of things');
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
    (0, skeleton_1.processDateTimePattern)(bestFormat.rawPattern, patternFormat);
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

},{"./skeleton":61,"./utils":62,"@formatjs/ecma402-abstract":37,"tslib":80}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeStyleFormat = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
function DateTimeStyleFormat(dateStyle, timeStyle, dataLocaleData) {
    var dateFormat, timeFormat;
    if (timeStyle !== undefined) {
        (0, ecma402_abstract_1.invariant)(timeStyle === 'full' ||
            timeStyle === 'long' ||
            timeStyle === 'medium' ||
            timeStyle === 'short', 'invalid timeStyle');
        timeFormat = dataLocaleData.timeFormat[timeStyle];
    }
    if (dateStyle !== undefined) {
        (0, ecma402_abstract_1.invariant)(dateStyle === 'full' ||
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
    (0, ecma402_abstract_1.invariant)(dateStyle !== undefined, 'dateStyle should not be undefined');
    return dateFormat;
}
exports.DateTimeStyleFormat = DateTimeStyleFormat;

},{"@formatjs/ecma402-abstract":37}],51:[function(require,module,exports){
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
    var parts = (0, PartitionDateTimePattern_1.PartitionDateTimePattern)(dtf, x, implDetails);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result += part.value;
    }
    return result;
}
exports.FormatDateTime = FormatDateTime;

},{"./PartitionDateTimePattern":57}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimePattern = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var utils_1 = require("./utils");
var ToLocalTime_1 = require("./ToLocalTime");
function pad(n) {
    if (n < 10) {
        return "0".concat(n);
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
        offsetStr = pattern.replace(/H+/, String(hours)).replace(/m+/, String(mins));
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
    x = (0, ecma402_abstract_1.TimeClip)(x);
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
    var fractionalSecondDigits = internalSlots.fractionalSecondDigits;
    var nf3;
    if (fractionalSecondDigits !== undefined) {
        var nf3Options = Object.create(null);
        nf3Options.minimumIntegerDigits = fractionalSecondDigits;
        nf3Options.useGrouping = false;
        nf3 = new Intl.NumberFormat(locale, nf3Options);
    }
    var tm = (0, ToLocalTime_1.ToLocalTime)(x, 
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
        else if (p === 'fractionalSecondDigits') {
            var v = Math.floor(tm.millisecond * Math.pow(10, ((fractionalSecondDigits || 0) - 3)));
            result.push({
                type: 'fractionalSecond',
                value: nf3.format(v),
            });
        }
        else if (p === 'dayPeriod') {
            var f = internalSlots.dayPeriod;
            // @ts-ignore
            var fv = tm[f];
            result.push({ type: p, value: fv });
        }
        else if (p === 'timeZoneName') {
            var f = internalSlots.timeZoneName;
            var fv = void 0;
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
            result.push({ type: p, value: fv });
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

},{"./ToLocalTime":60,"./utils":62,"@formatjs/ecma402-abstract":37}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeRange = void 0;
var PartitionDateTimeRangePattern_1 = require("./PartitionDateTimeRangePattern");
function FormatDateTimeRange(dtf, x, y, implDetails) {
    var parts = (0, PartitionDateTimeRangePattern_1.PartitionDateTimeRangePattern)(dtf, x, y, implDetails);
    var result = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        result += part.value;
    }
    return result;
}
exports.FormatDateTimeRange = FormatDateTimeRange;

},{"./PartitionDateTimeRangePattern":58}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeRangeToParts = void 0;
var PartitionDateTimeRangePattern_1 = require("./PartitionDateTimeRangePattern");
function FormatDateTimeRangeToParts(dtf, x, y, implDetails) {
    var parts = (0, PartitionDateTimeRangePattern_1.PartitionDateTimeRangePattern)(dtf, x, y, implDetails);
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

},{"./PartitionDateTimeRangePattern":58}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateTimeToParts = void 0;
var PartitionDateTimePattern_1 = require("./PartitionDateTimePattern");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
/**
 * https://tc39.es/ecma402/#sec-formatdatetimetoparts
 *
 * @param dtf
 * @param x
 * @param implDetails
 */
function FormatDateTimeToParts(dtf, x, implDetails) {
    var parts = (0, PartitionDateTimePattern_1.PartitionDateTimePattern)(dtf, x, implDetails);
    var result = (0, ecma402_abstract_1.ArrayCreate)(0);
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

},{"./PartitionDateTimePattern":57,"@formatjs/ecma402-abstract":37}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeDateTimeFormat = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var intl_localematcher_1 = require("@formatjs/intl-localematcher");
var BasicFormatMatcher_1 = require("./BasicFormatMatcher");
var BestFitFormatMatcher_1 = require("./BestFitFormatMatcher");
var DateTimeStyleFormat_1 = require("./DateTimeStyleFormat");
var ToDateTimeOptions_1 = require("./ToDateTimeOptions");
var utils_1 = require("./utils");
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
            (0, ecma402_abstract_1.invariant)(!hour12, 'hour12 must not be set');
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
    var requestedLocales = (0, ecma402_abstract_1.CanonicalizeLocaleList)(locales);
    var options = (0, ToDateTimeOptions_1.ToDateTimeOptions)(opts, 'any', 'date');
    var opt = Object.create(null);
    var matcher = (0, ecma402_abstract_1.GetOption)(options, 'localeMatcher', 'string', ['lookup', 'best fit'], 'best fit');
    opt.localeMatcher = matcher;
    var calendar = (0, ecma402_abstract_1.GetOption)(options, 'calendar', 'string', undefined, undefined);
    if (calendar !== undefined && !TYPE_REGEX.test(calendar)) {
        throw new RangeError('Malformed calendar');
    }
    var internalSlots = getInternalSlots(dtf);
    opt.ca = calendar;
    var numberingSystem = (0, ecma402_abstract_1.GetOption)(options, 'numberingSystem', 'string', undefined, undefined);
    if (numberingSystem !== undefined && !TYPE_REGEX.test(numberingSystem)) {
        throw new RangeError('Malformed numbering system');
    }
    opt.nu = numberingSystem;
    var hour12 = (0, ecma402_abstract_1.GetOption)(options, 'hour12', 'boolean', undefined, undefined);
    var hourCycle = (0, ecma402_abstract_1.GetOption)(options, 'hourCycle', 'string', ['h11', 'h12', 'h23', 'h24'], undefined);
    if (hour12 !== undefined) {
        // @ts-ignore
        hourCycle = null;
    }
    opt.hc = hourCycle;
    var r = (0, intl_localematcher_1.ResolveLocale)(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
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
        if (!(0, ecma402_abstract_1.IsValidTimeZoneName)(timeZone, {
            zoneNamesFromData: Object.keys(tzData),
            uppercaseLinks: uppercaseLinks,
        })) {
            throw new RangeError('Invalid timeZoneName');
        }
        timeZone = (0, ecma402_abstract_1.CanonicalizeTimeZoneName)(timeZone, {
            zoneNames: Object.keys(tzData),
            uppercaseLinks: uppercaseLinks,
        });
    }
    else {
        timeZone = getDefaultTimeZone();
    }
    internalSlots.timeZone = timeZone;
    opt = Object.create(null);
    opt.weekday = (0, ecma402_abstract_1.GetOption)(options, 'weekday', 'string', ['narrow', 'short', 'long'], undefined);
    opt.era = (0, ecma402_abstract_1.GetOption)(options, 'era', 'string', ['narrow', 'short', 'long'], undefined);
    opt.year = (0, ecma402_abstract_1.GetOption)(options, 'year', 'string', ['2-digit', 'numeric'], undefined);
    opt.month = (0, ecma402_abstract_1.GetOption)(options, 'month', 'string', ['2-digit', 'numeric', 'narrow', 'short', 'long'], undefined);
    opt.day = (0, ecma402_abstract_1.GetOption)(options, 'day', 'string', ['2-digit', 'numeric'], undefined);
    opt.hour = (0, ecma402_abstract_1.GetOption)(options, 'hour', 'string', ['2-digit', 'numeric'], undefined);
    opt.minute = (0, ecma402_abstract_1.GetOption)(options, 'minute', 'string', ['2-digit', 'numeric'], undefined);
    opt.second = (0, ecma402_abstract_1.GetOption)(options, 'second', 'string', ['2-digit', 'numeric'], undefined);
    opt.timeZoneName = (0, ecma402_abstract_1.GetOption)(options, 'timeZoneName', 'string', [
        'long',
        'short',
        'longOffset',
        'shortOffset',
        'longGeneric',
        'shortGeneric',
    ], undefined);
    opt.fractionalSecondDigits = (0, ecma402_abstract_1.GetNumberOption)(options, 'fractionalSecondDigits', 1, 3, undefined);
    var dataLocaleData = localeData[dataLocale];
    (0, ecma402_abstract_1.invariant)(!!dataLocaleData, "Missing locale data for ".concat(dataLocale));
    var formats = dataLocaleData.formats[calendar];
    // UNSPECCED: IMPLEMENTATION DETAILS
    if (!formats) {
        throw new RangeError("Calendar \"".concat(calendar, "\" is not supported. Try setting \"calendar\" to 1 of the following: ").concat(Object.keys(dataLocaleData.formats).join(', ')));
    }
    var formatMatcher = (0, ecma402_abstract_1.GetOption)(options, 'formatMatcher', 'string', ['basic', 'best fit'], 'best fit');
    var dateStyle = (0, ecma402_abstract_1.GetOption)(options, 'dateStyle', 'string', ['full', 'long', 'medium', 'short'], undefined);
    internalSlots.dateStyle = dateStyle;
    var timeStyle = (0, ecma402_abstract_1.GetOption)(options, 'timeStyle', 'string', ['full', 'long', 'medium', 'short'], undefined);
    internalSlots.timeStyle = timeStyle;
    var bestFormat;
    if (dateStyle === undefined && timeStyle === undefined) {
        if (formatMatcher === 'basic') {
            bestFormat = (0, BasicFormatMatcher_1.BasicFormatMatcher)(opt, formats);
        }
        else {
            // IMPL DETAILS START
            if (isTimeRelated(opt)) {
                var hc = resolveHourCycle(internalSlots.hourCycle, dataLocaleData.hourCycle, hour12);
                opt.hour12 = hc === 'h11' || hc === 'h12';
            }
            // IMPL DETAILS END
            bestFormat = (0, BestFitFormatMatcher_1.BestFitFormatMatcher)(opt, formats);
        }
    }
    else {
        for (var _i = 0, DATE_TIME_PROPS_1 = utils_1.DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
            var prop = DATE_TIME_PROPS_1[_i];
            var p = opt[prop];
            if (p !== undefined) {
                throw new TypeError("Intl.DateTimeFormat can't set option ".concat(prop, " when ").concat(dateStyle ? 'dateStyle' : 'timeStyle', " is used"));
            }
        }
        bestFormat = (0, DateTimeStyleFormat_1.DateTimeStyleFormat)(dateStyle, timeStyle, dataLocaleData);
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
    return dtf; // TODO: remove this when https://github.com/microsoft/TypeScript/pull/50402 is merged
}
exports.InitializeDateTimeFormat = InitializeDateTimeFormat;

},{"./BasicFormatMatcher":48,"./BestFitFormatMatcher":49,"./DateTimeStyleFormat":50,"./ToDateTimeOptions":59,"./utils":62,"@formatjs/ecma402-abstract":37,"@formatjs/intl-localematcher":79}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionDateTimePattern = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var FormatDateTimePattern_1 = require("./FormatDateTimePattern");
/**
 * https://tc39.es/ecma402/#sec-partitiondatetimepattern
 * @param dtf
 * @param x
 */
function PartitionDateTimePattern(dtf, x, implDetails) {
    x = (0, ecma402_abstract_1.TimeClip)(x);
    if (isNaN(x)) {
        throw new RangeError('invalid time');
    }
    /** IMPL START */
    var getInternalSlots = implDetails.getInternalSlots;
    var internalSlots = getInternalSlots(dtf);
    /** IMPL END */
    var pattern = internalSlots.pattern;
    return (0, FormatDateTimePattern_1.FormatDateTimePattern)(dtf, (0, ecma402_abstract_1.PartitionPattern)(pattern), x, implDetails);
}
exports.PartitionDateTimePattern = PartitionDateTimePattern;

},{"./FormatDateTimePattern":52,"@formatjs/ecma402-abstract":37}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartitionDateTimeRangePattern = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var ToLocalTime_1 = require("./ToLocalTime");
var FormatDateTimePattern_1 = require("./FormatDateTimePattern");
var TABLE_2_FIELDS = [
    'era',
    'year',
    'month',
    'day',
    'dayPeriod',
    'ampm',
    'hour',
    'minute',
    'second',
    'fractionalSecondDigits',
];
function PartitionDateTimeRangePattern(dtf, x, y, implDetails) {
    x = (0, ecma402_abstract_1.TimeClip)(x);
    if (isNaN(x)) {
        throw new RangeError('Invalid start time');
    }
    y = (0, ecma402_abstract_1.TimeClip)(y);
    if (isNaN(y)) {
        throw new RangeError('Invalid end time');
    }
    /** IMPL START */
    var getInternalSlots = implDetails.getInternalSlots, tzData = implDetails.tzData;
    var internalSlots = getInternalSlots(dtf);
    /** IMPL END */
    var tm1 = (0, ToLocalTime_1.ToLocalTime)(x, 
    // @ts-ignore
    internalSlots.calendar, internalSlots.timeZone, { tzData: tzData });
    var tm2 = (0, ToLocalTime_1.ToLocalTime)(y, 
    // @ts-ignore
    internalSlots.calendar, internalSlots.timeZone, { tzData: tzData });
    var pattern = internalSlots.pattern, rangePatterns = internalSlots.rangePatterns;
    var rangePattern;
    var dateFieldsPracticallyEqual = true;
    var patternContainsLargerDateField = false;
    for (var _i = 0, TABLE_2_FIELDS_1 = TABLE_2_FIELDS; _i < TABLE_2_FIELDS_1.length; _i++) {
        var fieldName = TABLE_2_FIELDS_1[_i];
        if (dateFieldsPracticallyEqual && !patternContainsLargerDateField) {
            var rp = fieldName in rangePatterns ? rangePatterns[fieldName] : undefined;
            if (rangePattern !== undefined && rp === undefined) {
                patternContainsLargerDateField = true;
            }
            else {
                rangePattern = rp;
                if (fieldName === 'ampm') {
                    var v1 = tm1.hour;
                    var v2 = tm2.hour;
                    if ((v1 > 11 && v2 < 11) || (v1 < 11 && v2 > 11)) {
                        dateFieldsPracticallyEqual = false;
                    }
                }
                else if (fieldName === 'dayPeriod') {
                    // TODO
                }
                else if (fieldName === 'fractionalSecondDigits') {
                    var fractionalSecondDigits = internalSlots.fractionalSecondDigits;
                    if (fractionalSecondDigits === undefined) {
                        fractionalSecondDigits = 3;
                    }
                    var v1 = Math.floor(tm1.millisecond * Math.pow(10, (fractionalSecondDigits - 3)));
                    var v2 = Math.floor(tm2.millisecond * Math.pow(10, (fractionalSecondDigits - 3)));
                    if (!(0, ecma402_abstract_1.SameValue)(v1, v2)) {
                        dateFieldsPracticallyEqual = false;
                    }
                }
                else {
                    var v1 = tm1[fieldName];
                    var v2 = tm2[fieldName];
                    if (!(0, ecma402_abstract_1.SameValue)(v1, v2)) {
                        dateFieldsPracticallyEqual = false;
                    }
                }
            }
        }
    }
    if (dateFieldsPracticallyEqual) {
        var result_2 = (0, FormatDateTimePattern_1.FormatDateTimePattern)(dtf, (0, ecma402_abstract_1.PartitionPattern)(pattern), x, implDetails);
        for (var _a = 0, result_1 = result_2; _a < result_1.length; _a++) {
            var r = result_1[_a];
            r.source = ecma402_abstract_1.RangePatternType.shared;
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
        if (source === ecma402_abstract_1.RangePatternType.startRange ||
            source === ecma402_abstract_1.RangePatternType.shared) {
            z = x;
        }
        else {
            z = y;
        }
        var patternParts = (0, ecma402_abstract_1.PartitionPattern)(pattern_1);
        var partResult = (0, FormatDateTimePattern_1.FormatDateTimePattern)(dtf, patternParts, z, implDetails);
        for (var _f = 0, partResult_1 = partResult; _f < partResult_1.length; _f++) {
            var r = partResult_1[_f];
            r.source = source;
        }
        result = result.concat(partResult);
    }
    return result;
}
exports.PartitionDateTimeRangePattern = PartitionDateTimeRangePattern;

},{"./FormatDateTimePattern":52,"./ToLocalTime":60,"@formatjs/ecma402-abstract":37}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDateTimeOptions = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
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
        options = (0, ecma402_abstract_1.ToObject)(options);
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
        for (var _b = 0, _c = [
            'dayPeriod',
            'hour',
            'minute',
            'second',
            'fractionalSecondDigits',
        ]; _b < _c.length; _b++) {
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

},{"@formatjs/ecma402-abstract":37}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToLocalTime = void 0;
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
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
            ;
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
    (0, ecma402_abstract_1.invariant)((0, ecma402_abstract_1.Type)(t) === 'Number', 'invalid time');
    (0, ecma402_abstract_1.invariant)(calendar === 'gregory', 'We only support Gregory calendar right now');
    var _b = getApplicableZoneData(t, timeZone, tzData), timeZoneOffset = _b[0], inDST = _b[1];
    var tz = t + timeZoneOffset;
    var year = (0, ecma402_abstract_1.YearFromTime)(tz);
    return {
        weekday: (0, ecma402_abstract_1.WeekDay)(tz),
        era: year < 0 ? 'BC' : 'AD',
        year: year,
        relatedYear: undefined,
        yearName: undefined,
        month: (0, ecma402_abstract_1.MonthFromTime)(tz),
        day: (0, ecma402_abstract_1.DateFromTime)(tz),
        hour: (0, ecma402_abstract_1.HourFromTime)(tz),
        minute: (0, ecma402_abstract_1.MinFromTime)(tz),
        second: (0, ecma402_abstract_1.SecFromTime)(tz),
        millisecond: (0, ecma402_abstract_1.msFromTime)(tz),
        inDST: inDST,
        // IMPORTANT: Not in spec
        timeZoneOffset: timeZoneOffset,
    };
}
exports.ToLocalTime = ToLocalTime;

},{"@formatjs/ecma402-abstract":37}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitRangePattern = exports.splitFallbackRangePattern = exports.parseDateTimeSkeleton = exports.processDateTimePattern = void 0;
var tslib_1 = require("tslib");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
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
                undefined,
                undefined,
                'short',
                'long',
                'narrow',
                'short',
            ][len - 1];
            return '{weekday}';
        case 'c':
            result.weekday = [
                undefined,
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
        case 'O': // 1, 4: milliseconds in day short, long
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
        return "$$".concat(literals.length - 1, "$$");
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
    if (intervalFormatFallback) {
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
                    source: ecma402_abstract_1.RangePatternType.startRange,
                    pattern: pattern,
                };
            case '{1}':
                return {
                    source: ecma402_abstract_1.RangePatternType.endRange,
                    pattern: pattern,
                };
            default:
                return {
                    source: ecma402_abstract_1.RangePatternType.shared,
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
                source: ecma402_abstract_1.RangePatternType.startRange,
                pattern: pattern,
            },
        ];
    }
    return [
        {
            source: ecma402_abstract_1.RangePatternType.startRange,
            pattern: pattern.slice(0, splitIndex),
        },
        {
            source: ecma402_abstract_1.RangePatternType.endRange,
            pattern: pattern.slice(splitIndex),
        },
    ];
}
exports.splitRangePattern = splitRangePattern;

},{"@formatjs/ecma402-abstract":37,"tslib":80}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offsetPenalty = exports.shortMorePenalty = exports.shortLessPenalty = exports.longMorePenalty = exports.longLessPenalty = exports.differentNumericTypePenalty = exports.additionPenalty = exports.removalPenalty = exports.DATE_TIME_PROPS = void 0;
exports.DATE_TIME_PROPS = [
    'weekday',
    'era',
    'year',
    'month',
    'day',
    'dayPeriod',
    'hour',
    'minute',
    'second',
    'fractionalSecondDigits',
    'timeZoneName',
];
exports.removalPenalty = 120;
exports.additionPenalty = 20;
exports.differentNumericTypePenalty = 15;
exports.longLessPenalty = 8;
exports.longMorePenalty = 6;
exports.shortLessPenalty = 6;
exports.shortMorePenalty = 3;
exports.offsetPenalty = 1;

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeFormat = void 0;
var tslib_1 = require("tslib");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var FormatDateTime_1 = require("./abstract/FormatDateTime");
var FormatDateTimeRange_1 = require("./abstract/FormatDateTimeRange");
var FormatDateTimeRangeToParts_1 = require("./abstract/FormatDateTimeRangeToParts");
var FormatDateTimeToParts_1 = require("./abstract/FormatDateTimeToParts");
var InitializeDateTimeFormat_1 = require("./abstract/InitializeDateTimeFormat");
var skeleton_1 = require("./abstract/skeleton");
var utils_1 = require("./abstract/utils");
var links_1 = tslib_1.__importDefault(require("./data/links"));
var get_internal_slots_1 = tslib_1.__importDefault(require("./get_internal_slots"));
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
        if (typeof this !== 'object' ||
            !(0, ecma402_abstract_1.OrdinaryHasInstance)(exports.DateTimeFormat, this)) {
            throw TypeError('Intl.DateTimeFormat format property accessor called on incompatible receiver');
        }
        var internalSlots = (0, get_internal_slots_1.default)(this);
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
                return (0, FormatDateTime_1.FormatDateTime)(dtf, x, {
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
                // In older browser (e.g Chrome 36 like polyfill-fastly.io)
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
    // In older browser (e.g Chrome 36 like polyfill-fastly.io)
    // TypeError: Cannot redefine property: name
}
exports.DateTimeFormat = function (locales, options) {
    // Cannot use `new.target` bc of IE11 & TS transpiles it to something else
    if (!this || !(0, ecma402_abstract_1.OrdinaryHasInstance)(exports.DateTimeFormat, this)) {
        return new exports.DateTimeFormat(locales, options);
    }
    (0, InitializeDateTimeFormat_1.InitializeDateTimeFormat)(this, locales, options, {
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
    var internalSlots = (0, get_internal_slots_1.default)(this);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = exports.DateTimeFormat.localeData[dataLocale];
    (0, ecma402_abstract_1.invariant)(dataLocaleData !== undefined, "Cannot load locale-dependent data for ".concat(dataLocale, "."));
    /** IMPL END */
};
// Static properties
(0, ecma402_abstract_1.defineProperty)(exports.DateTimeFormat, 'supportedLocalesOf', {
    value: function supportedLocalesOf(locales, options) {
        return (0, ecma402_abstract_1.SupportedLocales)(exports.DateTimeFormat.availableLocales, (0, ecma402_abstract_1.CanonicalizeLocaleList)(locales), options);
    },
});
(0, ecma402_abstract_1.defineProperty)(exports.DateTimeFormat.prototype, 'resolvedOptions', {
    value: function resolvedOptions() {
        if (typeof this !== 'object' ||
            !(0, ecma402_abstract_1.OrdinaryHasInstance)(exports.DateTimeFormat, this)) {
            throw TypeError('Method Intl.DateTimeFormat.prototype.resolvedOptions called on incompatible receiver');
        }
        var internalSlots = (0, get_internal_slots_1.default)(this);
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
            if (utils_1.DATE_TIME_PROPS.indexOf(key) > -1) {
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
(0, ecma402_abstract_1.defineProperty)(exports.DateTimeFormat.prototype, 'formatToParts', {
    value: function formatToParts(date) {
        if (date === undefined) {
            date = Date.now();
        }
        else {
            date = (0, ecma402_abstract_1.ToNumber)(date);
        }
        return (0, FormatDateTimeToParts_1.FormatDateTimeToParts)(this, date, {
            getInternalSlots: get_internal_slots_1.default,
            localeData: exports.DateTimeFormat.localeData,
            tzData: exports.DateTimeFormat.tzData,
            getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        });
    },
});
(0, ecma402_abstract_1.defineProperty)(exports.DateTimeFormat.prototype, 'formatRangeToParts', {
    value: function formatRangeToParts(startDate, endDate) {
        var dtf = this;
        if (typeof dtf !== 'object') {
            throw new TypeError();
        }
        if (startDate === undefined || endDate === undefined) {
            throw new TypeError('startDate/endDate cannot be undefined');
        }
        var x = (0, ecma402_abstract_1.ToNumber)(startDate);
        var y = (0, ecma402_abstract_1.ToNumber)(endDate);
        return (0, FormatDateTimeRangeToParts_1.FormatDateTimeRangeToParts)(dtf, x, y, {
            getInternalSlots: get_internal_slots_1.default,
            localeData: exports.DateTimeFormat.localeData,
            tzData: exports.DateTimeFormat.tzData,
            getDefaultTimeZone: exports.DateTimeFormat.getDefaultTimeZone,
        });
    },
});
(0, ecma402_abstract_1.defineProperty)(exports.DateTimeFormat.prototype, 'formatRange', {
    value: function formatRange(startDate, endDate) {
        var dtf = this;
        if (typeof dtf !== 'object') {
            throw new TypeError();
        }
        if (startDate === undefined || endDate === undefined) {
            throw new TypeError('startDate/endDate cannot be undefined');
        }
        var x = (0, ecma402_abstract_1.ToNumber)(startDate);
        var y = (0, ecma402_abstract_1.ToNumber)(endDate);
        return (0, FormatDateTimeRange_1.FormatDateTimeRange)(dtf, x, y, {
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
        if (!(0, ecma402_abstract_1.IsValidTimeZoneName)(timeZone, {
            zoneNamesFromData: Object.keys(exports.DateTimeFormat.tzData),
            uppercaseLinks: UPPERCASED_LINKS,
        })) {
            throw new RangeError('Invalid timeZoneName');
        }
        timeZone = (0, ecma402_abstract_1.CanonicalizeTimeZoneName)(timeZone, {
            zoneNames: Object.keys(exports.DateTimeFormat.tzData),
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
                full: (0, skeleton_1.parseDateTimeSkeleton)(dateFormat.full),
                long: (0, skeleton_1.parseDateTimeSkeleton)(dateFormat.long),
                medium: (0, skeleton_1.parseDateTimeSkeleton)(dateFormat.medium),
                short: (0, skeleton_1.parseDateTimeSkeleton)(dateFormat.short),
            }, timeFormat: {
                full: (0, skeleton_1.parseDateTimeSkeleton)(timeFormat.full),
                long: (0, skeleton_1.parseDateTimeSkeleton)(timeFormat.long),
                medium: (0, skeleton_1.parseDateTimeSkeleton)(timeFormat.medium),
                short: (0, skeleton_1.parseDateTimeSkeleton)(timeFormat.short),
            }, dateTimeFormat: {
                full: (0, skeleton_1.parseDateTimeSkeleton)(dateTimeFormat.full).pattern,
                long: (0, skeleton_1.parseDateTimeSkeleton)(dateTimeFormat.long).pattern,
                medium: (0, skeleton_1.parseDateTimeSkeleton)(dateTimeFormat.medium).pattern,
                short: (0, skeleton_1.parseDateTimeSkeleton)(dateTimeFormat.short).pattern,
            }, formats: {} });
        var _loop_2 = function (calendar) {
            processedData.formats[calendar] = Object.keys(formats[calendar]).map(function (skeleton) {
                return (0, skeleton_1.parseDateTimeSkeleton)(skeleton, formats[calendar][skeleton], intervalFormats[skeleton], intervalFormats.intervalFormatFallback);
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
    exports.DateTimeFormat.tzData = (0, packer_1.unpack)(d);
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

},{"./abstract/FormatDateTime":51,"./abstract/FormatDateTimeRange":53,"./abstract/FormatDateTimeRangeToParts":54,"./abstract/FormatDateTimeToParts":55,"./abstract/InitializeDateTimeFormat":56,"./abstract/skeleton":61,"./abstract/utils":62,"./data/links":64,"./get_internal_slots":65,"./packer":66,"@formatjs/ecma402-abstract":37,"tslib":80}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @generated
// prettier-ignore
exports.default = {
    "Africa/Accra": "Africa/Abidjan",
    "Africa/Addis_Ababa": "Africa/Nairobi",
    "Africa/Asmara": "Africa/Nairobi",
    "Africa/Asmera": "Africa/Nairobi",
    "Africa/Bamako": "Africa/Abidjan",
    "Africa/Bangui": "Africa/Lagos",
    "Africa/Banjul": "Africa/Abidjan",
    "Africa/Blantyre": "Africa/Maputo",
    "Africa/Brazzaville": "Africa/Lagos",
    "Africa/Bujumbura": "Africa/Maputo",
    "Africa/Conakry": "Africa/Abidjan",
    "Africa/Dakar": "Africa/Abidjan",
    "Africa/Dar_es_Salaam": "Africa/Nairobi",
    "Africa/Djibouti": "Africa/Nairobi",
    "Africa/Douala": "Africa/Lagos",
    "Africa/Freetown": "Africa/Abidjan",
    "Africa/Gaborone": "Africa/Maputo",
    "Africa/Harare": "Africa/Maputo",
    "Africa/Kampala": "Africa/Nairobi",
    "Africa/Kigali": "Africa/Maputo",
    "Africa/Kinshasa": "Africa/Lagos",
    "Africa/Libreville": "Africa/Lagos",
    "Africa/Lome": "Africa/Abidjan",
    "Africa/Luanda": "Africa/Lagos",
    "Africa/Lubumbashi": "Africa/Maputo",
    "Africa/Lusaka": "Africa/Maputo",
    "Africa/Malabo": "Africa/Lagos",
    "Africa/Maseru": "Africa/Johannesburg",
    "Africa/Mbabane": "Africa/Johannesburg",
    "Africa/Mogadishu": "Africa/Nairobi",
    "Africa/Niamey": "Africa/Lagos",
    "Africa/Nouakchott": "Africa/Abidjan",
    "Africa/Ouagadougou": "Africa/Abidjan",
    "Africa/Porto-Novo": "Africa/Lagos",
    "Africa/Timbuktu": "Africa/Abidjan",
    "America/Anguilla": "America/Puerto_Rico",
    "America/Antigua": "America/Puerto_Rico",
    "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
    "America/Aruba": "America/Puerto_Rico",
    "America/Atikokan": "America/Panama",
    "America/Atka": "America/Adak",
    "America/Blanc-Sablon": "America/Puerto_Rico",
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "America/Catamarca": "America/Argentina/Catamarca",
    "America/Cayman": "America/Panama",
    "America/Coral_Harbour": "America/Panama",
    "America/Cordoba": "America/Argentina/Cordoba",
    "America/Creston": "America/Phoenix",
    "America/Curacao": "America/Puerto_Rico",
    "America/Dominica": "America/Puerto_Rico",
    "America/Ensenada": "America/Tijuana",
    "America/Fort_Wayne": "America/Indiana/Indianapolis",
    "America/Godthab": "America/Nuuk",
    "America/Grenada": "America/Puerto_Rico",
    "America/Guadeloupe": "America/Puerto_Rico",
    "America/Indianapolis": "America/Indiana/Indianapolis",
    "America/Jujuy": "America/Argentina/Jujuy",
    "America/Knox_IN": "America/Indiana/Knox",
    "America/Kralendijk": "America/Puerto_Rico",
    "America/Louisville": "America/Kentucky/Louisville",
    "America/Lower_Princes": "America/Puerto_Rico",
    "America/Marigot": "America/Puerto_Rico",
    "America/Mendoza": "America/Argentina/Mendoza",
    "America/Montreal": "America/Toronto",
    "America/Montserrat": "America/Puerto_Rico",
    "America/Nassau": "America/Toronto",
    "America/Nipigon": "America/Toronto",
    "America/Pangnirtung": "America/Iqaluit",
    "America/Port_of_Spain": "America/Puerto_Rico",
    "America/Porto_Acre": "America/Rio_Branco",
    "America/Rainy_River": "America/Winnipeg",
    "America/Rosario": "America/Argentina/Cordoba",
    "America/Santa_Isabel": "America/Tijuana",
    "America/Shiprock": "America/Denver",
    "America/St_Barthelemy": "America/Puerto_Rico",
    "America/St_Kitts": "America/Puerto_Rico",
    "America/St_Lucia": "America/Puerto_Rico",
    "America/St_Thomas": "America/Puerto_Rico",
    "America/St_Vincent": "America/Puerto_Rico",
    "America/Thunder_Bay": "America/Toronto",
    "America/Tortola": "America/Puerto_Rico",
    "America/Virgin": "America/Puerto_Rico",
    "America/Yellowknife": "America/Edmonton",
    "Antarctica/DumontDUrville": "Pacific/Port_Moresby",
    "Antarctica/McMurdo": "Pacific/Auckland",
    "Antarctica/South_Pole": "Pacific/Auckland",
    "Antarctica/Syowa": "Asia/Riyadh",
    "Arctic/Longyearbyen": "Europe/Berlin",
    "Asia/Aden": "Asia/Riyadh",
    "Asia/Ashkhabad": "Asia/Ashgabat",
    "Asia/Bahrain": "Asia/Qatar",
    "Asia/Brunei": "Asia/Kuching",
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Chongqing": "Asia/Shanghai",
    "Asia/Chungking": "Asia/Shanghai",
    "Asia/Dacca": "Asia/Dhaka",
    "Asia/Harbin": "Asia/Shanghai",
    "Asia/Istanbul": "Europe/Istanbul",
    "Asia/Kashgar": "Asia/Urumqi",
    "Asia/Katmandu": "Asia/Kathmandu",
    "Asia/Kuala_Lumpur": "Asia/Singapore",
    "Asia/Kuwait": "Asia/Riyadh",
    "Asia/Macao": "Asia/Macau",
    "Asia/Muscat": "Asia/Dubai",
    "Asia/Phnom_Penh": "Asia/Bangkok",
    "Asia/Rangoon": "Asia/Yangon",
    "Asia/Saigon": "Asia/Ho_Chi_Minh",
    "Asia/Tel_Aviv": "Asia/Jerusalem",
    "Asia/Thimbu": "Asia/Thimphu",
    "Asia/Ujung_Pandang": "Asia/Makassar",
    "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
    "Asia/Vientiane": "Asia/Bangkok",
    "Atlantic/Faeroe": "Atlantic/Faroe",
    "Atlantic/Jan_Mayen": "Europe/Berlin",
    "Atlantic/Reykjavik": "Africa/Abidjan",
    "Atlantic/St_Helena": "Africa/Abidjan",
    "Australia/ACT": "Australia/Sydney",
    "Australia/Canberra": "Australia/Sydney",
    "Australia/Currie": "Australia/Hobart",
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
    "Etc/GMT+0": "Etc/GMT",
    "Etc/GMT-0": "Etc/GMT",
    "Etc/GMT0": "Etc/GMT",
    "Etc/Greenwich": "Etc/GMT",
    "Etc/UCT": "Etc/UTC",
    "Etc/Universal": "Etc/UTC",
    "Etc/Zulu": "Etc/UTC",
    "Europe/Amsterdam": "Europe/Brussels",
    "Europe/Belfast": "Europe/London",
    "Europe/Bratislava": "Europe/Prague",
    "Europe/Busingen": "Europe/Zurich",
    "Europe/Copenhagen": "Europe/Berlin",
    "Europe/Guernsey": "Europe/London",
    "Europe/Isle_of_Man": "Europe/London",
    "Europe/Jersey": "Europe/London",
    "Europe/Kiev": "Europe/Kyiv",
    "Europe/Ljubljana": "Europe/Belgrade",
    "Europe/Luxembourg": "Europe/Brussels",
    "Europe/Mariehamn": "Europe/Helsinki",
    "Europe/Monaco": "Europe/Paris",
    "Europe/Nicosia": "Asia/Nicosia",
    "Europe/Oslo": "Europe/Berlin",
    "Europe/Podgorica": "Europe/Belgrade",
    "Europe/San_Marino": "Europe/Rome",
    "Europe/Sarajevo": "Europe/Belgrade",
    "Europe/Skopje": "Europe/Belgrade",
    "Europe/Stockholm": "Europe/Berlin",
    "Europe/Tiraspol": "Europe/Chisinau",
    "Europe/Uzhgorod": "Europe/Kyiv",
    "Europe/Vaduz": "Europe/Zurich",
    "Europe/Vatican": "Europe/Rome",
    "Europe/Zagreb": "Europe/Belgrade",
    "Europe/Zaporozhye": "Europe/Kyiv",
    "GB": "Europe/London",
    "GB-Eire": "Europe/London",
    "GMT+0": "Etc/GMT",
    "GMT-0": "Etc/GMT",
    "GMT0": "Etc/GMT",
    "Greenwich": "Etc/GMT",
    "Hongkong": "Asia/Hong_Kong",
    "Iceland": "Africa/Abidjan",
    "Indian/Antananarivo": "Africa/Nairobi",
    "Indian/Christmas": "Asia/Bangkok",
    "Indian/Cocos": "Asia/Yangon",
    "Indian/Comoro": "Africa/Nairobi",
    "Indian/Kerguelen": "Indian/Maldives",
    "Indian/Mahe": "Asia/Dubai",
    "Indian/Mayotte": "Africa/Nairobi",
    "Indian/Reunion": "Asia/Dubai",
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
    "Pacific/Chuuk": "Pacific/Port_Moresby",
    "Pacific/Enderbury": "Pacific/Kanton",
    "Pacific/Funafuti": "Pacific/Tarawa",
    "Pacific/Johnston": "Pacific/Honolulu",
    "Pacific/Majuro": "Pacific/Tarawa",
    "Pacific/Midway": "Pacific/Pago_Pago",
    "Pacific/Pohnpei": "Pacific/Guadalcanal",
    "Pacific/Ponape": "Pacific/Guadalcanal",
    "Pacific/Saipan": "Pacific/Guam",
    "Pacific/Samoa": "Pacific/Pago_Pago",
    "Pacific/Truk": "Pacific/Port_Moresby",
    "Pacific/Wake": "Pacific/Tarawa",
    "Pacific/Wallis": "Pacific/Tarawa",
    "Pacific/Yap": "Pacific/Port_Moresby",
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpack = exports.pack = void 0;
var tslib_1 = require("tslib");
function pack(data) {
    var zoneNames = Object.keys(data.zones);
    zoneNames.sort(); // so output is stable
    return {
        zones: zoneNames.map(function (zone) {
            return tslib_1.__spreadArray([
                zone
            ], data.zones[zone].map(function (_a) {
                var ts = _a[0], others = _a.slice(1);
                return tslib_1.__spreadArray([ts === '' ? '' : ts.toString(36)], others, true).join(',');
            }), true).join('|');
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

},{"tslib":80}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLocaleTimeString = exports.toLocaleDateString = exports.toLocaleString = void 0;
// eslint-disable-next-line import/no-cycle
var core_1 = require("./core");
var ToDateTimeOptions_1 = require("./abstract/ToDateTimeOptions");
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
    var dtf = new core_1.DateTimeFormat(locales, (0, ToDateTimeOptions_1.ToDateTimeOptions)(options, 'date', 'date'));
    return dtf.format(x);
}
exports.toLocaleDateString = toLocaleDateString;
function toLocaleTimeString(x, locales, options) {
    var dtf = new core_1.DateTimeFormat(locales, (0, ToDateTimeOptions_1.ToDateTimeOptions)(options, 'time', 'time'));
    return dtf.format(x);
}
exports.toLocaleTimeString = toLocaleTimeString;

},{"./abstract/ToDateTimeOptions":59,"./core":63}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedLocales = void 0;
exports.supportedLocales = ["af", "af-NA", "agq", "ak", "am", "ar", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ", "ar-EG", "ar-EH", "ar-ER", "ar-IL", "ar-IQ", "ar-JO", "ar-KM", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "ar-MR", "ar-OM", "ar-PS", "ar-QA", "ar-SA", "ar-SD", "ar-SO", "ar-SS", "ar-SY", "ar-TD", "ar-TN", "ar-YE", "as", "asa", "ast", "az", "az-Cyrl", "az-Latn", "bas", "be", "be-tarask", "bem", "bez", "bg", "bm", "bn", "bn-IN", "bo", "bo-IN", "br", "brx", "bs", "bs-Cyrl", "bs-Latn", "ca", "ca-AD", "ca-ES-valencia", "ca-FR", "ca-IT", "ccp", "ccp-IN", "ce", "ceb", "cgg", "chr", "ckb", "ckb-IR", "cs", "cy", "da", "da-GL", "dav", "de", "de-AT", "de-BE", "de-CH", "de-IT", "de-LI", "de-LU", "dje", "doi", "dsb", "dua", "dyo", "dz", "ebu", "ee", "ee-TG", "el", "el-CY", "en", "en-001", "en-150", "en-AE", "en-AG", "en-AI", "en-AS", "en-AT", "en-AU", "en-BB", "en-BE", "en-BI", "en-BM", "en-BS", "en-BW", "en-BZ", "en-CA", "en-CC", "en-CH", "en-CK", "en-CM", "en-CX", "en-CY", "en-DE", "en-DG", "en-DK", "en-DM", "en-ER", "en-FI", "en-FJ", "en-FK", "en-FM", "en-GB", "en-GD", "en-GG", "en-GH", "en-GI", "en-GM", "en-GU", "en-GY", "en-HK", "en-IE", "en-IL", "en-IM", "en-IN", "en-IO", "en-JE", "en-JM", "en-KE", "en-KI", "en-KN", "en-KY", "en-LC", "en-LR", "en-LS", "en-MG", "en-MH", "en-MO", "en-MP", "en-MS", "en-MT", "en-MU", "en-MW", "en-MY", "en-NA", "en-NF", "en-NG", "en-NL", "en-NR", "en-NU", "en-NZ", "en-PG", "en-PH", "en-PK", "en-PN", "en-PR", "en-PW", "en-RW", "en-SB", "en-SC", "en-SD", "en-SE", "en-SG", "en-SH", "en-SI", "en-SL", "en-SS", "en-SX", "en-SZ", "en-TC", "en-TK", "en-TO", "en-TT", "en-TV", "en-TZ", "en-UG", "en-UM", "en-VC", "en-VG", "en-VI", "en-VU", "en-WS", "en-ZA", "en-ZM", "en-ZW", "eo", "es", "es-419", "es-AR", "es-BO", "es-BR", "es-BZ", "es-CL", "es-CO", "es-CR", "es-CU", "es-DO", "es-EA", "es-EC", "es-GQ", "es-GT", "es-HN", "es-IC", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH", "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et", "eu", "ewo", "fa", "fa-AF", "ff", "ff-Adlm", "ff-Adlm-BF", "ff-Adlm-CM", "ff-Adlm-GH", "ff-Adlm-GM", "ff-Adlm-GW", "ff-Adlm-LR", "ff-Adlm-MR", "ff-Adlm-NE", "ff-Adlm-NG", "ff-Adlm-SL", "ff-Adlm-SN", "ff-Latn", "ff-Latn-BF", "ff-Latn-CM", "ff-Latn-GH", "ff-Latn-GM", "ff-Latn-GN", "ff-Latn-GW", "ff-Latn-LR", "ff-Latn-MR", "ff-Latn-NE", "ff-Latn-NG", "ff-Latn-SL", "fi", "fil", "fo", "fo-DK", "fr", "fr-BE", "fr-BF", "fr-BI", "fr-BJ", "fr-BL", "fr-CA", "fr-CD", "fr-CF", "fr-CG", "fr-CH", "fr-CI", "fr-CM", "fr-DJ", "fr-DZ", "fr-GA", "fr-GF", "fr-GN", "fr-GP", "fr-GQ", "fr-HT", "fr-KM", "fr-LU", "fr-MA", "fr-MC", "fr-MF", "fr-MG", "fr-ML", "fr-MQ", "fr-MR", "fr-MU", "fr-NC", "fr-NE", "fr-PF", "fr-PM", "fr-RE", "fr-RW", "fr-SC", "fr-SN", "fr-SY", "fr-TD", "fr-TG", "fr-TN", "fr-VU", "fr-WF", "fr-YT", "fur", "fy", "ga", "ga-GB", "gd", "gl", "gsw", "gsw-FR", "gsw-LI", "gu", "guz", "gv", "ha", "ha-GH", "ha-NE", "haw", "he", "hi", "hr", "hr-BA", "hsb", "hu", "hy", "ia", "id", "ig", "ii", "is", "it", "it-CH", "it-SM", "it-VA", "ja", "jgo", "jmc", "jv", "ka", "kab", "kam", "kde", "kea", "kgp", "khq", "ki", "kk", "kkj", "kl", "kln", "km", "kn", "ko", "ko-KP", "kok", "ks", "ks-Arab", "ksb", "ksf", "ksh", "ku", "kw", "ky", "lag", "lb", "lg", "lkt", "ln", "ln-AO", "ln-CF", "ln-CG", "lo", "lrc", "lrc-IQ", "lt", "lu", "luo", "luy", "lv", "mai", "mas", "mas-TZ", "mer", "mfe", "mg", "mgh", "mgo", "mi", "mk", "ml", "mn", "mni", "mni-Beng", "mr", "ms", "ms-BN", "ms-ID", "ms-SG", "mt", "mua", "my", "mzn", "naq", "nb", "nb-SJ", "nd", "nds", "nds-NL", "ne", "ne-IN", "nl", "nl-AW", "nl-BE", "nl-BQ", "nl-CW", "nl-SR", "nl-SX", "nmg", "nn", "nnh", "no", "nus", "nyn", "om", "om-KE", "or", "os", "os-RU", "pa", "pa-Arab", "pa-Guru", "pcm", "pl", "ps", "ps-PK", "pt", "pt-AO", "pt-CH", "pt-CV", "pt-GQ", "pt-GW", "pt-LU", "pt-MO", "pt-MZ", "pt-PT", "pt-ST", "pt-TL", "qu", "qu-BO", "qu-EC", "rm", "rn", "ro", "ro-MD", "rof", "ru", "ru-BY", "ru-KG", "ru-KZ", "ru-MD", "ru-UA", "rw", "rwk", "sa", "sah", "saq", "sat", "sat-Olck", "sbp", "sc", "sd", "sd-Arab", "sd-Deva", "se", "se-FI", "se-SE", "seh", "ses", "sg", "shi", "shi-Latn", "shi-Tfng", "si", "sk", "sl", "smn", "sn", "so", "so-DJ", "so-ET", "so-KE", "sq", "sq-MK", "sq-XK", "sr", "sr-Cyrl", "sr-Cyrl-BA", "sr-Cyrl-ME", "sr-Cyrl-XK", "sr-Latn", "sr-Latn-BA", "sr-Latn-ME", "sr-Latn-XK", "su", "su-Latn", "sv", "sv-AX", "sv-FI", "sw", "sw-CD", "sw-KE", "sw-UG", "ta", "ta-LK", "ta-MY", "ta-SG", "te", "teo", "teo-KE", "tg", "th", "ti", "ti-ER", "tk", "to", "tr", "tr-CY", "tt", "twq", "tzm", "ug", "uk", "und", "ur", "ur-IN", "uz", "uz-Arab", "uz-Cyrl", "uz-Latn", "vai", "vai-Latn", "vai-Vaii", "vi", "vun", "wae", "wo", "xh", "xog", "yav", "yi", "yo", "yo-BJ", "yrl", "yrl-CO", "yrl-VE", "yue", "yue-Hans", "yue-Hant", "zgh", "zh", "zh-Hans", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zu"];

},{}],69:[function(require,module,exports){
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
        if (availableLocales.indexOf(candidate) > -1) {
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

},{}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestFitMatcher = void 0;
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-bestfitmatcher
 * @param availableLocales
 * @param requestedLocales
 * @param getDefaultLocale
 */
function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var foundLocale;
    var extension;
    var noExtensionLocales = [];
    var noExtensionLocaleMap = requestedLocales.reduce(function (all, l) {
        var noExtensionLocale = l.replace(utils_1.UNICODE_EXTENSION_SEQUENCE_REGEX, '');
        noExtensionLocales.push(noExtensionLocale);
        all[noExtensionLocale] = l;
        return all;
    }, {});
    var result = (0, utils_1.findBestMatch)(noExtensionLocales, availableLocales);
    if (result.matchedSupportedLocale && result.matchedDesiredLocale) {
        foundLocale = result.matchedSupportedLocale;
        extension =
            noExtensionLocaleMap[result.matchedDesiredLocale].slice(result.matchedDesiredLocale.length) || undefined;
    }
    if (!foundLocale) {
        return { locale: getDefaultLocale() };
    }
    return {
        locale: foundLocale,
        extension: extension,
    };
}
exports.BestFitMatcher = BestFitMatcher;

},{"./utils":78}],71:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupMatcher = void 0;
var BestAvailableLocale_1 = require("./BestAvailableLocale");
var utils_1 = require("./utils");
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
        var availableLocale = (0, BestAvailableLocale_1.BestAvailableLocale)(availableLocales, noExtensionLocale);
        if (availableLocale) {
            result.locale = availableLocale;
            if (locale !== noExtensionLocale) {
                result.extension = locale.slice(noExtensionLocale.length, locale.length);
            }
            return result;
        }
    }
    result.locale = getDefaultLocale();
    return result;
}
exports.LookupMatcher = LookupMatcher;

},{"./BestAvailableLocale":69,"./utils":78}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupSupportedLocales = void 0;
var BestAvailableLocale_1 = require("./BestAvailableLocale");
var utils_1 = require("./utils");
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
        var availableLocale = (0, BestAvailableLocale_1.BestAvailableLocale)(availableLocales, noExtensionLocale);
        if (availableLocale) {
            subset.push(availableLocale);
        }
    }
    return subset;
}
exports.LookupSupportedLocales = LookupSupportedLocales;

},{"./BestAvailableLocale":69,"./utils":78}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveLocale = void 0;
var BestFitMatcher_1 = require("./BestFitMatcher");
var LookupMatcher_1 = require("./LookupMatcher");
var UnicodeExtensionValue_1 = require("./UnicodeExtensionValue");
var utils_1 = require("./utils");
/**
 * https://tc39.es/ecma402/#sec-resolvelocale
 */
function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var matcher = options.localeMatcher;
    var r;
    if (matcher === 'lookup') {
        r = (0, LookupMatcher_1.LookupMatcher)(Array.from(availableLocales), requestedLocales, getDefaultLocale);
    }
    else {
        r = (0, BestFitMatcher_1.BestFitMatcher)(Array.from(availableLocales), requestedLocales, getDefaultLocale);
    }
    var foundLocale = r.locale;
    var result = { locale: '', dataLocale: foundLocale };
    var supportedExtension = '-u';
    for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
        var key = relevantExtensionKeys_1[_i];
        (0, utils_1.invariant)(foundLocale in localeData, "Missing locale data for ".concat(foundLocale));
        var foundLocaleData = localeData[foundLocale];
        (0, utils_1.invariant)(typeof foundLocaleData === 'object' && foundLocaleData !== null, "locale data ".concat(key, " must be an object"));
        var keyLocaleData = foundLocaleData[key];
        (0, utils_1.invariant)(Array.isArray(keyLocaleData), "keyLocaleData for ".concat(key, " must be an array"));
        var value = keyLocaleData[0];
        (0, utils_1.invariant)(typeof value === 'string' || value === null, "value must be string or null but got ".concat(typeof value, " in key ").concat(key));
        var supportedExtensionAddition = '';
        if (r.extension) {
            var requestedValue = (0, UnicodeExtensionValue_1.UnicodeExtensionValue)(r.extension, key);
            if (requestedValue !== undefined) {
                if (requestedValue !== '') {
                    if (~keyLocaleData.indexOf(requestedValue)) {
                        value = requestedValue;
                        supportedExtensionAddition = "-".concat(key, "-").concat(value);
                    }
                }
                else if (~requestedValue.indexOf('true')) {
                    value = 'true';
                    supportedExtensionAddition = "-".concat(key);
                }
            }
        }
        if (key in options) {
            var optionsValue = options[key];
            (0, utils_1.invariant)(typeof optionsValue === 'string' ||
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

},{"./BestFitMatcher":70,"./LookupMatcher":72,"./UnicodeExtensionValue":75,"./utils":78}],75:[function(require,module,exports){
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
    (0, utils_1.invariant)(key.length === 2, 'key must have 2 elements');
    var size = extension.length;
    var searchValue = "-".concat(key, "-");
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
    searchValue = "-".concat(key);
    pos = extension.indexOf(searchValue);
    if (pos !== -1 && pos + 3 === size) {
        return '';
    }
    return undefined;
}
exports.UnicodeExtensionValue = UnicodeExtensionValue;

},{"./utils":78}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.data = {
    supplemental: {
        languageMatching: {
            'written-new': [
                {
                    paradigmLocales: {
                        _locales: 'en en_GB es es_419 pt_BR pt_PT',
                    },
                },
                {
                    $enUS: {
                        _value: 'AS+CA+GU+MH+MP+PH+PR+UM+US+VI',
                    },
                },
                {
                    $cnsar: {
                        _value: 'HK+MO',
                    },
                },
                {
                    $americas: {
                        _value: '019',
                    },
                },
                {
                    $maghreb: {
                        _value: 'MA+DZ+TN+LY+MR+EH',
                    },
                },
                {
                    no: {
                        _desired: 'nb',
                        _distance: '1',
                    },
                },
                {
                    bs: {
                        _desired: 'hr',
                        _distance: '4',
                    },
                },
                {
                    bs: {
                        _desired: 'sh',
                        _distance: '4',
                    },
                },
                {
                    hr: {
                        _desired: 'sh',
                        _distance: '4',
                    },
                },
                {
                    sr: {
                        _desired: 'sh',
                        _distance: '4',
                    },
                },
                {
                    aa: {
                        _desired: 'ssy',
                        _distance: '4',
                    },
                },
                {
                    de: {
                        _desired: 'gsw',
                        _distance: '4',
                        _oneway: 'true',
                    },
                },
                {
                    de: {
                        _desired: 'lb',
                        _distance: '4',
                        _oneway: 'true',
                    },
                },
                {
                    no: {
                        _desired: 'da',
                        _distance: '8',
                    },
                },
                {
                    nb: {
                        _desired: 'da',
                        _distance: '8',
                    },
                },
                {
                    ru: {
                        _desired: 'ab',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ach',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    nl: {
                        _desired: 'af',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ak',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'am',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'ay',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'az',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ur: {
                        _desired: 'bal',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'be',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'bem',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    hi: {
                        _desired: 'bh',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'bn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'bo',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'br',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'ca',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    fil: {
                        _desired: 'ceb',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'chr',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ckb',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'co',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'crs',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    sk: {
                        _desired: 'cs',
                        _distance: '20',
                    },
                },
                {
                    en: {
                        _desired: 'cy',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ee',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'eo',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'eu',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    da: {
                        _desired: 'fo',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    nl: {
                        _desired: 'fy',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ga',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'gaa',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'gd',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'gl',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'gn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    hi: {
                        _desired: 'gu',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ha',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'haw',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'ht',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'hy',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ia',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ig',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'is',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    id: {
                        _desired: 'jv',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ka',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'kg',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'kk',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'km',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'kn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'kri',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    tr: {
                        _desired: 'ku',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'ky',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    it: {
                        _desired: 'la',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'lg',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'ln',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'lo',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'loz',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'lua',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    hi: {
                        _desired: 'mai',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'mfe',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'mg',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'mi',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ml',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'mn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    hi: {
                        _desired: 'mr',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    id: {
                        _desired: 'ms',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'mt',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'my',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ne',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    nb: {
                        _desired: 'nn',
                        _distance: '20',
                    },
                },
                {
                    no: {
                        _desired: 'nn',
                        _distance: '20',
                    },
                },
                {
                    en: {
                        _desired: 'nso',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ny',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'nyn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'oc',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'om',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'or',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'pa',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'pcm',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ps',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    es: {
                        _desired: 'qu',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    de: {
                        _desired: 'rm',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'rn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'rw',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    hi: {
                        _desired: 'sa',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'sd',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'si',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'sn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'so',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'sq',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'st',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    id: {
                        _desired: 'su',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'sw',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ta',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'te',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'tg',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ti',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'tk',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'tlh',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'tn',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'to',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'tt',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'tum',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'ug',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'uk',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'ur',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ru: {
                        _desired: 'uz',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    fr: {
                        _desired: 'wo',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'xh',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'yi',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'yo',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'za',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    en: {
                        _desired: 'zu',
                        _distance: '30',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'aao',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'abh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'abv',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'acm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'acq',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'acw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'acx',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'acy',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'adf',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'aeb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'aec',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'afb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ajp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'apc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'apd',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'arq',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ars',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ary',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'arz',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'auz',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'avl',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ayh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ayl',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ayn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ayp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'bbz',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'pga',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'shu',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ar: {
                        _desired: 'ssh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    az: {
                        _desired: 'azb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    et: {
                        _desired: 'vro',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'ffm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fub',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fue',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fuf',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fuh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fui',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fuq',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ff: {
                        _desired: 'fuv',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    gn: {
                        _desired: 'gnw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    gn: {
                        _desired: 'gui',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    gn: {
                        _desired: 'gun',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    gn: {
                        _desired: 'nhd',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    iu: {
                        _desired: 'ikt',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'enb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'eyo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'niq',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'oki',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'pko',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'sgc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'tec',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kln: {
                        _desired: 'tuy',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kok: {
                        _desired: 'gom',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    kpe: {
                        _desired: 'gkp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'ida',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lkb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lko',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lks',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lri',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lrm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lsm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lto',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lts',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'lwg',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'nle',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'nyd',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    luy: {
                        _desired: 'rag',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    lv: {
                        _desired: 'ltg',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'bhr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'bjq',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'bmm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'bzc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'msh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'skg',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'tdx',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'tkg',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'txy',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'xmv',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mg: {
                        _desired: 'xmw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    mn: {
                        _desired: 'mvf',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'bjn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'btj',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'bve',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'bvu',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'coa',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'dup',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'hji',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'id',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'jak',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'jax',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'kvb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'kvr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'kxd',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'lce',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'lcf',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'liw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'max',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'meo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'mfa',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'mfb',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'min',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'mqg',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'msi',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'mui',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'orn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'ors',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'pel',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'pse',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'tmw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'urk',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'vkk',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'vkt',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'xmm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'zlm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ms: {
                        _desired: 'zmi',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ne: {
                        _desired: 'dty',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    om: {
                        _desired: 'gax',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    om: {
                        _desired: 'hae',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    om: {
                        _desired: 'orc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    or: {
                        _desired: 'spv',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ps: {
                        _desired: 'pbt',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    ps: {
                        _desired: 'pst',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qub',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qud',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'quf',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qug',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'quh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'quk',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qul',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qup',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qur',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qus',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'quw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qux',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'quy',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qva',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qve',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvi',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvj',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvl',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvm',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvs',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qvz',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qwa',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qwc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qwh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qws',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxa',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxl',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxt',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxu',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    qu: {
                        _desired: 'qxw',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sc: {
                        _desired: 'sdc',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sc: {
                        _desired: 'sdn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sc: {
                        _desired: 'sro',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sq: {
                        _desired: 'aae',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sq: {
                        _desired: 'aat',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    sq: {
                        _desired: 'aln',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    syr: {
                        _desired: 'aii',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    uz: {
                        _desired: 'uzs',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    yi: {
                        _desired: 'yih',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'cdo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'cjy',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'cpx',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'czh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'czo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'gan',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'hak',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'hsn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'lzh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'mnp',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'nan',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'wuu',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    zh: {
                        _desired: 'yue',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    '*': {
                        _desired: '*',
                        _distance: '80',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'am-Ethi',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'ru-Cyrl': {
                        _desired: 'az-Latn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'bn-Beng',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'zh-Hans': {
                        _desired: 'bo-Tibt',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'ru-Cyrl': {
                        _desired: 'hy-Armn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ka-Geor',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'km-Khmr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'kn-Knda',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'lo-Laoo',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ml-Mlym',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'my-Mymr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ne-Deva',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'or-Orya',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'pa-Guru',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ps-Arab',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'sd-Arab',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'si-Sinh',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ta-Taml',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'te-Telu',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ti-Ethi',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'ru-Cyrl': {
                        _desired: 'tk-Latn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'ur-Arab',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'ru-Cyrl': {
                        _desired: 'uz-Latn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'en-Latn': {
                        _desired: 'yi-Hebr',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'sr-Cyrl': {
                        _desired: 'sr-Latn',
                        _distance: '5',
                    },
                },
                {
                    'zh-Hans': {
                        _desired: 'za-Latn',
                        _distance: '10',
                        _oneway: 'true',
                    },
                },
                {
                    'zh-Hans': {
                        _desired: 'zh-Hani',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'zh-Hant': {
                        _desired: 'zh-Hani',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'ar-Arab': {
                        _desired: 'ar-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'bn-Beng': {
                        _desired: 'bn-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'gu-Gujr': {
                        _desired: 'gu-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'hi-Deva': {
                        _desired: 'hi-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'kn-Knda': {
                        _desired: 'kn-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'ml-Mlym': {
                        _desired: 'ml-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'mr-Deva': {
                        _desired: 'mr-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'ta-Taml': {
                        _desired: 'ta-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'te-Telu': {
                        _desired: 'te-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'zh-Hans': {
                        _desired: 'zh-Latn',
                        _distance: '20',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Jpan': {
                        _desired: 'ja-Latn',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Jpan': {
                        _desired: 'ja-Hani',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Jpan': {
                        _desired: 'ja-Hira',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Jpan': {
                        _desired: 'ja-Kana',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Jpan': {
                        _desired: 'ja-Hrkt',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Hrkt': {
                        _desired: 'ja-Hira',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ja-Hrkt': {
                        _desired: 'ja-Kana',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ko-Kore': {
                        _desired: 'ko-Hani',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ko-Kore': {
                        _desired: 'ko-Hang',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ko-Kore': {
                        _desired: 'ko-Jamo',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    'ko-Hang': {
                        _desired: 'ko-Jamo',
                        _distance: '5',
                        _oneway: 'true',
                    },
                },
                {
                    '*-*': {
                        _desired: '*-*',
                        _distance: '50',
                    },
                },
                {
                    'ar-*-$maghreb': {
                        _desired: 'ar-*-$maghreb',
                        _distance: '4',
                    },
                },
                {
                    'ar-*-$!maghreb': {
                        _desired: 'ar-*-$!maghreb',
                        _distance: '4',
                    },
                },
                {
                    'ar-*-*': {
                        _desired: 'ar-*-*',
                        _distance: '5',
                    },
                },
                {
                    'en-*-$enUS': {
                        _desired: 'en-*-$enUS',
                        _distance: '4',
                    },
                },
                {
                    'en-*-GB': {
                        _desired: 'en-*-$!enUS',
                        _distance: '3',
                    },
                },
                {
                    'en-*-$!enUS': {
                        _desired: 'en-*-$!enUS',
                        _distance: '4',
                    },
                },
                {
                    'en-*-*': {
                        _desired: 'en-*-*',
                        _distance: '5',
                    },
                },
                {
                    'es-*-$americas': {
                        _desired: 'es-*-$americas',
                        _distance: '4',
                    },
                },
                {
                    'es-*-$!americas': {
                        _desired: 'es-*-$!americas',
                        _distance: '4',
                    },
                },
                {
                    'es-*-*': {
                        _desired: 'es-*-*',
                        _distance: '5',
                    },
                },
                {
                    'pt-*-$americas': {
                        _desired: 'pt-*-$americas',
                        _distance: '4',
                    },
                },
                {
                    'pt-*-$!americas': {
                        _desired: 'pt-*-$!americas',
                        _distance: '4',
                    },
                },
                {
                    'pt-*-*': {
                        _desired: 'pt-*-*',
                        _distance: '5',
                    },
                },
                {
                    'zh-Hant-$cnsar': {
                        _desired: 'zh-Hant-$cnsar',
                        _distance: '4',
                    },
                },
                {
                    'zh-Hant-$!cnsar': {
                        _desired: 'zh-Hant-$!cnsar',
                        _distance: '4',
                    },
                },
                {
                    'zh-Hant-*': {
                        _desired: 'zh-Hant-*',
                        _distance: '5',
                    },
                },
                {
                    '*-*-*': {
                        _desired: '*-*-*',
                        _distance: '4',
                    },
                },
            ],
        },
    },
};

},{}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regions = void 0;
// This file is generated from regions-gen.ts
exports.regions = {
    "001": [
        "001",
        "001-status-grouping",
        "002",
        "005",
        "009",
        "011",
        "013",
        "014",
        "015",
        "017",
        "018",
        "019",
        "021",
        "029",
        "030",
        "034",
        "035",
        "039",
        "053",
        "054",
        "057",
        "061",
        "142",
        "143",
        "145",
        "150",
        "151",
        "154",
        "155",
        "AC",
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CP",
        "CQ",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DG",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EA",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "EU",
        "EZ",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HM",
        "HN",
        "HR",
        "HT",
        "HU",
        "IC",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NF",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "QO",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TA",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UM",
        "UN",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "XK",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "002": [
        "002",
        "002-status-grouping",
        "011",
        "014",
        "015",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "DZ",
        "EA",
        "EG",
        "EH",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IC",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "LY",
        "MA",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SD",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TN",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "003": [
        "003",
        "013",
        "021",
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BM",
        "BQ",
        "BS",
        "BZ",
        "CA",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GL",
        "GP",
        "GT",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PM",
        "PR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "VC",
        "VG",
        "VI"
    ],
    "005": [
        "005",
        "AR",
        "BO",
        "BR",
        "BV",
        "CL",
        "CO",
        "EC",
        "FK",
        "GF",
        "GS",
        "GY",
        "PE",
        "PY",
        "SR",
        "UY",
        "VE"
    ],
    "009": [
        "009",
        "053",
        "054",
        "057",
        "061",
        "AC",
        "AQ",
        "AS",
        "AU",
        "CC",
        "CK",
        "CP",
        "CX",
        "DG",
        "FJ",
        "FM",
        "GU",
        "HM",
        "KI",
        "MH",
        "MP",
        "NC",
        "NF",
        "NR",
        "NU",
        "NZ",
        "PF",
        "PG",
        "PN",
        "PW",
        "QO",
        "SB",
        "TA",
        "TK",
        "TO",
        "TV",
        "UM",
        "VU",
        "WF",
        "WS"
    ],
    "011": [
        "011",
        "BF",
        "BJ",
        "CI",
        "CV",
        "GH",
        "GM",
        "GN",
        "GW",
        "LR",
        "ML",
        "MR",
        "NE",
        "NG",
        "SH",
        "SL",
        "SN",
        "TG"
    ],
    "013": [
        "013",
        "BZ",
        "CR",
        "GT",
        "HN",
        "MX",
        "NI",
        "PA",
        "SV"
    ],
    "014": [
        "014",
        "BI",
        "DJ",
        "ER",
        "ET",
        "IO",
        "KE",
        "KM",
        "MG",
        "MU",
        "MW",
        "MZ",
        "RE",
        "RW",
        "SC",
        "SO",
        "SS",
        "TF",
        "TZ",
        "UG",
        "YT",
        "ZM",
        "ZW"
    ],
    "015": [
        "015",
        "DZ",
        "EA",
        "EG",
        "EH",
        "IC",
        "LY",
        "MA",
        "SD",
        "TN"
    ],
    "017": [
        "017",
        "AO",
        "CD",
        "CF",
        "CG",
        "CM",
        "GA",
        "GQ",
        "ST",
        "TD"
    ],
    "018": [
        "018",
        "BW",
        "LS",
        "NA",
        "SZ",
        "ZA"
    ],
    "019": [
        "003",
        "005",
        "013",
        "019",
        "019-status-grouping",
        "021",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BM",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CA",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GL",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PM",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
    ],
    "021": [
        "021",
        "BM",
        "CA",
        "GL",
        "PM",
        "US"
    ],
    "029": [
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BQ",
        "BS",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GP",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "PR",
        "SX",
        "TC",
        "TT",
        "VC",
        "VG",
        "VI"
    ],
    "030": [
        "030",
        "CN",
        "HK",
        "JP",
        "KP",
        "KR",
        "MN",
        "MO",
        "TW"
    ],
    "034": [
        "034",
        "AF",
        "BD",
        "BT",
        "IN",
        "IR",
        "LK",
        "MV",
        "NP",
        "PK"
    ],
    "035": [
        "035",
        "BN",
        "ID",
        "KH",
        "LA",
        "MM",
        "MY",
        "PH",
        "SG",
        "TH",
        "TL",
        "VN"
    ],
    "039": [
        "039",
        "AD",
        "AL",
        "BA",
        "ES",
        "GI",
        "GR",
        "HR",
        "IT",
        "ME",
        "MK",
        "MT",
        "PT",
        "RS",
        "SI",
        "SM",
        "VA",
        "XK"
    ],
    "053": [
        "053",
        "AU",
        "CC",
        "CX",
        "HM",
        "NF",
        "NZ"
    ],
    "054": [
        "054",
        "FJ",
        "NC",
        "PG",
        "SB",
        "VU"
    ],
    "057": [
        "057",
        "FM",
        "GU",
        "KI",
        "MH",
        "MP",
        "NR",
        "PW",
        "UM"
    ],
    "061": [
        "061",
        "AS",
        "CK",
        "NU",
        "PF",
        "PN",
        "TK",
        "TO",
        "TV",
        "WF",
        "WS"
    ],
    "142": [
        "030",
        "034",
        "035",
        "142",
        "143",
        "145",
        "AE",
        "AF",
        "AM",
        "AZ",
        "BD",
        "BH",
        "BN",
        "BT",
        "CN",
        "CY",
        "GE",
        "HK",
        "ID",
        "IL",
        "IN",
        "IQ",
        "IR",
        "JO",
        "JP",
        "KG",
        "KH",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LK",
        "MM",
        "MN",
        "MO",
        "MV",
        "MY",
        "NP",
        "OM",
        "PH",
        "PK",
        "PS",
        "QA",
        "SA",
        "SG",
        "SY",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TR",
        "TW",
        "UZ",
        "VN",
        "YE"
    ],
    "143": [
        "143",
        "KG",
        "KZ",
        "TJ",
        "TM",
        "UZ"
    ],
    "145": [
        "145",
        "AE",
        "AM",
        "AZ",
        "BH",
        "CY",
        "GE",
        "IL",
        "IQ",
        "JO",
        "KW",
        "LB",
        "OM",
        "PS",
        "QA",
        "SA",
        "SY",
        "TR",
        "YE"
    ],
    "150": [
        "039",
        "150",
        "151",
        "154",
        "155",
        "AD",
        "AL",
        "AT",
        "AX",
        "BA",
        "BE",
        "BG",
        "BY",
        "CH",
        "CQ",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "FI",
        "FO",
        "FR",
        "GB",
        "GG",
        "GI",
        "GR",
        "HR",
        "HU",
        "IE",
        "IM",
        "IS",
        "IT",
        "JE",
        "LI",
        "LT",
        "LU",
        "LV",
        "MC",
        "MD",
        "ME",
        "MK",
        "MT",
        "NL",
        "NO",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SE",
        "SI",
        "SJ",
        "SK",
        "SM",
        "UA",
        "VA",
        "XK"
    ],
    "151": [
        "151",
        "BG",
        "BY",
        "CZ",
        "HU",
        "MD",
        "PL",
        "RO",
        "RU",
        "SK",
        "UA"
    ],
    "154": [
        "154",
        "AX",
        "CQ",
        "DK",
        "EE",
        "FI",
        "FO",
        "GB",
        "GG",
        "IE",
        "IM",
        "IS",
        "JE",
        "LT",
        "LV",
        "NO",
        "SE",
        "SJ"
    ],
    "155": [
        "155",
        "AT",
        "BE",
        "CH",
        "DE",
        "FR",
        "LI",
        "LU",
        "MC",
        "NL"
    ],
    "202": [
        "011",
        "014",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "419": [
        "005",
        "013",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
    ],
    "EU": [
        "AT",
        "BE",
        "BG",
        "CY",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "EU",
        "FI",
        "FR",
        "GR",
        "HR",
        "HU",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SE",
        "SI",
        "SK"
    ],
    "EZ": [
        "AT",
        "BE",
        "CY",
        "DE",
        "EE",
        "ES",
        "EZ",
        "FI",
        "FR",
        "GR",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PT",
        "SI",
        "SK"
    ],
    "QO": [
        "AC",
        "AQ",
        "CP",
        "DG",
        "QO",
        "TA"
    ],
    "UN": [
        "AD",
        "AE",
        "AF",
        "AG",
        "AL",
        "AM",
        "AO",
        "AR",
        "AT",
        "AU",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FM",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GR",
        "GT",
        "GW",
        "GY",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MR",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PG",
        "PH",
        "PK",
        "PL",
        "PT",
        "PW",
        "PY",
        "QA",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SI",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SY",
        "SZ",
        "TD",
        "TG",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TZ",
        "UA",
        "UG",
        "UN",
        "US",
        "UY",
        "UZ",
        "VC",
        "VE",
        "VN",
        "VU",
        "WS",
        "YE",
        "ZA",
        "ZM",
        "ZW"
    ]
};

},{}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBestMatch = exports.findMatchingDistance = exports.invariant = exports.UNICODE_EXTENSION_SEQUENCE_REGEX = void 0;
var tslib_1 = require("tslib");
var languageMatching_1 = require("./languageMatching");
var regions_generated_1 = require("./regions.generated");
exports.UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
function invariant(condition, message, Err) {
    if (Err === void 0) { Err = Error; }
    if (!condition) {
        throw new Err(message);
    }
}
exports.invariant = invariant;
// This is effectively 2 languages in 2 different regions in the same cluster
var DEFAULT_MATCHING_THRESHOLD = 838;
var PROCESSED_DATA;
function processData() {
    var _a, _b;
    if (!PROCESSED_DATA) {
        var paradigmLocales = (_b = (_a = languageMatching_1.data.supplemental.languageMatching['written-new'][0]) === null || _a === void 0 ? void 0 : _a.paradigmLocales) === null || _b === void 0 ? void 0 : _b._locales.split(' ');
        var matchVariables = languageMatching_1.data.supplemental.languageMatching['written-new'].slice(1, 5);
        var data = languageMatching_1.data.supplemental.languageMatching['written-new'].slice(5);
        var matches = data.map(function (d) {
            var key = Object.keys(d)[0];
            var value = d[key];
            return {
                supported: key,
                desired: value._desired,
                distance: +value._distance,
                oneway: value.oneway === 'true' ? true : false,
            };
        }, {});
        PROCESSED_DATA = {
            matches: matches,
            matchVariables: matchVariables.reduce(function (all, d) {
                var key = Object.keys(d)[0];
                var value = d[key];
                all[key.slice(1)] = value._value.split('+');
                return all;
            }, {}),
            paradigmLocales: tslib_1.__spreadArray(tslib_1.__spreadArray([], paradigmLocales, true), paradigmLocales.map(function (l) {
                return new Intl.Locale(l.replace(/_/g, '-')).maximize().toString();
            }), true),
        };
    }
    return PROCESSED_DATA;
}
function isMatched(locale, languageMatchInfoLocale, matchVariables) {
    var _a = languageMatchInfoLocale.split('-'), language = _a[0], script = _a[1], region = _a[2];
    var matches = true;
    if (region && region[0] === '$') {
        var shouldInclude = region[1] !== '!';
        var matchRegions = shouldInclude
            ? matchVariables[region.slice(1)]
            : matchVariables[region.slice(2)];
        var expandedMatchedRegions = matchRegions
            .map(function (r) { return regions_generated_1.regions[r] || [r]; })
            .reduce(function (all, list) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], all, true), list, true); }, []);
        matches && (matches = !(expandedMatchedRegions.indexOf(locale.region || '') > 1 !=
            shouldInclude));
    }
    else {
        matches && (matches = locale.region
            ? region === '*' || region === locale.region
            : true);
    }
    matches && (matches = locale.script ? script === '*' || script === locale.script : true);
    matches && (matches = locale.language
        ? language === '*' || language === locale.language
        : true);
    return matches;
}
function serializeLSR(lsr) {
    return [lsr.language, lsr.script, lsr.region].filter(Boolean).join('-');
}
function findMatchingDistanceForLSR(desired, supported, data) {
    for (var _i = 0, _a = data.matches; _i < _a.length; _i++) {
        var d = _a[_i];
        var matches = isMatched(desired, d.desired, data.matchVariables) &&
            isMatched(supported, d.supported, data.matchVariables);
        if (!d.oneway && !matches) {
            matches =
                isMatched(desired, d.supported, data.matchVariables) &&
                    isMatched(supported, d.desired, data.matchVariables);
        }
        if (matches) {
            var distance = d.distance * 10;
            if (data.paradigmLocales.indexOf(serializeLSR(desired)) > -1 !=
                data.paradigmLocales.indexOf(serializeLSR(supported)) > -1) {
                return distance - 1;
            }
            return distance;
        }
    }
    throw new Error('No matching distance found');
}
function findMatchingDistance(desired, supported) {
    var desiredLocale = new Intl.Locale(desired).maximize();
    var supportedLocale = new Intl.Locale(supported).maximize();
    var desiredLSR = {
        language: desiredLocale.language,
        script: desiredLocale.script || '',
        region: desiredLocale.region || '',
    };
    var supportedLSR = {
        language: supportedLocale.language,
        script: supportedLocale.script || '',
        region: supportedLocale.region || '',
    };
    var matchingDistance = 0;
    var data = processData();
    if (desiredLSR.language !== supportedLSR.language) {
        matchingDistance += findMatchingDistanceForLSR({
            language: desiredLocale.language,
            script: '',
            region: '',
        }, {
            language: supportedLocale.language,
            script: '',
            region: '',
        }, data);
    }
    if (desiredLSR.script !== supportedLSR.script) {
        matchingDistance += findMatchingDistanceForLSR({
            language: desiredLocale.language,
            script: desiredLSR.script,
            region: '',
        }, {
            language: supportedLocale.language,
            script: desiredLSR.script,
            region: '',
        }, data);
    }
    if (desiredLSR.region !== supportedLSR.region) {
        matchingDistance += findMatchingDistanceForLSR(desiredLSR, supportedLSR, data);
    }
    return matchingDistance;
}
exports.findMatchingDistance = findMatchingDistance;
function findBestMatch(requestedLocales, supportedLocales, threshold) {
    if (threshold === void 0) { threshold = DEFAULT_MATCHING_THRESHOLD; }
    var lowestDistance = Infinity;
    var result = {
        matchedDesiredLocale: '',
        distances: {},
    };
    requestedLocales.forEach(function (desired, i) {
        if (!result.distances[desired]) {
            result.distances[desired] = {};
        }
        supportedLocales.forEach(function (supported) {
            // Add some weight to the distance based on the order of the supported locales
            // Add penalty for the order of the requested locales, which currently is 0 since ECMA-402
            // doesn't really have room for weighted locales like `en; q=0.1`
            var distance = findMatchingDistance(desired, supported) + 0 + i * 40;
            result.distances[desired][supported] = distance;
            if (distance < lowestDistance) {
                lowestDistance = distance;
                result.matchedDesiredLocale = desired;
                result.matchedSupportedLocale = supported;
            }
        });
    });
    if (lowestDistance >= threshold) {
        result.matchedDesiredLocale = undefined;
        result.matchedSupportedLocale = undefined;
    }
    return result;
}
exports.findBestMatch = findBestMatch;

},{"./languageMatching":76,"./regions.generated":77,"tslib":80}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveLocale = exports.LookupSupportedLocales = exports.match = void 0;
var CanonicalizeLocaleList_1 = require("./abstract/CanonicalizeLocaleList");
var ResolveLocale_1 = require("./abstract/ResolveLocale");
function match(requestedLocales, availableLocales, defaultLocale, opts) {
    return (0, ResolveLocale_1.ResolveLocale)(availableLocales, (0, CanonicalizeLocaleList_1.CanonicalizeLocaleList)(requestedLocales), {
        localeMatcher: (opts === null || opts === void 0 ? void 0 : opts.algorithm) || 'best fit',
    }, [], {}, function () { return defaultLocale; }).locale;
}
exports.match = match;
var LookupSupportedLocales_1 = require("./abstract/LookupSupportedLocales");
Object.defineProperty(exports, "LookupSupportedLocales", { enumerable: true, get: function () { return LookupSupportedLocales_1.LookupSupportedLocales; } });
var ResolveLocale_2 = require("./abstract/ResolveLocale");
Object.defineProperty(exports, "ResolveLocale", { enumerable: true, get: function () { return ResolveLocale_2.ResolveLocale; } });

},{"./abstract/CanonicalizeLocaleList":71,"./abstract/LookupSupportedLocales":73,"./abstract/ResolveLocale":74}],80:[function(require,module,exports){
(function (global){(function (){
/******************************************************************************
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
var __esDecorate;
var __runInitializers;
var __propKey;
var __setFunctionName;
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
var __classPrivateFieldIn;
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

    __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access) context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0) continue;
                if (result === null || typeof result !== "object") throw new TypeError("Object expected");
                if (_ = accept(result.get)) descriptor.get = _;
                if (_ = accept(result.set)) descriptor.set = _;
                if (_ = accept(result.init)) initializers.push(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field") initializers.push(_);
                else descriptor[key] = _;
            }
        }
        if (target) Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    };

    __runInitializers = function (thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    };

    __propKey = function (x) {
        return typeof x === "symbol" ? x : "".concat(x);
    };

    __setFunctionName = function (f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
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

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
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
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
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

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    __classPrivateFieldIn = function (state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__esDecorate", __esDecorate);
    exporter("__runInitializers", __runInitializers);
    exporter("__propKey", __propKey);
    exporter("__setFunctionName", __setFunctionName);
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
    exporter("__classPrivateFieldIn", __classPrivateFieldIn);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var ecma402_abstract_1 = require("@formatjs/ecma402-abstract");
var should_polyfill_1 = require("./should-polyfill");
var to_locale_string_1 = require("./src/to_locale_string");
if ((0, should_polyfill_1.shouldPolyfill)()) {
    (0, ecma402_abstract_1.defineProperty)(Intl, 'DateTimeFormat', { value: _1.DateTimeFormat });
    (0, ecma402_abstract_1.defineProperty)(Date.prototype, 'toLocaleString', {
        value: function toLocaleString(locales, options) {
            try {
                return (0, to_locale_string_1.toLocaleString)(this, locales, options);
            }
            catch (error) {
                return 'Invalid Date';
            }
        },
    });
    (0, ecma402_abstract_1.defineProperty)(Date.prototype, 'toLocaleDateString', {
        value: function toLocaleDateString(locales, options) {
            try {
                return (0, to_locale_string_1.toLocaleDateString)(this, locales, options);
            }
            catch (error) {
                return 'Invalid Date';
            }
        },
    });
    (0, ecma402_abstract_1.defineProperty)(Date.prototype, 'toLocaleTimeString', {
        value: function toLocaleTimeString(locales, options) {
            try {
                return (0, to_locale_string_1.toLocaleTimeString)(this, locales, options);
            }
            catch (error) {
                return 'Invalid Date';
            }
        },
    });
}

},{"./":46,"./should-polyfill":47,"./src/to_locale_string":67,"@formatjs/ecma402-abstract":37}]},{},[81])(81)
});
