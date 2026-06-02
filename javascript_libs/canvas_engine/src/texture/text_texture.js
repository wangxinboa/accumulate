import { BaseTexture } from "./base_texture.js";
import { DefaultVariable } from "../../../javascript_utils/javascript_utils.js";

let textTextureKey = 0;
const canvasDom = document.createElement("canvas");
const ctx = canvasDom.getContext("2d", {
	willReadFrequently: true,
});

export class TextTexture extends BaseTexture {
	/** @type {boolean} */
	isTextTexture;

	/** @type {string} */
	key;
	/** @type {string} */
	fontStyle;
	/** @type {string} */
	fontVariant;
	/** @type {number} */
	fontSize;
	/** @type {string} */
	fontWeight;
	/** @type {string} */
	fontFamily;
	/** @type {string} */
	_text = "";
	/** @type {boolean} */
	textHasChanged;
	/** @type {number} */
	width = 0;
	/** @type {number} */
	height = 0;
	/** @type {ImageData} */
	image2D = DefaultVariable.ImageData;
	/**
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this.isTextTexture = true;

		this.key = `text_texture_${textTextureKey++}`;

		/** font style */
		this.fontStyle = "normal";
		this.fontVariant = "normal";
		this.fontSize = 26;
		this.fontWeight = "normal";
		this.fontFamily = "Arial";

		this.text = text;

		this.textHasChanged = false;
	}

	/**
	 * @param {CanvasEngineType.AllTexture} texture
	 */
	isSameTexParameter(texture) {
		return super.isSameTexParameter(texture) && !this.textHasChanged;
	}
	get text() {
		return this._text;
	}
	set text(value) {
		this._text = value;
		this.textHasChanged = true;
		this._setTextMeasure();
	}
	/**
	 * @private
	 * @param {TextTexture} textTexture
	 */
	_getFontString(textTexture) {
		return `${textTexture.fontStyle} ${textTexture.fontVariant} ${textTexture.fontWeight} ${textTexture.fontSize}px ${textTexture.fontFamily}`;
	}
	/** @private */
	_setTextMeasure() {
		if (ctx) {
			const font = this._getFontString(this);

			ctx.font = font;

			const textMetrics = ctx.measureText(this._text);

			const width = Math.ceil(textMetrics.width);
			const height = Math.ceil(textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent);

			const pixelWidth = width * devicePixelRatio;
			const pixelHeight = height * devicePixelRatio;

			const offsetY = textMetrics.actualBoundingBoxAscent;

			canvasDom.style.width = `${width}px`;
			canvasDom.style.height = `${height}px`;

			canvasDom.width = pixelWidth;
			canvasDom.height = pixelHeight;

			ctx.scale(devicePixelRatio, devicePixelRatio);

			ctx.fillStyle = "rgba(255, 255, 255, 1)";
			ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);

			ctx.textBaseline = "alphabetic";
			ctx.font = font;

			ctx.fillStyle = "rgba(0, 0, 0, 1)";
			ctx.lineWidth = 0;
			ctx.fillText(this.text, 0, offsetY);

			this.width = width;
			this.height = height;
			this.image2D = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
		} else {
			throw new Error("Failed to create canvas context for measuring text.");
		}
	}
}
