import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../../../../javascript_libs/canvas_engine/src/renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	aPositionName,
	aTexCoordName,
	aIsBgName,
	CardGlProgramFormat,
	uBgColorName,
	uTextColorName,
	uImageName,
} from "./card_pipe_gl_program_format.js";
import { GlAttribs } from "../../../../../../javascript_libs/canvas_engine/src/renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlBuffer } from "../../../../../../javascript_libs/canvas_engine/src/renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { generateCardVertexData } from "./generate_card_vertex_data.js";

/**
 * @param {CardStoryGameType.Card} card
 * @returns {string}
 */
function getBufferKey(card) {
	return "Card-" + card.id;
}

export const CardPipe = {
	/**
	 * @param {CardStoryGameType.Card} _card
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_card, programSystem) {
		return programSystem.addGlProgram("Card", CardGlProgramFormat);
	},

	/**
	 * @param {CardStoryGameType.Card} card
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(card, bufferSystem) {
		const bufferKey = getBufferKey(card);
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
	 * @param {CardStoryGameType.Card} card
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(card, gl, bufferSystem) {
		const bufferKey = getBufferKey(card);

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			// bufferSystem.getGlBuffer(bufferKey).updateBufferSubData(gl, 0, data);
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					generateCardVertexData(card),
					GlBufferUsageTypeEnum.DYNAMIC_DRAW,
				).bufferData(gl),
			);
		}
	},

	/**
	 * @param {CardStoryGameType.Card} card
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(card, textureSystem) {
		if (card.textTexture && card.textTexture.isReady) {
			textureSystem.updateGlTexture(card.textTexture);
		}
	},

	/**
	 * @param {CardStoryGameType.Card} card
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(card, gl, textureSystem, glProgram) {
		glProgram.uniform(gl, uBgColorName, card.bgColor);
		glProgram.uniform(gl, uTextColorName, card.textColor);
		if (card.textTexture && card.textTexture.isReady) {
			glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(card.textTexture.key));
		}
	},

	/**
	 * @param {CardStoryGameType.Card} _card
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_card, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 12);
	},
};
