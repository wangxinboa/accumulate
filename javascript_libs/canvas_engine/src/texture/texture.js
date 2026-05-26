import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { LoaderManager } from "../loader/loader_manager.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

export class Texture extends BaseCleanUp {
	/** @type {boolean} */
	isTexture;
	/** @type {boolean} */
	needUpdate;

	/** @type {JavaScriptUtilsType.ImageTask} */
	source;

	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapS;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapT;

	/** @type {boolean} */
	unpackFlipY;
	/**
	 * @param {string} url
	 */
	constructor(url) {
		super();

		this.isTexture = true;

		this.source = LoaderManager.addImageTask(url);

		this.unpackFlipY = true;
		this.wrapS = GlTextureParamTypeEnum.REPEAT;
		this.wrapT = GlTextureParamTypeEnum.REPEAT;

		this.minFilter = GlTextureParamTypeEnum.LINEAR;
		this.magFilter = GlTextureParamTypeEnum.LINEAR;
		this.unpackFlipY = true;

		this.needUpdate = true;
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
		return new Texture(url);
	}
}
