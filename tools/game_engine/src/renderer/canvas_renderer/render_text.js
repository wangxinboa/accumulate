
function hasStroke(object) {
	return !!object.stroke && object.stroke !== 'transparent' && object.strokeWidth > 0;
}

function hasFill(object) {
	return !!object.fill && object.fill !== 'transparent';
}


function _setFillStyles(ctx, object) {
	if (hasFill(object)) {
		ctx.lineWidth = object.strokeWidth;
		ctx.fillStyle = object.fill;
	}
}

function _renderFill(ctx, text) {
	if (hasFill(text)) {
		ctx.save();
		_setFillStyles(ctx, text);
		ctx.fillText(text.text, text.left, text.ascent);
		ctx.restore();
	}
}

function _setLineDash(ctx, object) {
	if (!object.strokeDashArray || object.strokeDashArray.length === 0) {
		return;
	}
	ctx.setLineDash(object.strokeDashArray);
}


function _setStrokeStyles(ctx, object) {
	const stroke = object.stroke;
	if (stroke) {
		ctx.lineWidth = object.strokeWidth;
		//ctx.lineCap = object.strokeLineCap;
		//ctx.lineDashOffset = object.strokeDashOffset;
		//ctx.lineJoin = object.strokeLineJoin;
		//ctx.miterLimit = object.strokeMiterLimit;

		ctx.strokeStyle = object.stroke;
	}
}

function _renderStroke(ctx, text) {
	if (hasStroke(text)) {
		ctx.save();
		_setLineDash(ctx, text);
		_setStrokeStyles(ctx, text);

		ctx.strokeText(text.text, text.left, text.ascent);
		ctx.restore();
	}
}

export function _setTextStyles(ctx, text) {
	ctx.textBaseline = 'alphabetic';
	ctx.font = `${text.fontStyle} ${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
}

export default function renderText(ctx, text) {
	ctx.save();

	let elements = text.matrixWorld.elements;
	if (
		elements[0] !== 1 ||
		elements[1] !== 0 ||
		elements[2] !== 0 ||
		elements[3] !== 0 ||
		elements[4] !== 1 ||
		elements[5] !== 0 ||
		elements[6] !== 0 ||
		elements[7] !== 0 ||
		elements[8] !== 1
	) {
		// a c e
		// b d f
		// 0 0 1
		ctx.transform(
			elements[0], elements[1],
			elements[3], elements[4],
			elements[6], elements[7]
		);
	}
	elements = null;

	ctx.globalAlpha = text.opacity;

	ctx.beginPath();

	if (text.backgroundColor && text.backgroundColor !== 'transparent') {
		ctx.save();
		ctx.fillStyle = text.backgroundColor;
		ctx.fillRect(0, 0, text.width, text.height);
		ctx.restore();
	}

	_setTextStyles(ctx, text);

	if (text.paintFirst === 'stroke') {
		_renderStroke(ctx, text);
		_renderFill(ctx, text);
	} else {
		_renderFill(ctx, text);
		_renderStroke(ctx, text);
	}

	ctx.restore();
}