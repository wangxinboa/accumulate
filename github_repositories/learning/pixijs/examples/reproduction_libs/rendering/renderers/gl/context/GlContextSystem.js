import webglRenderer from "../WebGLRenderer.js";
import { DOMAdapter } from "../../../../environment/adapter.js";
import viewSystem from "../../shared/view/ViewSystem.js";
import backgroundSystem from "../../shared/background/BackgroundSystem.js";

const contextSystem = {
	defaultOptions: {
		preferWebGLVersion: 2,
		multiView: false,
	},
	supports: {
		uint32Indices: true,
		uniformBufferObject: true,
		vertexArrayObject: true,
		srgbTextures: true,
		nonPowOf2wrapping: true,
		msaa: true,
		nonPowOf2mipmaps: true,
	},
	extensions: {},
	canvas: null,
	gl: null,
	new(renderer) {
		this._renderer = renderer;
		return this;
	},
	init(options) {
		options = { ...contextSystem.defaultOptions, ...options };
		contextSystem.canvas = viewSystem.canvas;
		if (options.context) {
			contextSystem.initFromContext(options.context);
		} else {
			const alpha = backgroundSystem.alpha < 1;
			const premultipliedAlpha = options.premultipliedAlpha ?? true;
			const antialias = options.antialias && !renderer.backBuffer.useBackBuffer;
			contextSystem.createContext(options.preferWebGLVersion, {
				alpha,
				premultipliedAlpha,
				antialias,
				stencil: true,
				preserveDrawingBuffer: options.preserveDrawingBuffer,
				powerPreference: options.powerPreference ?? "default",
			});
		}
	},
	createContext(preferWebGLVersion, options) {
		let gl;
		const canvas = this.canvas;
		if (preferWebGLVersion === 2) {
			gl = canvas.getContext("webgl2", options);
		}
		if (!gl) {
			gl = canvas.getContext("webgl", options);
			if (!gl) {
				throw new Error("This browser does not support WebGL. Try using the canvas renderer");
			}
		}
		this.gl = gl;
		this.initFromContext(gl);
	},
	initFromContext(gl) {
		this.gl = gl;
		this.webGLVersion = gl instanceof DOMAdapter.get().getWebGLRenderingContext() ? 1 : 2;
		webglRenderer.gl = gl;
		// this.getExtensions();
		this.validateContext(gl);

		webglRenderer.buffer.contextChange(gl);
		webglRenderer.texture.contextChange(gl);
		webglRenderer.geometry.contextChange(gl);
		webglRenderer.shader.contextChange(gl);
		webglRenderer.state.contextChange(gl);
	},
	validateContext(gl) {
		const attributes = gl.getContextAttributes();
		if (attributes && !attributes.stencil) {
			console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
		}
		const supports = this.supports;
		const isWebGl2 = this.webGLVersion === 2;
		const extensions = this.extensions;
		supports.uint32Indices = isWebGl2 || !!extensions.uint32ElementIndex;
		supports.uniformBufferObject = isWebGl2;
		supports.vertexArrayObject = isWebGl2 || !!extensions.vertexArrayObject;
		supports.srgbTextures = isWebGl2 || !!extensions.srgb;
		supports.nonPowOf2wrapping = isWebGl2;
		supports.nonPowOf2mipmaps = isWebGl2;
		supports.msaa = isWebGl2;
		if (!supports.uint32Indices) {
			console.warn("Provided WebGL context does not support 32 index buffer, large scenes may not render correctly");
		}
	},
	ensureCanvasSize(targetCanvas) {
		if (!this.multiView) {
			if (targetCanvas !== this.canvas) {
				warn("multiView is disabled, but targetCanvas is not the main canvas");
			}
			return;
		}
		const { canvas } = this;
		if (canvas.width < targetCanvas.width || canvas.height < targetCanvas.height) {
			canvas.width = Math.max(targetCanvas.width, targetCanvas.width);
			canvas.height = Math.max(targetCanvas.height, targetCanvas.height);
		}
	},
};

export default contextSystem;
