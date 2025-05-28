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

var clampRgba = function (rgba) { return ({
    r: clamp(rgba.r, 0, 255),
    g: clamp(rgba.g, 0, 255),
    b: clamp(rgba.b, 0, 255),
    a: clamp(rgba.a),
}); };
/**
 * Converts an RGB channel [0-255] to its linear light (un-companded) form [0-1].
 * Linearized RGB values are widely used for color space conversions and contrast calculations
 */
var linearizeRgbChannel = function (value) {
    var ratio = value / 255;
    return ratio < 0.04045 ? ratio / 12.92 : Math.pow((ratio + 0.055) / 1.055, 2.4);
};
/**
 * Converts an linear-light sRGB channel [0-1] back to its gamma corrected form [0-255]
 */
var unlinearizeRgbChannel = function (ratio) {
    var value = ratio > 0.0031308 ? 1.055 * Math.pow(ratio, 1 / 2.4) - 0.055 : 12.92 * ratio;
    return value * 255;
};

// Theoretical light source that approximates "warm daylight" and follows the CIE standard.
// https://en.wikipedia.org/wiki/Standard_illuminant
var D50 = {
    x: 96.422,
    y: 100,
    z: 82.521,
};
/**
 * Limits XYZ axis values assuming XYZ is relative to D50.
 */
var clampXyza = function (xyza) { return ({
    x: clamp(xyza.x, 0, D50.x),
    y: clamp(xyza.y, 0, D50.y),
    z: clamp(xyza.z, 0, D50.z),
    a: clamp(xyza.a),
}); };
/**
 * Performs Bradford chromatic adaptation from D65 to D50
 */
var adaptXyzaToD50 = function (xyza) { return ({
    x: xyza.x * 1.0478112 + xyza.y * 0.0228866 + xyza.z * -0.050127,
    y: xyza.x * 0.0295424 + xyza.y * 0.9904844 + xyza.z * -0.0170491,
    z: xyza.x * -0.0092345 + xyza.y * 0.0150436 + xyza.z * 0.7521316,
    a: xyza.a,
}); };
/**
 * Performs Bradford chromatic adaptation from D50 to D65
 */
var adaptXyzToD65 = function (xyza) { return ({
    x: xyza.x * 0.9555766 + xyza.y * -0.0230393 + xyza.z * 0.0631636,
    y: xyza.x * -0.0282895 + xyza.y * 1.0099416 + xyza.z * 0.0210077,
    z: xyza.x * 0.0122982 + xyza.y * -0.020483 + xyza.z * 1.3299098,
}); };
/**
 * Converts an CIE XYZ color (D50) to RGBA color space (D65)
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
var xyzaToRgba = function (sourceXyza) {
    var xyz = adaptXyzToD65(sourceXyza);
    return clampRgba({
        r: unlinearizeRgbChannel(0.032404542 * xyz.x - 0.015371385 * xyz.y - 0.004985314 * xyz.z),
        g: unlinearizeRgbChannel(-0.00969266 * xyz.x + 0.018760108 * xyz.y + 0.00041556 * xyz.z),
        b: unlinearizeRgbChannel(0.000556434 * xyz.x - 0.002040259 * xyz.y + 0.010572252 * xyz.z),
        a: sourceXyza.a,
    });
};
/**
 * Converts an RGB color (D65) to CIE XYZ (D50)
 * https://image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 */
var rgbaToXyza = function (rgba) {
    var sRed = linearizeRgbChannel(rgba.r);
    var sGreen = linearizeRgbChannel(rgba.g);
    var sBlue = linearizeRgbChannel(rgba.b);
    // Convert an array of linear-light sRGB values to CIE XYZ
    // using sRGB own white (D65 no chromatic adaptation)
    var xyza = {
        x: (sRed * 0.4124564 + sGreen * 0.3575761 + sBlue * 0.1804375) * 100,
        y: (sRed * 0.2126729 + sGreen * 0.7151522 + sBlue * 0.072175) * 100,
        z: (sRed * 0.0193339 + sGreen * 0.119192 + sBlue * 0.9503041) * 100,
        a: rgba.a,
    };
    return clampXyza(adaptXyzaToD50(xyza));
};

