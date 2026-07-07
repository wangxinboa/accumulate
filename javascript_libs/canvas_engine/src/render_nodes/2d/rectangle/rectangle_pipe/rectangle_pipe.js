import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { aPositionName, rectangleGlProgramFormat, uColorName } from "./rectangle_pipe_gl_program_format.js";
import { GlAttribs } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { getPositionFloat32ArrayFromWidthAndHeight } from "../../../../renderers/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";

/**
 * @param {CanvasEngineType.Rectangle} rectangle
 */
function getBufferKey(rectangle) {
	return `rectangle-${rectangle.id}`;
}

export const RectanglePipe = {
	/**
	 * @param {CanvasEngineType.Rectangle} _rectangle
	 * @param {CanvasEngineType.WebGL2DRenderer['programSystem']} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_rectangle, programSystem) {
		return programSystem.addGlProgram("Rectangle", rectangleGlProgramFormat);
	},

	/**
	 * @param {CanvasEngineType.Rectangle} rectangle
	 * @param {CanvasEngineType.WebGL2DRenderer['bufferSystem']} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(rectangle, bufferSystem) {
		const bufferKey = getBufferKey(rectangle);
		const attribsKey = bufferKey;

		if (!bufferSystem.hasGlAttribs(attribsKey)) {
			bufferSystem.setGlAttribs(
				attribsKey,
				new GlAttribs(attribsKey).addAttrib(bufferKey, aPositionName, 2, GlBufferDataTypeEnum.FLOAT, false, 8, 0),
			);
		}
		return bufferSystem.getGlAttribs(attribsKey);
	},

	/**
	 * @param {CanvasEngineType.Rectangle} rectangle
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(rectangle, gl, bufferSystem) {
		const width = rectangle.width;
		const height = rectangle.height;
		const bufferKey = getBufferKey(rectangle);

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			if (rectangle._cacheBufferWidth !== width || rectangle._cacheBufferHeight !== height) {
				bufferSystem
					.getGlBuffer(bufferKey)
					.updateBufferSubData(gl, 0, getPositionFloat32ArrayFromWidthAndHeight(width, height));
				rectangle._cacheBufferWidth = width;
				rectangle._cacheBufferHeight = height;
			}
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					getPositionFloat32ArrayFromWidthAndHeight(width, height),
					GlBufferUsageTypeEnum.STATIC_DRAW,
				).bufferData(gl),
			);
			rectangle._cacheBufferWidth = width;
			rectangle._cacheBufferHeight = height;
		}
	},

	/**
	 * @param {CanvasEngineType.Rectangle} rectangle
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(rectangle, gl, _textureSystem, glProgram) {
		glProgram.uniform(gl, uColorName, rectangle.color);
	},

	/**
	 * @param {CanvasEngineType.Rectangle} _rectangle
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_rectangle, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	},
};
