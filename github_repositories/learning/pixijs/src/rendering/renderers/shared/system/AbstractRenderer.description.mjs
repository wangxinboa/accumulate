import { Color } from "../../../../color/Color.mjs";
import { loadEnvironmentExtensions } from "../../../../environment/autoDetectEnvironment.mjs";
import { Container } from "../../../../scene/container/Container.mjs";
import { unsafeEvalSupported } from "../../../../utils/browser/unsafeEvalSupported.mjs";
import { deprecation, v8_0_0 } from "../../../../utils/logging/deprecation.mjs";
import "../../../../utils/utils.mjs";
import { CLEAR } from "../../gl/const.mjs";
import { SystemRunner } from "./SystemRunner.mjs";
import EventEmitter from "eventemitter3";

import "../../../../app/init.mjs";

import { GlContextSystem } from "../../gl/context/GlContextSystem.mjs";
import { GlGeometrySystem } from "../../gl/geometry/GlGeometrySystem.mjs";
import { GlBackBufferSystem } from "../../gl/GlBackBufferSystem.mjs";
import { GlColorMaskSystem } from "../../gl/GlColorMaskSystem.mjs";
import { GlEncoderSystem } from "../../gl/GlEncoderSystem.mjs";
import { GlStencilSystem } from "../../gl/GlStencilSystem.mjs";
import { GlUboSystem } from "../../gl/GlUboSystem.mjs";
import { GlRenderTargetSystem } from "../../gl/renderTarget/GlRenderTargetSystem.mjs";
import { GlShaderSystem } from "../../gl/shader/GlShaderSystem.mjs";
import { GlUniformGroupSystem } from "../../gl/shader/GlUniformGroupSystem.mjs";
import { GlStateSystem } from "../../gl/state/GlStateSystem.mjs";
import { GlTextureSystem } from "../../gl/texture/GlTextureSystem.mjs";
import { BackgroundSystem } from "../background/BackgroundSystem.mjs";
import { ExtractSystem } from "../extract/ExtractSystem.mjs";
import { GenerateTextureSystem } from "../extract/GenerateTextureSystem.mjs";
import { GlobalUniformSystem } from "../renderTarget/GlobalUniformSystem.mjs";
import { SchedulerSystem } from "../SchedulerSystem.mjs";
import { HelloSystem } from "../startup/HelloSystem.mjs";
import { RenderableGCSystem } from "../texture/RenderableGCSystem.mjs";
import { TextureGCSystem } from "../texture/TextureGCSystem.mjs";
import { ViewSystem } from "../view/ViewSystem.mjs";
import { RenderGroupSystem } from "../../../../scene/container/RenderGroupSystem.mjs";
import { CanvasTextSystem } from "../../../../scene/text/canvas/CanvasTextSystem.mjs";
import { RendererInitHook } from "../../../../utils/global/globalHooks.mjs";
import { GlBufferSystem } from "../../gl/buffer/GlBufferSystem.mjs";

import { BlendModePipe } from "../blendModes/BlendModePipe.mjs";
import { BatcherPipe } from "../../../batcher/shared/BatcherPipe.mjs";
import { SpritePipe } from "../../../../scene/sprite/SpritePipe.mjs";
import { RenderGroupPipe } from "../../../../scene/container/RenderGroupPipe.mjs";
import { AlphaMaskPipe } from "../../../mask/alpha/AlphaMaskPipe.mjs";
import { StencilMaskPipe } from "../../../mask/stencil/StencilMaskPipe.mjs";
import { ColorMaskPipe } from "../../../mask/color/ColorMaskPipe.mjs";
import { CustomRenderPipe } from "../../../../scene/container/CustomRenderPipe.mjs";
import { DOMPipe } from "../../../../dom/DOMPipe.mjs";
import { CanvasTextPipe } from "../../../../scene/text/canvas/CanvasTextPipe.mjs";

import { GlBatchAdaptor } from "../../../batcher/gl/GlBatchAdaptor.mjs";

