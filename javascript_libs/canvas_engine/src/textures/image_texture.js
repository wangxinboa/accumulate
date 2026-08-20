import { BaseTexture } from "./base_texture.js";
import { LoaderManager } from "../loader/loader_manager.js";

export class ImageTexture extends BaseTexture {
	/** @type {boolean} */
	isTexture;
	/** @type {JavaScriptUtilsType.ImageTask} */
	_source;
	/**
	 * @param {string} url
	 */
	constructor(url) {
		super();

		this.isTexture = true;

		this._onImageLoaded = this._onImageLoaded.bind(this);
		this._source = LoaderManager.addImageTask(url);
		this._onSourceChange();
	}
	get source() {
		return this._source;
	}
	set source(value) {
		if (value !== this._source) {
			this._source = value;

			this._onSourceChange();
		}
	}
	/** @private */
	_onSourceChange() {
		if (this._source.isLoaded) {
			this._onImageLoaded();
		} else {
			this._source.addLoadedCallback(this._onImageLoaded);
		}
		this.needTexImage2D = true;
	}
	/** @private */
	_onImageLoaded() {
		this.width = this.source.width;
		this.height = this.source.height;
		this.onTextureRectChange(this.width, this.height);
	}
	get key() {
		return this.source.src;
	}
	get isReady() {
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
