import Rectangle from "../../../math/rectangle.js";
import BaseObject from "../../base_object.js";

export default class Object2DRange extends BaseObject {
	constructor(option = {}) {
		super();

		this.rectangle = new Rectangle();

		this.defaultEimt = option.defaultEimt || false;
	}

	updateRange() { }

	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	containsPoint(camera, x, y) {
		return this.rectangle.containsPoint(x, y, camera.matrixWorldInvert, this.matrixWorld);
	}

	emit(eventType, context, e, camera) {
		if (this.containsPoint(camera, e.offsetX, e.offsetY)) {
			return super.emit(eventType, context, e, camera) || this.defaultEimt;
		}
		return false;
	}

	destroy() {
		super.destroy();

		this.rectangle = null;
		this.max = null;
		this.min = null;
	}
}