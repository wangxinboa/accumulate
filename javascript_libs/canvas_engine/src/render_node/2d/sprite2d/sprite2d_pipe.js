import { Texture } from "../../../texture/texture.js";
import { Render2DNode } from "../render_2d_node.js";
import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { GlProgram } from "../../../renderer/webgl_renderer/webgl_program/gl_program/gl_program.js";
import { GlAttribs } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { GlTexture } from "../../../renderer/webgl_renderer/webgl_texture/gl_texture.js";
import {
	aPositionName,
	aTextureCoordName,
	glProgramFormat,
	uImageName,
} from "./sprite2d_webgl_pipe/gl_program_format.js";

export class Sprite2DPipe extends Render2DNode {
	/** @type {Texture} */
	texture;
	/**
	 * @param {Texture} texture
	 */
	constructor(texture) {
		super();

		this.texture = texture;
	}

	get isReady() {
		return this.texture.isLoaded;
	}

	static cacheProgramKey = "Sprite2D";
	/**
	 * @param {WebGL2RenderingContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]['_cacheGlPrograms']} cacheGlPrograms
	 */
	getGlProgram(gl, cacheGlPrograms) {
		const glProgramKey = Sprite2DPipe.cacheProgramKey;
		if (!cacheGlPrograms.has(glProgramKey)) {
			cacheGlPrograms.set(glProgramKey, new GlProgram(gl, glProgramFormat));
		}
		return cacheGlPrograms.get(glProgramKey);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]["_cacheGlAttribs"]} cacheGlAttribs
	 */
	getAttribs(cacheGlAttribs) {
		const attribsKey = this.texture.key;
		const bufferKey = this.texture.key;
		if (!cacheGlAttribs.has(attribsKey)) {
			cacheGlAttribs.set(
				attribsKey,
				new GlAttribs({
					arrtibsKey: attribsKey,
					arrtibs: [
						{
							bufferKey: bufferKey,
							attribName: aPositionName,
							size: 2,
							type: GlBufferDataTypeEnum.FLOAT,
							normalized: false,
							stride: 16, // 每个顶点5个float，每个float4字节，共20字节,
							offset: 0,
						},
						{
							bufferKey: bufferKey,
							attribName: aTextureCoordName,
							size: 2,
							type: GlBufferDataTypeEnum.FLOAT,
							normalized: false,
							stride: 16, // 每个顶点5个float，每个float4字节，共20字节,
							offset: 8, // 跳过前2个浮点数(x,y)，每个浮点数4字节,
						},
					],
				}),
			);
		}
		return cacheGlAttribs.get(attribsKey);
	}
	/**
	 * @param {WebGL2RenderingContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]['_cacheGlBuffers']} cacheGlBuffers
	 */
	initBuffers(gl, cacheGlBuffers) {
		if (this.isReady) {
			const bufferTextureKey = this.texture.key;
			const width = this.width;
			const height = this.height;

			if (!cacheGlBuffers.has(bufferTextureKey)) {
				cacheGlBuffers.set(
					bufferTextureKey,
					new GlBuffer(
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
					).bufferData(gl),
				);
			}
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGLRenderer["textureSystem"]["_cacheTextures"]} cacheTextures
	 */
	initTextures(gl, cacheTextures) {
		const textureKey = this.texture.key;
		if (this.texture.image2D && !cacheTextures.has(textureKey)) {
			cacheTextures.set(textureKey, new GlTexture(this.texture.image2D));
			cacheTextures.get(textureKey).initTexture(gl, this.texture);
		}
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
