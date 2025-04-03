import Matrix3 from '../../../math/matrix3.js';
import Vector2 from '../../../math/vector2.js';
import Rectangle from '../../../math/rectangle.js';
import { PiBy180 } from '../../../math/math_utils.js';
import BaseObject from '../../base_object.js';

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

const _point = new Vector2();
const _matrx = new Matrix3();

export default class Object2DTransform extends BaseObject {
	constructor(option = {}) {
		super(option);

		this.matrixNeedsUpdate = true;
		this.matrix = new Matrix3();
		this.matrixWorld = new Matrix3();

		this._x = option.x || 0;
		this._y = option.y || 0;
		this._rotation = option.rotation || 0;
		this._rotationAngle = option.rotationAngle || 0;
		this._scaleX = option.scaleX || 1;
		this._scaleY = option.scaleY || 1;

		this.rectangle = new Rectangle();
	}

	// 判断两个 Object2DRange 是否重叠
	isOverlap(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	hitTest(x, y) {
		_point.set(x, y).applyMatrix3(_matrx.copy(this.matrixWorld).invert());
		return this.rectangle.containsPoint(_point.x, _point.y);
	}

	transform(ctx) {
		let elements = this.matrixWorld.elements;
		if (
			elements[0] !== 1 ||
			elements[1] !== 0 ||
			elements[2] !== 0 ||
			elements[3] !== 0 ||
			elements[4] !== 1 ||
			elements[5] !== 0 ||
			elements[6] !== 0 ||
			elements[7] !== 0 ||
			elements[8] !== 1
		) {
			// a c e
			// b d f
			// 0 0 1
			ctx.transform(
				elements[0], elements[1],
				elements[3], elements[4],
				elements[6], elements[7]
			);
		}
		elements = null;
	}

	afterAddChild() {
		// 更新全局矩阵
		this.updateMatrixWorld();
	}

	updateMatrix() {
		if (this.matrixNeedsUpdate) {
			_translation.makeTranslation(this.x, this.y);
			_rotation.makeRotation(this.rotation);
			_scale.makeScale(this.scaleX, this.scaleY);

			this.matrix
				.identity()
				.multiply(_translation)
				.multiply(_rotation)
				.multiply(_scale);

			this.updateMatrixWorld();

			this.rectangle.applyMatrix3(this.matrixWorld);

			this.matrixNeedsUpdate = false;
		}
	}

	updateMatrixWorld() {
		if (this.parent) {
			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
		} else {
			this.matrixWorld.copy(this.matrix);
		}

		// if (Array.isArray(this.children) && this.children.length > 0) {
		// 	this.children.forEach(child => {
		// 		child.updateMatrixWorld();
		// 	});
		// }
	}

	get x() {
		return this._x;
	}
	set x(val) {
		this._x = val;
		this.matrixNeedsUpdate = true;
	}
	get y() {
		return this._y;
	}
	set y(val) {
		this._y = val;
		this.matrixNeedsUpdate = true;
	}
	get rotationAngle() {
		return this._rotationAngle;
	}
	set rotationAngle(val) {
		this._rotationAngle = val;
		this._rotation = val * PiBy180;

		this.matrixNeedsUpdate = true;
	}
	get rotation() {
		return this._rotation;
	}
	set rotation(val) {
		this._rotation = val;
		this._rotationAngle = val / PiBy180;

		this.matrixNeedsUpdate = true;
	}
	get scaleX() {
		return this._scaleX;
	}
	set scaleX(val) {
		this._scaleX = val;
		this.matrixNeedsUpdate = true;
	}
	get scaleY() {
		return this._scaleY;
	}
	set scaleY(val) {
		this._scaleY = val;
		this.matrixNeedsUpdate = true;
	}

	destroy() {
		super.destroy();

		this.rectangle.destroy();

		this.matrixNeedsUpdate =
			this.matrix =
			this.matrixWorld =

			this._x =
			this._y =
			this._rotationAngle =
			this._rotation =
			this._scaleX =
			this._scaleY =

			this.rectangle = null;

		delete this.matrixNeedsUpdate;
		delete this.matrix;
		delete this.matrixWorld;

		delete this._x;
		delete this._y;
		delete this._rotationAngle;
		delete this._rotation;
		delete this._scaleX;
		delete this._scaleY;

		delete this.rectangle;
	}
}

