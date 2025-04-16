import Object2D from './base/object2d.js';

export default class Polygon extends Object2D {
	constructor(option = {}) {
		super(option);

		this.isPolygon = true;

		this.points = option.points || [];

		this.updateMatrix();
		this.updateRange();
	}

	updateRange() {
		this.rectangle.setRectangleByPoints(this.points, this.matrixWorld);
	}

	destroy() {
		super.destroy();

		this.isPolygon =
			this.points = null;

		delete this.isPolygon;
		delete this.points;
	}
}