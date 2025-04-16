import Object2D from './base/object2d.js';

export default class Rect extends Object2D {
	constructor(option = {}) {
		super(option);

		this.isRect = true;

		this._width = option.width || 0;
		this._height = option.height || 0;
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

		this.updateMatrix();
		this.updateRange();
	}

	updateRange() {
		const x = this.width / 2, y = this.height / 2;
		this.rectangle.setRectangle(-x, -y, x, y, this.matrixWorld);
	}

	get width() {
		return this._width;
	}
	set width(val) {
		this._width = val;
		this.updateRange();
	}
	get height() {
		return this._height;
	}
	set height(val) {
		this._height = val;
		this.updateRange();
	}
}