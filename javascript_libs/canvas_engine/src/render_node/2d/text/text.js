import { Rectangle } from "../../../math/geometry_2d_def/rectangle.js";
import { GlAttribs } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { getPositionUvFloat32ArrayFromWidthAndHeight } from "../../../renderer/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";
import { TextTexture } from "../../../texture/text_texture.js";
import { Render2DNode } from "../render_2d_node.js";
import { Sprite2D } from "../sprite2d/sprite2d.js";
import {
	aPositionName,
	aTextureCoordName,
	sprite2dGlProgramFormat,
	uImageName,
} from "../sprite2d/sprite2d_webgl_pipe/gl_program_format.js";

export class Text extends Render2DNode {
	/** @type {TextTexture} */
	_texture;
	/** @type {CanvasEngineType.Rectangle} */
	geometry;
	/**
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this._texture = new TextTexture(text);
		this.geometry = new Rectangle();

		this._onTextureChange();
	}
	_updateGeometry() {
		this.width = this.texture.width;
		this.height = this.texture.height;

		this.geometry.updateShape(0, 0, this.width, this.height);
	}
	get texture() {
		return this._texture;
	}
	set texture(value) {
		this._texture = value;
		this._onTextureChange();
	}
	/** @private */
	_onTextureChange() {
		if (this.texture.isReady) {
			this._updateGeometry();
		}
		this.texture.registerTextureRectChangeCallback(this._updateGeometry);
	}
	get text() {
		return this.texture.text;
	}
	set text(text) {
		this.texture.text = text;
	}
	get textHasChange() {
		return this.texture.textHasChange;
	}
	set textHasChange(value) {
		this.texture.textHasChange = value;
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer['programSystem']} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2D.key, sprite2dGlProgramFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer['bufferSystem']} bufferSystem
	 */
	updateAttribs(bufferSystem) {
		const attribsKey = this.texture.key;
		const bufferKey = this.texture.key;

		if (!bufferSystem.hasGlAttribs(attribsKey)) {
			bufferSystem.setGlAttribs(
				attribsKey,
				new GlAttribs(attribsKey)
					.addAttrib(bufferKey, aPositionName, 2, GlBufferDataTypeEnum.FLOAT, false, 4 * 4, 0)
					.addAttrib(bufferKey, aTextureCoordName, 2, GlBufferDataTypeEnum.FLOAT, false, 4 * 4, 2 * 4),
			);
		}
		return bufferSystem.getGlAttribs(attribsKey);
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(gl, bufferSystem) {
		const bufferKey = this.texture.key;

		const width = this.width;
		const height = this.height;

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			if (this.textHasChange) {
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
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer['textureSystem']} textureSystem
	 */
	updateTextures(textureSystem) {
		textureSystem.updateGlTexture(this.texture.key, this.texture);

		this.textHasChange = false;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(gl, textureSystem, glProgram) {
		glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(this.texture.key));
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	}
}
