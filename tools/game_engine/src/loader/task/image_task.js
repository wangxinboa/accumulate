import Task from './task.js';


export default class ImageTask extends Task {
	constructor(loaderManager, onloaded, onerror, index, src, crossOrigin) {
		super(loaderManager, onloaded, onerror, index, src);

		this.image = null;
		this.src = src;
		this.crossOrigin = crossOrigin;
	}

	loading() {
		this.image = new Image();

		this.image.src = this.src;
		this.image.crossOrigin = this.crossOrigin;

		this.image.onload = this.loaded;
		this.image.onerror = this.error;

		super.loading();

		return this;
	}

	destroy() {
		super.destroy();

		this.image =
			this.src =
			this.crossOrigin = null;
	}
}