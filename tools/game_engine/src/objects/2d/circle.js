import Object2D from './base/object2d.js';

export default class Circle extends Object2D {
	constructor(option = {}) {
		super(option);

		this.isCircle = true;

		this.radius = option.radius || 1;
		this.startAngle = option.startAngle || 0;
		this.endAngle = option.endAngle || 360;
		this.counterclockwise = option.counterclockwise || false;

		this.updateMatrix();
		this.updateRange();
	}

	updateRange() {
		const r = this.radius;
		this.rectangle.setRectangle(-r, -r, r, r, this.matrixWorld);
	}

	destroy() {
		super.destroy();

		this.isCircle =

			this.radius =
			this.startAngle =
			this.endAngle =
			this.counterclockwise = null;

		delete this.isCircle;

		delete this.radius;
		delete this.startAngle;
		delete this.endAngle;
		delete this.counterclockwise;
	}
}