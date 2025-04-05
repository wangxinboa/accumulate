import Matrix3 from '../math/matrix3.js';
import Rectangle from '../math/rectangle.js';
import Object2DTransform from '../objects/2d/base/object2d_transform.js';
import { IdentityMatrix3 } from '../math/matrix3.js';

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

export default class Camera2D extends Object2DTransform {
	constructor(option = {}) {
		super(option);

		this.isCamera2D = true;

		this.matrixWorldInvert = new Matrix3();

		this.width = option.width || 0;
		this.height = option.height || 0;

		this.screenRectangle = new Rectangle();
	}

	invertTransform(ctx) {
		let elements = this.matrixWorldInvert.elements;
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

	updateMatrix() {
		_translation.makeTranslation(-this.x, this.y);
		_rotation.makeRotation(-this.rotation);
		_scale.makeScale(this.scaleX === 0 ? 0 : 1 / this.scaleX, this.scaleY === 0 ? 0 : 1 / this.scaleY);

		this.matrix
			.identity()
			.multiply(_translation)
			.multiply(_rotation)
			.multiply(_scale);
		this.matrixWorld.copy(this.matrix);
		this.matrixWorldInvert.copy(this.matrixWorld).invert();

		this.updateRange();
	}

	setRange(width, height) {
		this.width = width;
		this.height = height;

		this.updateRange();
	}

	updateRange() {
		this.rectangle.setRectangle(0, 0, this.width, this.height, this.matrixWorldInvert);
		this.screenRectangle.setRectangle(0, 0, this.width, this.height, IdentityMatrix3);
	}

	viewInCamera(object2d) {
		return this.rectangle.overlapRectangleSAT(object2d.rectangle);
	}

	viewInScreen(object2d) {
		return this.screenRectangle.overlapRectangleSAT(object2d.rectangle);
	}

	destroy() {
		super.destroy();

		this.isCamera2D =
			this.matrixWorldInvert =
			this.width =
			this.height = null;

		delete this.isCamera2D;
		delete this.matrixWorldInvert;
		delete this.width;
		delete this.height;
	}
}