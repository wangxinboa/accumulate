import { Geometry2DDef } from "./geometry_2d_def.js";

export class CircleDef extends Geometry2DDef {
	constructor(radius = 0) {
		super();

		this.radius = radius;
	}
	updateShape(radius = 0) {
		this.radius = radius;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	containPoint(x, y) {
		const dx = x - this.radius;
		const dy = y - this.radius;
		return dx * dx + dy * dy <= this.radius * this.radius;
	}
}
