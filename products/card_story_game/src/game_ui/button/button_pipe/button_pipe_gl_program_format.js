import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
	GlDataTypeEnum,
} from "../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";

export const uBgColorName = "u_bgColor";
export const uImageName = "u_image";

export const aPositionName = "a_position";
export const aTexCoordName = "a_texCoord";
export const aIsBgName = "a_isBg";

const vertexSource =
	"attribute vec2 a_position;" +
	"attribute vec2 a_texCoord;" +
	"attribute float a_isBg;" +
	"varying vec2 v_texCoord;" +
	"varying float v_isBg;" +
	"uniform mat3 u_projection;" +
	"uniform mat3 u_view;" +
	"uniform mat3 u_model;" +
	"void main() {" +
	"vec3 pos = u_projection * u_view * u_model * vec3(a_position, 1.0);" +
	"gl_Position = vec4(pos.xy, 0.0, 1.0);" +
	"v_texCoord = a_texCoord;" +
	"v_isBg = a_isBg;" +
	"}";

const fragmentSource =
	"precision mediump float;" +
	"varying vec2 v_texCoord;" +
	"varying float v_isBg;" +
	"uniform sampler2D u_image;" +
	"uniform vec4 u_bgColor;" +
	"void main() {" +
	"if (v_isBg > 0.5) {" +
	"    gl_FragColor = u_bgColor;" +
	"} else {" +
	"    gl_FragColor = texture2D(u_image, v_texCoord);" +
	"}" +
	"}";

/** @type {CanvasEngineType.GlUniformLocationsFormat} */
export const uniformLocationsFormat = [
	{ type: GlDataTypeEnum.sampler2D, name: uImageName },
	{ type: GlDataTypeEnum.mat3, name: uCameraProjectionName },
	{ type: GlDataTypeEnum.mat3, name: uCameraViewName },
	{ type: GlDataTypeEnum.mat3, name: uRenderNodeModelName },
	{ type: GlDataTypeEnum.color, name: uBgColorName },
];

/** @type {CanvasEngineType.GlAttribLocationsFormat} */
export const attribLocationsFormat = [
	{ type: GlDataTypeEnum.vec2, name: aPositionName },
	{ type: GlDataTypeEnum.vec2, name: aTexCoordName },
	{ type: GlDataTypeEnum.float, name: aIsBgName },
];

export const buttonGlProgramFormat = {
	vertexSource: vertexSource,
	fragmentSource: fragmentSource,
	uniformLocationsFormat: uniformLocationsFormat,
	attribLocationsFormat: attribLocationsFormat,
};
