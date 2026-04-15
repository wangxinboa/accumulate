import { Camera2D } from "./camera/camera2d.js";
import { CanvasEngine } from "./canvas_engine.js";
import { Render2DScene } from "./render_node/2d/render_2d_scene.js";
import { CanvasRenderer } from "./renderer/canvas_renderer/canvas_renderer.js";
import { WebGL2DRenderer } from "./renderer/webgl_renderer/webgl_2d_renderer.js";

export class Canvas2DEngine extends CanvasEngine {
	/** @type {Render2DScene} */
	scene;
	/** @type {Camera2D} */
	camera;
	/** @type {WebGL2DRenderer | CanvasRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.Canvas2DEngineOption} canvasEngineOption
	 */
	constructor(canvasEngineOption) {
		super(canvasEngineOption);

		this.scene = new Render2DScene();
		this.camera = new Camera2D();

		this.renderer =
			canvasEngineOption?.rendererType === WebGL2DRenderer.key
				? new WebGL2DRenderer(canvasEngineOption)
				: new CanvasRenderer(canvasEngineOption);

		this.resize = this.resize.bind(this);
		this.renderer.canvasSystem.onResize(this.resize);
	}

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	resize(width, height) {
		this.camera.updateProjection(width, height, this.renderer.canvasSystem.devicePixelRatio);
	}

	/**
	 * @param {number} timestamp
	 */
	render(timestamp) {
		this.renderer.render(this.scene, this.camera, timestamp);
	}

	destroy() {
		this.scene.destroy();
		this.renderer.destroy();

		super.destroy();
	}
}
