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
var roundRgba = function (rgba) { return ({
    r: round(rgba.r),
    g: round(rgba.g),
    b: round(rgba.b),
    a: round(rgba.a, ALPHA_PRECISION),
}); };
var parseRgba = function (_a) {
    var r = _a.r, g = _a.g, b = _a.b, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(r) || !isPresent(g) || !isPresent(b))
        return null;
    return clampRgba({
        r: Number(r),
        g: Number(g),
        b: Number(b),
        a: Number(a),
    });
};

var hexMatcher = /^#([0-9a-f]{3,8})$/i;
/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
var parseHex = function (hex) {
    var hexMatch = hexMatcher.exec(hex);
    if (!hexMatch)
        return null;
    hex = hexMatch[1];
    if (hex.length <= 4) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
            a: hex.length === 4 ? round(parseInt(hex[3] + hex[3], 16) / 255, 2) : 1,
        };
    }
    if (hex.length === 6 || hex.length === 8) {
        return {
            r: parseInt(hex.substr(0, 2), 16),
            g: parseInt(hex.substr(2, 2), 16),
            b: parseInt(hex.substr(4, 2), 16),
            a: hex.length === 8 ? round(parseInt(hex.substr(6, 2), 16) / 255, 2) : 1,
        };
    }
    return null;
};
/** Formats any decimal number (e.g. 128) as a hexadecimal string (e.g. "08") */
var format = function (number) {
    var hex = number.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};
/** Converts RGBA object to Hex6 or (if it has alpha channel) Hex8 string */
var rgbaToHex = function (rgba) {
    var _a = roundRgba(rgba), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    var alphaHex = a < 1 ? format(round(a * 255)) : "";
    return "#" + format(r) + format(g) + format(b) + alphaHex;
};

var clampHsva = function (hsva) { return ({
    h: clampHue(hsva.h),
    s: clamp(hsva.s, 0, 100),
    v: clamp(hsva.v, 0, 100),
    a: clamp(hsva.a),
}); };
var roundHsva = function (hsva) { return ({
    h: round(hsva.h),
    s: round(hsva.s),
    v: round(hsva.v),
    a: round(hsva.a, ALPHA_PRECISION),
}); };
var parseHsva = function (_a) {
    var h = _a.h, s = _a.s, v = _a.v, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(h) || !isPresent(s) || !isPresent(v))
        return null;
    var hsva = clampHsva({
        h: Number(h),
        s: Number(s),
        v: Number(v),
        a: Number(a),
    });
    return hsvaToRgba(hsva);
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

var clampHsla = function (hsla) { return ({
    h: clampHue(hsla.h),
    s: clamp(hsla.s, 0, 100),
    l: clamp(hsla.l, 0, 100),
    a: clamp(hsla.a),
}); };
var roundHsla = function (hsla) { return ({
    h: round(hsla.h),
    s: round(hsla.s),
    l: round(hsla.l),
    a: round(hsla.a, ALPHA_PRECISION),
}); };
var parseHsla = function (_a) {
    var h = _a.h, s = _a.s, l = _a.l, _b = _a.a, a = _b === void 0 ? 1 : _b;
    if (!isPresent(h) || !isPresent(s) || !isPresent(l))
        return null;
    var hsla = clampHsla({
        h: Number(h),
        s: Number(s),
        l: Number(l),
        a: Number(a),
    });
    return hslaToRgba(hsla);
};
var hslaToHsva = function (_a) {
    var h = _a.h, s = _a.s, l = _a.l, a = _a.a;
    s *= (l < 50 ? l : 100 - l) / 100;
    return {
        h: h,
        s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
        v: l + s,
        a: a,
    };
};
var hsvaToHsla = function (_a) {
    var h = _a.h, s = _a.s, v = _a.v, a = _a.a;
    var hh = ((200 - s) * v) / 100;
    return {
        h: h,
        s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
        l: hh / 2,
        a: a,
    };
};
var hslaToRgba = function (hsla) {
    return hsvaToRgba(hslaToHsva(hsla));
};
var rgbaToHsla = function (rgba) {
    return hsvaToHsla(rgbaToHsva(rgba));
};

