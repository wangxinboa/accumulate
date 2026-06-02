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
	glProgramFormat,
	uImageName,
} from "../sprite2d/sprite2d_webgl_pipe/gl_program_format.js";

export class Text extends Render2DNode {
	/** @type {TextTexture} */
	texture;
	/**
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this.texture = new TextTexture(text);
	}
	get width() {
		return this.texture.width;
	}
	get height() {
		return this.texture.height;
	}
	get text() {
		return this.texture.text;
	}
	set text(text) {
		this.texture.text = text;
	}
	get textHasChanged() {
		return this.texture.textHasChanged;
	}
	set textHasChanged(value) {
		this.texture.textHasChanged = value;
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer['programSystem']} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2D.key, glProgramFormat);
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
			if (this.textHasChanged) {
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

		this.textHasChanged = false;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} webglTextureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(gl, webglTextureSystem, glProgram) {
		glProgram.uniform(gl, uImageName, webglTextureSystem.getGlTexture(this.texture.key));
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	}
}
