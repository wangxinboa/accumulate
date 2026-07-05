import {
	GetTextureBufferTypeEnum,
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	aPositionName,
	aTextureCoordName,
	sprite2DGlProgramFormat,
	uImageName,
} from "./sprite2d_pipe_gl_program_format.js";
import { GlAttribs } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { getPositionUvFloat32ArrayFromWidthAndHeight } from "../../../../renderers/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";

/**
 * @param {{width: number; height: number}} sprite2D
 * @returns {string}
 */
function getBufferKey(sprite2D) {
	return `texture-${sprite2D.width}-${sprite2D.height}`;
}

/**
 * Sprite2D 渲染管道对象，封装了 Sprite2D 的 WebGL 渲染相关逻辑。
 * 所有方法第一个参数均为 Sprite2D 实例。
 */
export const Sprite2DPipe = {
	/**
	 * 获取着色器程序
	 * @param {CanvasEngineType.Sprite2D} _sprite2D
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_sprite2D, programSystem) {
		return programSystem.addGlProgram("Sprite2D", sprite2DGlProgramFormat);
	},

	/**
	 * 更新属性配置
	 * @param {CanvasEngineType.Sprite2D} sprite2D
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(sprite2D, bufferSystem) {
		if (!sprite2D.isReady) return;

		let bufferKey;
		switch (sprite2D.getTextureBufferType) {
			case GetTextureBufferTypeEnum.fromTextureKey:
				bufferKey = sprite2D.texture.key;
				break;
			case GetTextureBufferTypeEnum.fromTextureWidthAndHeight:
				bufferKey = getBufferKey(sprite2D);
				break;
			default:
				throw new Error("未知的获取 buffer key 类型");
		}

		const attribsKey = bufferKey;

		if (!bufferSystem.hasGlAttribs(attribsKey)) {
			bufferSystem.setGlAttribs(
				attribsKey,
				new GlAttribs(attribsKey)
					.addAttrib(bufferKey, aPositionName, 2, GlBufferDataTypeEnum.FLOAT, false, 16, 0)
					.addAttrib(bufferKey, aTextureCoordName, 2, GlBufferDataTypeEnum.FLOAT, false, 16, 8),
			);
		}
		return bufferSystem.getGlAttribs(attribsKey);
	},

	/**
	 * 更新缓冲区
	 * @param {CanvasEngineType.Sprite2D} sprite2D
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(sprite2D, gl, bufferSystem) {
		if (!sprite2D.isReady) return;

		const width = sprite2D.width;
		const height = sprite2D.height;

		let bufferKey;
		switch (sprite2D.getTextureBufferType) {
			case GetTextureBufferTypeEnum.fromTextureKey:
				bufferKey = sprite2D.texture.key;
				break;
			case GetTextureBufferTypeEnum.fromTextureWidthAndHeight:
				bufferKey = getBufferKey(sprite2D);
				break;
			default:
				throw new Error("未知的获取 buffer key 类型");
		}

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			if (sprite2D.cacheBufferWidth !== width || sprite2D.cacheBufferHeight !== height) {
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
		sprite2D.cacheBufferWidth = width;
		sprite2D.cacheBufferHeight = height;
	},

	/**
	 * 更新纹理
	 * @param {CanvasEngineType.Sprite2D} sprite2D
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(sprite2D, textureSystem) {
		if (sprite2D.isReady) {
			textureSystem.updateGlTexture(sprite2D.texture);
		}
	},

	/**
	 * 设置 Uniform
	 * @param {CanvasEngineType.Sprite2D} sprite2D
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(sprite2D, gl, textureSystem, glProgram) {
		if (sprite2D.isReady) {
			glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(sprite2D.texture.key));
		}
	},

	/**
	 * 绘制
	 * @param {CanvasEngineType.Sprite2D} sprite2D
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(sprite2D, gl, glProgram) {
		if (sprite2D.isReady) {
			glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
		}
	},
};
