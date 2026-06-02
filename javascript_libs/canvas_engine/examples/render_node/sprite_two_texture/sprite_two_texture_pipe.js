import { Render2DNode } from "../../../src/render_node/2d/render_2d_node.js";
import { GlAttribs } from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	aPositionName,
	aTextureCoordName,
	glProgramFormat,
	uImageClamp,
	uImageName1,
	uImageName2,
} from "./gl_program_format.js";
import { getBufferKey } from "../../../src/render_node/2d/sprite2d/sprite2d.js";
import { GlBuffer } from "../../../src/renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";

export class Sprite2DTwoTexturePipe extends Render2DNode {
	/** @type {CanvasEngineType.Sprite2DTexture} */
	texture1;
	/** @type {CanvasEngineType.Sprite2DTexture} */
	texture2;
	/** @type {number} */
	clamp;
	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture1
	 * @param {CanvasEngineType.Sprite2DTexture} texture2
	 */
	constructor(texture1, texture2) {
		super();

		this.texture1 = texture1;
		this.texture2 = texture2;

		this.clamp = 0.5;
	}

	get isReady() {
		return this.texture1.isReady && this.texture2.isReady;
	}

	static cacheProgramKey = "Sprite2DTwoTexture";

	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2DTwoTexturePipe.cacheProgramKey, glProgramFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateAttribs(bufferSystem) {
		if (this.isReady) {
			const attribsKey = this.texture1.key;
			const bufferKey = getBufferKey(this);

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
							16, // 每个顶点4个float，每个float4字节，共16字节,
							0,
						)
						.addAttrib(
							bufferKey,
							aTextureCoordName,
							2,
							GlBufferDataTypeEnum.FLOAT,
							false,
							16, // 每个顶点4个float，每个float4字节，共16字节,
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
			const bufferTextureKey = getBufferKey(this);

			if (!bufferSystem.hasGlBuffer(bufferTextureKey)) {
				bufferSystem.setGlBuffer(
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
	 * @param {CanvasEngineType.WebGLRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(textureSystem) {
		if (this.isReady) {
			textureSystem.updateGlTexture(this.texture1.key, this.texture1);
			textureSystem.updateGlTexture(this.texture2.key, this.texture2);
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
