import Polygon from './polygon.js';

export default class Polyline extends Polygon {
	constructor(option = {}) {
		super(option);

		this.isPolyline = true;

		this.updateMatrix();
		this.updateRange();
	}

	destroy() {
		super.destroy();

		this.isPolygon = null;

		delete this.isPolygon;
	}
}