// Functional syntax
// hsl( <hue>, <percentage>, <percentage>, <alpha-value>? )
var commaHslaMatcher = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
// Whitespace syntax
// hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? )
var spaceHslaMatcher = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid HSL[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#the-hsl-notation
 */
var parseHslaString = function (input) {
    var match = commaHslaMatcher.exec(input) || spaceHslaMatcher.exec(input);
    if (!match)
        return null;
    var hsla = clampHsla({
        h: parseHue(match[1], match[2]),
        s: Number(match[3]),
        l: Number(match[4]),
        a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
    });
    return hslaToRgba(hsla);
};
var rgbaToHslaString = function (rgba) {
    var _a = roundHsla(rgbaToHsla(rgba)), h = _a.h, s = _a.s, l = _a.l, a = _a.a;
    return a < 1 ? "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")" : "hsl(" + h + ", " + s + "%, " + l + "%)";
};

// Functional syntax
// rgb( <percentage>#{3} , <alpha-value>? )
// rgb( <number>#{3} , <alpha-value>? )
var commaRgbaMatcher = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
// Whitespace syntax
// rgb( <percentage>{3} [ / <alpha-value> ]? )
// rgb( <number>{3} [ / <alpha-value> ]? )
var spaceRgbaMatcher = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid RGB[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#rgb-functions
 */
var parseRgbaString = function (input) {
    var match = commaRgbaMatcher.exec(input) || spaceRgbaMatcher.exec(input);
    if (!match)
        return null;
    // Mixing numbers and percentages is not allowed
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_syntax_variations
    if (match[2] !== match[4] || match[4] !== match[6])
        return null;
    return clampRgba({
        r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
        g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
        b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
        a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
    });
};
var rgbaToRgbaString = function (rgba) {
    var _a = roundRgba(rgba), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return a < 1 ? "rgba(" + r + ", " + g + ", " + b + ", " + a + ")" : "rgb(" + r + ", " + g + ", " + b + ")";
};

// The built-in input parsing functions.
// We use array instead of object to keep the bundle size lighter.
var parsers = {
    string: [
        [parseHex, "hex"],
        [parseRgbaString, "rgb"],
        [parseHslaString, "hsl"],
    ],
    object: [
        [parseRgba, "rgb"],
        [parseHsla, "hsl"],
        [parseHsva, "hsv"],
    ],
};
var findValidColor = function (input, parsers) {
    for (var index = 0; index < parsers.length; index++) {
        var result = parsers[index][0](input);
        if (result)
            return [result, parsers[index][1]];
    }
    return [null, undefined];
};
/** Tries to convert an incoming value into RGBA color by going through all color model parsers */
var parse = function (input) {
    if (typeof input === "string") {
        return findValidColor(input.trim(), parsers.string);
    }
    // Don't forget that the type of `null` is "object" in JavaScript
    // https://bitsofco.de/javascript-typeof/
    if (typeof input === "object" && input !== null) {
        return findValidColor(input, parsers.object);
    }
    return [null, undefined];
};
/**
 * Returns a color model name for the input passed to the function.
 */
var getFormat = function (input) { return parse(input)[1]; };

var changeAlpha = function (rgba, a) { return ({
    r: rgba.r,
    g: rgba.g,
    b: rgba.b,
    a: a,
}); };

var saturate = function (rgba, amount) {
    var hsla = rgbaToHsla(rgba);
    return {
        h: hsla.h,
        s: clamp(hsla.s + amount * 100, 0, 100),
        l: hsla.l,
        a: hsla.a,
    };
};

/**
 * Returns the brightness of a color [0-1].
 * https://www.w3.org/TR/AERT/#color-contrast
 * https://en.wikipedia.org/wiki/YIQ
 */
var getBrightness = function (rgba) {
    return (rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000 / 255;
};

var lighten = function (rgba, amount) {
    var hsla = rgbaToHsla(rgba);
    return {
        h: hsla.h,
        s: hsla.s,
        l: clamp(hsla.l + amount * 100, 0, 100),
        a: hsla.a,
    };
};

var invert = function (rgba) { return ({
    r: 255 - rgba.r,
    g: 255 - rgba.g,
    b: 255 - rgba.b,
    a: rgba.a,
}); };

var Colord = /** @class */ (function () {
    function Colord(input) {
        // Internal color format is RGBA object.
        // We do not round the internal RGBA numbers for better conversion accuracy.
        this.parsed = parse(input)[0];
        this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
    }
    /**
     * Returns a boolean indicating whether or not an input has been parsed successfully.
     * Note: If parsing is unsuccessful, Colord defaults to black (does not throws an error).
     */
    Colord.prototype.isValid = function () {
        return this.parsed !== null;
    };
    /**
     * Returns the brightness of a color (from 0 to 1).
     * The calculation logic is modified from WCAG.
     * https://www.w3.org/TR/AERT/#color-contrast
     */
    Colord.prototype.brightness = function () {
        return round(getBrightness(this.rgba), 2);
    };
    /**
     * Same as calling `brightness() < 0.5`.
     */
    Colord.prototype.isDark = function () {
        return getBrightness(this.rgba) < 0.5;
    };
    /**
     * Same as calling `brightness() >= 0.5`.
     * */
    Colord.prototype.isLight = function () {
        return getBrightness(this.rgba) >= 0.5;
    };
    /**
     * Returns the hexadecimal representation of a color.
     * When the alpha channel value of the color is less than 1,
     * it outputs #rrggbbaa format instead of #rrggbb.
     */
    Colord.prototype.toHex = function () {
        return rgbaToHex(this.rgba);
    };
    /**
     * Converts a color to RGB color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    Colord.prototype.toRgb = function () {
        return roundRgba(this.rgba);
    };
    /**
     * Converts a color to RGB color space and returns a string representation.
     * Outputs an alpha value only if it is less than 1.
     */
    Colord.prototype.toRgbString = function () {
        return rgbaToRgbaString(this.rgba);
    };
    /**
     * Converts a color to HSL color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    Colord.prototype.toHsl = function () {
        return roundHsla(rgbaToHsla(this.rgba));
    };
    /**
     * Converts a color to HSL color space and returns a string representation.
     * Always includes an alpha value from 0 to 1.
     */
    Colord.prototype.toHslString = function () {
        return rgbaToHslaString(this.rgba);
    };
    /**
     * Converts a color to HSV color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    Colord.prototype.toHsv = function () {
        return roundHsva(rgbaToHsva(this.rgba));
    };
    /**
     * Creates a new instance containing an inverted (opposite) version of the color.
     */
    Colord.prototype.invert = function () {
        return colord(invert(this.rgba));
    };
    /**
     * Increases the HSL saturation of a color by the given amount.
     */
    Colord.prototype.saturate = function (amount) {
        if (amount === void 0) { amount = 0.1; }
        return colord(saturate(this.rgba, amount));
    };
    /**
     * Decreases the HSL saturation of a color by the given amount.
     */
    Colord.prototype.desaturate = function (amount) {
        if (amount === void 0) { amount = 0.1; }
        return colord(saturate(this.rgba, -amount));
    };
    /**
     * Makes a gray color with the same lightness as a source color.
     */
    Colord.prototype.grayscale = function () {
        return colord(saturate(this.rgba, -1));
    };
    /**
     * Increases the HSL lightness of a color by the given amount.
     */
    Colord.prototype.lighten = function (amount) {
        if (amount === void 0) { amount = 0.1; }
        return colord(lighten(this.rgba, amount));
    };
    /**
     * Increases the HSL lightness of a color by the given amount.
     */
    Colord.prototype.darken = function (amount) {
        if (amount === void 0) { amount = 0.1; }
        return colord(lighten(this.rgba, -amount));
    };
    /**
     * Changes the HSL hue of a color by the given amount.
     */
    Colord.prototype.rotate = function (amount) {
        if (amount === void 0) { amount = 15; }
        return this.hue(this.hue() + amount);
    };
    Colord.prototype.alpha = function (value) {
        if (typeof value === "number")
            return colord(changeAlpha(this.rgba, value));
        return round(this.rgba.a, ALPHA_PRECISION);
    };
    Colord.prototype.hue = function (value) {
        var hsla = rgbaToHsla(this.rgba);
        if (typeof value === "number")
            return colord({ h: value, s: hsla.s, l: hsla.l, a: hsla.a });
        return round(hsla.h);
    };
    /**
     * Determines whether two values are the same color.
     */
    Colord.prototype.isEqual = function (color) {
        return this.toHex() === colord(color).toHex();
    };
    return Colord;
}());
/**
 * Parses the given input color and creates a new `Colord` instance.
 * See accepted input formats: https://github.com/omgovich/colord#color-parsing
 */
var colord = function (input) {
    if (input instanceof Colord)
        return input;
    return new Colord(input);
};

var activePlugins = [];
var extend = function (plugins) {
    plugins.forEach(function (plugin) {
        if (activePlugins.indexOf(plugin) < 0) {
            plugin(Colord, parsers);
            activePlugins.push(plugin);
        }
    });
};

var random = function () {
    return new Colord({
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
    });
};

export { Colord, colord, extend, getFormat, random };
