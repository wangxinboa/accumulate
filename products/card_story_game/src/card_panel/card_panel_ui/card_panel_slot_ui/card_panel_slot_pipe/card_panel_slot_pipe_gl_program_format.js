import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
	GlDataTypeEnum,
} from "../../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";

export const uBgColorName = "u_bgColor";
export const aPositionName = "a_position";

const vertexSource =
	"attribute vec2 a_position;" +
	"uniform mat3 u_projection;" +
	"uniform mat3 u_view;" +
	"uniform mat3 u_model;" +
	"void main() {" +
	"vec3 pos = u_projection * u_view * u_model * vec3(a_position, 1.0);" +
	"gl_Position = vec4(pos.xy, 0.0, 1.0);" +
	"}";

const fragmentSource =
	"precision mediump float;" + "uniform vec4 u_bgColor;" + "void main() {" + "gl_FragColor = u_bgColor;" + "}";

/** @type {CanvasEngineType.GlUniformLocationsFormat} */
export const uniformLocationsFormat = [
	{ type: GlDataTypeEnum.mat3, name: uCameraProjectionName },
	{ type: GlDataTypeEnum.mat3, name: uCameraViewName },
	{ type: GlDataTypeEnum.mat3, name: uRenderNodeModelName },
	{ type: GlDataTypeEnum.color, name: uBgColorName },
];

/** @type {CanvasEngineType.GlAttribLocationsFormat} */
export const attribLocationsFormat = [{ type: GlDataTypeEnum.vec2, name: aPositionName }];

export const cardPanelSlotGlProgramFormat = {
	vertexSource: vertexSource,
	fragmentSource: fragmentSource,
	uniformLocationsFormat: uniformLocationsFormat,
	attribLocationsFormat: attribLocationsFormat,
};
