import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
	GlAttribs,
	GlBuffer,
} from "../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import {
	aPositionName,
	aTexCoordName,
	aIsBgName,
	buttonGlProgramFormat,
	uBgColorName,
	uTextColorName,
	uImageName,
} from "./button_pipe_gl_program_format.js";
import { generateButtonVertexData } from "./generate_button_vertex_data.js";

/**
 * @param {CardStoryGameType.Button} button
 * @returns {string}
 */
function getBufferKey(button) {
	return "button-" + button.id;
}

export const ButtonPipe = {
	/**
	 * @param {CardStoryGameType.Button} _button
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_button, programSystem) {
		return programSystem.addGlProgram("Button", buttonGlProgramFormat);
	},

	/**
	 * @param {CardStoryGameType.Button} button
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(button, bufferSystem) {
		const bufferKey = getBufferKey(button);
		const attribsKey = bufferKey;

		if (!bufferSystem.hasGlAttribs(attribsKey)) {
			bufferSystem.setGlAttribs(
				attribsKey,
				new GlAttribs(attribsKey)
					.addAttrib(bufferKey, aPositionName, 2, GlBufferDataTypeEnum.FLOAT, false, 20, 0)
					.addAttrib(bufferKey, aTexCoordName, 2, GlBufferDataTypeEnum.FLOAT, false, 20, 8)
					.addAttrib(bufferKey, aIsBgName, 1, GlBufferDataTypeEnum.FLOAT, false, 20, 16),
			);
		}
		return bufferSystem.getGlAttribs(attribsKey);
	},

	/**
	 * @param {CardStoryGameType.Button} button
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(button, gl, bufferSystem) {
		const bufferKey = getBufferKey(button);

		if (!bufferSystem.hasGlBuffer(bufferKey)) {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					generateButtonVertexData(button),
					GlBufferUsageTypeEnum.DYNAMIC_DRAW,
				).bufferData(gl),
			);
		}
	},

	/**
	 * @param {CardStoryGameType.Button} button
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(button, textureSystem) {
		if (button.textTexture && button.textTexture.isReady) {
			textureSystem.updateGlTexture(button.textTexture);
		}
	},

	/**
	 * @param {CardStoryGameType.Button} button
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(button, gl, textureSystem, glProgram) {
		glProgram.uniform(gl, uBgColorName, button.bgColor);
		glProgram.uniform(gl, uTextColorName, button.textColor);
		if (button.textTexture && button.textTexture.isReady) {
			glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(button.textTexture.key));
		}
	},

	/**
	 * @param {CardStoryGameType.Button} _button
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_button, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 12);
	},
};
