import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { LoaderManager } from "../../../loader/loader_manager.js";
import { GlTextureParamTypeEnum } from "./gl_texture_type.js";

export class GlTexture extends BaseCleanUp {
	/** @type {boolean} */
	isTexture;
	/** @private @type {CanvasEngineType.ImageTask} */
	source;
	/** @type {WebGLTexture | null} */
	texture = null;
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
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	initTexture(gl) {
		if (this.source.data && !this.texture) {
			this.texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.source.data);
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	update(gl) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}

	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new GlTexture(url);
	}
}
