import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
} from "../../../../renderer/webgl_renderer/shaders/global_uniform_names.js";
import { GlDataTypeEnum } from "../../../../renderer/webgl_renderer/webgl_program/gl_program/gl_data_type.js";

export const uImageName = "u_image";

export const aPositionName = "a_position";
export const aTextureCoordName = "a_texCoord";

const vertexSource =
	"attribute vec2 a_position;" +
	"attribute vec2 a_texCoord;" +
	"varying vec2 v_texCoord;" +
	// 添加矩阵uniforms
	"uniform mat4 u_projection;" +
	"uniform mat4 u_view;" +
	"uniform mat4 u_model;" +
	"void main() {" +
	// 应用矩阵变换：投影 * 视图 * 模型
	"gl_Position = u_projection * u_view * u_model * vec4(a_position, 0.0, 1.0);" +
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
		type: GlDataTypeEnum.mat4,
		name: uCameraProjectionName,
	},
	{
		type: GlDataTypeEnum.mat4,
		name: uCameraViewName,
	},
	{
		type: GlDataTypeEnum.mat4,
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
