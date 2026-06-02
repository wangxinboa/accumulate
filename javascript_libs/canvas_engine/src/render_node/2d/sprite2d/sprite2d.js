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
import { GlAttribs } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { ImageTexture } from "../../../texture/image_texture.js";
import { getPositionUvFloat32ArrayFromWidthAndHeight } from "../../../renderer/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";

/**
 * @param {{width: number; height: number}} sprite2DPipe
 */
export function getBufferKey(sprite2DPipe) {
	return `texture-${sprite2DPipe.width}-${sprite2DPipe.height}`;
}

export class Sprite2D extends Render2DNode {
	/** @type {CanvasEngineType.Sprite2DTexture} */
	texture;
	/**
	 * @param {CanvasEngineType.Sprite2DTexture} texture
	 */
	constructor(texture) {
		super();

		this.texture = texture;
	}
	/** @private */
	get isReady() {
		return this.texture.isReady;
	}
	get width() {
		return this.texture.width;
	}
	get height() {
		return this.texture.height;
	}
	/**
	 * @param {string} url
	 */
	static createFromUrl(url) {
		return new Sprite2D(ImageTexture.createFromUrl(url));
	}
	static key = "Sprite2D";
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 */
	getGlProgram(programSystem) {
		return programSystem.addGlProgram(Sprite2D.key, glProgramFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateAttribs(bufferSystem) {
		if (this.isReady) {
			const attribsKey = this.texture.key;
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
			const bufferTextureKey = getBufferKey(this);

			if (!bufferSystem.hasGlBuffer(bufferTextureKey)) {
				bufferSystem.setGlBuffer(
					bufferTextureKey,
					new GlBuffer(
						bufferTextureKey,
						GlBufferTargetTypeEnum.ARRAY_BUFFER,
						getPositionUvFloat32ArrayFromWidthAndHeight(width, height),
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
			textureSystem.updateGlTexture(this.texture.key, this.texture);
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
