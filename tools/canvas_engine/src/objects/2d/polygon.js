import Object2D from "./base/object2d.js";

export default class Polygon extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isPolygon = true;

		this.points = option.points || [];
	}

	_render(ctx) {
		ctx.beginPath();
		this.points.forEach((point) => {
			ctx.lineTo(point.x, point.y);
		});
		ctx.closePath();
	}
}