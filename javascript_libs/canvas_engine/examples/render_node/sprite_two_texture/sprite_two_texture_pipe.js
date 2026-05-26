import { Render2DNode } from "../../../src/render_node/2d/render_2d_node.js";
import { GlAttribs } from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { GlProgram } from "../../../src/renderer/webgl_renderer/webgl_program/gl_program/gl_program.js";
import { GlTexture } from "../../../src/renderer/webgl_renderer/webgl_texture/gl_texture.js";
import {
	aPositionName,
	aTextureCoordName,
	glProgramFormat,
	uImageClamp,
	uImageName1,
	uImageName2,
} from "./gl_program_format.js";

export class Sprite2DTwoTexturePipe extends Render2DNode {
	/** @type {CanvasEngineType.Texture} */
	texture1;
	/** @type {CanvasEngineType.Texture} */
	texture2;
	/** @type {number} */
	clamp;
	/**
	 * @param {CanvasEngineType.Texture} texture1
	 * @param {CanvasEngineType.Texture} texture2
	 */
	constructor(texture1, texture2) {
		super();

		this.texture1 = texture1;
		this.texture2 = texture2;

		this.clamp = 0.5;
	}

	get isReady() {
		return this.texture1.isLoaded && this.texture2.isLoaded;
	}

	static cacheProgramKey = "Sprite2D";

	/**
	 * @param {WebGL2RenderingContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]['_cacheGlPrograms']} cacheGlPrograms
	 */
	getGlProgram(gl, cacheGlPrograms) {
		const glProgramKey = Sprite2DTwoTexturePipe.cacheProgramKey;
		if (!cacheGlPrograms.has(glProgramKey)) {
			cacheGlPrograms.set(glProgramKey, new GlProgram(gl, glProgramFormat));
		}
		return cacheGlPrograms.get(glProgramKey);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]["_cacheGlAttribs"]} cacheGlAttribs
	 */
	getAttribs(cacheGlAttribs) {
		const attribsKey = this.texture1.key;
		const bufferKey = this.texture1.key;
		if (!cacheGlAttribs.has(attribsKey)) {
			cacheGlAttribs.set(
				attribsKey,
				new GlAttribs({
					attribsKey: attribsKey,
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
			const bufferTextureKey = this.texture1.key;
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
		const texture1Key = this.texture1.key;
		const texture2Key = this.texture2.key;
		if (this.texture1.image2D && !cacheTextures.has(texture1Key)) {
			cacheTextures.set(texture1Key, new GlTexture(this.texture1.image2D).initTexture(gl, this.texture1));
		}
		if (this.texture2.image2D && !cacheTextures.has(texture2Key)) {
			cacheTextures.set(texture2Key, new GlTexture(this.texture2.image2D).initTexture(gl, this.texture2));
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} webglTextureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(gl, webglTextureSystem, glProgram) {
		if (this.isReady) {
			glProgram.uniform(gl, uImageName1, webglTextureSystem.getGlTexture(this.texture1.key));
			glProgram.uniform(gl, uImageName2, webglTextureSystem.getGlTexture(this.texture2.key));
			glProgram.uniform(gl, uImageClamp, this.clamp);
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
