import { __decorate } from "../tslib.es6.js";
import { serialize } from "../Misc/decorators.js";
import { Color4 } from "../Maths/math.color.js";
import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { PrepareUniformsForColorCurves } from "./colorCurves.functions.js";
/**
 * The color grading curves provide additional color adjustment that is applied after any color grading transform (3D LUT).
 * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
 * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
 * corresponding to low luminance, medium luminance, and high luminance areas respectively.
 */
export class ColorCurves {
    constructor() {
        this._dirty = true;
        this._tempColor = new Color4(0, 0, 0, 0);
        this._globalCurve = new Color4(0, 0, 0, 0);
        this._highlightsCurve = new Color4(0, 0, 0, 0);
        this._midtonesCurve = new Color4(0, 0, 0, 0);
        this._shadowsCurve = new Color4(0, 0, 0, 0);
        this._positiveCurve = new Color4(0, 0, 0, 0);
        this._negativeCurve = new Color4(0, 0, 0, 0);
        this._globalHue = 30;
        this._globalDensity = 0;
        this._globalSaturation = 0;
        this._globalExposure = 0;
        this._highlightsHue = 30;
        this._highlightsDensity = 0;
        this._highlightsSaturation = 0;
        this._highlightsExposure = 0;
        this._midtonesHue = 30;
        this._midtonesDensity = 0;
        this._midtonesSaturation = 0;
        this._midtonesExposure = 0;
        this._shadowsHue = 30;
        this._shadowsDensity = 0;
        this._shadowsSaturation = 0;
        this._shadowsExposure = 0;
    }
    /**
     * Gets the global Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    get globalHue() {
        return this._globalHue;
    }
    /**
     * Sets the global Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    set globalHue(value) {
        this._globalHue = value;
        this._dirty = true;
    }
    /**
     * Gets the global Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    get globalDensity() {
        return this._globalDensity;
    }
    /**
     * Sets the global Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    set globalDensity(value) {
        this._globalDensity = value;
        this._dirty = true;
    }
    /**
     * Gets the global Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    get globalSaturation() {
        return this._globalSaturation;
    }
    /**
     * Sets the global Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    set globalSaturation(value) {
        this._globalSaturation = value;
        this._dirty = true;
    }
    /**
     * Gets the global Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    get globalExposure() {
        return this._globalExposure;
    }
    /**
     * Sets the global Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    set globalExposure(value) {
        this._globalExposure = value;
        this._dirty = true;
    }
    /**
     * Gets the highlights Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    get highlightsHue() {
        return this._highlightsHue;
    }
    /**
     * Sets the highlights Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    set highlightsHue(value) {
        this._highlightsHue = value;
        this._dirty = true;
    }
    /**
     * Gets the highlights Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    get highlightsDensity() {
        return this._highlightsDensity;
    }
    /**
     * Sets the highlights Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    set highlightsDensity(value) {
        this._highlightsDensity = value;
        this._dirty = true;
    }
    /**
     * Gets the highlights Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    get highlightsSaturation() {
        return this._highlightsSaturation;
    }
    /**
     * Sets the highlights Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    set highlightsSaturation(value) {
        this._highlightsSaturation = value;
        this._dirty = true;
    }
    /**
     * Gets the highlights Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    get highlightsExposure() {
        return this._highlightsExposure;
    }
    /**
     * Sets the highlights Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    set highlightsExposure(value) {
        this._highlightsExposure = value;
        this._dirty = true;
    }
    /**
     * Gets the midtones Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    get midtonesHue() {
        return this._midtonesHue;
    }
    /**
     * Sets the midtones Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    set midtonesHue(value) {
        this._midtonesHue = value;
        this._dirty = true;
    }
    /**
     * Gets the midtones Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    get midtonesDensity() {
        return this._midtonesDensity;
    }
    /**
     * Sets the midtones Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    set midtonesDensity(value) {
        this._midtonesDensity = value;
        this._dirty = true;
    }
    /**
     * Gets the midtones Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    get midtonesSaturation() {
        return this._midtonesSaturation;
    }
    /**
     * Sets the midtones Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    set midtonesSaturation(value) {
        this._midtonesSaturation = value;
        this._dirty = true;
    }
    /**
     * Gets the midtones Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    get midtonesExposure() {
        return this._midtonesExposure;
    }
    /**
     * Sets the midtones Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    set midtonesExposure(value) {
        this._midtonesExposure = value;
        this._dirty = true;
    }
    /**
     * Gets the shadows Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    get shadowsHue() {
        return this._shadowsHue;
    }
    /**
     * Sets the shadows Hue value.
     * The hue value is a standard HSB hue in the range [0,360] where 0=red, 120=green and 240=blue. The default value is 30 degrees (orange).
     */
    set shadowsHue(value) {
        this._shadowsHue = value;
        this._dirty = true;
    }
    /**
     * Gets the shadows Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    get shadowsDensity() {
        return this._shadowsDensity;
    }
    /**
     * Sets the shadows Density value.
     * The density value is in range [-100,+100] where 0 means the color filter has no effect and +100 means the color filter has maximum effect.
     * Values less than zero provide a filter of opposite hue.
     */
    set shadowsDensity(value) {
        this._shadowsDensity = value;
        this._dirty = true;
    }
    /**
     * Gets the shadows Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    get shadowsSaturation() {
        return this._shadowsSaturation;
    }
    /**
     * Sets the shadows Saturation value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase saturation and negative values decrease saturation.
     */
    set shadowsSaturation(value) {
        this._shadowsSaturation = value;
        this._dirty = true;
    }
    /**
     * Gets the shadows Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    get shadowsExposure() {
        return this._shadowsExposure;
    }
    /**
     * Sets the shadows Exposure value.
     * This is an adjustment value in the range [-100,+100], where the default value of 0.0 makes no adjustment, positive values increase exposure and negative values decrease exposure.
     */
    set shadowsExposure(value) {
        this._shadowsExposure = value;
        this._dirty = true;
    }
    /**
     * Returns the class name
     * @returns The class name
     */
    getClassName() {
        return "ColorCurves";
    }
    /**
     * Binds the color curves to the shader.
     * @param colorCurves The color curve to bind
     * @param effect The effect to bind to
     * @param positiveUniform The positive uniform shader parameter
     * @param neutralUniform The neutral uniform shader parameter
     * @param negativeUniform The negative uniform shader parameter
     */
    static Bind(colorCurves, effect, positiveUniform = "vCameraColorCurvePositive", neutralUniform = "vCameraColorCurveNeutral", negativeUniform = "vCameraColorCurveNegative") {
        if (colorCurves._dirty) {
            colorCurves._dirty = false;
            // Fill in global info.
            colorCurves._getColorGradingDataToRef(colorCurves._globalHue, colorCurves._globalDensity, colorCurves._globalSaturation, colorCurves._globalExposure, colorCurves._globalCurve);
            // Compute highlights info.
            colorCurves._getColorGradingDataToRef(colorCurves._highlightsHue, colorCurves._highlightsDensity, colorCurves._highlightsSaturation, colorCurves._highlightsExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._highlightsCurve);
            // Compute midtones info.
            colorCurves._getColorGradingDataToRef(colorCurves._midtonesHue, colorCurves._midtonesDensity, colorCurves._midtonesSaturation, colorCurves._midtonesExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._midtonesCurve);
            // Compute shadows info.
            colorCurves._getColorGradingDataToRef(colorCurves._shadowsHue, colorCurves._shadowsDensity, colorCurves._shadowsSaturation, colorCurves._shadowsExposure, colorCurves._tempColor);
            colorCurves._tempColor.multiplyToRef(colorCurves._globalCurve, colorCurves._shadowsCurve);
            // Compute deltas (neutral is midtones).
            colorCurves._highlightsCurve.subtractToRef(colorCurves._midtonesCurve, colorCurves._positiveCurve);
            colorCurves._midtonesCurve.subtractToRef(colorCurves._shadowsCurve, colorCurves._negativeCurve);
        }
        if (effect) {
            effect.setFloat4(positiveUniform, colorCurves._positiveCurve.r, colorCurves._positiveCurve.g, colorCurves._positiveCurve.b, colorCurves._positiveCurve.a);
            effect.setFloat4(neutralUniform, colorCurves._midtonesCurve.r, colorCurves._midtonesCurve.g, colorCurves._midtonesCurve.b, colorCurves._midtonesCurve.a);
            effect.setFloat4(negativeUniform, colorCurves._negativeCurve.r, colorCurves._negativeCurve.g, colorCurves._negativeCurve.b, colorCurves._negativeCurve.a);
        }
    }
    /**
     * Returns color grading data based on a hue, density, saturation and exposure value.
     * @param hue
     * @param density
     * @param saturation The saturation.
     * @param exposure The exposure.
     * @param result The result data container.
     */
    _getColorGradingDataToRef(hue, density, saturation, exposure, result) {
        if (hue == null) {
            return;
        }
        hue = ColorCurves._Clamp(hue, 0, 360);
        density = ColorCurves._Clamp(density, -100, 100);
        saturation = ColorCurves._Clamp(saturation, -100, 100);
        exposure = ColorCurves._Clamp(exposure, -100, 100);
        // Remap the slider/config filter density with non-linear mapping and also scale by half
        // so that the maximum filter density is only 50% control. This provides fine control
        // for small values and reasonable range.
        density = ColorCurves._ApplyColorGradingSliderNonlinear(density);
        density *= 0.5;
        exposure = ColorCurves._ApplyColorGradingSliderNonlinear(exposure);
        if (density < 0) {
            density *= -1;
            hue = (hue + 180) % 360;
        }
        ColorCurves._FromHSBToRef(hue, density, 50 + 0.25 * exposure, result);
        result.scaleToRef(2, result);
        result.a = 1 + 0.01 * saturation;
    }
    /**
     * Takes an input slider value and returns an adjusted value that provides extra control near the centre.
     * @param value The input slider value in range [-100,100].
     * @returns Adjusted value.
     */
    static _ApplyColorGradingSliderNonlinear(value) {
        value /= 100;
        let x = Math.abs(value);
        x = Math.pow(x, 2);
        if (value < 0) {
            x *= -1;
        }
        x *= 100;
        return x;
    }
    /**
     * Returns an RGBA Color4 based on Hue, Saturation and Brightness (also referred to as value, HSV).
     * @param hue The hue (H) input.
     * @param saturation The saturation (S) input.
     * @param brightness The brightness (B) input.
     * @param result
     * @result An RGBA color represented as Vector4.
     */
    static _FromHSBToRef(hue, saturation, brightness, result) {
        let h = ColorCurves._Clamp(hue, 0, 360);
        const s = ColorCurves._Clamp(saturation / 100, 0, 1);
        const v = ColorCurves._Clamp(brightness / 100, 0, 1);
        if (s === 0) {
            result.r = v;
            result.g = v;
            result.b = v;
        }
        else {
            // sector 0 to 5
            h /= 60;
            const i = Math.floor(h);
            // fractional part of h
            const f = h - i;
            const p = v * (1 - s);
            const q = v * (1 - s * f);
            const t = v * (1 - s * (1 - f));
            switch (i) {
                case 0:
                    result.r = v;
                    result.g = t;
                    result.b = p;
                    break;
                case 1:
                    result.r = q;
                    result.g = v;
                    result.b = p;
                    break;
                case 2:
                    result.r = p;
                    result.g = v;
                    result.b = t;
                    break;
                case 3:
                    result.r = p;
                    result.g = q;
                    result.b = v;
                    break;
                case 4:
                    result.r = t;
                    result.g = p;
                    result.b = v;
                    break;
                default:
                    // case 5:
                    result.r = v;
                    result.g = p;
                    result.b = q;
                    break;
            }
        }
        result.a = 1;
    }
    /**
     * Returns a value clamped between min and max
     * @param value The value to clamp
     * @param min The minimum of value
     * @param max The maximum of value
     * @returns The clamped value.
     */
    static _Clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    /**
     * Clones the current color curve instance.
     * @returns The cloned curves
     */
    clone() {
        return SerializationHelper.Clone(() => new ColorCurves(), this);
    }
    /**
     * Serializes the current color curve instance to a json representation.
     * @returns a JSON representation
     */
    serialize() {
        return SerializationHelper.Serialize(this);
    }
    /**
     * Parses the color curve from a json representation.
     * @param source the JSON source to parse
     * @returns The parsed curves
     */
    static Parse(source) {
        return SerializationHelper.Parse(() => new ColorCurves(), source, null, null);
    }
}
/**
 * Prepare the list of uniforms associated with the ColorCurves effects.
 * @param uniformsList The list of uniforms used in the effect
 */
ColorCurves.PrepareUniforms = PrepareUniformsForColorCurves;
__decorate([
    serialize()
], ColorCurves.prototype, "_globalHue", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_globalDensity", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_globalSaturation", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_globalExposure", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_highlightsHue", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_highlightsDensity", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_highlightsSaturation", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_highlightsExposure", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_midtonesHue", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_midtonesDensity", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_midtonesSaturation", void 0);
__decorate([
    serialize()
], ColorCurves.prototype, "_midtonesExposure", void 0);
// References the dependencies.
SerializationHelper._ColorCurvesParser = ColorCurves.Parse;
//# sourceMappingURL=colorCurves.js.map