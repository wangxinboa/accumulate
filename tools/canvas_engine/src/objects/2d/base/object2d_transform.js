import Matrix3 from "../../../math/matrix3.js";
import Vector2 from "../../../math/vector2.js";
import { PiBy180 } from "../../../math/constants.js";

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

export default class Object2DTransform {
	constructor(option) {
		this.matrix = new Matrix3();
		this.matrixWorld = new Matrix3();

		this.position = new Vector2(option.x || 0, option.y || 0);
		this.rotation = option.rotation || 0;
		this.rotationAngle = option.rotationAngle || 0;
		this.scale = new Vector2(option.scaleX || 1, option.scaleY || 1);
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
		_translation.makeTranslation(this.position.x, this.position.y);
		_rotation.makeRotation(this.rotation);
		_scale.makeScale(this.scale.x, this.scale.y);

		this.matrix
			.identity()
			.multiply(_translation)
			.multiply(_rotation)
			.multiply(_scale);

		this.updateMatrixWorld();
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

	get rotationAngle() {
		return this._rotationAngle;
	}
	set rotationAngle(val) {
		this._rotationAngle = val;
		this._rotation = val * PiBy180;
	}

	get rotation() {
		return this._rotation;
	}
	set rotation(val) {
		this._rotation = val;
		this._rotationAngle = val / PiBy180;
	}
}

