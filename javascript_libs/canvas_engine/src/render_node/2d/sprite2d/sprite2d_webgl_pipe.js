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

const sprite2dCacheProgramKey = "Sprite2D";

/** @type {CanvasEngineType.WebGLPipe} */
export const Sprite2DWebGLPipe = {
	getGlProgram(gl, cacheGlPrograms) {
		const glProgramKey = sprite2dCacheProgramKey;
		if (!cacheGlPrograms.has(glProgramKey)) {
			cacheGlPrograms.set(glProgramKey, new GlProgram(gl, glProgramFormat));
		}
		return cacheGlPrograms.get(glProgramKey);
	},
	getAttribs(cacheGlAttribs, sprite2d) {
		const attribsKey = sprite2d.texture.key;
		if (!cacheGlAttribs.has(attribsKey)) {
			cacheGlAttribs.set(
				attribsKey,
				new GlAttribs({
					arrtibsKey: `${sprite2d.texture.key}`,
					arrtibs: [
						{
							bufferKey: `${sprite2d.texture.key}`,
							attribName: aPositionName,
							size: 2,
							type: GlBufferDataTypeEnum.FLOAT,
							normalized: false,
							stride: 16, // 每个顶点5个float，每个float4字节，共20字节,
							offset: 0,
						},
						{
							bufferKey: `${sprite2d.texture.key}`,
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
	},
	initBuffers(gl, cacheGlBuffers, sprite2d) {
		if (sprite2d.isReady) {
			const bufferTextureKey = sprite2d.texture.key;
			const width = sprite2d.width;
			const height = sprite2d.height;

			if (!cacheGlBuffers.has(bufferTextureKey)) {
				cacheGlBuffers.set(
					bufferTextureKey,
					new GlBuffer(
						`${sprite2d.texture.key}`,
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
	},
	/**
	 * @param {CanvasEngineType.Sprite2D} sprite2d
	 */
	initTextures(gl, cacheTextures, sprite2d) {
		const textureKey = sprite2d.texture.key;
		if (!cacheTextures.has(textureKey)) {
			cacheTextures.set(textureKey, new GlTexture());
		}

		if (sprite2d.isReady) {
			cacheTextures.get(textureKey).initTexture(gl, sprite2d.texture);
		}
	},
	uniform(gl, webglTextureSystem, glProgram, sprite2d) {
		glProgram.uniform(gl, uImageName, webglTextureSystem.getGlTexture(sprite2d.texture.key));
	},

	drawArrays(gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	},
};
