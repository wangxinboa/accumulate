import { BaseCleanUp, DefaultVariable } from "../../../javascript_utils/javascript_utils.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

/**
 * @abstract
 */
export class BaseTexture extends BaseCleanUp {
	/** @type {string} */
	_key = "";
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
	/** @type {CanvasEngineType.BaseTextureImage2D} */
	_image2D = DefaultVariable.ImageData;
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
	get key() {
		return this._key;
	}
	set key(value) {
		this._key = value;
	}
	get image2D() {
		return this._image2D;
	}
	set image2D(value) {
		this._image2D = value;
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
