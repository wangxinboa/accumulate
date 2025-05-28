var round = function (number, digits, base) {
    if (digits === void 0) { digits = 0; }
    if (base === void 0) { base = Math.pow(10, digits); }
    return Math.round(base * number) / base + 0;
};

/**
 * A plugin adding a color minification utilities.
 */
var minifyPlugin = function (ColordClass) {
    // Finds the shortest hex representation
    var minifyHex = function (instance) {
        var hex = instance.toHex();
        var alpha = instance.alpha();
        var _a = hex.split(""), r1 = _a[1], r2 = _a[2], g1 = _a[3], g2 = _a[4], b1 = _a[5], b2 = _a[6], a1 = _a[7], a2 = _a[8];
        // Make sure conversion is lossless
        if (alpha > 0 && alpha < 1 && round(parseInt(a1 + a2, 16) / 255, 2) !== alpha)
            return null;
        // Check if the string can be shorten
        if (r1 === r2 && g1 === g2 && b1 === b2) {
            if (alpha === 1) {
                // Express as 3 digit hexadecimal string if the color doesn't have an alpha channel
                return "#" + r1 + g1 + b1;
            }
            else if (a1 === a2) {
                // Format 4 digit hex
                return "#" + r1 + g1 + b1 + a1;
            }
        }
        return hex;
    };
    // Returns the shortest string in array
    var findShortestString = function (variants) {
        var shortest = variants[0];
        for (var index = 1; index < variants.length; index++) {
            if (variants[index].length < shortest.length)
                shortest = variants[index];
        }
        return shortest;
    };
    // Removes leading zero before floating point if necessary
    var shortenNumber = function (number) {
        if (number > 0 && number < 1)
            return number.toString().replace("0.", ".");
        return number;
    };
    // Define new public method
    ColordClass.prototype.minify = function (options) {
        if (options === void 0) { options = {}; }
        var rgb = this.toRgb();
        var r = shortenNumber(rgb.r);
        var g = shortenNumber(rgb.g);
        var b = shortenNumber(rgb.b);
        var hsl = this.toHsl();
        var h = shortenNumber(hsl.h);
        var s = shortenNumber(hsl.s);
        var l = shortenNumber(hsl.l);
        var a = shortenNumber(this.alpha());
        var defaults = {
            hex: true,
            rgb: true,
            hsl: true,
        };
        var settings = Object.assign(defaults, options);
        var variants = [];
        // #rrggbb, #rrggbbaa, #rgb or #rgba
        if (settings.hex && (a === 1 || settings.alphaHex)) {
            var hex = minifyHex(this);
            if (hex)
                variants.push(hex);
        }
        // rgb() functional notation with no spaces
        if (settings.rgb) {
            variants.push(a === 1 ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")");
        }
        // hsl() functional notation with no spaces
        if (settings.hsl) {
            variants.push(a === 1 ? "hsl(" + h + "," + s + "%," + l + "%)" : "hsla(" + h + "," + s + "%," + l + "%," + a + ")");
        }
        if (settings.transparent && r === 0 && g === 0 && b === 0 && a === 0) {
            // Convert to transparent keyword if this option is enabled
            variants.push("transparent");
        }
        else if (a === 1 && settings.name && typeof this.toName === "function") {
            // CSS color keyword if "names" plugin is installed
            var name_1 = this.toName();
            if (name_1)
                variants.push(name_1);
        }
        return findShortestString(variants);
    };
};

export default minifyPlugin;
