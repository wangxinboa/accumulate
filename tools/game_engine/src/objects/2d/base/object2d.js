import Object2DTransform from './object2d_transform.js';

const PaintFirst = {
	fill: 'fill',
	stroke: 'stroke',
}

export default class Object2D extends Object2DTransform {
	constructor(option) {
		super(option);

		this.isObject2D = true;

		this.name = option.name || '';

		this.fill = option.fill || 'transparent';
		this.stroke = option.stroke || 'transparent';
		this.strokeWidth = option.strokeWidth || 0;

		this.paintFirst = option.paintFirst || PaintFirst.stroke;

		this.opacity = option.opacity || 1;

		this.applyCameraTransform = option.applyCameraTransform !== void 0 ? option.applyCameraTransform : true;
	}

	hasStroke() {
		return !!this.stroke && this.stroke !== 'transparent' && this.strokeWidth > 0;
	}

	hasFill() {
		return !!this.fill && this.fill !== 'transparent'
	}

	_setFillStyles(ctx) {
		if (this.hasFill()) {
			ctx.lineWidth = this.strokeWidth;
			ctx.fillStyle = this.fill;
		}
	}

	_setLineDash(ctx, dashArray) {
		if (!dashArray || dashArray.length === 0) {
			return;
		}
		ctx.setLineDash(dashArray);
	}

	_setStrokeStyles(ctx) {
		const stroke = this.stroke;
		if (stroke) {
			ctx.lineWidth = this.strokeWidth;
			//ctx.lineCap = this.strokeLineCap;
			//ctx.lineDashOffset = this.strokeDashOffset;
			//ctx.lineJoin = this.strokeLineJoin;
			//ctx.miterLimit = this.strokeMiterLimit;

			ctx.strokeStyle = this.stroke;
		}
	}

	_renderStroke(ctx) {
		if (this.hasStroke()) {
			ctx.save();
			this._setLineDash(ctx, this.strokeDashArray);
			this._setStrokeStyles(ctx);

			ctx.stroke();
			ctx.restore();
		}
	}

	_renderFill(ctx) {
		if (this.hasFill()) {
			ctx.save();
			this._setFillStyles(ctx);

			if (this.fillRule === 'evenodd') {
				ctx.fill('evenodd');
			} else {
				ctx.fill();
			}
			ctx.restore();
		}
	}

	_renderPaintInOrder(ctx) {
		if (this.paintFirst === 'stroke') {
			this._renderStroke(ctx);
			this._renderFill(ctx);
		} else {
			this._renderFill(ctx);
			this._renderStroke(ctx);
		}
	}

	render(ctx) {
		ctx.save();

		ctx.globalAlpha = this.opacity;
		this.transform(ctx);

		this._render(ctx);
		this._renderPaintInOrder(ctx);

		ctx.restore();

		// 测试代码，每个元素添加范围矩形边
		// ctx.save();
		// ctx.lineWidth = 1;
		// ctx.strokeStyle = '#ff0000'
		// const { leftTop, rightTop, rightBottom, leftBottom } = this.rectangle;
		// ctx.beginPath();
		// ctx.moveTo(leftTop.x, leftTop.y);
		// ctx.lineTo(rightTop.x, rightTop.y);
		// ctx.lineTo(rightBottom.x, rightBottom.y);
		// ctx.lineTo(leftBottom.x, leftBottom.y);
		// ctx.closePath();
		// ctx.stroke();
		// ctx.restore();
	}

	destroy() {
		super.destroy();

		this.isObject2D =

			this.name =

			this.fill =
			this.stroke =
			this.strokeWidth =

			this.paintFirst =

			this.opacity =

			this.applyCameraTransform = null;
	}
}