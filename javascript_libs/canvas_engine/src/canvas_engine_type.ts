import { Geometry2DDef as Geometry2DDefClass } from "./math/geometry_2d_defs/geometry_2d_def.js";
import { Rectangle as RectangleClass } from "./math/geometry_2d_defs/rectangle.js";
import { Color as ColorClass } from "./math/color.js";
import { Matrix3 as Matrix3Class } from "./math/matrix3.js";
import { Matrix4 as Matrix4Class } from "./math/matrix4.js";
import { Vector2 as Vector2Class } from "./math/vector2.js";
import { Vector3 as Vector3Class } from "./math/vector3.js";
import { BaseRenderer as BaseRendererClass } from "./renderers/base_renderer.js";
import { CanvasRenderer as CanvasRendererClass } from "./renderers/canvas_renderer/canvas_renderer.js";
import { WebGL2DRenderer as WebGL2DRendererClass } from "./renderers/webgl_renderer/webgl_2d_renderer.js";
import { WebGLProgramSystem as WebGLProgramSystemClass } from "./renderers/webgl_renderer/webgl_program/webgl_program_system.js";
import { WebGLBufferSystem as WebGLBufferSystemClass } from "./renderers/webgl_renderer/webgl_buffer/webgl_buffer_system.js";
import { WebGLTextureSystem as WebGLTextureSystemClass } from "./renderers/webgl_renderer/webgl_texture/webgl_texture_system.js";
import { GlProgram as GlProgramClass } from "./renderers/webgl_renderer/webgl_program/gl_program/gl_program.js";
import { UniformLocation as UniformLocationClass } from "./renderers/webgl_renderer/webgl_program/gl_program/gl_location/uniform_location.js";
import { AttribLocation as AttribLocationClass } from "./renderers/webgl_renderer/webgl_program/gl_program/gl_location/attrib_location.js";
import { GlDataTypeEnum as _GlDataTypeEnum } from "./renderers/webgl_renderer/webgl_program/gl_program/gl_data_type.js";
import { GlBuffer as GlBufferClass } from "./renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { GlAttribs as GlAttribsClass } from "./renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlAttrib as GlAttribClass } from "./renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_attrib.js";
import { Camera2D as Camera2DClass } from "./cameras/camera2d.js";
import { RenderNode as RenderNodeClass } from "./render_nodes/render_node.js";
import { RenderEventNode as RenderEventNodeClass } from "./render_nodes/render_event_node.js";
import { Render2DNode as Render2DNodeClass } from "./render_nodes/2d/render_2d_node.js";
import { Scene2D as Scene2DClass } from "./render_nodes/2d/scene2d.js";
import { Sprite2D as Sprite2DClass } from "./render_nodes/2d/sprite2d/sprite2d.js";
import { BaseTexture as BaseTextureClass } from "./textures/base_texture.js";
import { ImageTexture as ImageTextureClass } from "./textures/image_texture.js";
import { TextTexture as TextTextureClass } from "./textures/text_texture.js";
import { GlTexture as GlTextureClass } from "./renderers/webgl_renderer/webgl_texture/gl_texture.js";
import {
	GlBufferTargetTypeEnum as _GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum as _GlBufferUsageTypeEnum,
	GlBufferDataTypeEnum as _GlBufferDataTypeEnum,
	GetTextureBufferTypeEnum as _GetTextureBufferTypeEnum,
} from "./renderers/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	GlTextureTargetTypeEnum as _GlTextureTargetTypeEnum,
	GlTexturePnameTypeEnum as _GlTexturePnameTypeEnum,
	GlTextureParamTypeEnum as _GlTextureParamTypeEnum,
	GlTextureImageUnitEnum as _GlTextureImageUnitEnum,
} from "./renderers/webgl_renderer/webgl_texture/gl_texture_type.js";

