import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { LoaderManager } from "../loader/loader_manager.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

export class Texture extends BaseCleanUp {
	/** @type {boolean} */
	isTexture;
	/** @type {CanvasEngineType.ImageTask} */
	source;
	/**
	 * @param {string} url
	 */
	constructor(url) {
		super();

		this.isTexture = true;

		this.source = LoaderManager.addImageTask(url);

		this.wrapS = GlTextureParamTypeEnum.REPEAT;
		this.wrapT = GlTextureParamTypeEnum.REPEAT;
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
	get isReady() {
		return this.source.isLoaded;
	}

	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new Texture(url);
	}
}
