import { ImageTexture } from "../../../src/texture/image_texture.js";
import { Sprite2DTwoTexturePipe } from "./sprite_two_texture_pipe.js";

export class Sprite2DTwoTexture extends Sprite2DTwoTexturePipe {
	/** @type {boolean} */
	isSprite2D = true;
	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture1
	 * @param {CanvasEngineType.Sprite2DTexture} texture2
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
		return new Sprite2DTwoTexture(ImageTexture.createFromUrl(url1), ImageTexture.createFromUrl(url2));
	}
}
