import Task from './task.js';


export default class ImageTask extends Task {
	constructor(onloaded, onerror, index, src, crossOrigin) {
		super(onloaded, onerror, index, src);

		this.image = null;
		this.src = src;
		this.crossOrigin = crossOrigin;

		this.naturalWidth = 0;
		this.naturalHeight = 0;
		this.width = 0;
		this.height = 0;
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

	loaded() {
		this.naturalWidth = this.image.naturalWidth;
		this.naturalHeight = this.image.naturalHeight;
		this.width = this.image.width;
		this.height = this.image.height;

		super.loaded();
	}

	destroy() {
		super.destroy();

		this.image =
			this.src =
			this.crossOrigin =

			this.naturalWidth =
			this.naturalHeight =
			this.width =
			this.height = null;
	}
}