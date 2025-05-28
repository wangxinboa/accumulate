/**
 * We used to work with 2 digits after the decimal point, but it wasn't accurate enough,
 * so the library produced colors that were perceived differently.
 */
var ALPHA_PRECISION = 3;

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
 * Clamps the CMYK color object values.
 */
var clampCmyka = function (cmyka) { return ({
    c: clamp(cmyka.c, 0, 100),
    m: clamp(cmyka.m, 0, 100),
    y: clamp(cmyka.y, 0, 100),
    k: clamp(cmyka.k, 0, 100),
    a: clamp(cmyka.a),
}); };
/**
 * Rounds the CMYK color object values.
 */
var roundCmyka = function (cmyka) { return ({
    c: round(cmyka.c, 2),
    m: round(cmyka.m, 2),
    y: round(cmyka.y, 2),
    k: round(cmyka.k, 2),
    a: round(cmyka.a, ALPHA_PRECISION),
}); };
/**
 * Transforms the CMYK color object to RGB.
 * https://www.rapidtables.com/convert/color/cmyk-to-rgb.html
 */
function cmykaToRgba(cmyka) {
    return {
        r: round(255 * (1 - cmyka.c / 100) * (1 - cmyka.k / 100)),
        g: round(255 * (1 - cmyka.m / 100) * (1 - cmyka.k / 100)),
        b: round(255 * (1 - cmyka.y / 100) * (1 - cmyka.k / 100)),
        a: cmyka.a,
    };
}
/**
 * Convert RGB Color Model object to CMYK.
 * https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
 */
function rgbaToCmyka(rgba) {
    var k = 1 - Math.max(rgba.r / 255, rgba.g / 255, rgba.b / 255);
    var c = (1 - rgba.r / 255 - k) / (1 - k);
    var m = (1 - rgba.g / 255 - k) / (1 - k);
    var y = (1 - rgba.b / 255 - k) / (1 - k);
    return {
        c: isNaN(c) ? 0 : round(c * 100),
        m: isNaN(m) ? 0 : round(m * 100),
        y: isNaN(y) ? 0 : round(y * 100),
        k: round(k * 100),
        a: rgba.a,
    };
}
/**
 * Parses the CMYK color object into RGB.
 */
function parseCmyka(_a) {
    var c = _a.c, m = _a.m, y = _a.y, k = _a.k, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(c) || !isPresent(m) || !isPresent(y) || !isPresent(k))
        return null;
    var cmyk = clampCmyka({
        c: Number(c),
        m: Number(m),
        y: Number(y),
        k: Number(k),
        a: Number(a),
    });
    return cmykaToRgba(cmyk);
}

var cmykMatcher = /^device-cmyk\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid CMYK CSS color function/string
 * https://www.w3.org/TR/css-color-4/#device-cmyk
 */
var parseCmykaString = function (input) {
    var match = cmykMatcher.exec(input);
    if (!match)
        return null;
    var cmyka = clampCmyka({
        c: Number(match[1]) * (match[2] ? 1 : 100),
        m: Number(match[3]) * (match[4] ? 1 : 100),
        y: Number(match[5]) * (match[6] ? 1 : 100),
        k: Number(match[7]) * (match[8] ? 1 : 100),
        a: match[9] === undefined ? 1 : Number(match[9]) / (match[10] ? 100 : 1),
    });
    return cmykaToRgba(cmyka);
};
function rgbaToCmykaString(rgb) {
    var _a = roundCmyka(rgbaToCmyka(rgb)), c = _a.c, m = _a.m, y = _a.y, k = _a.k, a = _a.a;
    return a < 1
        ? "device-cmyk(" + c + "% " + m + "% " + y + "% " + k + "% / " + a + ")"
        : "device-cmyk(" + c + "% " + m + "% " + y + "% " + k + "%)";
}

/**
 * A plugin adding support for CMYK color space.
 * https://lea.verou.me/2009/03/cmyk-colors-in-css-useful-or-useless/
 * https://en.wikipedia.org/wiki/CMYK_color_model
 */
var cmykPlugin = function (ColordClass, parsers) {
    ColordClass.prototype.toCmyk = function () {
        return roundCmyka(rgbaToCmyka(this.rgba));
    };
    ColordClass.prototype.toCmykString = function () {
        return rgbaToCmykaString(this.rgba);
    };
    parsers.object.push([parseCmyka, "cmyk"]);
    parsers.string.push([parseCmykaString, "cmyk"]);
};

export default cmykPlugin;
