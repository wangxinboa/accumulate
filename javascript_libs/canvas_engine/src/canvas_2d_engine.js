import { BaseCanvasEngine } from "./base_canvas_engine.js";
import { CanvasRenderer } from "./renderers/canvas_renderer/canvas_renderer.js";
import { WebGL2DRenderer } from "./renderers/webgl_renderer/webgl_2d_renderer.js";

export class Canvas2DEngine extends BaseCanvasEngine {
	/** @type {WebGL2DRenderer | CanvasRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.Canvas2DEngineOption} canvasEngineOption
	 */
	constructor(canvasEngineOption) {
		super(canvasEngineOption);

		this.renderer =
			canvasEngineOption?.rendererType === WebGL2DRenderer.key
				? new WebGL2DRenderer(canvasEngineOption)
				: new CanvasRenderer(canvasEngineOption);

		this.resize = this.resize.bind(this);
		this.renderer.canvasSystem.onResize(this.resize);
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
	resize(width, height) {
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
