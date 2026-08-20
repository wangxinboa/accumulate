import { Render2DNode } from "../render_2d_node.js";
import { GetTextureBufferTypeEnum } from "../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { ImageTexture } from "../../../textures/image_texture.js";
import { TextTexture } from "../../../textures/text_texture.js";
import { RectangleDef } from "../../../math/geometry_2d_defs/rectangle_def.js";
import { Sprite2DPipe } from "./sprite2d_pipe/sprite2d_pipe.js";
import { emptyTexture } from "../../../textures/base_texture.js";

export class Sprite2D extends Render2DNode {
	/** @type {CanvasEngineType.Sprite2DTexture} */
	_texture = emptyTexture;
	/** @type {CanvasEngineType.RectangleDef} */
	geometry;
	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture
	 */
	constructor(texture) {
		super();

		this.geometry = new RectangleDef();
		/** @type {boolean} */
		this._fixedGeometry = false;
		/** @type {number} */
		this.cacheBufferWidth = -1;
		/** @type {number} */
		this.cacheBufferHeight = -1;
		/** @type {CanvasEngineType.GetTextureBufferTypeEnum} */
		this.getTextureBufferType = GetTextureBufferTypeEnum.fromTextureWidthAndHeight;

		this.texture = texture;
	}

	/**
	 * 获取当前 Sprite2D 的渲染管道对象
	 * @returns {CanvasEngineType.RenderPipe<this>}
	 */
	get pipe() {
		return Sprite2DPipe;
	}

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	fixGeometry(width, height) {
		this.width = width;
		this.height = height;
		this.geometry.updateShape(0, 0, this.width, this.height);
		this._fixedGeometry = true;

		return this;
	}

	/**
	 * @protected
	 * @returns {this}
	 */
	_updateGeometry() {
		if (!this._fixedGeometry) {
			this.width = this.texture.width;
			this.height = this.texture.height;

			this.geometry.updateShape(0, 0, this.width, this.height);
		}
		return this;
	}

	get texture() {
		return this._texture ?? emptyTexture;
	}

	set texture(textureValue) {
		if (this._texture === textureValue) {
			return;
		}
		if (this._texture) {
			this._texture.removeTextureRectChangeCallback(this._updateGeometry);
		}
		this._texture = textureValue;

		if (textureValue.isReady) {
			this._updateGeometry();
		}
		textureValue.addTextureRectChangeCallback(this._updateGeometry);
	}

	get text() {
		if (this.texture instanceof TextTexture) {
			return this.texture.text;
		} else {
			throw new Error("sprite2D texture 不为 TextTexture");
		}
	}
	set text(text) {
		if (this.texture instanceof TextTexture) {
			this.texture.text = text;
		} else {
			throw new Error("sprite2D texture 不为 TextTexture");
		}
	}

	get isReady() {
		return this.texture.isReady;
	}

	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new Sprite2D(ImageTexture.createFromUrl(url));
	}

	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture
	 */
	static createFromTexture(texture) {
		return new Sprite2D(texture);
	}

	/**
	 * @param {string} text
	 * @param {CanvasEngineType.TextOption} [textOption]
	 */
	static createFromText(text, textOption) {
		return new Sprite2D(new TextTexture(text, textOption)).setGetTextureBufferType(
			GetTextureBufferTypeEnum.fromTextureKey,
		);
	}

	/**
	 * @param {CanvasEngineType.GetTextureBufferTypeEnum} getTextureBufferType
	 */
	setGetTextureBufferType(getTextureBufferType) {
		this.getTextureBufferType = getTextureBufferType;
		return this;
	}
}
