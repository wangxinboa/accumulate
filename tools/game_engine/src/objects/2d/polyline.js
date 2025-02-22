import Polygon from './polygon.js';

export default class Polyline extends Polygon {
	constructor(option = {}) {
		super(option);

		this.isPolyline = true;

		this.points = option.points || [];

		this.updateMatrix();
		this.updateRange();
	}

	_render(ctx) {
		ctx.beginPath();
		this.points.forEach((point) => {
			ctx.lineTo(point.x, point.y);
		});
	}
}