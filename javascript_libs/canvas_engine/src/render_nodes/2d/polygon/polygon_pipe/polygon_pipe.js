import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { aPositionName, polygonGlProgramFormat, uColorName } from "./polygon_pipe_gl_program_format.js";
import { GlAttribs } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../../renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";

/**
 * @param {CanvasEngineType.Polygon} polygon
 * @returns {string}
 */
function getBufferKey(polygon) {
	return `polygon-${polygon.id}`;
}

export const PolygonPipe = {
	/**
	 * @param {CanvasEngineType.Polygon} _polygon
	 * @param {CanvasEngineType.WebGL2DRenderer['programSystem']} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_polygon, programSystem) {
		return programSystem.addGlProgram("Polygon", polygonGlProgramFormat);
	},

	/**
	 * @param {CanvasEngineType.Polygon} polygon
	 * @param {CanvasEngineType.WebGL2DRenderer['bufferSystem']} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(polygon, bufferSystem) {
		const bufferKey = getBufferKey(polygon);
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
	 * @param {CanvasEngineType.Polygon} polygon
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(polygon, gl, bufferSystem) {
		const bufferKey = getBufferKey(polygon);
		const geometry = polygon.geometry;

		if (!geometry.triangles || geometry.triangles.length === 0) {
			return;
		}

		const trianglesData = new Float32Array(geometry.triangles);

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			if (polygon.bufferNeedUpdate) {
				bufferSystem.getGlBuffer(bufferKey).updateBufferSubData(gl, 0, trianglesData);
				polygon.bufferNeedUpdate = false;
			}
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					trianglesData,
					GlBufferUsageTypeEnum.STATIC_DRAW,
				).bufferData(gl),
			);
			polygon.bufferNeedUpdate = false;
		}
		polygon.cachedVertexCount = trianglesData.length / 2;
	},

	/**
	 * @param {CanvasEngineType.Polygon} polygon
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(polygon, gl, _textureSystem, glProgram) {
		glProgram.uniform(gl, uColorName, polygon.color);
	},

	/**
	 * @param {CanvasEngineType.Polygon} polygon
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(polygon, gl, glProgram) {
		if (polygon.cachedVertexCount > 0) {
			glProgram.drawArrays(gl, gl.TRIANGLES, 0, polygon.cachedVertexCount);
		}
	},
};
