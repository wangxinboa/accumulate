import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { resizeCanvas } from "../../../canvas_engine_utils/scale_canvas.js";

export class CanvasDomSystem extends BaseCleanUp {
	/** @type {Element | undefined} */
	containerDom;
	/** @type {HTMLCanvasElement} */
	canvasDom;
	/** @type {number} */
	devicePixelRatio;
	/** @private @type {CanvasEngineType.CanvasDomResizeCallbacks} */
	_resizeCallback;
	/**
	 * @param {CanvasEngineType.CanvasDomOption} canvasDomOption
	 */
	constructor(canvasDomOption) {
		super();

		this.devicePixelRatio = canvasDomOption.devicePixelRatio ?? window.devicePixelRatio;

		if (canvasDomOption.container) {
			this.canvasDom = document.createElement("canvas");
			this.containerDom = canvasDomOption.container;

			this.containerDom.appendChild(this.canvasDom);
		} else if (canvasDomOption.canvas) {
			this.canvasDom = canvasDomOption?.canvas;
		} else {
			throw new Error("CanvasDomSystem 中 无法初始化 canvas dom 信息");
		}

		this.resize = this.resize.bind(this);
		window.addEventListener("resize", this.resize);

		this._resizeCallback = [];
	}
	/**
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback
	 */
	addResizeCallback(callback) {
		if (!this._resizeCallback.includes(callback)) {
			this._resizeCallback.push(callback);
		}
	}
	/**
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback
	 */
	removeResizeCallback(callback) {
		const index = this._resizeCallback.indexOf(callback);
		if (index > -1) {
			this._resizeCallback.splice(index, 1);
		}
	}
	resize() {
		resizeCanvas(this.canvasDom, this.devicePixelRatio);
		this._executeResizeCallback();
	}
	/** @private */
	_executeResizeCallback() {
		for (let i = 0, len = this._resizeCallback.length; i < len; i++) {
			this._resizeCallback[i](this.canvasDom.clientWidth, this.canvasDom.clientHeight);
		}
	}
	destroy() {
		window.removeEventListener("resize", this.resize);
		if (this.containerDom) {
			this.canvasDom.remove();
		}

		super.destroy();
	}
}
