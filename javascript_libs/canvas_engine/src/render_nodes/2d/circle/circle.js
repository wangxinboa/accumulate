import { Render2DNode } from "../render_2d_node.js";
import { Color } from "../../../math/color.js";
import { CirclePipe } from "./circle_pipe/circle_pipe.js";
import { CircleDef } from "../../../math/geometry_2d_defs/circle_def.js";

export class Circle extends Render2DNode {
	/** @type {Color} */
	color;
	/** @type {number} 缓存直径用于buffer更新 */
	_cacheBufferDiameter;

	constructor(radius = 10, color = new Color(1, 1, 1)) {
		super();

		this.color = color;

		this._cacheBufferDiameter = -1;

		this.geometry = new CircleDef(radius);

		this.radius = radius;
	}

	get pipe() {
		return CirclePipe;
	}

	get radius() {
		return this.geometry.radius;
	}
	/**
	 * @param {number} value
	 */
	set radius(value) {
		this.geometry.updateShape(value);
		this.width = value * 2;
		this.height = value * 2;
	}

	static create(radius = 10, color = new Color(1, 1, 1)) {
		return new Circle(radius, color);
	}
}
