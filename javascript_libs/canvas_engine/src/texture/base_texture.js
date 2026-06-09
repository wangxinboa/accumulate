import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

export class BaseTexture extends BaseCleanUp {
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
	/** @type {boolean} */
	needUpdapte;
	/** @type {boolean} */
	image2DHasChange;
	/** @type {CanvasEngineType.onTextureRectChangeCallback | null} */
	onTextureRectChangeCallback;
	constructor() {
		super();

		this.isBaseTexture = true;

		this._wrapS = GlTextureParamTypeEnum.CLAMP_TO_EDGE;
		this._wrapT = GlTextureParamTypeEnum.CLAMP_TO_EDGE;

		this._minFilter = GlTextureParamTypeEnum.LINEAR;
		this._magFilter = GlTextureParamTypeEnum.LINEAR;
		this.unpackFlipY = true;

		this.needUpdapte = true;
		this.image2DHasChange = true;

		this.onTextureRectChangeCallback = null;
	}
	get wrapS() {
		return this._wrapS;
	}
	set wrapS(value) {
		this.needUpdapte = true;
		this._wrapS = value;
	}
	get wrapT() {
		return this._wrapT;
	}
	set wrapT(value) {
		this.needUpdapte = true;
		this._wrapT = value;
	}
	get minFilter() {
		return this._minFilter;
	}
	set minFilter(value) {
		this.needUpdapte = true;
		this._minFilter = value;
	}
	get magFilter() {
		return this._magFilter;
	}
	set magFilter(value) {
		this.needUpdapte = true;
		this._magFilter = value;
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
