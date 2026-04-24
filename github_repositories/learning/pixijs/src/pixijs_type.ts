import { WebGPURenderer as WebGPURendererClass } from "./rendering/renderers/gpu/WebGPURenderer.mjs";
import { WebGLRenderer as WebGLRendererClass } from "./rendering/renderers/gl/WebGLRenderer.mjs";
import { AbstractRenderer as AbstractRendererClass } from "./rendering/renderers/shared/system/AbstractRenderer.mjs";
import { ViewSystem as ViewSystemClass } from "./rendering/renderers/shared/view/ViewSystem.mjs";
import { Container as ContainerClass } from "./scene/container/Container.mjs";
import { Sprite as SpriteClass } from "./scene/sprite/Sprite.mjs";
import { Text as TextClass } from "./scene/text/Text.mjs";
import { AbstractText as AbstractTextClass } from "./scene/text/AbstractText.mjs";
import { Texture as TextureClass } from "./rendering/renderers/shared/texture/Texture.mjs";
import { TextureSource as TextureSourceClass } from "./rendering/renderers/shared/texture/sources/TextureSource.mjs";
import { RenderTarget as RenderTargetClass } from "./rendering/renderers/shared/renderTarget/RenderTarget.mjs";
import { BackgroundSystem as BackgroundSystemClass } from "./rendering/renderers/shared/background/BackgroundSystem.mjs";
import { SystemRunner } from "./rendering/renderers/shared/system/SystemRunner.mjs";
import { GlobalUniformSystem as GlobalUniformSystemClass } from "./rendering/renderers/shared/renderTarget/GlobalUniformSystem.mjs";
import { GlContextSystem as GlContextSystemClass } from "./rendering/renderers/gl/context/GlContextSystem.mjs";
import { GlBufferSystem as GlBufferSystemClass } from "./rendering/renderers/gl/buffer/GlBufferSystem.mjs";
import { GlTextureSystem as GlTextureSystemClass } from "./rendering/renderers/gl/texture/GlTextureSystem.mjs";
import { GlRenderTargetSystem as GlRenderTargetSystemClass } from "./rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs";
import { GlRenderTargetAdaptor as GlRenderTargetAdaptorClass } from "./rendering/renderers/gl/renderTarget/GlRenderTargetAdaptor.mjs";
import { GlGeometrySystem as GlGeometrySystemClass } from "./rendering/renderers/gl/geometry/GlGeometrySystem.mjs";
import { GlUniformGroupSystem as GlUniformGroupSystemClass } from "./rendering/renderers/gl/shader/GlUniformGroupSystem.mjs";
import { GlShaderSystem as GlShaderSystemClass } from "./rendering/renderers/gl/shader/GlShaderSystem.mjs";
import { GlStateSystem as GlStateSystemClass } from "./rendering/renderers/gl/state/GlStateSystem.mjs";
import { RenderGroupSystem as RenderGroupSystemClass } from "./scene/container/RenderGroupSystem.mjs";
import { BlendModePipe as BlendModePipeClass } from "./rendering/renderers/shared/blendModes/BlendModePipe.mjs";
import { BatcherPipe as BatcherPipeClass } from "./rendering/batcher/shared/BatcherPipe.mjs";
import { GlBatchAdaptor as GlBatchAdaptorClass } from "./rendering/batcher/gl/GlBatchAdaptor.mjs";
import { SpritePipe as SpritePipeClass } from "./scene/sprite/SpritePipe.mjs";
import { CanvasTextPipe as CanvasTextPipeClass } from "./scene/text/canvas/CanvasTextPipe.mjs";
import { BatchableSprite as BatchableSpriteClass } from "./scene/sprite/BatchableSprite.mjs";
import { ColorMaskPipe as ColorMaskPipeClass } from "./rendering/mask/color/ColorMaskPipe.mjs";
import { RenderGroupPipe as RenderGroupPipeClass } from "./scene/container/RenderGroupPipe.mjs";
import { Color as ColorClass } from "./color/Color.mjs";
import { Point as PointClass } from "./maths/point/Point.mjs";
import { Matrix as MatrixClass } from "./maths/matrix/Matrix.mjs";
import { Rectangle as RectangleClass } from "./maths/shapes/Rectangle.mjs";
import { RenderGroup as RenderGroupClass } from "./scene/container/RenderGroup.mjs";
import { InstructionSet as InstructionSetClass } from "./rendering/renderers/shared/instructions/InstructionSet.mjs";
import { DefaultBatcher as DefaultBatcherClass } from "./rendering/batcher/shared/DefaultBatcher.mjs";
import { Batch as BatchClass, Batcher as BatcherClass } from "./rendering/batcher/shared/Batcher.mjs";
import { BatchTextureArray as BatchTextureArrayClass } from "./rendering/batcher/shared/BatchTextureArray.mjs";
import { ViewableBuffer as ViewableBufferClass } from "./utils/data/ViewableBuffer.mjs";
import { BatchGeometry as BatchGeometryClass } from "./rendering/batcher/shared/BatchGeometry.mjs";
import { Geometry as GeometryClass } from "./rendering/renderers/shared/geometry/Geometry.mjs";
import { Buffer as BufferClass } from "./rendering/renderers/shared/buffer/Buffer.mjs";
import { DefaultShader as DefaultShaderClass } from "./rendering/batcher/shared/DefaultShader.mjs";
import { Shader as ShaderClass } from "./rendering/renderers/shared/shader/Shader.mjs";
import { UniformGroup as UniformGroupClass } from "./rendering/renderers/shared/shader/UniformGroup.mjs";
import { BindGroup as BindGroupClass } from "./rendering/renderers/gpu/shader/BindGroup.mjs";

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
type VertexFormat =
	| "uint8x2"
	| "uint8x4"
	| "sint8x2"
	| "sint8x4"
	| "unorm8x2"
	| "unorm8x4"
	| "snorm8x2"
	| "snorm8x4"
	| "uint16x2"
	| "uint16x4"
	| "sint16x2"
	| "sint16x4"
	| "unorm16x2"
	| "unorm16x4"
	| "snorm16x2"
	| "snorm16x4"
	| "float16x2"
	| "float16x4"
	| "float32"
	| "float32x2"
	| "float32x3"
	| "float32x4"
	| "uint32"
	| "uint32x2"
	| "uint32x3"
	| "uint32x4"
	| "sint32"
	| "sint32x2"
	| "sint32x3"
	| "sint32x4";
