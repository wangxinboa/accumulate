import Rectangle from "../../../math/rectangle.js";
import Vector2 from "../../../math/vector2.js";

export default class Object2DRange {
	constructor() {
		this.max = new Vector2(-Infinity, -Infinity);
		this.min = new Vector2(Infinity, Infinity);

		this.rectangle = new Rectangle();
	}

	updateRange() { }

	updateRectangle() {
		this.rectangle.setRectangle(
			this.min.x, this.max.y,
			this.max.x, this.max.y,
			this.max.x, this.min.y,
			this.min.x, this.min.y,
			this.matrixWorld,
		);
	}

	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	destroy() {
		this.rectangle = null;
		this.max = null;
		this.min = null;
	}
}