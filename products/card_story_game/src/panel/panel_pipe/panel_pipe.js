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
	aTexIndexName,
	panelGlProgramFormat,
	uBgColorName,
	uTextColorName,
	uTitleImageName,
	uDescImageName,
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
					.addAttrib(bufferKey, aPositionName, 2, GlBufferDataTypeEnum.FLOAT, false, 24, 0) // stride 6*4=24
					.addAttrib(bufferKey, aTexCoordName, 2, GlBufferDataTypeEnum.FLOAT, false, 24, 8)
					.addAttrib(bufferKey, aIsBgName, 1, GlBufferDataTypeEnum.FLOAT, false, 24, 16)
					.addAttrib(bufferKey, aTexIndexName, 1, GlBufferDataTypeEnum.FLOAT, false, 24, 20),
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
		if (!panel.titleTexture || !panel.descriptionTexture) {
			return;
		}

		const bufferKey = getBufferKey(panel);
		const width = panel.width;
		const height = panel.height;
		const titleText = panel.titleTexture.text;
		const descText = panel.descriptionTexture.text;

		if (
			bufferSystem.hasGlBuffer(bufferKey) &&
			panel.cacheBufferWidth === width &&
			panel.cacheBufferHeight === height &&
			panel.cacheTitleText === titleText &&
			panel.cacheDescText === descText
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
		panel.cacheTitleText = titleText;
		panel.cacheDescText = descText;
	},

	/**
	 * @param {CardStoryGameType.Panel} panel
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} textureSystem
	 */
	updateTextures(panel, textureSystem) {
		if (panel.titleTexture && panel.titleTexture.isReady) {
			textureSystem.updateGlTexture(panel.titleTexture);
		}
		if (panel.descriptionTexture && panel.descriptionTexture.isReady) {
			textureSystem.updateGlTexture(panel.descriptionTexture);
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

		// 标题纹理
		if (panel.titleTexture && panel.titleTexture.isReady) {
			const titleGlTex = textureSystem.getGlTexture(panel.titleTexture.key);
			if (titleGlTex) {
				glProgram.uniform(gl, uTitleImageName, titleGlTex);
			}
		}
		// 描述纹理
		if (panel.descriptionTexture && panel.descriptionTexture.isReady) {
			const descGlTex = textureSystem.getGlTexture(panel.descriptionTexture.key);
			if (descGlTex) {
				glProgram.uniform(gl, uDescImageName, descGlTex);
			}
		}
	},

	/**
	 * @param {CardStoryGameType.Panel} _panel
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	drawArrays(_panel, gl, glProgram) {
		glProgram.drawArrays(gl, gl.TRIANGLES, 0, 18); // 18顶点 = 6背景 + 6标题 + 6描述
	},
};
