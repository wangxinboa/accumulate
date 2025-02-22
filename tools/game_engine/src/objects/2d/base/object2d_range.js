import Object2DTransform from './object2d_transform.js';
import Rectangle from '../../../math/rectangle.js';
import Vector2 from '../../../math/vector2.js';
import Matrix3 from '../../../math/matrix3.js';


const _point = new Vector2();
const _matrx = new Matrix3();

export default class Object2DRange extends Object2DTransform {
	constructor(option = {}) {
		super(option);

		this.rectangle = new Rectangle();

		this.defaultEimt = option.defaultEimt || false;
	}

	updateMatrix() {
		super.updateMatrix();

		this.rectangle.applyMatrix3(this.matrixWorld);
	}

	updateRange() { }

	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	containsPoint(x, y) {
		return this.rectangle.containsPoint(x, y);
	}

	emit(eventType, e, camera) {
		_point.set(e.offsetX, e.offsetY).applyMatrix3(camera.matrixWorldInvert).applyMatrix3(_matrx.copy(this.matrixWorld).invert());
		if (this.containsPoint(_point.x, _point.y)) {
			return super.emit(eventType, e, camera) || this.defaultEimt;
		}
		return false;
	}

	destroy() {
		super.destroy();

		this.rectangle.destroy();
		this.rectangle = null;
		this.max = null;
		this.min = null;
	}
}