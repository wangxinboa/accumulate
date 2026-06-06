import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

export class BaseTexture extends BaseCleanUp {
	/** @type {boolean} */
	isBaseTexture;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapS;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapT;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	minFilter;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	magFilter;
	/** @type {boolean} */
	unpackFlipY;
	/** @type {CanvasEngineType.onTextureRectChangeCallback | null} */
	onTextureRectChangeCallback;
	constructor() {
		super();

		this.isBaseTexture = true;

		this.wrapS = GlTextureParamTypeEnum.CLAMP_TO_EDGE;
		this.wrapT = GlTextureParamTypeEnum.CLAMP_TO_EDGE;

		this.minFilter = GlTextureParamTypeEnum.LINEAR;
		this.magFilter = GlTextureParamTypeEnum.LINEAR;
		this.unpackFlipY = true;

		this.onTextureRectChangeCallback = null;
	}
	/**
	 * @param {CanvasEngineType.AllTexture} texture
	 * @returns
	 */
	isSameTexParameter(texture) {
		return (
			this instanceof texture.constructor &&
			this.wrapS === texture.wrapS &&
			this.wrapT === texture.wrapT &&
			this.minFilter === texture.minFilter &&
			this.magFilter === texture.magFilter &&
			this.unpackFlipY === texture.unpackFlipY
		);
	}
	get isReady() {
		return true;
	}
	/**
	 * @param {CanvasEngineType.onTextureRectChangeCallback} callback
	 */
	registerTextureRectChangeCallback(callback) {
		this.onTextureRectChangeCallback = callback;
		return this;
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	onTextureRectChange(width, height) {
		if (this.onTextureRectChangeCallback) {
			this.onTextureRectChangeCallback(width, height);
		}
		return this;
	}
}
