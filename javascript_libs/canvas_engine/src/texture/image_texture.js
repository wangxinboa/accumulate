import { BaseTexture } from "./base_texture.js";
import { LoaderManager } from "../loader/loader_manager.js";

export class ImageTexture extends BaseTexture {
	/** @type {boolean} */
	isTexture;
	/** @type {JavaScriptUtilsType.ImageTask} */
	source;
	/**
	 * @param {string} url
	 */
	constructor(url) {
		super();

		this.isTexture = true;

		this.source = LoaderManager.addImageTask(url);
	}

	/**
	 * @param {CanvasEngineType.AllTexture} texture
	 */
	isSameTexParameter(texture) {
		return super.isSameTexParameter(texture) && this.key === texture.key;
	}

	get key() {
		return this.source.src;
	}
	get width() {
		return this.source.width;
	}
	get height() {
		return this.source.height;
	}
	get isLoaded() {
		return this.source.isLoaded;
	}
	get image2D() {
		return this.source.data;
	}

	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new ImageTexture(url);
	}
}
