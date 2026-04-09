import {
	GlBufferDataTypeEnum,
	GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum,
} from "../../../renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import { GlDataTypeEnum } from "../../../renderer/webgl_renderer/webgl_program/gl_program/gl_data_type.js";

export const vertex =
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

export const fragment =
	"precision mediump float;" +
	"varying vec2 v_texCoord;" +
	"uniform sampler2D u_image;" +
	"void main() {" +
	"gl_FragColor = texture2D(u_image, v_texCoord);" +
	"}";

const sprite2dCacheProgramKey = "Sprite2D";

const uImageName = "u_image";
const uProjectionName = "u_projection";
const uViewName = "u_view";
const uModelName = "u_model";

const aPositionName = "a_position";
const aTextureCoordName = "a_texCoord";

/** @type {CanvasEngineType.GlUniformLocationsFormat} */
export const uniformLocationsFormat = [
	{
		type: GlDataTypeEnum.sampler2D,
		name: uImageName,
		// isTexture: true,
	},
	{
		type: GlDataTypeEnum.mat4,
		name: uProjectionName,
		// isGlobal: true,
	},
	{
		type: GlDataTypeEnum.mat4,
		name: uViewName,
		// isGlobal: true,
	},
	{
		type: GlDataTypeEnum.mat4,
		name: uModelName,
		// isGlobal: true,
	},
];
/** @type {CanvasEngineType.GlAttribLocationsFormat} */
export const attribLocationsFormat = [
	{
		type: GlDataTypeEnum.vec2,
		name: aPositionName,
	},
	{
		type: GlDataTypeEnum.vec2,
		name: aTextureCoordName,
	},
];

/** @type {CanvasEngineType.WebGLPipe} */
export const Sprite2DWebGLPipe = {
	getProgramKey() {
		return sprite2dCacheProgramKey;
	},
	getShaderSource() {
		return {
			vertexSource: vertex,
			fragmentSource: fragment,
		};
	},
	getUniformLocationsFormat() {
		return uniformLocationsFormat;
	},
	getAttribLocationsFormat() {
		return attribLocationsFormat;
	},
	/**
	 * @param {CanvasEngineType.Sprite2D} sprite2d
	 * @returns {CanvasEngineType.GlAttribsFormat}
	 */
	getAttribsFormat(sprite2d) {
		return {
			arrtibsKey: `${sprite2d.texture.key}`,
			arrtibs: [
				{
					bufferKey: `${sprite2d.texture.key}`,
					attribName: aPositionName,
					size: 2,
					type: GlBufferDataTypeEnum.FLOAT,
					normalized: false,
					stride: 16, // 每个顶点5个float，每个float4字节，共20字节,
					offset: 0,
				},
				{
					bufferKey: `${sprite2d.texture.key}`,
					attribName: aTextureCoordName,
					size: 2,
					type: GlBufferDataTypeEnum.FLOAT,
					normalized: false,
					stride: 16, // 每个顶点5个float，每个float4字节，共20字节,
					offset: 8, // 跳过前2个浮点数(x,y)，每个浮点数4字节,
				},
			],
		};
	},
	/**
	 * @param {CanvasEngineType.Sprite2D} sprite2d
	 * @returns {CanvasEngineType.GlBuffersFormat}
	 */
	getBuffersFormat(sprite2d) {
		const width = sprite2d.width;
		const height = sprite2d.height;

		return [
			{
				key: `${sprite2d.texture.key}`,
				target: GlBufferTargetTypeEnum.ARRAY_BUFFER,
				usage: GlBufferUsageTypeEnum.STATIC_DRAW,
				data: new Float32Array([
					// 位置x,y, 纹理坐标u,v
					0,
					0,
					0,
					1, // 左下
					width,
					0,
					1,
					1, // 右下
					0,
					height,
					0,
					0, // 左上
					0,
					height,
					0.0,
					0.0, // 左上
					width,
					0,
					1,
					1, // 右下
					width,
					height,
					1,
					0, // 右上
				]),
			},
		];
	},
	/**
	 * @param {CanvasEngineType.Sprite2D} sprite2d
	 * @returns {Array<CanvasEngineType.GlTexture>}
	 */
	getTextures(sprite2d) {
		return [sprite2d.texture];
	},
	/**
	 * @param {CanvasEngineType.Sprite2D} sprite2d
	 * @returns {CanvasEngineType.GlUniformsFormat}
	 */
	getUniformsFormat(sprite2d) {
		return [
			{
				type: GlDataTypeEnum.sampler2D,
				data: sprite2d.texture.key,
			},
		];
	},
};
