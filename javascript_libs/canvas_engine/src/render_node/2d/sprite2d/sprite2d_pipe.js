import { Render2DNode } from "../render_2d_node.js";
import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	aPositionName,
	aTextureCoordName,
	glProgramFormat,
	uImageName,
} from "./sprite2d_webgl_pipe/gl_program_format.js";

export class Sprite2DPipe extends Render2DNode {
	/** @type {CanvasEngineType.Texture} */
	texture;
	/**
	 * @param {CanvasEngineType.Texture} texture
	 */
	constructor(texture) {
		super();

		this.texture = texture;
	}

	get isReady() {
		return this.texture.isLoaded;
	}

	static key = "Sprite2D";
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2DPipe.key, glProgramFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	getAttribs(bufferSystem) {
		const attribsKey = this.texture.key;
		const bufferKey = this.texture.key;

		return bufferSystem
			.getAttribs(attribsKey)
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
			);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	addBuffers(bufferSystem) {
		if (this.isReady) {
			const bufferTextureKey = this.texture.key;
			const width = this.width;
			const height = this.height;

			bufferSystem.addBuffer(
				bufferTextureKey,
				GlBufferTargetTypeEnum.ARRAY_BUFFER,
				new Float32Array([
					// 位置x,y, 纹理坐标u,v
					0,
					0,
					0,
					1, // 左下
					width,
					0,
					1,
					1, // 右下
					0,
					height,
					0,
					0, // 左上
					0,
					height,
					0.0,
					0.0, // 左上
					width,
					0,
					1,
					1, // 右下
					width,
					height,
					1,
					0, // 右上
				]),
				GlBufferUsageTypeEnum.STATIC_DRAW,
			);
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(textureSystem) {
		textureSystem.updateTexture(this.texture.key, this.texture);
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} webglTextureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(gl, webglTextureSystem, glProgram) {
		if (this.isReady) {
			glProgram.uniform(gl, uImageName, webglTextureSystem.getGlTexture(this.texture.key));
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
