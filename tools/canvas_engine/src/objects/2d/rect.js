import Object2D from "./base/object2d.js";

export default class Rect extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isRect = true;

		this.width = option.width || 0;
		this.height = option.height || 0;
		/**
		 *     rxlt rxrt
		 * rylt         ryrt
		 * rylb         ryrb
		 *     rxlb rxrb
		 */
		this.rxlt = option.rxlt || 0;
		this.rxrt = option.rxrt || 0;
		this.ryrt = option.ryrt || 0;
		this.ryrb = option.ryrb || 0;
		this.rxrb = option.rxrb || 0;
		this.rxlb = option.rxlb || 0;
		this.rylb = option.rylb || 0;
		this.rylt = option.rylt || 0;
	}

	_render(ctx) {
		const
			x = -this.width / 2,
			y = -this.height / 2,
			w = this.width,
			h = this.height;

		ctx.beginPath();
		ctx.moveTo(x + this.rxlt, y);
		ctx.lineTo(x + w - this.rxrt, y);
		ctx.bezierCurveTo(x + w, y, x + w, y + this.ryrt, x + w, y + this.ryrt);
		ctx.lineTo(x + w, y + h - this.ryrb);
		ctx.bezierCurveTo(x + w, y + h, x + w - this.rxrb, y + h, x + w - this.rxrb, y + h);
		ctx.lineTo(x + this.rxlb, y + h);
		ctx.bezierCurveTo(x, y + h, x, y + h - this.rylb, x, y + h - this.rylb);
		ctx.lineTo(x, y + this.rylt);
		ctx.bezierCurveTo(x, y, x + this.rxlt, y, x + this.rxlt, y);
		ctx.closePath();
	}
}