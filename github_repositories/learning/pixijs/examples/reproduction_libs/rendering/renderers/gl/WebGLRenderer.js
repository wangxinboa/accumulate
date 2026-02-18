import backgroundSystem from "../shared/background/BackgroundSystem.js";
import viewSystem from "../shared/view/ViewSystem.js";
import contextSystem from "./context/GlContextSystem.js";
import bufferSystem from "./buffer/GlBufferSystem.js";
import textureSystem from "./texture/GlTextureSystem.js";
import glRenderTargetSystem from "./renderTarget/GlRenderTargetSystem.js";
import geometrySystem from "./geometry/GlGeometrySystem.js";
import glUniformGroupSystem from "./shader/GlUniformGroupSystem.js";
import globalUniformsSystem from "../shared/renderTarget/GlobalUniformSystem.js";
import shaderSystem from "./shader/GlShaderSystem.js";
import stateSystem from "./state/GlStateSystem.js";
import renderGroupSystem from "../../../scene/container/RenderGroupSystem.js";
import blendModePipe from "../shared/blendModes/BlendModePipe.js";
import batchPipe from "../../batcher/shared/BatcherPipe.js";
import batchAdaptor from "../../batcher/gl/GlBatchAdaptor.js";
import spritePipe from "../../../scene/sprite/SpritePipe.js";
import colorMaskPipe from "../../mask/color/ColorMaskPipe.js";

const webglRenderer = {
	background: backgroundSystem,
	globalUniforms: globalUniformsSystem,
	view: viewSystem,
	context: contextSystem,
	buffer: bufferSystem,
	texture: textureSystem,
	renderTarget: glRenderTargetSystem,
	geometry: geometrySystem,
	uniformGroup: glUniformGroupSystem,
	shader: shaderSystem,
	state: stateSystem,
	renderGroup: renderGroupSystem,
	renderPipes: {
		blendMode: blendModePipe,
		batch: batchPipe,
		sprite: spritePipe,
		colorMask: colorMaskPipe,
	},
	init(options) {
		this.globalUniforms.new(this);
		this.context.new(this);
		this.buffer.new(this);
		this.texture.new(this);
		this.renderTarget.new(this);
		this.geometry.new(this);
		this.uniformGroup.new(this);
		this.shader.new(this);
		this.renderGroup.new(this);

		this.renderPipes.blendMode.new(this);
		this.renderPipes.batch.new(this, batchAdaptor.new());
		this.renderPipes.sprite.new(this);
		this.renderPipes.colorMask.new(this);

		// backgroundSystem init
		this.background.init(options);
		// viewSystem init
		this.view.init(options);
		// contextSystem init
		this.context.init(options);
	},
	render(args, deprecated) {
		let options = args;
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

		options.container.enableRenderGroup();

		this.renderTarget.renderStart(options);

		this.renderGroup.render(options);
	},
	resize(desiredScreenWidth, desiredScreenHeight, resolution) {
		this.view.resize(desiredScreenWidth, desiredScreenHeight, resolution);
	},
};

export default webglRenderer;
