import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { GlTexture } from "./gl_texture.js";

export class WebGLTextureSystem extends BaseCleanUp {
	/** @type {Record<string, GlTexture>} */
	_cacheTextures;
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheTextures = {};
	}

	/**
	 * @param {CanvasEngineType.WebGLPipe} webglPipe
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	bindTexturesByRenderNode(webglPipe, renderNode) {
		const textures = webglPipe.getTextures(renderNode);

		for (let i = 0, len = textures.length; i < len; i++) {
			const texture = textures[i];

			if (texture.isReady) {
				texture.initTexture(this.renderer.gl);
			}
		}
	}
}
