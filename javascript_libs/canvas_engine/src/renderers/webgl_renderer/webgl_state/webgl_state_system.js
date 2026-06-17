import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class WebGLStateSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;

	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;
	}
}
