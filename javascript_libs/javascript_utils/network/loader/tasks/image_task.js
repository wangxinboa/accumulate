import { BaseTask } from "./base_task.js";

export class ImageTask extends BaseTask {
	/** @type {HTMLImageElement} */
	data;
	/** @type {string} */
	src;
	/** @type {boolean} */
	crossOrigin;
	/**
	 * @param {string} src
	 * @param {boolean} crossOrigin
	 */
	constructor(src, crossOrigin = true) {
		super(src);

		this.data = new Image();
		this.src = src;
		this.crossOrigin = crossOrigin;

		this.naturalWidth = 0;
		this.naturalHeight = 0;
		this.width = 0;
		this.height = 0;
	}
	startLoad() {
		this.data.src = this.src;
		this.data.crossOrigin = this.crossOrigin ? "anonymous" : "";

		this.data.onload = this.onload;
		this.data.onerror = this.onerror;

		return this;
	}
	_loadingComplete() {
		if (this.data) {
			this.naturalWidth = this.data.naturalWidth;
			this.naturalHeight = this.data.naturalHeight;
			this.width = this.data.width;
			this.height = this.data.height;
		} else {
			throw new Error("ImageTask 任务加载完成时, this.data 不存在");
		}

		return this;
	}
}
