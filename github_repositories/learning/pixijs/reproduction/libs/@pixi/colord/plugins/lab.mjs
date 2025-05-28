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
 * Clamps LAB axis values as defined in CSS Color Level 4 specs.
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
var clampLaba = function (laba) { return ({
    // CIE Lightness values less than 0% must be clamped to 0%.
    // Values greater than 100% are permitted for forwards compatibility with HDR.
    l: clamp(laba.l, 0, 400),
    // A and B axis values are signed (allow both positive and negative values)
    // and theoretically unbounded (but in practice do not exceed ±160).
    a: laba.a,
    b: laba.b,
    alpha: clamp(laba.alpha),
}); };
var roundLaba = function (laba) { return ({
    l: round(laba.l, 2),
    a: round(laba.a, 2),
    b: round(laba.b, 2),
    alpha: round(laba.alpha, ALPHA_PRECISION),
}); };
var parseLaba = function (_a) {
    var l = _a.l, a = _a.a, b = _a.b, _b = _a.alpha, alpha = _b === void 0 ? 1 : _b;
    if (!isPresent(l) || !isPresent(a) || !isPresent(b))
        return null;
    var laba = clampLaba({
        l: Number(l),
        a: Number(a),
        b: Number(b),
        alpha: Number(alpha),
    });
    return labaToRgba(laba);
};
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
 * Calculates the perceived color difference according to [Delta E2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
 *
 * ΔE - (Delta E, dE) The measure of change in visual perception of two given colors.
 *
 * Delta E is a metric for understanding how the human eye perceives color difference.
 * The term delta comes from mathematics, meaning change in a variable or function.
 * The suffix E references the German word Empfindung, which broadly means sensation.
 *
 * On a typical scale, the Delta E value will range from 0 to 100.
 *
 * | Delta E | Perception                             |
 * |---------|----------------------------------------|
 * | <= 1.0  | Not perceptible by human eyes          |
 * | 1 - 2   | Perceptible through close observation  |
 * | 2 - 10  | Perceptible at a glance                |
 * | 11 - 49 | Colors are more similar than opposite  |
 * | 100     | Colors are exact opposite              |
 *
 * [Source](http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html)
 * [Read about Delta E](https://zschuessler.github.io/DeltaE/learn/#toc-delta-e-2000)
 */
function getDeltaE00(color1, color2) {
    var l1 = color1.l, a1 = color1.a, b1 = color1.b;
    var l2 = color2.l, a2 = color2.a, b2 = color2.b;
    var rad2deg = 180 / Math.PI;
    var deg2rad = Math.PI / 180;
    // dc -> delta c;
    // ml -> median l;
    var c1 = Math.pow((Math.pow(a1, 2) + Math.pow(b1, 2)), 0.5);
    var c2 = Math.pow((Math.pow(a2, 2) + Math.pow(b2, 2)), 0.5);
    var mc = (c1 + c2) / 2;
    var ml = (l1 + l2) / 2;
    // reuse
    var c7 = Math.pow(mc, 7);
    var g = 0.5 * (1 - Math.pow((c7 / (c7 + Math.pow(25, 7))), 0.5));
    var a11 = a1 * (1 + g);
    var a22 = a2 * (1 + g);
    var c11 = Math.pow((Math.pow(a11, 2) + Math.pow(b1, 2)), 0.5);
    var c22 = Math.pow((Math.pow(a22, 2) + Math.pow(b2, 2)), 0.5);
    var mc1 = (c11 + c22) / 2;
    var h1 = a11 === 0 && b1 === 0 ? 0 : Math.atan2(b1, a11) * rad2deg;
    var h2 = a22 === 0 && b2 === 0 ? 0 : Math.atan2(b2, a22) * rad2deg;
    if (h1 < 0)
        h1 += 360;
    if (h2 < 0)
        h2 += 360;
    var dh = h2 - h1;
    var dhAbs = Math.abs(h2 - h1);
    if (dhAbs > 180 && h2 <= h1) {
        dh += 360;
    }
    else if (dhAbs > 180 && h2 > h1) {
        dh -= 360;
    }
    var H = h1 + h2;
    if (dhAbs <= 180) {
        H /= 2;
    }
    else {
        H = (h1 + h2 < 360 ? H + 360 : H - 360) / 2;
    }
    var T = 1 -
        0.17 * Math.cos(deg2rad * (H - 30)) +
        0.24 * Math.cos(deg2rad * 2 * H) +
        0.32 * Math.cos(deg2rad * (3 * H + 6)) -
        0.2 * Math.cos(deg2rad * (4 * H - 63));
    var dL = l2 - l1;
    var dC = c22 - c11;
    var dH = 2 * Math.sin((deg2rad * dh) / 2) * Math.pow((c11 * c22), 0.5);
    var sL = 1 + (0.015 * Math.pow((ml - 50), 2)) / Math.pow((20 + Math.pow((ml - 50), 2)), 0.5);
    var sC = 1 + 0.045 * mc1;
    var sH = 1 + 0.015 * mc1 * T;
    var dTheta = 30 * Math.exp(-1 * Math.pow(((H - 275) / 25), 2));
    var Rc = 2 * Math.pow((c7 / (c7 + Math.pow(25, 7))), 0.5);
    var Rt = -Rc * Math.sin(deg2rad * 2 * dTheta);
    var kl = 1; // 1 for graphic arts, 2 for textiles
    var kc = 1; // unity factor
    var kh = 1; // weighting factor
    return (Math.pow((Math.pow((dL / kl / sL), 2) +
        Math.pow((dC / kc / sC), 2) +
        Math.pow((dH / kh / sH), 2) +
        (Rt * dC * dH) / (kc * sC * kh * sH)), 0.5));
}

/**
 * A plugin adding support for CIELAB color space.
 * https://en.wikipedia.org/wiki/CIELAB_color_space
 */
var labPlugin = function (ColordClass, parsers) {
    ColordClass.prototype.toLab = function () {
        return roundLaba(rgbaToLaba(this.rgba));
    };
    ColordClass.prototype.delta = function (color) {
        if (color === void 0) { color = "#FFF"; }
        var compared = color instanceof ColordClass ? color : new ColordClass(color);
        var delta = getDeltaE00(this.toLab(), compared.toLab()) / 100;
        return clamp(round(delta, 3));
    };
    parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