type Topology = "point-list" | "line-list" | "line-strip" | "triangle-list" | "triangle-strip";

declare global {
	namespace PixijsType {
		// class
		type WebGPURenderer = WebGPURendererClass;
		type WebGLRenderer = WebGLRendererClass;
		type AbstractRenderer = InstanceType<typeof AbstractRendererClass>;
		type Renderer = WebGPURenderer | WebGLRenderer;
		type ViewSystem = InstanceType<typeof ViewSystemClass>;
		type BackgroundSystem = InstanceType<typeof BackgroundSystemClass>;
		type GlobalUniformSystem = GlobalUniformSystemClass;
		type GlContextSystem = GlContextSystemClass;
		type GlBufferSystem = GlBufferSystemClass;
		type GlTextureSystem = GlTextureSystemClass;
		type GlRenderTargetSystem = GlRenderTargetSystemClass;
		type GlRenderTargetAdaptor = GlRenderTargetAdaptorClass;
		type GlGeometrySystem = GlGeometrySystemClass;
		type GlUniformGroupSystem = GlUniformGroupSystemClass;
		type GlShaderSystem = GlShaderSystemClass;
		type GlStateSystem = InstanceType<typeof GlStateSystemClass>;
		type RenderGroupSystem = RenderGroupSystemClass;
		type DefaultBatcher = InstanceType<typeof DefaultBatcherClass>;
		type Batcher = InstanceType<typeof BatcherClass>;
		type BatchTextureArray = BatchTextureArrayClass;
		type Batch = BatchClass;
		type ViewableBuffer = ViewableBufferClass;
		type BatchGeometry = BatchGeometryClass;
		type Geometry = GeometryClass;
		type Buffer = BufferClass;
		type DefaultShader = DefaultShaderClass;
		type Shader = ShaderClass;
		type UniformGroup = InstanceType<typeof UniformGroupClass>;
		type BindGroup = BindGroupClass;
		type BlendModePipe = BlendModePipeClass;
		type BatcherPipe = InstanceType<typeof BatcherPipeClass>;
		type SpritePipe = SpritePipeClass;
		type CanvasTextPipe = CanvasTextPipeClass;
		type BatchableSprite = BatchableSpriteClass;
		type ColorMaskPipe = ColorMaskPipeClass;
		type RenderGroupPipe = RenderGroupPipeClass;
		type AllRenderPipe = BatcherPipe | SpritePipe | CanvasTextPipe | BatchableSprite | ColorMaskPipe | RenderGroupPipe;
		type GlBatchAdaptor = GlBatchAdaptorClass;
		type Container = ContainerClass;
		type RenderGroup = RenderGroupClass;
		type InstructionSet = InstructionSetClass;
		type Sprite = SpriteClass;
		type Text = TextClass;
		type gpuTextData = {
			texture: Texture | null;
			currentKey: string;
			batchableSprite: BatchableSprite;
		};
		type AbstractText = AbstractTextClass;
		type Texture = TextureClass;
		type TextureSource = InstanceType<typeof TextureSourceClass>;
		type AllContainer = Container | Sprite;
		type RenderTarget = InstanceType<typeof RenderTargetClass>;
		type Color = InstanceType<typeof ColorClass>;
		type Point = PointClass;
		type Matrix = MatrixClass;
		type Rectangle = RectangleClass;
		// Application
		type ApplicationOption =
			| {
					name: "webgl";
					type: 1;
					systems: [];
					renderPipes: [];
					renderPipeAdaptors: [];
			  }
			| {
					name: "webgpu";
					type: 2;
					systems: [];
					renderPipes: [];
					renderPipeAdaptors: [];
			  };
		type ApplicationInitOption = {} & AbstractRendererInitOption &
			BackgroundSystemInitOption &
			ViewSystemInitOption &
			GlContextSystemInitOption;
		type AbstractRendererInitOption = {
			skipExtensionImports?: boolean;
			manageImports?: boolean;
			roundPixels?: boolean;
		};
		type BackgroundSystemInitOption = {
			clearBeforeRender?: boolean;
			background?: string | number | Color;
			backgroundColor?: BackgroundSystemInitOption["background"];
			_backgroundColor?: BackgroundSystemInitOption["background"];
			backgroundAlpha?: number;
		};
		type ViewSystemInitOption = {
			view?: HTMLCanvasElement;
			canvas?: HTMLCanvasElement;
			antialias?: boolean;
			depth?: boolean;
			backgroundAlpha: number;
			resolution?: number;
			width?: number;
			height?: number;
		};
		type GlContextSystemInitOption = {
			multiView: boolean;
			context: WebGLRenderingContext | WebGL2RenderingContext;
			premultipliedAlpha: boolean;
			antialias: boolean;
			preferWebGLVersion: 1 | 2;
			preserveDrawingBuffer?: boolean;
			powerPreference?: WebGLPowerPreference;
		};
		type AbstractRendererRenderOption = {
			container: AllContainer;
			target?: RenderTarget;
			transform?: Matrix;
			clearColor?: [number, number, number, number];
			clear?: boolean;
		} & RenderTargetSystemRenderStartOption;
		type RenderTargetSystemRenderStartOption = {
			target?: RenderTarget;
			clearColor?: [number, number, number, number];
			clear?: boolean;
			frame?: Rectangle;
		};
		type WebGLRendererRunners = {
			init: { items: []; _name: "init" } & SystemRunner;
			destroy: { items: []; _name: "destroy" } & SystemRunner;
			// contextChange: { items: []; _name: "contextChange" };
			// resolutionChange: { items: []; _name: "resolutionChange" };
			// resetState: { items: []; _name: "resetState" };
			// renderEnd: { items: []; _name: "renderEnd" };
			// renderStart: { items: []; _name: "renderStart" };
			// render: { items: []; _name: "render" };
			// update: { items: []; _name: "update" };
			// postrender: { items: []; _name: "postrender" };
			prerender: { items: []; _name: "prerender" } & SystemRunner;
		};
		type WebGLRendererRenderPipes = {
			blendMode: BlendModePipe;
			batch: BatcherPipe;
			sprite: SpritePipe;
			colorMask: ColorMaskPipe;
			text: CanvasTextPipe;
			renderGroup: RenderGroupPipe;
		};
		type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;
		type AbstractRendererRunners = WebGLRendererRunners;
		type GlobalUniformSystemStartOption = { worldTransformMatrix: Matrix; worldColor: number };
		type GlobalUniformSystemCurrentGlobalUniformData = {
			projectionMatrix: Matrix;
			resolution: Float32Array<ArrayBuffer>;
			worldTransformMatrix: Matrix;
			worldColor: number;
			offset: Point;
			bindGroup: BindGroup;
		};
		type BatcherInitOption = {
			maxTextures?: number;
			attributesInitialSize?: number;
			indicesInitialSize?: number;
		};
		type GeometryAttribute = {
			buffer: PixijsType.Buffer;
			format?: VertexFormat;
			stride?: number;
			offset?: number;
			instance?: boolean;
			size?: number;
			start?: number;
			divisor?: number;
		};
		type GeometryInitOption = {
			label?: string;
			attributes?: Record<string, GeometryAttribute>;
			indexBuffer?: Buffer | TypedArray | number[];
			topology?: Topology;
			instanceCount?: number;
		};
		type BufferInitOption = {
			data?: TypedArray | number[];
			size?: number;
			usage: number;
			label?: string;
			shrinkToFit?: boolean;
		};
		type ShaderInitOption = {
			groups?: Record<string, BindGroup>;
			resources?: Record<string, UniformGroup>;
		};
	}
}

export { PixijsType };
