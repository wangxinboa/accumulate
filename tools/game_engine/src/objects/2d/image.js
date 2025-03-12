import Object2D from './base/object2d.js';
import loaderManager from '../../loader/loader_manager.js';

export default class Image extends Object2D {
	constructor(option = {}) {
		super(option);

		this.updateRange = this.updateRange.bind(this);
		this.imageTask = loaderManager.addImage(option.url, true, this.updateRange);

		this.updateMatrix();
		this.updateRange();
	}

	_render(ctx) {
		if (this.imageTask.isLoaded()) {
			ctx.beginPath();
			ctx.drawImage(this.imageTask.image,
				0, 0, this.width, this.height,
				0, 0, this.width, this.height
			);
		}
	}

	updateRange() {
		if (this.imageTask.isLoaded()) {
			this.rectangle.setRectangle(0, 0, this.width, this.height, this.matrixWorld);
		} else {
			this.rectangle.setRectangle(0, 0, 0, 0, this.matrixWorld);
		}
	}

	get width() {
		return this.imageTask.width;
	}
	get height() {
		return this.imageTask.height;
	}

	destroy() {
		super.destroy();

		this.updateRange =
			this.imageTask = null;
	}
}