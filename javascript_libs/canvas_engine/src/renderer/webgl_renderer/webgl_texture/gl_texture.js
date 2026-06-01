import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class GlTexture extends BaseCleanUp {
	/** @type {WebGLTexture | null} */
	texture = null;
	/** @type {CanvasEngineType.AllTexture | null} */
	cacheTexture;
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	constructor(gl) {
		super();

		this.texture = gl.createTexture();

		this.cacheTexture = null;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	resetTexture(gl) {
		this.texture = gl.createTexture();

		if (this.cacheTexture) {
			this.update(gl, this.cacheTexture);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	deleteTexture(gl) {
		gl.deleteTexture(this.texture);
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.AllTexture} texture
	 */
	update(gl, texture) {
		if (this.cacheTexture && texture.isSameTexParameter(this.cacheTexture)) {
			return this;
		}

		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture.wrapS]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture.wrapT]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[texture.minFilter]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[texture.magFilter]);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image2D);

		this.cacheTexture = texture;

		return this;
	}
}