// Conversion factors from https://en.wikipedia.org/wiki/CIELAB_color_space
var e = 216 / 24389;
var k = 24389 / 27;
/**
 * Performs RGB → CIEXYZ → LAB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
var rgbaToLaba = function (rgba) {
    // Compute XYZ scaled relative to D50 reference white
    var xyza = rgbaToXyza(rgba);
    var x = xyza.x / D50.x;
    var y = xyza.y / D50.y;
    var z = xyza.z / D50.z;
    x = x > e ? Math.cbrt(x) : (k * x + 16) / 116;
    y = y > e ? Math.cbrt(y) : (k * y + 16) / 116;
    z = z > e ? Math.cbrt(z) : (k * z + 16) / 116;
    return {
        l: 116 * y - 16,
        a: 500 * (x - y),
        b: 200 * (y - z),
        alpha: xyza.a,
    };
};
/**
 * Performs LAB → CIEXYZ → RGB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
var labaToRgba = function (laba) {
    var y = (laba.l + 16) / 116;
    var x = laba.a / 500 + y;
    var z = y - laba.b / 200;
    return xyzaToRgba({
        x: (Math.pow(x, 3) > e ? Math.pow(x, 3) : (116 * x - 16) / k) * D50.x,
        y: (laba.l > k * e ? Math.pow((laba.l + 16) / 116, 3) : laba.l / k) * D50.y,
        z: (Math.pow(z, 3) > e ? Math.pow(z, 3) : (116 * z - 16) / k) * D50.z,
        a: laba.alpha,
    });
};

/**
 * Limits LCH axis values.
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 * https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/#how-does-lch-work
 */
var clampLcha = function (laba) { return ({
    l: clamp(laba.l, 0, 100),
    c: laba.c,
    h: clampHue(laba.h),
    a: laba.a,
}); };
var roundLcha = function (laba) { return ({
    l: round(laba.l, 2),
    c: round(laba.c, 2),
    h: round(laba.h, 2),
    a: round(laba.a, ALPHA_PRECISION),
}); };
var parseLcha = function (_a) {
    var l = _a.l, c = _a.c, h = _a.h, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(l) || !isPresent(c) || !isPresent(h))
        return null;
    var lcha = clampLcha({
        l: Number(l),
        c: Number(c),
        h: Number(h),
        a: Number(a),
    });
    return lchaToRgba(lcha);
};
/**
 * Performs RGB → CIEXYZ → CIELAB → CIELCH color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
var rgbaToLcha = function (rgba) {
    var laba = rgbaToLaba(rgba);
    // Round axis values to get proper values for grayscale colors
    var a = round(laba.a, 3);
    var b = round(laba.b, 3);
    var hue = 180 * (Math.atan2(b, a) / Math.PI);
    return {
        l: laba.l,
        c: Math.sqrt(a * a + b * b),
        h: hue < 0 ? hue + 360 : hue,
        a: laba.alpha,
    };
};
/**
 * Performs CIELCH → CIELAB → CIEXYZ → RGB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
var lchaToRgba = function (lcha) {
    return labaToRgba({
        l: lcha.l,
        a: lcha.c * Math.cos((lcha.h * Math.PI) / 180),
        b: lcha.c * Math.sin((lcha.h * Math.PI) / 180),
        alpha: lcha.a,
    });
};

// The only valid LCH syntax
// lch() = lch( <percentage> <number> <hue> [ / <alpha-value> ]? )
var lchaMatcher = /^lch\(\s*([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid LCH CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
var parseLchaString = function (input) {
    var match = lchaMatcher.exec(input);
    if (!match)
        return null;
    var lcha = clampLcha({
        l: Number(match[1]),
        c: Number(match[2]),
        h: parseHue(match[3], match[4]),
        a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
    });
    return lchaToRgba(lcha);
};
var rgbaToLchaString = function (rgba) {
    var _a = roundLcha(rgbaToLcha(rgba)), l = _a.l, c = _a.c, h = _a.h, a = _a.a;
    return a < 1 ? "lch(" + l + "% " + c + " " + h + " / " + a + ")" : "lch(" + l + "% " + c + " " + h + ")";
};

/**
 * A plugin adding support for CIELCH color space.
 * https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/
 * https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model
 */
var lchPlugin = function (ColordClass, parsers) {
    ColordClass.prototype.toLch = function () {
        return roundLcha(rgbaToLcha(this.rgba));
    };
    ColordClass.prototype.toLchString = function () {
        return rgbaToLchaString(this.rgba);
    };
    parsers.string.push([parseLchaString, "lch"]);
    parsers.object.push([parseLcha, "lch"]);
};

export default lchPlugin;
