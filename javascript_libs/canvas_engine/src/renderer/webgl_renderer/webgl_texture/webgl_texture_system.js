import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";
import { GlTexture } from "./gl_texture.js";

export class WebGLTextureSystem extends BaseCleanUp {
	/** @type {CustomMap<GlTexture>} */
	_cacheTextures;
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheTextures = new CustomMap();
	}

	/**
	 * @param {string} textureKey
	 */
	getGlTexture(textureKey) {
		return this._cacheTextures.get(textureKey);
	}

	/**
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	initTexturesByRenderNode(renderNode) {
		renderNode.initTextures(this.renderer.gl, this._cacheTextures);
	}
}
