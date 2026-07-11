import { BaseTexture } from "./base_texture.js";

let textTextureKey = 0;
const canvasDom = document.createElement("canvas");
const ctx = canvasDom.getContext("2d", {
	willReadFrequently: true,
	alpha: true,
});

export class TextTexture extends BaseTexture {
	static defaultTextOption = {
		fontStyle: "normal",
		fontVariant: "normal",
		fontSize: 16,
		fontWeight: "normal",
		fontFamily: "Arial",
	};
	/** @type {boolean} */
	isTextTexture;
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
	/** @type {number} */
	width = 0;
	/** @type {number} */
	height = 0;
	/**
	 * @param {string} text
	 * @param {CanvasEngineType.TextOption} [textOption]
	 */
	constructor(text, textOption = TextTexture.defaultTextOption) {
		super();

		this.isTextTexture = true;
		this.key = `text_texture_${textTextureKey++}`;

		this.fontStyle = textOption.fontStyle ?? TextTexture.defaultTextOption.fontStyle;
		this.fontVariant = textOption.fontVariant ?? TextTexture.defaultTextOption.fontVariant;
		this.fontSize = textOption.fontSize ?? TextTexture.defaultTextOption.fontSize;
		this.fontWeight = textOption.fontWeight ?? TextTexture.defaultTextOption.fontWeight;
		this.fontFamily = textOption.fontFamily ?? TextTexture.defaultTextOption.fontFamily;

		this.text = text;
	}

	get text() {
		return this._text;
	}
	set text(value) {
		this._text = value;
		this.needTexImage2D = true;
		this._setTextMeasure();
		this.onTextureRectChange(this.width, this.height);
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
			const actualBoundingBoxAscent = Math.ceil(textMetrics.actualBoundingBoxAscent);
			const actualBoundingBoxDescent = Math.ceil(textMetrics.actualBoundingBoxDescent);

			const width = Math.ceil(textMetrics.width);
			const height = actualBoundingBoxAscent + actualBoundingBoxDescent + 1;

			const pixelWidth = width * window.devicePixelRatio;
			const pixelHeight = height * window.devicePixelRatio;

			const offsetY = actualBoundingBoxAscent + 1;

			canvasDom.style.width = `${width}px`;
			canvasDom.style.height = `${height}px`;

			canvasDom.width = pixelWidth;
			canvasDom.height = pixelHeight;

			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

			ctx.fillStyle = "rgba(255, 255, 255, 0)";
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
