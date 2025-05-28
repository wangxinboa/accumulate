/**
 * We used to work with 2 digits after the decimal point, but it wasn't accurate enough,
 * so the library produced colors that were perceived differently.
 */
var ALPHA_PRECISION = 3;
/**
 * Valid CSS <angle> units.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
var ANGLE_UNITS = {
    grad: 360 / 400,
    turn: 360,
    rad: 360 / (Math.PI * 2),
};

var isPresent = function (value) {
    if (typeof value === "string")
        return value.length > 0;
    if (typeof value === "number")
        return true;
    return false;
};
var round = function (number, digits, base) {
    if (digits === void 0) { digits = 0; }
    if (base === void 0) { base = Math.pow(10, digits); }
    return Math.round(base * number) / base + 0;
};
/**
 * Clamps a value between an upper and lower bound.
 * We use ternary operators because it makes the minified code
 * is 2 times shorter then `Math.min(Math.max(a,b),c)`
 * NaN is clamped to the lower bound
 */
var clamp = function (number, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return number > max ? max : number > min ? number : min;
};
/**
 * Processes and clamps a degree (angle) value properly.
 * Any `NaN` or `Infinity` will be converted to `0`.
 * Examples: -1 => 359, 361 => 1
 */
var clampHue = function (degrees) {
    degrees = isFinite(degrees) ? degrees % 360 : 0;
    return degrees > 0 ? degrees : degrees + 360;
};
/**
 * Converts a hue value to degrees from 0 to 360 inclusive.
 */
var parseHue = function (value, unit) {
    if (unit === void 0) { unit = "deg"; }
    return Number(value) * (ANGLE_UNITS[unit] || 1);
};

var rgbaToHsva = function (_a) {
    var r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    var max = Math.max(r, g, b);
    var delta = max - Math.min(r, g, b);
    var hh = delta
        ? max === r
            ? (g - b) / delta
            : max === g
                ? 2 + (b - r) / delta
                : 4 + (r - g) / delta
        : 0;
    return {
        h: 60 * (hh < 0 ? hh + 6 : hh),
        s: max ? (delta / max) * 100 : 0,
        v: (max / 255) * 100,
        a: a,
    };
};
var hsvaToRgba = function (_a) {
    var h = _a.h, s = _a.s, v = _a.v, a = _a.a;
    h = (h / 360) * 6;
    s = s / 100;
    v = v / 100;
    var hh = Math.floor(h), b = v * (1 - s), c = v * (1 - (h - hh) * s), d = v * (1 - (1 - h + hh) * s), module = hh % 6;
    return {
        r: [v, c, b, b, d, v][module] * 255,
        g: [d, v, v, c, b, b][module] * 255,
        b: [b, b, d, v, v, c][module] * 255,
        a: a,
    };
};

var clampHwba = function (hwba) { return ({
    h: clampHue(hwba.h),
    w: clamp(hwba.w, 0, 100),
    b: clamp(hwba.b, 0, 100),
    a: clamp(hwba.a),
}); };
var roundHwba = function (hwba) { return ({
    h: round(hwba.h),
    w: round(hwba.w),
    b: round(hwba.b),
    a: round(hwba.a, ALPHA_PRECISION),
}); };
var rgbaToHwba = function (rgba) {
    var h = rgbaToHsva(rgba).h;
    var w = (Math.min(rgba.r, rgba.g, rgba.b) / 255) * 100;
    var b = 100 - (Math.max(rgba.r, rgba.g, rgba.b) / 255) * 100;
    return { h: h, w: w, b: b, a: rgba.a };
};
var hwbaToRgba = function (hwba) {
    return hsvaToRgba({
        h: hwba.h,
        s: hwba.b === 100 ? 0 : 100 - (hwba.w / (100 - hwba.b)) * 100,
        v: 100 - hwba.b,
        a: hwba.a,
    });
};
var parseHwba = function (_a) {
    var h = _a.h, w = _a.w, b = _a.b, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(h) || !isPresent(w) || !isPresent(b))
        return null;
    var hwba = clampHwba({
        h: Number(h),
        w: Number(w),
        b: Number(b),
        a: Number(a),
    });
    return hwbaToRgba(hwba);
};

// The only valid HWB syntax
// hwb( <hue> <percentage> <percentage> [ / <alpha-value> ]? )
var hwbaMatcher = /^hwb\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid HWB[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#the-hwb-notation
 */
var parseHwbaString = function (input) {
    var match = hwbaMatcher.exec(input);
    if (!match)
        return null;
    var hwba = clampHwba({
        h: parseHue(match[1], match[2]),
        w: Number(match[3]),
        b: Number(match[4]),
        a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
    });
    return hwbaToRgba(hwba);
};
var rgbaToHwbaString = function (rgba) {
    var _a = roundHwba(rgbaToHwba(rgba)), h = _a.h, w = _a.w, b = _a.b, a = _a.a;
    return a < 1 ? "hwb(" + h + " " + w + "% " + b + "% / " + a + ")" : "hwb(" + h + " " + w + "% " + b + "%)";
};

/**
 * A plugin adding support for HWB (Hue-Whiteness-Blackness) color model.
 * https://en.wikipedia.org/wiki/HWB_color_model
 * https://www.w3.org/TR/css-color-4/#the-hwb-notation
 */
var hwbPlugin = function (ColordClass, parsers) {
    ColordClass.prototype.toHwb = function () {
        return roundHwba(rgbaToHwba(this.rgba));
    };
    ColordClass.prototype.toHwbString = function () {
        return rgbaToHwbaString(this.rgba);
    };
    parsers.string.push([parseHwbaString, "hwb"]);
    parsers.object.push([parseHwba, "hwb"]);
};

export default hwbPlugin;
