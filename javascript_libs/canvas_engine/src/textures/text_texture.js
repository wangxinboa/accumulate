import { BaseTexture } from "./base_texture.js";

let textTextureKey = 0;
const canvasDom = document.createElement("canvas");
const ctx = canvasDom.getContext("2d", {
	willReadFrequently: true,
	alpha: true,
});

/**
 * 辅助函数：将文本按最大宽度换行（按字符拆分，适用于中英文混合）
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]} 行数组
 */
function wrapText(ctx, text, maxWidth) {
	if (maxWidth <= 0 || !text) return [text || ""];
	const lines = [];
	let currentLine = "";
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const testLine = currentLine + char;
		const metrics = ctx.measureText(testLine);
		if (metrics.width > maxWidth && currentLine.length > 0) {
			lines.push(currentLine);
			currentLine = char;
		} else {
			currentLine = testLine;
		}
	}
	if (currentLine) lines.push(currentLine);
	return lines;
}

export class TextTexture extends BaseTexture {
	static defaultTextOption = {
		fontStyle: "normal",
		fontVariant: "normal",
		fontSize: 16,
		fontWeight: "normal",
		fontFamily: "math",
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
	/** @type {number} 最大宽度（像素），0 表示不限制（单行） */
	_maxWidth = 0;
	/** @type {number} 行高倍数，默认为 1.2 */
	_lineHeightRatio = 1.4;
	/** @type {string[]} 缓存的行数组 */
	_lines = [];

	/**
	 * @param {string} text
	 * @param {CanvasEngineType.TextOption} [textOption]
	 * @param {number} [maxWidth] 最大宽度（像素），0 表示不限制（单行）
	 */
	constructor(text, textOption = TextTexture.defaultTextOption, maxWidth = 0) {
		super();

		this.isTextTexture = true;
		this.key = `text_texture_${textTextureKey++}`;

		this.fontStyle = textOption.fontStyle ?? TextTexture.defaultTextOption.fontStyle;
		this.fontVariant = textOption.fontVariant ?? TextTexture.defaultTextOption.fontVariant;
		this.fontSize = textOption.fontSize ?? TextTexture.defaultTextOption.fontSize;
		this.fontWeight = textOption.fontWeight ?? TextTexture.defaultTextOption.fontWeight;
		this.fontFamily = textOption.fontFamily ?? TextTexture.defaultTextOption.fontFamily;

		this._maxWidth = maxWidth;
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

	get maxWidth() {
		return this._maxWidth;
	}
	set maxWidth(value) {
		if (this._maxWidth !== value) {
			this._maxWidth = value;
			this.needTexImage2D = true;
			this._setTextMeasure();
			this.onTextureRectChange(this.width, this.height);
		}
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
		if (!ctx) {
			throw new Error("Failed to create canvas context for measuring text.");
		}
		const font = this._getFontString(this);
		ctx.font = font;

		const maxWidth = this._maxWidth;
		let lines = [this._text];
		if (maxWidth > 0 && this._text) {
			lines = wrapText(ctx, this._text, maxWidth);
		}
		this._lines = lines;

		// 计算总宽高
		let maxLineWidth = 0;
		const lineHeight = this.fontSize * this._lineHeightRatio;
		for (let i = 0; i < lines.length; i++) {
			const metrics = ctx.measureText(lines[i]);
			if (metrics.width > maxLineWidth) maxLineWidth = metrics.width;
		}
		let totalWidth = Math.ceil(maxLineWidth);
		let totalHeight = Math.ceil(lines.length * lineHeight);

		// 如果文本为空，设置最小尺寸为 1x1，避免 getImageData 宽度为 0 报错
		if (totalWidth === 0) totalWidth = 1;
		if (totalHeight === 0) totalHeight = 1;

		const pixelWidth = totalWidth * window.devicePixelRatio;
		const pixelHeight = totalHeight * window.devicePixelRatio;

		canvasDom.style.width = `${totalWidth}px`;
		canvasDom.style.height = `${totalHeight}px`;

		canvasDom.width = pixelWidth;
		canvasDom.height = pixelHeight;

		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		// 清除画布（透明）
		ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);

		ctx.textBaseline = "alphabetic";
		ctx.font = font;
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.lineWidth = 0;

		// 逐行绘制
		const baselineOffset = this.fontSize * 0.8; // 近似基线偏移
		for (let i = 0; i < lines.length; i++) {
			const y = i * lineHeight + baselineOffset;
			ctx.fillText(lines[i], 0, y);
		}

		this.width = totalWidth;
		this.height = totalHeight;
		this.image2D = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
	}
}
