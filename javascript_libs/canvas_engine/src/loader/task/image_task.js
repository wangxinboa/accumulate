import { BaseTask } from "./base_task.js";

export class ImageTask extends BaseTask {
	/** @type {HTMLImageElement | null} */
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

		this.data = null;
		this.src = src;
		this.crossOrigin = crossOrigin;

		this.naturalWidth = 0;
		this.naturalHeight = 0;
		this.width = 0;
		this.height = 0;
	}
	startLoad() {
		const that = this;

		setTimeout(() => {
			this.data = new Image();
			that.data.src = this.src;
			that.data.crossOrigin = this.crossOrigin ? "anonymous" : "";

			that.data.onload = this.onload.bind(this);
			that.data.onerror = this.onerror.bind(this);
		}, 1000);

		return this;
	}
	loadingComplete() {
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
