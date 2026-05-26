import { Texture } from "../../../src/texture/texture.js";
import { Sprite2DTwoTexturePipe } from "./sprite_two_texture_pipe.js";

export class Sprite2DTwoTexture extends Sprite2DTwoTexturePipe {
	/** @type {boolean} */
	isSprite2D = true;
	/**
	 * @param {CanvasEngineType.Texture} texture1
	 * @param {CanvasEngineType.Texture} texture2
	 */
	constructor(texture1, texture2) {
		super(texture1, texture2);
	}
	get width() {
		return this.texture1.width;
	}
	get height() {
		return this.texture1.height;
	}
	/**
	 * @param {string} url1
	 * @param {string} url2
	 */
	static createFromUrl(url1, url2) {
		return new Sprite2DTwoTexture(Texture.createFromUrl(url1), Texture.createFromUrl(url2));
	}
}
