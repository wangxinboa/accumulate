import { Render2DNode } from "../render_2d_node.js";
import { GetTextureBufferTypeEnum } from "../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { ImageTexture } from "../../../textures/image_texture.js";
import { TextTexture } from "../../../textures/text_texture.js";
import { RectangleDef } from "../../../math/geometry_2d_defs/rectangle_def.js";
import { Sprite2DPipe } from "./sprite2d_pipe/sprite2d_pipe.js";

export class Sprite2D extends Render2DNode {
	/** @type {CanvasEngineType.Sprite2DTexture} */
	_texture;
	/** @type {CanvasEngineType.RectangleDef} */
	geometry;
	/** @type {CanvasEngineType.GetTextureBufferTypeEnum} */
	getTextureBufferType;
	/** @type {number} */
	cacheBufferWidth;
	/** @type {number} */
	cacheBufferHeight;

	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture
	 */
	constructor(texture) {
		super();

		this._texture = texture;
		this.geometry = new RectangleDef();

		this.getTextureBufferType = GetTextureBufferTypeEnum.fromTextureWidthAndHeight;

		this.cacheBufferWidth = this.width;
		this.cacheBufferHeight = this.height;

		this._onTextureChange();
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
		return this._texture;
	}

	set texture(value) {
		if (this._texture === value) {
			return;
		}
		if (this.texture) {
			this.texture.removeTextureRectChangeCallback(this._updateGeometry);
		}
		this._texture = value;
		this._onTextureChange();
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

	/** @private */
	_onTextureChange() {
		if (this.texture.isReady) {
			this._updateGeometry();
		}
		this.texture.addTextureRectChangeCallback(this._updateGeometry);
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
