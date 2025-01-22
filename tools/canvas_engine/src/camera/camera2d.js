import Matrix3 from "../math/matrix3.js";
import Object2DTransform from "../objects/2d/base/object2d_transform.js";

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

export default class Camera2d extends Object2DTransform {
	constructor(option = {}) {
		super(option);

		this.isCamera2d = true;
	}

	updateMatrix() {
		_translation.makeTranslation(-this.x, -this.y);
		_rotation.makeRotation(-this.rotation);
		_scale.makeScale(this.scaleX === 0 ? 0 : 1 / this.scaleX, this.scaleY === 0 ? 0 : 1 / this.scaleY);

		this.matrix
			.identity()
			.multiply(_translation)
			.multiply(_rotation)
			.multiply(_scale);
		this.matrixWorld.copy(this.matrix);
	}
}