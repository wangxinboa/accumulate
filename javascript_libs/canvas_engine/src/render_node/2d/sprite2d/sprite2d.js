import { GlTexture } from "../../../renderer/webgl_renderer/webgl_texture/gl_texture.js";
import { Render2DNode } from "./../render_2d_node.js";

export class Sprite2D extends Render2DNode {
	/** @type {boolean} */
	isSprite2D;
	/** @type {GlTexture} */
	texture;
	/**
	 * @param {GlTexture} texture
	 */
	constructor(texture) {
		super();

		this.isSprite2D = true;

		this.texture = texture;
	}

	get isReady() {
		return this.texture.isReady;
	}
	get width() {
		return this.texture.width;
	}
	get height() {
		return this.texture.height;
	}

	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new Sprite2D(GlTexture.createFromUrl(url));
	}
}
