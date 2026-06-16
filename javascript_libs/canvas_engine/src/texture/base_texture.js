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
	_wrapS;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	_wrapT;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	_minFilter;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	_magFilter;
	/** @type {boolean} */
	unpackFlipY;
	/** @type {CanvasEngineType.BaseTextureImage2D} */
	_image2D = DefaultVariable.ImageData;
	/** @type {CanvasEngineType.onTextureRectChangeCallbacks} */
	onTextureRectChangeCallbacks;
	constructor() {
		super();

		this.isBaseTexture = true;

		this._wrapS = GlTextureParamTypeEnum.CLAMP_TO_EDGE;
		this._wrapT = GlTextureParamTypeEnum.CLAMP_TO_EDGE;

		this._minFilter = GlTextureParamTypeEnum.LINEAR;
		this._magFilter = GlTextureParamTypeEnum.LINEAR;

		this.unpackFlipY = true;

		this.needTexImage2D = true;
		this.onTextureRectChangeCallbacks = [];
	}
	get key() {
		return this._key;
	}
	set key(value) {
		this._key = value;
	}
	get wrapS() {
		return this._wrapS;
	}
	set wrapS(value) {
		this.needTexImage2D = true;
		this._wrapS = value;
	}
	get wrapT() {
		return this._wrapT;
	}
	set wrapT(value) {
		this.needTexImage2D = true;
		this._wrapT = value;
	}
	get minFilter() {
		return this._minFilter;
	}
	set minFilter(value) {
		this.needTexImage2D = true;
		this._minFilter = value;
	}
	get magFilter() {
		return this._magFilter;
	}
	set magFilter(value) {
		this.needTexImage2D = true;
		this._magFilter = value;
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
	 * @param {CanvasEngineType.BaseTexture} texture
	 * @returns
	 */
	isNotSameTexParameter(texture) {
		return (
			this.wrapS !== texture.wrapS ||
			this.wrapT !== texture.wrapT ||
			this.minFilter !== texture.minFilter ||
			this.magFilter !== texture.magFilter ||
			this.image2D !== texture.image2D
		);
	}

	/**
	 * @param {CanvasEngineType.onTextureRectChangeCallback} callback
	 */
	registerTextureRectChangeCallback(callback) {
		this.onTextureRectChangeCallbacks.push(callback);
		return this;
	}
	/**
	 * @param {CanvasEngineType.onTextureRectChangeCallback} callback
	 */
	unregisterTextureRectChangeCallback(callback) {
		const index = this.onTextureRectChangeCallbacks.indexOf(callback);
		if (index > -1) {
			this.onTextureRectChangeCallbacks.splice(index, 1);
		}
		return this;
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	onTextureRectChange(width, height) {
		for (let i = 0, len = this.onTextureRectChangeCallbacks.length; i < len; i++) {
			this.onTextureRectChangeCallbacks[i](width, height);
		}
		return this;
	}
}
