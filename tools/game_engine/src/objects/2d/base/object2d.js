import Object2DTransform from './object2d_transform.js';

const PaintFirst = {
	fill: 'fill',
	stroke: 'stroke',
};

export default class Object2D extends Object2DTransform {
	constructor(option = {}) {
		super(option);

		this.isObject2D = true;

		this.name = option.name || '';

		this.fill = option.fill || 'transparent';
		this.stroke = option.stroke || 'transparent';
		this.strokeWidth = option.strokeWidth || 0;

		this.paintFirst = option.paintFirst || PaintFirst.stroke;

		this.opacity = option.opacity || 1;
	}

	destroy() {
		super.destroy();

		this.isObject2D =

			this.name =

			this.fill =
			this.stroke =
			this.strokeWidth =

			this.paintFirst =

			this.opacity = null;
	}
}