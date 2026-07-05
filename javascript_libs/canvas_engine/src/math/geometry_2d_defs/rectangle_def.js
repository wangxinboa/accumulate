import { Vector2 } from "../vector2.js";
import { Geometry2DDef } from "./geometry_2d_def.js";

export class RectangleDef extends Geometry2DDef {
	constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
		super();

		this.min = new Vector2(minX, minY);
		this.max = new Vector2(maxX, maxY);
	}
	updateShape(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
		this.min.x = minX;
		this.min.y = minY;
		this.max.x = maxX;
		this.max.y = maxY;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	containPoint(x, y) {
		return this.min.x <= x && this.max.x >= x && this.min.y <= y && this.max.y >= y;
	}
}
