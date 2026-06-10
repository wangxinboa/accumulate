import { BaseCleanUp, DefaultVariable } from "../../../../../javascript_utils/javascript_utils.js";
import { GlTextureParamTypeEnum } from "./gl_texture_type.js";

export class GlTexture extends BaseCleanUp {
	/** @type {WebGLTexture | null} */
	texture = null;
	/** @type {CanvasEngineType.GlTextureCacheParameter} */
	cacheParameter;
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	constructor(gl) {
		super();

		this.texture = gl.createTexture();

		this.cacheParameter = {
			wrapS: GlTextureParamTypeEnum.CLAMP_TO_EDGE,
			wrapT: GlTextureParamTypeEnum.CLAMP_TO_EDGE,
			minFilter: GlTextureParamTypeEnum.LINEAR,
			magFilter: GlTextureParamTypeEnum.LINEAR,
			image2D: DefaultVariable.ImageData,
		};
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	resetTexture(gl) {
		this.texture = gl.createTexture();

		return this._updateTexParameterFromCache(gl);
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
	 * @param {CanvasEngineType.BaseTexture} texture
	 */
	update(gl, texture) {
		if (
			this.cacheParameter.wrapS !== texture.wrapS ||
			this.cacheParameter.wrapT !== texture.wrapT ||
			this.cacheParameter.minFilter !== texture.minFilter ||
			this.cacheParameter.magFilter !== texture.magFilter ||
			this.cacheParameter.image2D !== texture.image2D
		) {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.cacheParameter.wrapS]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.cacheParameter.wrapT]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.cacheParameter.minFilter]);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.cacheParameter.magFilter]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image2D);

			this.cacheParameter.wrapS = texture.wrapS;
			this.cacheParameter.wrapT = texture.wrapT;
			this.cacheParameter.minFilter = texture.minFilter;
			this.cacheParameter.magFilter = texture.magFilter;
			this.cacheParameter.image2D = texture.image2D;
		}
		return this;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	_updateTexParameterFromCache(gl) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.cacheParameter.wrapS]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.cacheParameter.wrapT]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[this.cacheParameter.minFilter]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.cacheParameter.magFilter]);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.cacheParameter.image2D);

		return this;
	}
}
