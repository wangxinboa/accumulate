import { BaseTask as BaseTaskClass } from "./loader/task/base_task.js";
import { ImageTask as ImageTaskClass } from "./loader/task/image_task.js";
import { Color as ColorClass } from "./math/color.js";
import { Matrix3 as Matrix3Class } from "./math/matrix3.js";
import { Matrix4 as Matrix4Class } from "./math/matrix4.js";
import { Vector2 as Vector2Class } from "./math/vector2.js";
import { Vector3 as Vector3Class } from "./math/vector3.js";
import { CanvasRenderer as CanvasRendererClass } from "./renderer/canvas_renderer/canvas_renderer.js";
import { WebGL2DRenderer as WebGL2DRendererClass } from "./renderer/webgl_renderer/webgl_2d_renderer.js";
import { WebGLProgramSystem as WebGLProgramSystemClass } from "./renderer/webgl_renderer/webgl_program/webgl_program_system.js";
import { WebGLBufferSystem as WebGLBufferSystemClass } from "./renderer/webgl_renderer/webgl_buffer/webgl_buffer_system.js";
import { WebGLUniformSystem as WebGLUniformSystemClass } from "./renderer/webgl_renderer/webgl_uniform/webgl_uniform_system.js";
import { GlProgram as GlProgramClass } from "./renderer/webgl_renderer/webgl_program/gl_program/gl_program.js";
import { UniformLocation as UniformLocationClass } from "./renderer/webgl_renderer/webgl_program/gl_program/gl_location/uniform_location.js";
import { AttribLocation as AttribLocationClass } from "./renderer/webgl_renderer/webgl_program/gl_program/gl_location/attrib_location.js";
import { GlDataTypeEnum as _GlDataTypeEnum } from "./renderer/webgl_renderer/webgl_program/gl_program/gl_data_type.js";
import { GlBuffer as GlBufferClass } from "./renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer.js";
import { GlAttribs as GlAttribsClass } from "./renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attribs.js";
import { GlAttrib as GlAttribClass } from "./renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_attrib.js";
import { Camera2D as Camera2DClass } from "./camera/camera2d.js";
import { RenderNode as RenderNodeClass } from "./render_node/render_node.js";
import { Sprite2D as Sprite2DClass } from "./render_node/2d/sprite2d/sprite2d.js";
import { GlTexture as GlTextureClass } from "./renderer/webgl_renderer/webgl_texture/gl_texture.js";
import {
	GlBufferTargetTypeEnum as _GlBufferTargetTypeEnum,
	GlBufferUsageTypeEnum as _GlBufferUsageTypeEnum,
	GlBufferDataTypeEnum as _GlBufferDataTypeEnum,
} from "./renderer/webgl_renderer/webgl_buffer/gl_attribs/gl_buffer_type.js";
import {
	GlTextureTargetTypeEnum as _GlTextureTargetTypeEnum,
	GlTexturePnameTypeEnum as _GlTexturePnameTypeEnum,
	GlTextureParamTypeEnum as _GlTextureParamTypeEnum,
} from "./renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

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
		type CanvasDomOnResize = (width: number, height: number) => void;
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
		/** CanvasEngine 初始化配置 */
		type CanvasEngineOption = TimeTickerOption & RendererOption;
		/** Canvas2DEngine 初始化配置 */
		type Canvas2DEngineOption = {
			rendererType: "webgl" | "canvas";
		} & CanvasEngineOption;
		type WebGLContext = WebGL2RenderingContext;
		/** gl pipe */
		type WebGLPipe = {
			getProgramKey: (renderNode?: AllRenderNode) => string;
			getShaderSource: (renderNode?: AllRenderNode) => GlProgramFormat;
			getUniformLocationsFormat: (renderNode?: AllRenderNode) => GlLocationsFormat;
			getAttribLocationsFormat: (renderNode?: AllRenderNode) => GlLocationsFormat;
			getAttribsFormat: (renderNode: AllRenderNode) => GlAttribsFormat;
			getBuffersFormat: (renderNode: AllRenderNode) => GlBuffersFormat;
			getTextures: (renderNode: AllRenderNode) => Array<GlTexture>;
			getUniformsFormat: (renderNode: AllRenderNode) => GlUniformsFormat;
		};
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
		};
		/** gl location */
		type GlDataTypeEnum = keyof typeof _GlDataTypeEnum;
		type GlLocationFormat = { name: string; type: GlDataTypeEnum };
		type GlLocationsFormat = Array<GlLocationFormat>;

		type GlUniformLocationFormat = GlLocationFormat & { isTexture?: boolean; isGlobal?: boolean };
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
		type GlAttribsFormat = { arrtibsKey: string; arrtibs: Array<GlAttribFormat> };
		/** gl texture */
		type GlTextureTargetTypeEnum = keyof typeof _GlTextureTargetTypeEnum;
		type GlTexturePnameTypeEnum = keyof typeof _GlTexturePnameTypeEnum;
		type GlTextureParamTypeEnum = keyof typeof _GlTextureParamTypeEnum;
		/** gl uniform */
		type GlUniformFormat = {};
		type GlUniformsFormat = Array<GlUniformFormat>;

		type GlUniformValue = GlTexture | Matrix3 | Matrix4;

		// class
		type WebGL2DRenderer = WebGL2DRendererClass;
		type WebGLRenderer = WebGL2DRenderer;
		type CanvasRenderer = CanvasRendererClass;
		type WebGLProgramSystem = WebGLProgramSystemClass;
		type WebGLBufferSystem = WebGLBufferSystemClass;
		type WebGLUniformSystem = WebGLUniformSystemClass;
		type GlProgram = GlProgramClass;
		type UniformLocation = UniformLocationClass;
		type AttribLocation = AttribLocationClass;
		type GlBuffer = GlBufferClass;
		type GlAttribs = GlAttribsClass;
		type GlAttrib = GlAttribClass;
		type BaseTask = BaseTaskClass;
		type ImageTask = ImageTaskClass;
		type AllTaskType = BaseTaskClass | ImageTask;
		type TaskCallback = (task: AllTaskType) => void;
		type Color = ColorClass;
		type Matrix3 = Matrix3Class;
		type Matrix4 = Matrix4Class;
		type Vector2 = Vector2Class;
		type Vector3 = Vector3Class;
		type TimeTickerCallback = (timestamp: number) => void;
		type Camera2D = Camera2DClass;
		type RenderNode = RenderNodeClass;
		type Sprite2D = Sprite2DClass;
		type AllRenderNode = Sprite2D;
		type GlTexture = GlTextureClass;
	}
}

export { CanvasEngineType };
