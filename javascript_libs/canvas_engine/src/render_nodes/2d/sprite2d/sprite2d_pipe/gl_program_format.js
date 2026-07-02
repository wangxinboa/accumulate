import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
} from "../../../../renderers/webgl_renderer/shaders/global_uniform_names.js";
import { GlDataTypeEnum } from "../../../../renderers/webgl_renderer/webgl_program/gl_program/gl_data_type.js";

export const uImageName = "u_image";

export const aPositionName = "a_position";
export const aTextureCoordName = "a_texCoord";

const vertexSource =
	"attribute vec2 a_position;" +
	"attribute vec2 a_texCoord;" +
	"varying vec2 v_texCoord;" +
	"uniform mat3 u_projection;" +
	"uniform mat3 u_view;" +
	"uniform mat3 u_model;" +
	"void main() {" +
	// 按顺序变换：先模型，再视图，最后投影
	"vec3 pos = u_projection * u_view * u_model * vec3(a_position, 1.0);" +
	"gl_Position = vec4(pos.xy, 0.0, 1.0);" +
	"v_texCoord = a_texCoord;" +
	"}";

const fragmentSource =
	"precision mediump float;" +
	"varying vec2 v_texCoord;" +
	"uniform sampler2D u_image;" +
	"void main() {" +
	"gl_FragColor = texture2D(u_image, v_texCoord);" +
	"}";

/** @type {CanvasEngineType.GlUniformLocationsFormat} */
const uniformLocationsFormat = [
	{
		type: GlDataTypeEnum.sampler2D,
		name: uImageName,
	},
	{
		type: GlDataTypeEnum.mat3,
		name: uCameraProjectionName,
	},
	{
		type: GlDataTypeEnum.mat3,
		name: uCameraViewName,
	},
	{
		type: GlDataTypeEnum.mat3,
		name: uRenderNodeModelName,
	},
];
/** @type {CanvasEngineType.GlAttribLocationsFormat} */
const attribLocationsFormat = [
	{
		type: GlDataTypeEnum.vec2,
		name: aPositionName,
	},
	{
		type: GlDataTypeEnum.vec2,
		name: aTextureCoordName,
	},
];

export const sprite2DGlProgramFormat = {
	vertexSource,
	fragmentSource,
	uniformLocationsFormat,
	attribLocationsFormat,
};
