import Matrix3 from '../math/matrix3.js';
import Object2DRange from '../objects/2d/base/object2d_range.js';

const _translation = new Matrix3();
const _rotation = new Matrix3();
const _scale = new Matrix3();

export default class Camera2D extends Object2DRange {
	constructor(option = {}) {
		super(option);

		this.isCamera2D = true;

		this.matrixWorldInvert = new Matrix3();

		this.width = option.width || 0;
		this.height = option.height || 0;
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
	}
}