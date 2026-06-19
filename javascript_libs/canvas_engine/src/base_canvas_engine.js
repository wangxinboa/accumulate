import { BaseCleanUp } from "../../javascript_utils/javascript_utils.js";
import { TimeTicker } from "./time_ticker/time_ticker.js";

export class BaseCanvasEngine extends BaseCleanUp {
	/** @type {TimeTicker} */
	timeTicker;
	/**
	 * @param {CanvasEngineType.CanvasEngineOption} canvasEngineOption
	 */
	constructor(canvasEngineOption) {
		super();

		this.render = this.render.bind(this);

		this.timeTicker = new TimeTicker(canvasEngineOption);
		this.timeTicker.addRunCallback(this.render);
	}
	/**
	 * @param {number} _timestamp
	 */
	render(_timestamp) {
		throw new Error("CanvasEngine 子类未实现 render 方法");
	}
	destroy() {
		this.timeTicker.destroy();

		super.destroy();
	}
}
