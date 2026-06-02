import { Renderer } from "../renderer.js";
import { WebGLProgramSystem } from "./webgl_program/webgl_program_system.js";
import { WebGLExtensions } from "./webgl_extensions.js";
import { WebGLBufferSystem } from "./webgl_buffer/webgl_buffer_system.js";
import { WebGLTextureSystem } from "./webgl_texture/webgl_texture_system.js";
import { uCameraProjectionName, uCameraViewName, uRenderNodeModelName } from "./shaders/global_uniform_names.js";

export class WebGL2DRenderer extends Renderer {
	/** @type {CanvasEngineType.WebGLContext} */
	gl;
	/** @type {WebGLExtensions} */
	extensions;
	/** @type {WebGLProgramSystem} */
	programSystem;
	/** @type {WebGLBufferSystem} */
	bufferSystem;
	/** @type {WebGLTextureSystem} */
	textureSystem;
	/** @type {number} */
	webglVersion;

	static key = "webgl";
	/**
	 * @param {CanvasEngineType.RendererOption} webgl2DRendererOption
	 */
	constructor(webgl2DRendererOption) {
		super(webgl2DRendererOption);

		this.extensions = new WebGLExtensions(this);
		this.programSystem = new WebGLProgramSystem(this);
		this.bufferSystem = new WebGLBufferSystem(this);
		this.textureSystem = new WebGLTextureSystem(this);

		let gl;
		if ((gl = this.canvas.getContext("webgl2", webgl2DRendererOption))) {
			this.webglVersion = 2;
		} else {
			throw new Error("浏览器不支持 webgl");
		}
		this.gl = gl;

		this.extensions.initCanvas();

		this.extensions.initExtensions();
	}
	resetGl() {
		this.extensions.initExtensions();
		this.programSystem.resetAllPrograms();
		this.bufferSystem.resetAllBuffers();
		this.textureSystem.resetAllTextures();
	}
	deleteGlCache() {
		this.programSystem.deleteAllPrograms();
		this.bufferSystem.deleteAllBuffers();
		this.textureSystem.deleteTextures();
	}
	clear() {
		this.gl.clearColor(
			this.backgroundSystem.color.r,
			this.backgroundSystem.color.g,
			this.backgroundSystem.color.b,
			this.backgroundSystem.alpha,
		);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
	/**
	 * @param {CanvasEngineType.RenderNode} scene
	 * @param {CanvasEngineType.Camera2D} camera
	 * @param {number} timestamp
	 */
	render(scene, camera, timestamp) {
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.clear();
		this._traverseRender(scene, camera, timestamp);
	}
	/**
	 * @abstract @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.Camera2D} camera
	 * @param {number} timestamp
	 */
	_renderNode(renderNode, camera, timestamp) {
		renderNode.updateMatrix();

		const glProgram = this.programSystem.useProgram(renderNode);

		this.bufferSystem.bindBuffers(renderNode, glProgram);

		this.textureSystem.updateTextures(renderNode);

		glProgram.uniform(this.gl, uCameraProjectionName, camera.projectionMatrix);
		glProgram.uniform(this.gl, uCameraViewName, camera.matrixWorld);
		glProgram.uniform(this.gl, uRenderNodeModelName, renderNode.matrixWorld);

		renderNode.uniform(this.gl, this.textureSystem, glProgram);

		renderNode.drawArrays(this.gl, glProgram);
	}

	destroy() {
		this.extensions.destroy();
		this.programSystem.destroy();
		this.bufferSystem.destroy();

		super.destroy();
	}
}
