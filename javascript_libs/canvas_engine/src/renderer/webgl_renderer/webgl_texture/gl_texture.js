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
		if (texture.source.data && !this.texture) {
			this.texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture.wrapS]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture.wrapT]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source.data);
		}
	}

	// /**
	//  * @param {CanvasEngineType.WebGLContext} gl
	//  * @param {CanvasEngineType.Texture} texture
	//  */
	// update(gl, texture) {
	// gl.bindTexture(gl.TEXTURE_2D, this.texture);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	// }
}