("use strict");
const defaultRunners = [
	"init",
	"destroy",
	"contextChange",
	"resolutionChange",
	"resetState",
	"renderEnd",
	"renderStart",
	"render",
	"update",
	"postrender",
	"prerender",
];
const _AbstractRenderer = class _AbstractRenderer extends EventEmitter {
	/** @type {PixijsType.AbstractRendererRunners} */
	runners;
	/** @type {PixijsType.ViewSystem} */
	view;
	/** @type {PixijsType.BackgroundSystem} */
	background;
	/** @type {PixijsType.GlobalUniformSystem} */
	globalUniforms;
	/** @type {PixijsType.GlContextSystem} */
	context;
	/** @type {PixijsType.GlBufferSystem} */
	buffer;
	/** @type {PixijsType.GlTextureSystem} */
	texture;
	/** @type {PixijsType.GlRenderTargetSystem} */
	renderTarget;
	/** @type {PixijsType.GlGeometrySystem} */
	geometry;
	/** @type {PixijsType.GlUniformGroupSystem} */
	uniformGroup;
	/** @type {PixijsType.GlShaderSystem} */
	shader;
	/** @type {PixijsType.GlStateSystem} */
	state;
	/** @type {PixijsType.RenderGroupSystem} */
	renderGroup;
	/** @type {PixijsType.WebGLRendererRenderPipes} */
	renderPipes;
	/** @type {WebGLRenderingContext | WebGL2RenderingContext} */
	gl;

	/**
	 * Set up a system with a collection of SystemClasses and runners.
	 * Systems are attached dynamically to this class when added.
	 * @param {PixijsType.ApplicationOption} config - the config for the system manager
	 */
	constructor(config) {
		super();
		this.runners = /* @__PURE__ */ Object.create(null);
		this.renderPipes = /* @__PURE__ */ Object.create(null);
		this._initOptions = {};
		this._systemsHash = /* @__PURE__ */ Object.create(null);
		this.type = config.type;
		this.name = config.name;
		this.config = config;
		const combinedRunners = [...defaultRunners, ...(this.config.runners ?? [])];
		this._addRunners(...combinedRunners);
		this._unsafeEvalCheck();
	}
	/**
	 * Initialize the renderer.
	 * @param {PixijsType.AbstractRendererInitOption} options - The options to use to create the renderer.
	 */
	async init(options = {}) {
		this.backBuffer = new GlBackBufferSystem(this);
		this.background = new BackgroundSystem();
		this.view = new ViewSystem();
		this.renderableGC = new RenderableGCSystem(this);
		this.scheduler = new SchedulerSystem();
		this.globalUniforms = new GlobalUniformSystem(this);
		this.renderGroup = new RenderGroupSystem(this);
		this.textureGC = new TextureGCSystem(this);
		this.textureGenerator = new GenerateTextureSystem(this);
		this.extract = new ExtractSystem(this);
		this.ubo = new GlUboSystem();
		this.context = new GlContextSystem(this);
		this.buffer = new GlBufferSystem(this);
		this.texture = new GlTextureSystem(this);
		this.renderTarget = new GlRenderTargetSystem(this);
		this.geometry = new GlGeometrySystem(this);
		this.uniformGroup = new GlUniformGroupSystem(this);
		this.shader = new GlShaderSystem(this);
		this.encoder = new GlEncoderSystem(this);
		this.state = new GlStateSystem(this);
		this.stencil = new GlStencilSystem(this);
		this.colorMask = new GlColorMaskSystem(this);
		this.canvasText = new CanvasTextSystem(this);
		this.hello = new HelloSystem(this);
		this.initHook = new RendererInitHook(this);

		this.renderPipes.blendMode = new BlendModePipe(this);
		this.renderPipes.batch = new BatcherPipe(this, new GlBatchAdaptor());
		this.renderPipes.sprite = new SpritePipe(this);
		this.renderPipes.renderGroup = new RenderGroupPipe(this);
		this.renderPipes.alphaMask = new AlphaMaskPipe(this);
		this.renderPipes.stencilMask = new StencilMaskPipe(this);
		this.renderPipes.colorMask = new ColorMaskPipe(this);
		this.renderPipes.customRender = new CustomRenderPipe();
		this.renderPipes.dom = new DOMPipe(this);
		this.renderPipes.text = new CanvasTextPipe(this);

		for (const systemName in this._systemsHash) {
			const system = this._systemsHash[systemName];
			const defaultSystemOptions = system.constructor.defaultOptions;
			options = { ...defaultSystemOptions, ...options };
		}
		options = { ..._AbstractRenderer.defaultOptions, ...options };
		this._roundPixels = options.roundPixels ? 1 : 0;

		await this.backBuffer.init(options);
		await this.background.init(options);
		await this.view.init(options);
		await this.renderableGC.init(options);
		await this.scheduler.init(options);
		await this.textureGC.init(options);
		await this.context.init(options);
		await this.hello.init(options);
		await this.initHook.init(options);

		this._initOptions = options;
	}
	/**
	 * @param {PixijsType.AbstractRendererRenderOption} args
	 */
	render(args, deprecated) {
		let options = args;
		if (options instanceof Container) {
			options = { container: options };
			if (deprecated) {
				deprecation(v8_0_0, "passing a second argument is deprecated, please use render options instead");
				options.target = deprecated.renderTexture;
			}
		}
		options.target || (options.target = this.view.renderTarget);
		if (options.target === this.view.renderTarget) {
			this._lastObjectRendered = options.container;
			options.clearColor ?? (options.clearColor = this.background.colorRgba);
			options.clear ?? (options.clear = this.background.clearBeforeRender);
		}
		if (options.clearColor) {
			const isRGBAArray = Array.isArray(options.clearColor) && options.clearColor.length === 4;
			options.clearColor = isRGBAArray ? options.clearColor : Color.shared.setValue(options.clearColor).toArray();
		}
		if (!options.transform) {
			options.container.updateLocalTransform();
			options.transform = options.container.localTransform;
		}
		options.container.enableRenderGroup();

		this.renderTarget.renderStart(options);
		this.renderGroup.render(options);
	}
	/**
	 * Resizes the WebGL view to the specified width and height.
	 * @param desiredScreenWidth - The desired width of the screen.
	 * @param desiredScreenHeight - The desired height of the screen.
	 * @param resolution - The resolution / device pixel ratio of the renderer.
	 */
	resize(desiredScreenWidth, desiredScreenHeight, resolution) {
		const previousResolution = this.view.resolution;
		this.view.resize(desiredScreenWidth, desiredScreenHeight, resolution);
		this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution);
		if (resolution !== void 0 && resolution !== previousResolution) {
			this.runners.resolutionChange.emit(resolution);
		}
	}
	clear(options = {}) {
		const renderer = this;
		options.target || (options.target = renderer.renderTarget.renderTarget);
		options.clearColor || (options.clearColor = this.background.colorRgba);
		options.clear ?? (options.clear = CLEAR.ALL);
		const { clear, clearColor, target } = options;
		Color.shared.setValue(clearColor ?? this.background.colorRgba);
		renderer.renderTarget.clear(target, clear, Color.shared.toArray());
	}
	/** The resolution / device pixel ratio of the renderer. */
	get resolution() {
		return this.view.resolution;
	}
	set resolution(value) {
		this.view.resolution = value;
		this.runners.resolutionChange.emit(value);
	}
	/**
	 * Same as view.width, actual number of pixels in the canvas by horizontal.
	 * @member {number}
	 * @readonly
	 * @default 800
	 */
	get width() {
		return this.view.texture.frame.width;
	}
	/**
	 * Same as view.height, actual number of pixels in the canvas by vertical.
	 * @default 600
	 */
	get height() {
		return this.view.texture.frame.height;
	}
	// NOTE: this was `view` in v7
	/**
	 * The canvas element that everything is drawn to.
	 * @type {environment.ICanvas}
	 */
	get canvas() {
		return this.view.canvas;
	}
	/**
	 * the last object rendered by the renderer. Useful for other plugins like interaction managers
	 * @readonly
	 */
	get lastObjectRendered() {
		return this._lastObjectRendered;
	}
	/**
	 * Flag if we are rendering to the screen vs renderTexture
	 * @readonly
	 * @default true
	 */
	get renderingToScreen() {
		const renderer = this;
		return renderer.renderTarget.renderingToScreen;
	}
	/**
	 * Measurements of the screen. (0, 0, screenWidth, screenHeight).
	 *
	 * Its safe to use as filterArea or hitArea for the whole stage.
	 */
	get screen() {
		return this.view.screen;
	}
	/**
	 * Create a bunch of runners based of a collection of ids
	 * @param runnerIds - the runner ids to add
	 */
	_addRunners(...runnerIds) {
		runnerIds.forEach((runnerId) => {
			this.runners[runnerId] = new SystemRunner(runnerId);
		});
	}
	destroy(options = false) {
		this.runners.destroy.items.reverse();
		this.runners.destroy.emit(options);
		Object.values(this.runners).forEach((runner) => {
			runner.destroy();
		});
		this._systemsHash = null;
		this.renderPipes = null;
	}
	/**
	 * Generate a texture from a container.
	 * @param options - options or container target to use when generating the texture
	 * @returns a texture
	 */
	generateTexture(options) {
		return this.textureGenerator.generateTexture(options);
	}
	/**
	 * Whether the renderer will round coordinates to whole pixels when rendering.
	 * Can be overridden on a per scene item basis.
	 */
	get roundPixels() {
		return !!this._roundPixels;
	}
	/**
	 * Overridable function by `pixi.js/unsafe-eval` to silence
	 * throwing an error if platform doesn't support unsafe-evals.
	 * @private
	 * @ignore
	 */
	_unsafeEvalCheck() {
		if (!unsafeEvalSupported()) {
			throw new Error(
				"Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.",
			);
		}
	}
	/**
	 * Resets the rendering state of the renderer.
	 * This is useful when you want to use the WebGL context directly and need to ensure PixiJS's internal state
	 * stays synchronized. When modifying the WebGL context state externally, calling this method before the next Pixi
	 * render will reset all internal caches and ensure it executes correctly.
	 *
	 * This is particularly useful when combining PixiJS with other rendering engines like Three.js:
	 * ```js
	 * // Reset Three.js state
	 * threeRenderer.resetState();
	 *
	 * // Render a Three.js scene
	 * threeRenderer.render(threeScene, threeCamera);
	 *
	 * // Reset PixiJS state since Three.js modified the WebGL context
	 * pixiRenderer.resetState();
	 *
	 * // Now render Pixi content
	 * pixiRenderer.render(pixiScene);
	 * ```
	 */
	resetState() {
		this.runners.resetState.emit();
	}
};
/** The default options for the renderer. */
_AbstractRenderer.defaultOptions = {
	/**
	 * Default resolution / device pixel ratio of the renderer.
	 * @default 1
	 */
	resolution: 1,
	/**
	 * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
	 * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
	 * performance issues when using WebGL.
	 *
	 * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
	 * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
	 * driver version blacklisted by the
	 * browser.
	 *
	 * If your application requires high performance rendering, you may wish to set this to false.
	 * We recommend one of two options if you decide to set this flag to false:
	 *
	 * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
	 *    not supported.
	 *
	 * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
	 *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
	 *    device & browser combination does not support high performance WebGL.
	 *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
	 * @default false
	 */
	failIfMajorPerformanceCaveat: false,
	/**
	 * Should round pixels be forced when rendering?
	 * @default false
	 */
	roundPixels: false,
};
let AbstractRenderer = _AbstractRenderer;

export { AbstractRenderer };
//# sourceMappingURL=AbstractRenderer.mjs.map
