export const tempTextRect = {
	width: 0,
	height: 0,
	offsetY: 0,
};

export const tempLinesTempTextRect = {
	/** @type {Array<string>} */
	lines: [],
	/** @type {Array<number>} */
	linseWidth: [],
	/** @type {Array<number>} */
	linesHeight: [],
	/** @type {Array<number>} */
	linesoOffsetY: [],
	width: 0,
	height: 0,
};

/**
 * @private
 * @param {CanvasEngineType.TextTexture} textTexture
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 */
export function setTempTextRect(textTexture, ctx, text) {
	const textMetrics = ctx.measureText(text);
	const actualBoundingBoxAscent = textMetrics.actualBoundingBoxAscent;
	const actualBoundingBoxDescent = textMetrics.actualBoundingBoxDescent;
	const fontBoundingBoxAscent = textMetrics.fontBoundingBoxAscent;
	const fontBoundingBoxDescent = textMetrics.fontBoundingBoxDescent;
	const canUseFontBoundingBox = textTexture.useFontBoundingBox && fontBoundingBoxAscent > actualBoundingBoxAscent;

	tempTextRect.width = Math.ceil(textMetrics.width);
	tempTextRect.height =
		Math.ceil(
			canUseFontBoundingBox
				? fontBoundingBoxAscent + fontBoundingBoxDescent
				: actualBoundingBoxAscent + actualBoundingBoxDescent,
		) + 1;

	tempTextRect.offsetY = Math.ceil(canUseFontBoundingBox ? fontBoundingBoxAscent : actualBoundingBoxAscent);
}

/**
 * @private
 * @param {CanvasEngineType.TextTexture} textTexture
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 */
export function setLinesTempTextRect(textTexture, ctx, text) {
	tempLinesTempTextRect.lines.length = 0;
	tempLinesTempTextRect.linseWidth.length = 0;
	tempLinesTempTextRect.linesHeight.length = 0;
	tempLinesTempTextRect.linesoOffsetY.length = 0;
	tempLinesTempTextRect.width = 0;
	tempLinesTempTextRect.height = 0;

	let currentLine = "";
	let currentWidth = 0;
	let currentHeight = 0;
	let currentOffsetY = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const testLine = currentLine + char;

		setTempTextRect(textTexture, ctx, testLine);

		if (tempTextRect.width > textTexture.maxWidth && currentLine.length > 0) {
			updateTempLinesTempTextRect(
				currentLine,
				currentWidth,
				currentHeight,
				currentOffsetY,
				tempLinesTempTextRect.lines.length === 0 ? 0 : textTexture.lineGap,
			);
			currentLine = char;
		} else {
			currentLine = testLine;
			currentWidth = tempTextRect.width;
			currentHeight = tempTextRect.height;
			currentOffsetY = tempTextRect.offsetY;
		}
	}
	if (currentLine) {
		updateTempLinesTempTextRect(currentLine, currentWidth, currentHeight, currentOffsetY, textTexture.lineGap);
	}
}

/**
 * @param {string} line
 * @param {number} width
 * @param {number} height
 * @param {number} offsetY
 * @param {number} lineGap
 */
function updateTempLinesTempTextRect(line, width, height, offsetY, lineGap) {
	tempLinesTempTextRect.lines.push(line);
	tempLinesTempTextRect.linseWidth.push(width);
	tempLinesTempTextRect.linesHeight.push(height);
	tempLinesTempTextRect.linesoOffsetY.push(tempLinesTempTextRect.height + offsetY + lineGap);

	tempLinesTempTextRect.height += height + lineGap;

	if (width > tempLinesTempTextRect.width) {
		tempLinesTempTextRect.width = width;
	}
}
