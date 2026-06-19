import { Render2DNode } from "../render_2d_node.js";
import {
	GetTextureBufferTypeEnum,
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	aPositionName,
	aTextureCoordName,
	sprite2DGlProgramFormat,
	uImageName,
} from "./sprite2d_webgl_pipe/gl_program_format.js";
import { GlAttribs } from "../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { ImageTexture } from "../../../textures/image_texture.js";
import { TextTexture } from "../../../textures/text_texture.js";
import { getPositionUvFloat32ArrayFromWidthAndHeight } from "../../../renderers/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";
import { Rectangle } from "../../../math/geometry_2d_defs/rectangle.js";

/**
 * @param {{width: number; height: number}} sprite2DPipe
 */
export function getBufferKey(sprite2DPipe) {
	return `texture-${sprite2DPipe.width}-${sprite2DPipe.height}`;
}

export class Sprite2D extends Render2DNode {
	/** @type {CanvasEngineType.Sprite2DTexture} */
	_texture;
	/** @type {CanvasEngineType.Rectangle} */
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
		this.geometry = new Rectangle();

		this.getTextureBufferType = GetTextureBufferTypeEnum.fromTextureWidthAndHeight;

		this.cacheBufferWidth = this.width;
		this.cacheBufferHeight = this.height;

		this._onTextureChange();
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
		if (this.texture) {
			this.texture.unregisterTextureRectChangeCallback(this._updateGeometry);
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
		this.texture.registerTextureRectChangeCallback(this._updateGeometry);
	}
	/** @private */
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
	static key = "Sprite2D";
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2D.key, sprite2DGlProgramFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateAttribs(bufferSystem) {
		if (this.isReady) {
			let bufferKey;
			switch (this.getTextureBufferType) {
				case GetTextureBufferTypeEnum.fromTextureKey:
					bufferKey = this.texture.key;
					break;
				case GetTextureBufferTypeEnum.fromTextureWidthAndHeight:
					bufferKey = getBufferKey(this);
					break;
				default:
					throw new Error("未知的获取 buffer key 类型");
			}

			const attribsKey = bufferKey;

			if (!bufferSystem.hasGlAttribs(attribsKey)) {
				bufferSystem.setGlAttribs(
					attribsKey,
					new GlAttribs(attribsKey)
						.addAttrib(
							bufferKey,
							aPositionName,
							2,
							GlBufferDataTypeEnum.FLOAT,
							false,
							16, // 每个顶点5个float，每个float4字节，共20字节,
							0,
						)
						.addAttrib(
							bufferKey,
							aTextureCoordName,
							2,
							GlBufferDataTypeEnum.FLOAT,
							false,
							16, // 每个顶点5个float，每个float4字节，共20字节,
							8, // 跳过前2个浮点数(x,y)，每个浮点数4字节,
						),
				);
			}

			return bufferSystem.getGlAttribs(attribsKey);
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(gl, bufferSystem) {
		if (this.isReady) {
			const width = this.width;
			const height = this.height;

			let bufferKey;
			switch (this.getTextureBufferType) {
				case GetTextureBufferTypeEnum.fromTextureKey:
					bufferKey = this.texture.key;
					break;
				case GetTextureBufferTypeEnum.fromTextureWidthAndHeight:
					bufferKey = getBufferKey(this);
					break;
				default:
					throw new Error("未知的获取 buffer key 类型");
			}

			if (bufferSystem.hasGlBuffer(bufferKey)) {
				if (this.cacheBufferWidth !== width || this.cacheBufferHeight !== height) {
					bufferSystem
						.getGlBuffer(bufferKey)
						.updateBufferSubData(gl, 0, getPositionUvFloat32ArrayFromWidthAndHeight(width, height));
				}
			} else {
				bufferSystem.setGlBuffer(
					bufferKey,
					new GlBuffer(
						bufferKey,
						GlBufferTargetTypeEnum.ARRAY_BUFFER,
						getPositionUvFloat32ArrayFromWidthAndHeight(width, height),
						GlBufferUsageTypeEnum.STATIC_DRAW,
					).bufferData(gl),
				);
			}
			this.cacheBufferWidth = width;
			this.cacheBufferHeight = height;
		}
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(textureSystem) {
		if (this.isReady) {
			textureSystem.updateGlTexture(this.texture);
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(gl, textureSystem, glProgram) {
		if (this.isReady) {
			glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(this.texture.key));
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(gl, glProgram) {
		if (this.isReady) {
			glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
		}
	}
}
