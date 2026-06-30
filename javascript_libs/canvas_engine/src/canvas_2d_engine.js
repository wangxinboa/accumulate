import { BaseCanvasEngine } from "./base_canvas_engine.js";
import { WebGL2DRenderer } from "./renderers/webgl_renderer/webgl_2d_renderer.js";

export class Canvas2DEngine extends BaseCanvasEngine {
	/** @type {WebGL2DRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.Canvas2DEngineOption} canvasEngineOption
	 */
	constructor(canvasEngineOption) {
		super(canvasEngineOption);

		this.renderer = new WebGL2DRenderer(canvasEngineOption);

		this.renderer.canvasSystem.resize();
	}
	get scene() {
		return this.renderer.scene;
	}
	get camera() {
		return this.renderer.camera;
	}
	get keyboard() {
		return this.renderer.eventSystem.keyboard;
	}
	/**
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback
	 */
	addResizeCallback(callback) {
		this.renderer.canvasSystem.addResizeCallback(callback);
	}
	/**
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback - 需要移除的回调函数
	 */
	removeResizeCallback(callback) {
		this.renderer.canvasSystem.removeResizeCallback(callback);
	}
	/**
	 * @param {number} timestamp
	 */
	render(timestamp) {
		this.renderer.render(timestamp);
	}
	destroy() {
		this.renderer.destroy();

		super.destroy();
	}
}
