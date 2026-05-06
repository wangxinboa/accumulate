import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class GlTexture extends BaseCleanUp {
	/** @type {WebGLTexture | null} */
	texture = null;
	constructor() {
		super();
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.Texture} texture
	 */
	initTexture(gl, texture) {
		if (texture.image2D && !this.texture) {
			this.texture = gl.createTexture();

			this.update(gl, texture);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image2D);
		}
	}

	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.Texture} texture
	 */
	update(gl, texture) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture.wrapS]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture.wrapT]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}
}
