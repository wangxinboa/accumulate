import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
	GlDataTypeEnum,
} from "../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";

export const uBgColorName = "u_bgColor";
export const uTextColorName = "u_textColor";
export const uTitleImageName = "u_titleImage";
export const uDescImageName = "u_descImage";
export const uUvTransformName = "u_uvTransform";

export const aPositionName = "a_position";
export const aTexCoordName = "a_texCoord";
export const aIsBgName = "a_isBg";
export const aTexIndexName = "a_texIndex";

const vertexSource =
	"attribute vec2 a_position;" +
	"attribute vec2 a_texCoord;" +
	"attribute float a_isBg;" +
	"attribute float a_texIndex;" +
	"varying vec2 v_texCoord;" +
	"varying float v_isBg;" +
	"varying float v_texIndex;" +
	"uniform mat3 u_projection;" +
	"uniform mat3 u_view;" +
	"uniform mat3 u_model;" +
	"uniform mat3 u_uvTransform;" +
	"void main() {" +
	"vec3 pos = u_projection * u_view * u_model * vec3(a_position, 1.0);" +
	"gl_Position = vec4(pos.xy, 0.0, 1.0);" +
	"if (a_texIndex > 0.5) {" +
	"    v_texCoord = (u_uvTransform * vec3(a_texCoord, 1.0)).xy;" +
	"} else {" +
	"    v_texCoord = a_texCoord;" +
	"}" +
	"v_isBg = a_isBg;" +
	"v_texIndex = a_texIndex;" +
	"}";

const fragmentSource =
	"precision mediump float;" +
	"varying vec2 v_texCoord;" +
	"varying float v_isBg;" +
	"varying float v_texIndex;" +
	"uniform sampler2D u_titleImage;" +
	"uniform sampler2D u_descImage;" +
	"uniform vec4 u_bgColor;" +
	"uniform vec4 u_textColor;" +
	"void main() {" +
	"if (v_isBg > 0.5) {" +
	"    gl_FragColor = u_bgColor;" +
	"} else {" +
	"    vec4 texColor;" +
	"    if (v_texIndex > 0.5) {" +
	"        texColor = texture2D(u_descImage, v_texCoord);" +
	"    } else {" +
	"        texColor = texture2D(u_titleImage, v_texCoord);" +
	"    }" +
	"    gl_FragColor = vec4(u_textColor.rgb, texColor.a * u_textColor.a);" +
	"}" +
	"}";

/** @type {CanvasEngineType.GlUniformLocationsFormat} */
export const uniformLocationsFormat = [
	{ type: GlDataTypeEnum.sampler2D, name: uTitleImageName },
	{ type: GlDataTypeEnum.sampler2D, name: uDescImageName },
	{ type: GlDataTypeEnum.mat3, name: uCameraProjectionName },
	{ type: GlDataTypeEnum.mat3, name: uCameraViewName },
	{ type: GlDataTypeEnum.mat3, name: uRenderNodeModelName },
	{ type: GlDataTypeEnum.mat3, name: uUvTransformName },
	{ type: GlDataTypeEnum.color, name: uBgColorName },
	{ type: GlDataTypeEnum.color, name: uTextColorName },
];

/** @type {CanvasEngineType.GlAttribLocationsFormat} */
export const attribLocationsFormat = [
	{ type: GlDataTypeEnum.vec2, name: aPositionName },
	{ type: GlDataTypeEnum.vec2, name: aTexCoordName },
	{ type: GlDataTypeEnum.float, name: aIsBgName },
	{ type: GlDataTypeEnum.float, name: aTexIndexName },
];

export const cardPanelGlProgramFormat = {
	vertexSource: vertexSource,
	fragmentSource: fragmentSource,
	uniformLocationsFormat: uniformLocationsFormat,
	attribLocationsFormat: attribLocationsFormat,
};
