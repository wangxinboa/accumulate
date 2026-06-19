import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { resizeCanvas } from "../../../canvas_engine_utils/scale_canvas.js";

export class CanvasDomSystem extends BaseCleanUp {
	/** @type {Element | undefined} */
	containerDom;
	/** @type {HTMLCanvasElement} */
	canvasDom;
	/** @type {number} */
	devicePixelRatio;
	/** @type {CanvasEngineType.CanvasDomOnResize | null} */
	resizeCallback;
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

		this.resize();

		this.resizeCallback = null;
	}
	/**
	 * @param {CanvasEngineType.CanvasDomOnResize} callback
	 */
	registerResizeCallback(callback) {
		this.resizeCallback = callback;
		this._executeResizeCallback();
	}
	resize() {
		resizeCanvas(this.canvasDom, this.devicePixelRatio);
		this._executeResizeCallback();
	}
	/** @private */
	_executeResizeCallback() {
		if (this.resizeCallback) {
			this.resizeCallback(this.canvasDom.clientWidth, this.canvasDom.clientHeight);
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
