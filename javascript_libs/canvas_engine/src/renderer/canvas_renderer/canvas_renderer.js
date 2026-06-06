import { Camera2D } from "../../camera/camera2d.js";
import { Scene2D } from "../../render_node/2d/scene2d.js";
import { BaseRenderer } from "../base_renderer.js";

export class CanvasRenderer extends BaseRenderer {
	static key = "canvas";
	/** @type {Camera2D} */
	camera;
	/** @type {Scene2D} */
	scene;
	/**
	 * @param {CanvasEngineType.RendererOption} canvasRendererOption
	 */
	constructor(canvasRendererOption) {
		super(canvasRendererOption);

		this.scene = new Scene2D();
		this.camera = new Camera2D();
	}
	initCanvas() {}
	clear() {}
	render() {}
}
