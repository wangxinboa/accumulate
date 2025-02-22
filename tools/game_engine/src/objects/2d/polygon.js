import Object2D from './base/object2d.js';

export default class Polygon extends Object2D {
	constructor(option = {}) {
		super(option);

		this.isPolygon = true;

		this.points = option.points || [];

		this.updateMatrix();
		this.updateRange();
	}

	_render(ctx) {
		ctx.beginPath();
		this.points.forEach((point) => {
			ctx.lineTo(point.x, point.y);
		});
		ctx.closePath();
	}

	updateRange() {
		this.rectangle.setRectangleByPoints(this.points, this.matrixWorld);
	}
}