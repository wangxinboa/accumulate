import Object2D from "./base/object2d.js";

export default class Polygon extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

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
		this.points.forEach((point) => {
			const { x, y } = point;
			if (x > this.max.x) {
				this.max.x = x;
			}
			if (y > this.max.y) {
				this.max.y = y;
			}
			if (x < this.min.x) {
				this.min.x = x;
			}
			if (y < this.min.y) {
				this.min.y = y;
			}
		});

		this.updateRectangle();
	}
}