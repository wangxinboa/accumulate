import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class WebGLUniformSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheGlobalUniformDatas = {};
		// this._cacheUniformDatas = {};
	}
}
