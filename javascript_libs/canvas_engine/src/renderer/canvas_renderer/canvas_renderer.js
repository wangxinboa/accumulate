import { Renderer } from "../renderer.js";

export class CanvasRenderer extends Renderer {
	static key = "canvas";

	/**
	 * @param {CanvasEngineType.RendererOption} canvasRendererOption
	 */
	constructor(canvasRendererOption) {
		super(canvasRendererOption);
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	initCanvas(canvas) {}

	clear() {}

	render() {}
}
