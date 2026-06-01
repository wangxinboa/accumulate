import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";
import { GlTexture } from "./gl_texture.js";

export class WebGLTextureSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @private @type {CustomMap<GlTexture>} */
	_cacheTextures;
	/** @private @type {boolean} */
	_cacheUnpackFlipY;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheTextures = new CustomMap();

		this._cacheUnpackFlipY = false;
	}
	/**
	 * @param {string} textureKey
	 */
	getGlTexture(textureKey) {
		return this._cacheTextures.get(textureKey);
	}
	/**
	 * @param {string} textureKey
	 */
	hasGlTexture(textureKey) {
		return this._cacheTextures.has(textureKey);
	}
	/**
	 * @param {string} textureKey
	 * @param {GlTexture} glTexture
	 */
	setGlTexture(textureKey, glTexture) {
		this._cacheTextures.set(textureKey, glTexture);
	}
	/**
	 * @param {string} textureKey
	 * @param {CanvasEngineType.AllTexture} texture
	 */
	updateTexture(textureKey, texture) {
		if (texture.unpackFlipY !== this._cacheUnpackFlipY) {
			this._cacheUnpackFlipY = texture.unpackFlipY;
			this.renderer.gl.pixelStorei(this.renderer.gl.UNPACK_FLIP_Y_WEBGL, texture.unpackFlipY);
		}

		if (this.hasGlTexture(textureKey)) {
			this.getGlTexture(textureKey).update(this.renderer.gl, texture);
		} else {
			this.setGlTexture(textureKey, new GlTexture(this.renderer.gl).update(this.renderer.gl, texture));
		}
	}

	/**
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	updateTexturesByRenderNode(renderNode) {
		renderNode.updateTextures(this);
	}
	resetAllTextures() {
		for (let i = 0, len = this._cacheTextures.array.length; i < len; i++) {
			this._cacheTextures.array[i].resetTexture(this.renderer.gl);
		}
	}
	deleteTextures() {
		for (let i = 0, len = this._cacheTextures.array.length; i < len; i++) {
			this._cacheTextures.array[i].deleteTexture(this.renderer.gl);
		}
	}
}
