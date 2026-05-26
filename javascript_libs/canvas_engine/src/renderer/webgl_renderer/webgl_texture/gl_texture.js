import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class GlTexture extends BaseCleanUp {
	/** @type {WebGLTexture | null} */
	texture = null;
	/** @type {CanvasEngineType.Texture | null} */
	cacheTexture;
	/**
	 * @param {HTMLImageElement} image2D
	 */
	constructor(image2D) {
		super();

		this.image2D = image2D;

		this.cacheTexture = null;
	}

	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.Texture} texture
	 */
	initTexture(gl, texture) {
		if (!this.texture) {
			this.texture = gl.createTexture();

			this.update(gl, texture);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image2D);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	resetTexture(gl) {
		this.texture = gl.createTexture();

		if (this.cacheTexture) {
			this.update(gl, this.cacheTexture);
		}
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image2D);
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	deleteTexture(gl) {
		gl.deleteTexture(this.texture);
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.Texture} texture
	 */
	update(gl, texture) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.unpackFlipY);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture.wrapS]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture.wrapT]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[texture.minFilter]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[texture.magFilter]);

		this.cacheTexture = texture;
	}
	/**
	 * @param {CanvasEngineType.Texture} texture
	 */
	isSameStyle(texture) {
		if (this.image2D !== texture.image2D || this.cacheTexture === null) {
			return false;
		} else {
			return this.cacheTexture.wrapS === texture.wrapS && this.cacheTexture.wrapT === texture.wrapT;
		}
	}
}
