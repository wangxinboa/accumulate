import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
	GlAttribs,
	GlBuffer,
} from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import {
	aPositionName,
	aTexCoordName,
	aIsBgName,
	panelGlProgramFormat,
	uBgColorName,
	uTextColorName,
	uImageName,
} from "./panel_pipe_gl_program_format.js";
import { generatePanelVertexData } from "./generate_panel_vertex_data.js";

/**
 * @param {CardStoryGameType.Panel} panel
 */
function getBufferKey(panel) {
	return "panel-" + panel.id;
}

export const PanelPipe = {
	/**
	 * @param {CardStoryGameType.Panel} _panel
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} programSystem
	 */
	getGlProgram(_panel, programSystem) {
		return programSystem.addGlProgram("Panel", panelGlProgramFormat);
	},

	/**
	 * @param {CardStoryGameType.Panel} panel
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateAttribs(panel, bufferSystem) {
		const bufferKey = getBufferKey(panel);
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
	 * @param {CardStoryGameType.Panel} panel
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} bufferSystem
	 */
	updateBuffers(panel, gl, bufferSystem) {
		const bufferKey = getBufferKey(panel);
		const width = panel.width;
		const height = panel.height;

		// 如果尺寸没变且缓冲区存在，则无需更新
		if (
			bufferSystem.hasGlBuffer(bufferKey) &&
			panel.cacheBufferWidth === width &&
			panel.cacheBufferHeight === height &&
			panel.cacheTitleText === panel.titleTexture.text
		) {
			return;
		}

		if (bufferSystem.hasGlBuffer(bufferKey)) {
			bufferSystem.getGlBuffer(bufferKey).updateBufferSubData(gl, 0, generatePanelVertexData(panel));
		} else {
			bufferSystem.setGlBuffer(
				bufferKey,
				new GlBuffer(
					bufferKey,
					GlBufferTargetTypeEnum.ARRAY_BUFFER,
					generatePanelVertexData(panel),
					GlBufferUsageTypeEnum.DYNAMIC_DRAW,
				).bufferData(gl),
			);
		}
		panel.cacheBufferWidth = width;
		panel.cacheBufferHeight = height;
		panel.cacheTitleText = panel.titleTexture.text;
	},

	/**
	 * @param {CardStoryGameType.Panel} panel
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(panel, textureSystem) {
		if (panel.titleTexture && panel.titleTexture.isReady) {
			textureSystem.updateGlTexture(panel.titleTexture);
		}
	},

	/**
	 * @param {CardStoryGameType.Panel} panel
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	uniform(panel, gl, textureSystem, glProgram) {
		glProgram.uniform(gl, uBgColorName, panel.bgColor);
		glProgram.uniform(gl, uTextColorName, panel.textColor);
		if (panel.titleTexture && panel.titleTexture.isReady) {
			glProgram.uniform(gl, uImageName, textureSystem.getGlTexture(panel.titleTexture.key));
		}
	},

	/**
	 * @param {CardStoryGameType.Panel} _panel
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_panel, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 12);
	},
};
