import MultiSprite from '../../objects/2d/sprite/multi_sprite.js';
import Sprite from '../../objects/2d/sprite/sprite.js';
import Circle from '../../objects/2d/circle.js'
import Image from '../../objects/2d/image.js';
import Polygon from '../../objects/2d/polygon.js';
import Polyline from '../../objects/2d/polyline.js';
import Rect from '../../objects/2d/rect.js';


function hasStroke(object) {
	return !!object.stroke && object.stroke !== 'transparent' && object.strokeWidth > 0;
}

function hasFill(object) {
	return !!object.fill && object.fill !== 'transparent'
}

function _setFillStyles(ctx, object) {
	if (hasFill(object)) {
		ctx.lineWidth = object.strokeWidth;
		ctx.fillStyle = object.fill;
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

function _renderStroke(ctx, object) {
	if (hasStroke(object)) {
		ctx.save();
		_setLineDash(ctx, object);
		_setStrokeStyles(ctx, object);

		ctx.stroke();
		ctx.restore();
	}
}

function _renderFill(ctx, object) {
	if (hasFill(object)) {
		ctx.save();
		_setFillStyles(ctx, object);

		if (object.fillRule === 'evenodd') {
			ctx.fill('evenodd');
		} else {
			ctx.fill();
		}
		ctx.restore();
	}
}

function _renderPaintInOrder(ctx, object) {
	if (object.paintFirst === 'stroke') {
		_renderStroke(ctx, object);
		_renderFill(ctx, object);
	} else {
		_renderFill(ctx, object);
		_renderStroke(ctx, object);
	}
}


let
	_drawBlock_ = null,
	_imageBlock_ = null;

export default function renderShape(ctx, object) {

	ctx.save();

	object.transform(ctx);
	ctx.globalAlpha = object.opacity;

	if (object instanceof MultiSprite) {
		if (object.imageTask.isLoaded) {
			ctx.beginPath();
			for (let i = 0, len = object.drawBlocks.length; i < len; i++) {
				_drawBlock_ = object.drawBlocks[i];
				_imageBlock_ = object.imageBlocks[_drawBlock_.imageBlockIndex]
				ctx.drawImage(object.imageTask.image,
					_imageBlock_.x, _imageBlock_.y, _imageBlock_.width, _imageBlock_.height,
					_drawBlock_.x, _drawBlock_.y, _drawBlock_.width, _drawBlock_.height
				);
			}
			_drawBlock_ = null;
		}
	} else if (object instanceof Sprite) {
		if (object.imageTask.isLoaded) {
			ctx.beginPath();
			ctx.drawImage(object.imageTask.image,
				object.imageBlock.x, object.imageBlock.y, object.imageBlock.width, object.imageBlock.height,
				0, 0, object.imageBlock.width, object.imageBlock.height
			);
		}
	} else if (object instanceof Circle) {
		ctx.beginPath();
		ctx.arc(0, 0, object.radius, object.startAngle * Math.PI / 180, object.endAngle * Math.PI / 180, object.counterClockwise);
	} else if (object instanceof Image) {
		if (object.imageTask.isLoaded) {
			ctx.beginPath();
			ctx.drawImage(object.imageTask.image,
				0, 0, object.width, object.height,
				0, 0, object.width, object.height
			);
		}
	} else if (object instanceof Polygon) {
		ctx.beginPath();
		for (let i = 0, len = object.points.length; i < len; i++) {
			ctx.lineTo(object.points[i].x, object.points[i].y);
		}
		ctx.closePath();
	} else if (object instanceof Polyline) {
		ctx.beginPath();
		for (let i = 0, len = object.points.length; i < len; i++) {
			ctx.lineTo(object.points[i].x, object.points[i].y);
		}
	} else if (object instanceof Rect) {
		const
			x = -object.width / 2,
			y = -object.height / 2,
			w = object.width,
			h = object.height;

		ctx.beginPath();
		ctx.moveTo(x + object.rxlt, y);
		ctx.lineTo(x + w - object.rxrt, y);
		ctx.bezierCurveTo(x + w, y, x + w, y + object.ryrt, x + w, y + object.ryrt);
		ctx.lineTo(x + w, y + h - object.ryrb);
		ctx.bezierCurveTo(x + w, y + h, x + w - object.rxrb, y + h, x + w - object.rxrb, y + h);
		ctx.lineTo(x + object.rxlb, y + h);
		ctx.bezierCurveTo(x, y + h, x, y + h - object.rylb, x, y + h - object.rylb);
		ctx.lineTo(x, y + object.rylt);
		ctx.bezierCurveTo(x, y, x + object.rxlt, y, x + object.rxlt, y);
		ctx.closePath();
	}

	_renderPaintInOrder(ctx, object);

	ctx.restore();
}