import { BaseRenderer } from "../base_renderer.js";
import { WebGLProgramSystem } from "./webgl_program/webgl_program_system.js";
import { WebGLExtensions } from "./webgl_extensions.js";
import { WebGLBufferSystem } from "./webgl_buffer/webgl_buffer_system.js";
import { WebGLTextureSystem } from "./webgl_texture/webgl_texture_system.js";
import { uCameraProjectionName, uCameraViewName, uRenderNodeModelName } from "./shaders/global_uniform_names.js";
import { Scene2D } from "../../render_nodes/2d/scene2d.js";
import { Camera2D } from "../../cameras/camera2d.js";
import { initializeMatrix4 } from "../../math/matrix4.js";

export class WebGL2DRenderer extends BaseRenderer {
	static key = "webgl";
	/** @type {Camera2D} */
	camera;
	/** @type {Scene2D} */
	scene;
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
	/**
	 * @param {CanvasEngineType.Canvas2DEngineOption} webgl2DRendererOption
	 */
	constructor(webgl2DRendererOption) {
		super(webgl2DRendererOption);

		this.scene = new Scene2D();
		this.camera = new Camera2D();

		this.extensions = new WebGLExtensions(this);
		this.programSystem = new WebGLProgramSystem(this);
		this.bufferSystem = new WebGLBufferSystem(this);
		this.textureSystem = new WebGLTextureSystem(this);

		this.eventSystem.activate2D(this.scene, this.camera);

		this.resize = this.resize.bind(this);
		this.canvasSystem.addResizeCallback(this.resize);

		let gl;
		if ((gl = this.canvasSystem.canvasDom.getContext("webgl2", webgl2DRendererOption))) {
			this.webglVersion = 2;
		} else {
			throw new Error("浏览器不支持 webgl");
		}
		this.gl = gl;

		this.extensions.initCanvas();

		this.extensions.initExtensions();
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	resize(width, height) {
		this.camera.updateProjection(width, height, this.canvasSystem.devicePixelRatio);
		this.gl.viewport(0, 0, this.canvasSystem.canvasDom.width, this.canvasSystem.canvasDom.height);
	}
	resetGl() {
		this.extensions.initExtensions();
		this.programSystem.resetGlPrograms();
		this.bufferSystem.resetGlBuffers();
		this.textureSystem.resetGlTextures();
	}
	deleteGlCache() {
		this.programSystem.deleteGlPrograms();
		this.bufferSystem.deleteGlBuffers();
		this.textureSystem.deleteGlTextures();
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
	 * @param {number} timestamp
	 */
	render(timestamp) {
		// this.gl.enable(this.gl.BLEND);
		// this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.clear();

		this.camera.updateMatrix();
		this.scene.updateMatrix();

		this.scene.clearDescendants();
		this._traverseRender(this.scene, this.camera, timestamp);
	}
	/**
	 * @abstract @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.Camera2D} camera
	 */
	_renderNode(renderNode, camera) {
		this.scene.registerDescendant(renderNode);

		renderNode.updateMatrix();

		// 使用 renderNode.pipe 获取程序
		const glProgram = this.programSystem.useProgram(renderNode);

		// 使用 renderNode.pipe 绑定缓冲区
		this.bufferSystem.bindBuffers(renderNode, glProgram);

		// 使用 renderNode.pipe 更新纹理
		renderNode.pipe.updateTextures(renderNode, this.textureSystem);

		glProgram.uniform(this.gl, uCameraProjectionName, camera.projectionMatrix);
		if (renderNode.applyCameraTransform) {
			glProgram.uniform(this.gl, uCameraViewName, camera.matrixWorld);
		} else {
			glProgram.uniform(this.gl, uCameraViewName, initializeMatrix4);
		}
		glProgram.uniform(this.gl, uRenderNodeModelName, renderNode.matrixWorld);

		// 使用 renderNode.pipe 设置 uniform 并绘制
		renderNode.pipe.uniform(renderNode, this.gl, this.textureSystem, glProgram);
		renderNode.pipe.drawArrays(renderNode, this.gl, glProgram);
	}
	destroy() {
		this.scene.destroy();
		this.camera.destroy();

		this.extensions.destroy();
		this.programSystem.destroy();
		this.bufferSystem.destroy();
		this.textureSystem.destroy();

		super.destroy();
	}
}
