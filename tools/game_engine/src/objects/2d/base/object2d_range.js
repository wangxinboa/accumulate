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
	}

	updateMatrix() {
		super.updateMatrix();

		this.rectangle.applyMatrix3(this.matrixWorld);
	}

	updateRange() { }

	// 判断两个 Object2DRange 是否重叠
	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	hitTest(x, y) {
		_point.set(x, y).applyMatrix3(_matrx.copy(this.matrixWorld).invert());
		return this.rectangle.containsPoint(_point.x, _point.y);
	}

	destroy() {
		super.destroy();

		this.rectangle.destroy();
		this.rectangle = null;
	}
}