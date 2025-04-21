import Object2D from '../base/object2d.js';
import loaderManager from '../../../loader/loader_manager.js';

export default class ImageObject extends Object2D {
	constructor(option = {}) {
		super(option);

		this.updateRange = this.updateRange.bind(this);
		this.imageTask = loaderManager.addImageByUrl(option.url, true, this.updateRange);

		this.updateMatrix();
		this.updateRange();
	}

	updateRange() {
		if (this.imageTask.isLoaded) {
			this.rectangle.setRectangle(0, 0, this.width, this.height, this.matrixWorld);
		} else {
			this.rectangle.setRectangle(0, 0, 0, 0, this.matrixWorld);
		}
	}

	setImageTaskByUrl(url) {
		this.imageTask = loaderManager.addImageByUrl(url, true, this.updateRange);
	}

	setImageTask(task) {
		this.imageTask = task;
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

		delete this.updateRange;
		delete this.imageTask;
	}
}