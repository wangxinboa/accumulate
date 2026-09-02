import { isBoolean } from "../../../javascript_utils/javascript_utils.js";
import { BaseTexture } from "./base_texture.js";
import { tempTextRect, setTempTextRect, setLinesTempTextRect, tempLinesTempTextRect } from "./text_texture_utils.js";

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
		useFontBoundingBox: false,
		fontColor: "#000000",
		maxWidth: 0,
		lineGap: 0,
	};
	/** @private */
	_text = "";
	fontStyle = TextTexture.defaultTextOption.fontStyle;
	fontVariant = TextTexture.defaultTextOption.fontVariant;
	fontSize = TextTexture.defaultTextOption.fontSize;
	fontWeight = TextTexture.defaultTextOption.fontWeight;
	fontFamily = TextTexture.defaultTextOption.fontFamily;
	useFontBoundingBox = TextTexture.defaultTextOption.useFontBoundingBox;
	fontColor = TextTexture.defaultTextOption.fontColor;
	maxWidth = TextTexture.defaultTextOption.maxWidth;
	lineGap = TextTexture.defaultTextOption.lineGap;
	/**
	 * @param {string} textString
	 * @param {CanvasEngineType.TextOption} [textOption]
	 */
	constructor(textString, textOption = TextTexture.defaultTextOption) {
		super();

		this.isTextTexture = true;
		this.key = `text_texture_${textTextureKey++}`;

		this.updateTextAndStyle(textString, textOption);
	}

	/**
	 * @param {string} textString
	 * @param {CanvasEngineType.TextOption} [textOption]
	 */
	updateTextAndStyle(textString, textOption) {
		this._text = textString;
		this.updateStyle(textOption);
	}

	/**
	 * @param {CanvasEngineType.TextOption} [textOption]
	 * @param {boolean} [needUpdateImage=true]
	 */
	updateStyle(textOption, needUpdateImage = true) {
		if (textOption) {
			if (textOption.fontStyle) {
				this.fontStyle = textOption.fontStyle;
			}
			if (textOption.fontVariant) {
				this.fontVariant = textOption.fontVariant;
			}
			if (textOption.fontSize) {
				this.fontSize = textOption.fontSize;
			}
			if (textOption.fontWeight) {
				this.fontWeight = textOption.fontWeight;
			}
			if (textOption.fontFamily) {
				this.fontFamily = textOption.fontFamily;
			}
			if (isBoolean(textOption.useFontBoundingBox)) {
				this.useFontBoundingBox = /** @type {Boolean} */ (textOption.useFontBoundingBox);
			}
			if (textOption.fontColor) {
				this.fontColor = textOption.fontColor;
			}
			if (textOption.maxWidth) {
				this.maxWidth = textOption.maxWidth;
			}
			if (textOption.lineGap) {
				this.lineGap = textOption.lineGap;
			}
		}
		if (needUpdateImage) {
			this.updateImage();
		}
	}

	get text() {
		return this._text;
	}
	set text(textString) {
		if (this._text !== textString) {
			this._text = textString;
			this.updateImage();
		}
	}

	/**
	 * @private
	 * @param {TextTexture} textTexture
	 */
	_getFontString(textTexture) {
		return `${textTexture.fontStyle} ${textTexture.fontVariant} ${textTexture.fontWeight} ${textTexture.fontSize}px ${textTexture.fontFamily}`;
	}

	updateImage() {
		if (ctx && this.text) {
			const font = this._getFontString(this);
			ctx.font = font;
			ctx.textBaseline = "top";

			let width = 0,
				height = 0,
				offsetY = 0;

			if (this.maxWidth > 0) {
				setLinesTempTextRect(this, ctx, this.text);

				width = tempLinesTempTextRect.width;
				height = tempLinesTempTextRect.height;
			} else {
				setTempTextRect(this, ctx, this.text);

				width = tempTextRect.width;
				height = tempTextRect.height;
				offsetY = tempTextRect.offsetY;
			}

			const pixelWidth = width * window.devicePixelRatio;
			const pixelHeight = height * window.devicePixelRatio;

			canvasDom.style.width = `${width}px`;
			canvasDom.style.height = `${height}px`;

			canvasDom.width = pixelWidth;
			canvasDom.height = pixelHeight;

			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

			ctx.fillStyle = "rgba(255, 255, 255, 0)";
			ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);

			ctx.textBaseline = "top";
			ctx.font = font;

			ctx.fillStyle = this.fontColor;
			ctx.lineWidth = 0;

			if (this.maxWidth > 0) {
				for (let i = 0, len = tempLinesTempTextRect.lines.length; i < len; i++) {
					ctx.fillText(tempLinesTempTextRect.lines[i], 0, tempLinesTempTextRect.linesoOffsetY[i]);
				}
			} else {
				ctx.fillText(this.text, 0, offsetY);
			}

			this.width = width;
			this.height = height;
			this.image2D = ctx.getImageData(0, 0, pixelWidth, pixelHeight);

			this.needTexImage2D = true;

			this.onTextureRectChange(this.width, this.height);
		} else {
			throw new Error("Failed to create canvas context for measuring text.");
		}
	}
}