declare global {
	namespace CanvasEngineType {
		// option
		/** BackgroundSystem 初始化配置 */
		type BackgroundOption = {
			backgroundAlpha?: number;
			backgroundColor?: number;
		};
		/** CanvasDomSystem 初始化配置 */
		type CanvasDomOption = {
			container?: Element;
			canvas?: HTMLCanvasElement;
			devicePixelRatio?: number;
		};
		type CanvasDomResizeCallback = (width: number, height: number) => void;
		type CanvasDomResizeCallbacks = Array<CanvasDomResizeCallback>;
		/** WebGL context 初始化配置, 同 WebGLContextAttributes */
		type WebGLContextOption = {
			alpha?: boolean;
			antialias?: boolean;
			depth?: boolean;
			desynchronized?: boolean;
			failIfMajorPerformanceCaveat?: boolean;
			powerPreference?: WebGLPowerPreference;
			premultipliedAlpha?: boolean;
			preserveDrawingBuffer?: boolean;
			stencil?: boolean;
		} & WebGLContextAttributes;
		/** renderer 初始化配置 */
		type RendererOption = CanvasDomOption & BackgroundOption & WebGLContextOption;
		/** TimeTickerSystem 初始化配置 */
		type TimeTickerOption = {
			autoStart?: boolean;
			waitLoadingCompleteStart?: boolean;
		};
		type TimeTickerCallback = (timestamp: number) => void;
		type TimeTickerCallbacks = Array<TimeTickerCallback>;
		/** CanvasEngine 初始化配置 */
		type CanvasEngineOption = TimeTickerOption & RendererOption;
		/** Canvas2DEngine 初始化配置 */
		type Canvas2DEngineOption = {
			rendererType: "webgl" | "canvas";
		} & CanvasEngineOption;
		type WebGLContext = WebGL2RenderingContext;

		type TypedArray =
			| Int8Array
			| Uint8Array
			| Int16Array
			| Uint16Array
			| Int32Array
			| Uint32Array
			| Uint8ClampedArray
			| Float32Array
			| Float64Array;
		/** gl program */
		type GlProgramFormat = {
			vertexSource: string;
			fragmentSource: string;
			uniformLocationsFormat: GlUniformLocationsFormat;
			attribLocationsFormat: GlAttribLocationsFormat;
		};
		/** gl location */
		type GlDataTypeEnum = keyof typeof _GlDataTypeEnum;
		type GlLocationFormat = { name: string; type: GlDataTypeEnum };
		type GlLocationsFormat = Array<GlLocationFormat>;

		type GlUniformLocationFormat = GlLocationFormat;
		type GlUniformLocationsFormat = Array<GlUniformLocationFormat>;

		type GlAttribLocationFormat = GlLocationFormat;
		type GlAttribLocationsFormat = Array<GlAttribLocationFormat>;

		/** gl buffer */
		type GlBufferTargetTypeEnum = keyof typeof _GlBufferTargetTypeEnum;
		type GlBufferUsageTypeEnum = keyof typeof _GlBufferUsageTypeEnum;
		type GlBufferFormat = {
			key: string;
			target: GlBufferTargetTypeEnum;
			data: Float32Array;
			usage: GlBufferUsageTypeEnum;
		};
		type GlBufferDataTypeEnum = keyof typeof _GlBufferDataTypeEnum;
		type GetTextureBufferTypeEnum = keyof typeof _GetTextureBufferTypeEnum;
		type GlBuffersFormat = Array<GlBufferFormat>;
		type GlAttribFormat = {
			bufferKey: string;
			attribName: string;
			size: number;
			type: GlBufferDataTypeEnum;
			normalized: boolean;
			stride: number;
			offset: number;
		};
		type GlAttribsFormat = { attribsKey: string; arrtibs: Array<GlAttribFormat> };
		/** gl texture */
		type TextureUnitName =
			| "TEXTURE0"
			| "TEXTURE1"
			| "TEXTURE2"
			| "TEXTURE3"
			| "TEXTURE4"
			| "TEXTURE5"
			| "TEXTURE6"
			| "TEXTURE7"
			| "TEXTURE8"
			| "TEXTURE9"
			| "TEXTURE10"
			| "TEXTURE11"
			| "TEXTURE12"
			| "TEXTURE13"
			| "TEXTURE14"
			| "TEXTURE15"
			| "TEXTURE16"
			| "TEXTURE17"
			| "TEXTURE18"
			| "TEXTURE19"
			| "TEXTURE20"
			| "TEXTURE21"
			| "TEXTURE22"
			| "TEXTURE23"
			| "TEXTURE24"
			| "TEXTURE25"
			| "TEXTURE26"
			| "TEXTURE27"
			| "TEXTURE28"
			| "TEXTURE29"
			| "TEXTURE30"
			| "TEXTURE31";
		type GlTextureTargetTypeEnum = keyof typeof _GlTextureTargetTypeEnum;
		type GlTexturePnameTypeEnum = keyof typeof _GlTexturePnameTypeEnum;
		type GlTextureParamTypeEnum = keyof typeof _GlTextureParamTypeEnum;
		type GlTextureImageUnitEnum = keyof typeof _GlTextureImageUnitEnum;
		/** gl uniform */
		type GlUniformFormat = {};
		type GlUniformsFormat = Array<GlUniformFormat>;

		type GlUniformValue = GlTexture | Matrix3 | Matrix4 | number;

		// class
		type BaseRenderer = BaseRendererClass;
		type WebGL2DRenderer = WebGL2DRendererClass;
		type WebGLRenderer = WebGL2DRenderer;
		type CanvasRenderer = CanvasRendererClass;
		type WebGLProgramSystem = WebGLProgramSystemClass;
		type WebGLBufferSystem = WebGLBufferSystemClass;
		type WebGLTextureSystem = WebGLTextureSystemClass;
		type GlProgram = GlProgramClass;
		type UniformLocation = UniformLocationClass;
		type AttribLocation = AttribLocationClass;
		type GlBuffer = GlBufferClass;
		type GlAttribs = GlAttribsClass;
		type GlAttrib = GlAttribClass;
		type Geometry2DDef = Geometry2DDefClass;
		type Rectangle = RectangleClass;
		type Color = ColorClass;
		type Matrix3 = Matrix3Class;
		type Matrix4 = Matrix4Class;
		type Vector2 = Vector2Class;
		type Vector3 = Vector3Class;
		type BaseTexture = BaseTextureClass;
		type ImageTexture = ImageTextureClass;
		type TextTexture = TextTextureClass;
		type GlTexture = GlTextureClass;
		type Camera2D = Camera2DClass;
		type RenderNode = RenderNodeClass;
		type RenderEventNode = RenderEventNodeClass;
		type Render2DNode = Render2DNodeClass;
		type Scene2D = Scene2DClass;
		type Sprite2D = Sprite2DClass;
		type Sprite2DTexture = ImageTexture | TextTexture;
		type AllRenderNode = Sprite2D;
		/**
		 * 渲染管道对象接口，为渲染节点提供 WebGL 渲染相关的方法。
		 * 所有方法第一个参数均为具体的渲染节点实例。
		 */
		interface RenderPipe<TNode extends Render2DNode = Render2DNode> {
			/**
			 * 获取当前节点所使用的着色器程序
			 * @param node 当前节点
			 * @param programSystem WebGL 程序系统
			 */
			getGlProgram(node: TNode, programSystem: WebGLProgramSystem): GlProgram;

			/**
			 * 更新顶点属性配置
			 * @param node 当前节点
			 * @param bufferSystem WebGL 缓冲系统
			 */
			updateAttribs(node: TNode, bufferSystem: WebGLBufferSystem): GlAttribs | undefined;

			/**
			 * 更新顶点缓冲区数据
			 * @param node 当前节点
			 * @param gl WebGL 上下文
			 * @param bufferSystem WebGL 缓冲系统
			 */
			updateBuffers(node: TNode, gl: WebGLContext, bufferSystem: WebGLBufferSystem): void;

			/**
			 * 更新纹理
			 * @param node 当前节点
			 * @param textureSystem WebGL 纹理系统
			 */
			updateTextures(node: TNode, textureSystem: WebGLTextureSystem): void;

			/**
			 * 设置 Uniform 变量（包括纹理绑定）
			 * @param node 当前节点
			 * @param gl WebGL 上下文
			 * @param textureSystem WebGL 纹理系统
			 * @param glProgram 当前使用的着色器程序
			 */
			uniform(node: TNode, gl: WebGLContext, textureSystem: WebGLTextureSystem, glProgram: GlProgram): void;

			/**
			 * 执行绘制命令
			 * @param node 当前节点
			 * @param gl WebGL 上下文
			 * @param glProgram 当前使用的着色器程序
			 */
			drawArrays(node: TNode, gl: WebGLContext, glProgram: GlProgram): void;
		}
		type RenderEventNodeCallback<T extends RenderEventNode> = (
			renderEventNode: T,
			x: number,
			y: number,
			sx: number,
			sy: number,
		) => void;
		type RenderEventNodeCallbacks<T extends RenderEventNode = RenderEventNode> = Array<RenderEventNodeCallback<T>>;
		type RenderNodeWheelEventCallback<T extends RenderEventNode> = (
			renderEventNode: T,
			dx: number,
			dy: number,
			dz: number,
			x: number,
			y: number,
			sx: number,
			sy: number,
		) => void;
		type RenderNodeWheelEventCallbacks<T extends RenderEventNode = RenderEventNode> = Array<
			RenderNodeWheelEventCallback<T>
		>;
		type TextureRectChangeCallback = (width: number, height: number) => void;
		type TextureRectChangeCallbacks = Array<TextureRectChangeCallback>;
		type BaseTextureImage2D = HTMLImageElement | ImageData;

		type TextOption = {
			fontStyle?: string;
			fontVariant?: string;
			fontSize?: number;
			fontWeight?: string;
			fontFamily?: string;
		};
	}
}

export { CanvasEngineType };
