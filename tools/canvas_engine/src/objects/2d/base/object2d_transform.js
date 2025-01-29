import Matrix3 from "../../../math/matrix3.js";
import { PiBy180 } from "../../../math/math_utils.js";
import Object2DRange from "./object2d_range.js";

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

export default class Object2DTransform extends Object2DRange {
	constructor(option = {}) {
		super();

		this.matrix = new Matrix3();
		this.matrixWorld = new Matrix3();

		this._x = option.x || 0;
		this._y = option.y || 0;
		this._rotation = option.rotation || 0;
		this._rotationAngle = option.rotationAngle || 0;
		this._scaleX = option.scaleX || 1;
		this._scaleY = option.scaleY || 1;
	}

	transform(ctx) {
		const elements = this.matrixWorld.elements;
		//a c e
		//b d f
		//0 0 1
		ctx.transform(
			elements[0], elements[1],
			elements[3], elements[4],
			elements[6], elements[7]
		);
	}

	updateMatrix() {
		_translation.makeTranslation(this.x, this.y);
		_rotation.makeRotation(this.rotation);
		_scale.makeScale(this.scaleX, this.scaleY);

		this.matrix
			.identity()
			.multiply(_translation)
			.multiply(_rotation)
			.multiply(_scale);

		this.updateMatrixWorld();

		this.updateRectangle();
	}

	updateMatrixWorld() {
		if (this.parent) {
			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
		} else {
			this.matrixWorld.copy(this.matrix);
		}

		if (Array.isArray(this.children) && this.children.length > 0) {
			this.children.forEach(child => {
				child.updateMatrixWorld();
			});
		}
	}

	get x() {
		return this._x;
	}
	set x(val) {
		this._x = val;
		this.updateMatrix();
	}
	get y() {
		return this._y;
	}
	set y(val) {
		this._y = val;
		this.updateMatrix();
	}
	get rotationAngle() {
		return this._rotationAngle;
	}
	set rotationAngle(val) {
		this._rotationAngle = val;
		this._rotation = val * PiBy180;
		this.updateMatrix();
	}
	get rotation() {
		return this._rotation;
	}
	set rotation(val) {
		this._rotation = val;
		this._rotationAngle = val / PiBy180;
		this.updateMatrix();
	}
	get scaleX() {
		return this._scaleX;
	}
	set scaleX(val) {
		this._scaleX = val;
		this.updateMatrix();
	}
	get scaleY() {
		return this._scaleY;
	}
	set scaleY(val) {
		this._scaleY = val;
		this.updateMatrix();
	}
}

