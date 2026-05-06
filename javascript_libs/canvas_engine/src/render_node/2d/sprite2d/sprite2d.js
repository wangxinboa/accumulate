import { Texture } from "../../../texture/texture.js";
import { Sprite2DPipe } from "./sprite2d_pipe.js";

export class Sprite2D extends Sprite2DPipe {
	/** @type {boolean} */
	isSprite2D = true;
	/**
	 * @param {Texture} texture
	 */
	constructor(texture) {
		super(texture);
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
		return new Sprite2D(Texture.createFromUrl(url));
	}
}
