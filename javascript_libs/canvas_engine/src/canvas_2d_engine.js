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

		this.executeResizeCallbacks = this.executeResizeCallbacks.bind(this);
		this.renderer.canvasSystem.addResizeCallback(this.executeResizeCallbacks);

		this.renderer.canvasSystem.resize();
	}
	get scene() {
		return this.renderer.scene;
	}
	get camera() {
		return this.renderer.camera;
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	executeResizeCallbacks(width, height) {
		super.executeResizeCallbacks(width, height);
		this.renderer.resize(width, height);
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
