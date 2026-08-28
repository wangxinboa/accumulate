import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
	GlAttribs,
	GlBuffer,
} from "../../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { aPositionName, cardPanelSlotGlProgramFormat, uBgColorName } from "./card_panel_slot_pipe_gl_program_format.js";
import { generateCardPanelSlotVertexData } from "./generate_card_panel_slot_vertex_data.js";

/**
 * @returns {string}
 */
function getBufferKey() {
	return "card_panel_slot";
}

export const CardPanelSlotPipe = {
	/**
	 * @param {CardStoryGameType.CardPanelSlot} _cardPanelSlot
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 * @returns {CanvasEngineType.GlProgram}
	 */
	getGlProgram(_cardPanelSlot, programSystem) {
		return programSystem.addGlProgram("CardPanelSlot", cardPanelSlotGlProgramFormat);
	},

	/**
	 * @param {CardStoryGameType.CardPanelSlot} _cardPanelSlot
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 * @returns {CanvasEngineType.GlAttribs | undefined}
	 */
	updateAttribs(_cardPanelSlot, bufferSystem) {
		const bufferKey = getBufferKey();
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
	 * @param {CardStoryGameType.CardPanelSlot} cardPanelSlot
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(cardPanelSlot, gl, bufferSystem) {
		const bufferKey = getBufferKey();

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			// 只有尺寸变化时才更新缓冲区数据
			if (cardPanelSlot.needUpdateBuffer) {
				bufferSystem.getGlBuffer(bufferKey).updateBufferSubData(gl, 0, generateCardPanelSlotVertexData(cardPanelSlot));
				cardPanelSlot.needUpdateBuffer = false;
			}
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					generateCardPanelSlotVertexData(cardPanelSlot),
					GlBufferUsageTypeEnum.DYNAMIC_DRAW,
				).bufferData(gl),
			);
			cardPanelSlot.needUpdateBuffer = false;
		}
	},

	/**
	 * @param {CardStoryGameType.CardPanelSlot} cardPanelSlot
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(cardPanelSlot, gl, _textureSystem, glProgram) {
		glProgram.uniform(gl, uBgColorName, cardPanelSlot.bgColor);
	},

	/**
	 * @param {CardStoryGameType.CardPanelSlot} _cardPanelSlot
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_cardPanelSlot, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 6);
	},
};
