import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { aPositionName, circleGlProgramFormat, uColorName, uRadiusName } from "./circle_pipe_gl_program_format.js";
import { GlAttribs } from "../.././../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { getPositionFloat32ArrayFromDiameter } from "../../../../renderers/webgl_renderer/webgl_buffer/webgl_buffer_utils.js";

/**
 * @param {CanvasEngineType.Circle} circle
 */
function getBufferKey(circle) {
	return `circle-${circle.id}`;
}

export const CirclePipe = {
	/**
	 * @param {CanvasEngineType.Circle} _circle
	 * @param {CanvasEngineType.WebGL2DRenderer['programSystem']} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_circle, programSystem) {
		return programSystem.addGlProgram("Circle", circleGlProgramFormat);
	},

	/**
	 * @param {CanvasEngineType.Circle} circle
	 * @param {CanvasEngineType.WebGL2DRenderer['bufferSystem']} bufferSystem
	 * @returns
	 */
	updateAttribs(circle, bufferSystem) {
		const bufferKey = getBufferKey(circle);
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
	 * @param {CanvasEngineType.Circle} circle
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(circle, gl, bufferSystem) {
		const diameter = circle.radius * 2;
		const bufferKey = getBufferKey(circle);

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			if (circle._cacheBufferDiameter !== diameter) {
				bufferSystem.getGlBuffer(bufferKey).updateBufferSubData(gl, 0, getPositionFloat32ArrayFromDiameter(diameter));
				circle._cacheBufferDiameter = diameter;
			}
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					getPositionFloat32ArrayFromDiameter(diameter),
					GlBufferUsageTypeEnum.STATIC_DRAW,
				).bufferData(gl),
			);
			circle._cacheBufferDiameter = diameter;
		}
	},

	/**
	 * @param {CanvasEngineType.Circle} circle
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(circle, gl, _textureSystem, glProgram) {
		glProgram.uniform(gl, uColorName, circle.color);
		glProgram.uniform(gl, uRadiusName, circle.radius);
	},

	/**
	 * @param {CanvasEngineType.Circle} _circle
	 * @param {{ TRIANGLES: any; }} gl
	 * @param {{ drawArrays: (arg0: any, arg1: any, arg2: number, arg3: number) => void; }} glProgram
	 */
	drawArrays(_circle, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	},
};
