import Rectangle from "../../../math/rectangle.js";

export default class Object2DRange {
	constructor() {
		this.rectangle = new Rectangle();
	}

	updateRange() { }

	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	containsPoint(x, y) {
		return this.rectangle.containsPoint(x, y, this.matrixWorld);
	}

	destroy() {
		this.rectangle = null;
		this.max = null;
		this.min = null;
	}
}